import neo4j from "neo4j-driver";

const URI = "neo4j+s://1ac9a69f.databases.neo4j.io";
const USERNAME = "neo4j"; // todo remove later since shouldnt expose our data
const PASSWORD = "ddMjBybR78Yb4FXEmjeQBLscuVgGGD4BX2FCoT5BlDU";

const driver = neo4j.driver(URI, neo4j.auth.basic(USERNAME, PASSWORD));

const runQuery = async (query, params = {}) => {
  const session = driver.session();
  try {
    const result = await session.run(query, params);

    const nodes = new Map();
    const relationships = new Map();

    result.records.forEach((record) => {
      const n = record.get("n");
      const m = record.get("m");
      const r = record.get("r");
      nodes.set(n.identity.toString(), n);
      nodes.set(m.identity.toString(), m);
      relationships.set(r.identity.toString(), r);
    });

    return {
      nodes: Array.from(nodes.values()),
      relationships: Array.from(relationships.values()),
    };
  } catch {
    return false;
  } finally {
    await session.close();
  }
};

export const getGraphData = async () => {
  let nodes = {};
  let relationships = [];
  try {
    let results = await runQuery("MATCH (n)-[r]->(m) RETURN n, r, m");
    results.nodes.forEach(function (n) {
      nodes[n.identity.low] = n.properties;
    });
    relationships = results.relationships;

    relationships = relationships.map(function (r) {
      if (r.properties && r.properties.order) {
        return {
          source: nodes[r.start.low].name,
          target: nodes[r.end.low].name,
          order: r.properties.order.low,
        };
      } else {
        return {
          source: nodes[r.start.low].name,
          target: nodes[r.end.low].name,
        };
      }
    });

    nodes = Object.entries(nodes)
      .sort(([a], [b]) => a - b)
      .map(([, value]) => value);
  } catch (error) {
    console.error("Error fetching graph data:", error);
  }
  return { nodes, relationships };
};

export const nodeExists = async (label, properties) => {
  const session = driver.session();
  const name = properties.name;
  const params = { name };
  try {
    const query = `MATCH (n:${label} {name: $name}) RETURN n LIMIT 1`;
    const result = await session.run(query, params);
    return result.records.length > 0;
  } finally {
    await session.close();
  }
};

export const subjectExists = async (
  label,
  properties,
  isMainSubject = true
) => {
  const session = driver.session();
  const name = isMainSubject ? properties.name : properties.subject;
  const params = { name };
  try {
    const query = `MATCH (n:${label} {name: $name, type: 'subject'}) RETURN n`;
    const result = await session.run(query, params);
    return result.records.length > 0;
  } finally {
    await session.close();
  }
};

export const mainSubjectExists = async (label, properties) => {
  const session = driver.session();
  let name = properties.name;
  let params = { name };
  try {
    const query = `MATCH (n:${label} {name: $name, type: 'subject'}) RETURN n`;
    let result = await session.run(query, params);

    return result.records.length > 0;
  } finally {
    await session.close();
  }
};

export const mainSubjectExistsForMini = async (label, properties) => {
  const session = driver.session();
  let name = properties.name;
  let params = { name };
  try {
    const query = `MATCH (n:${label} {name: $name, type: 'subject'}) RETURN n`;
    let result = await session.run(query, params);
    if (result.records.length == 0) {
      name = properties.subject;
      params = { name };
      const query = `MATCH (n:${label} {name: $name, type: 'subject'}) RETURN n`;
      result = await session.run(query, params);
    }
    return result.records.length > 0;
  } finally {
    await session.close();
  }
};

export const getMainSubjects = async () => {
  let nodes = await getAllNodes(
    "MATCH (n:Subject{type: 'subject', mainSubject: True}) RETURN (n)"
  );
  nodes = nodes.filter((n) => n.type === "subject" && n.mainSubject);
  return nodes;
};

export const addMainSubjectToGraph = async (name, theme) => {
  const query = `
      CREATE (n:Subject{
        name: $name,
        type: 'subject',
        theme: $theme,
        mainSubject: True
      })
    `;
  const params = { name, theme };
  return await runQuery(query, params);
};

export const addMiniSubjectToGraph = async (name, subject, prerequisites) => {
  let query = `
      CREATE (n:Subject{
        name: $name,
        type: 'subject',
        subject: $subject,
        mainSubject: False
      });
  `;

  let params = { name, subject };
  let results = await runQuery(query, params);

  if (results === false) {
    return false;
  }

  const prereqAsList = prerequisites.split(",").map((item) => item.trim());

  return addRelationshipsToGraph(prereqAsList, name, subject);
};

export const addTopicToGraph = async (name, subject, prerequisites) => {
  const prereqAsList = prerequisites.split(",").map((item) => item.trim());

  let query = `
    CREATE (n:Subject{
      name: $name,
      subject: $subject,
      type: 'topic',
      description: 'to add later',
      requires: $prereqAsList,
      links: '',
      approvals: 0,
      rejections: 0,
      comments: [],
      suggestions: [],
      resources: [],
      learning_objectives: []
    });
  `;

  const params = { name, subject, prereqAsList };
  const results = await runQuery(query, params);

  // Add relationships for prerequisites if they exist
  return !results
    ? results
    : prereqAsList.length <= 0
    ? await addRelationshipsToGraph([subject], name, subject)
    : await addRelationshipsToGraph(prereqAsList, name, subject);
};

const getHighestOrderFromSubject = async (subjectName) => {
  const session = driver.session();
  const query = `
    MATCH (n:Subject {subject: $subjectName})<- [r:IS_USED_IN] - (m:Subject)
    RETURN r.order AS order
  `;
  const params = { subjectName };

  try {
    const result = await session.run(query, params);
    let highestOrder = null;
    result.records.forEach((record) => {
      const order = record.get("order");
      if (order !== null) {
        const orderValue = order.low !== undefined ? order.low : order;
        if (highestOrder === null || orderValue > highestOrder) {
          highestOrder = orderValue;
        }
      }
    });

    return highestOrder;
  } finally {
    await session.close();
  }
};

async function addRelationshipsToGraph(prerequisites, name, subject) {
  let startNumber = await getHighestOrderFromSubject(subject);
  startNumber = startNumber !== null ? startNumber : 0;
  prerequisites.forEach(async (prerequisite) => {
    startNumber = startNumber + 1;
    const query = `
  MATCH (title:Subject{name: $prerequisite}), (subject:Subject{name: $name})
  CREATE (title) - [r:IS_USED_IN{order: $startNumber}] -> (subject);
  `;
    const params = { prerequisite, startNumber, name };
    const results = await runQuery(query, params);
    if (results === false) {
      return false;
    }
  });
  return true;
}

const getAllNodes = async (query) => {
  const session = driver.session();
  try {
    const result = await session.run(query);
    const nodes = new Map();

    result.records.forEach((record) => {
      const n = record.get("n");
      nodes.set(n.identity.toString(), n);
    });
    return Array.from(nodes.values()).map((n) => n.properties);
  } catch {
    return false;
  } finally {
    await session.close();
  }
};

export const getDependencyGraph = async (topicName) => {
  const session = driver.session();
  const query = `
    MATCH (n:Subject)-[r:IS_USED_IN*]->(m:Subject{name: $topicName}) 
    RETURN n, r, m;
  `;
  const params = { topicName };

  try {
    const result = await session.run(query, params);
    const nodes = new Map();
    const relationships = new Map();

    result.records.forEach((record) => {
      const n = record.get("n");
      const m = record.get("m");
      const relList = record.get("r");

      // Extract properties from Neo4j node objects
      const nProperties = { id: n.identity.toString(), ...n.properties };
      const mProperties = { id: m.identity.toString(), ...m.properties };

      // Store nodes in the map with their properties
      nodes.set(n.identity.toString(), nProperties);
      nodes.set(m.identity.toString(), mProperties);

      relList.forEach((rel) => {
        const startNode = nodes.get(rel.start.low.toString());
        const endNode = nodes.get(rel.end.low.toString());

        // Update properties of start and end nodes
        nodes.set(startNode.id.toString(), {
          ...startNode,
          ...startNode.properties,
        });
        nodes.set(endNode.id.toString(), { ...endNode, ...endNode.properties });

        relationships.set(rel.identity.toString(), {
          id: rel.identity.toString(),
          source: startNode.id.toString(),
          target: endNode.id.toString(),
          ...rel.properties,
        });
      });
    });

    const filteredNodes = Array.from(nodes.values());
    const filteredRelationships = Array.from(relationships.values());

    return { nodes: filteredNodes, relationships: filteredRelationships };
  } catch (error) {
    console.error("Failed to fetch dependency graph:", error);
    throw error;
  } finally {
    await session.close();
  }
};

export const getNode = async (nodeName) => {
  const { nodes, relationships } = await getGraphData();
  return nodes.find((n) => n.name === nodeName);
};

export const getOrder = async (linkToUse) => {
  const query =
    "MATCH (n:Subject{name: $name1}) -[r:IS_USED_IN]-> (m:Subject{name: $name2}) RETURN n, r, m";
  const params = { name1: linkToUse.source.name, name2: linkToUse.target.name };
  const { nodes, relationships } = await runQuery(query, params);
  return relationships[0].properties.order !== undefined
    ? relationships[0].properties.order
    : -1;
};

export const getTopicsInSubject = async (subject) => {
  const session = driver.session();
  const query = "MATCH (n:Subject{type: 'topic', subject: $subject}) RETURN n";
  const params = { subject };
  try {
    const result = await session.run(query, params);
    return result.records.map((record) => record.get("n").properties);
  } catch (error) {
    console.error("Error fetching topics in subject:", error);
    return [];
  } finally {
    await session.close();
  }
};

export const getMiniSubjectInSubject = async (subject) => {
  const session = driver.session();
  const query =
    "MATCH (n:Subject{type: 'subject', subject: $subject, mainSubject: false}) RETURN n";
  const params = { subject };
  try {
    const result = await session.run(query, params);
    return result.records.map((record) => record.get("n").properties);
  } catch (error) {
    console.error("Error fetching mini subjects in subject:", error);
    return [];
  } finally {
    await session.close();
  }
};

export const getPaths = async (node, graphData) => {
  let nodeToUse =
    node.name === undefined // asm string at this pt
      ? (node = graphData.nodes.find((n) => n.name === node))
      : node;

  if (nodeToUse === undefined) {
    return [{ name: node }];
  }

  if (nodeToUse.mainSubject) {
    return [nodeToUse];
  }

  const parentNode = graphData.nodes.find((n) => n.name === nodeToUse.subject);

  if (!parentNode) {
    return [nodeToUse];
  }

  if (parentNode.mainSubject) {
    return [parentNode, nodeToUse];
  }

  const ancestorNodes = await getPaths(parentNode, graphData);
  return [...ancestorNodes, nodeToUse];
};

export const increaseRatingInGraph = async (topicName, rating) => {
  const { nodes, relationships } = await getGraphData();
  const nodeToCheck = nodes.find((node) => node.name === topicName); // Use find instead of filter
  if (!nodeToCheck) {
    throw new Error("Node not found");
  }

  const lowValue = nodeToCheck[rating] ? parseInt(nodeToCheck[rating].low) : 0;
  const newRating = parseInt(lowValue) + 1;

  const session = driver.session();
  try {
    const updateQuery = `
      MATCH (n:Subject {name: $topicName})
      SET n.${rating} = toInteger($newRating)
      RETURN n
    `;
    const updateParams = { topicName, newRating };
    await session.run(updateQuery, updateParams);

    return newRating;
  } catch (error) {
    console.error("Error increasing rating in graph:", error);
    throw error;
  } finally {
    await session.close();
  }
};

export const decreaseRatingInGraph = async (topicName, rating) => {
  const { nodes, relationships } = await getGraphData();
  const nodeToCheck = nodes.find((node) => node.name === topicName); // Use find instead of filter
  if (!nodeToCheck) {
    throw new Error("Node not found");
  }

  const lowValue = nodeToCheck[rating] ? parseInt(nodeToCheck[rating].low) : 0;
  const newRating = parseInt(lowValue) - 1;

  const session = driver.session();
  try {
    const updateQuery = `
      MATCH (n:Subject {name: $topicName})
      SET n.${rating} = toInteger($newRating)
      RETURN n
    `;
    const updateParams = { topicName, newRating };
    await session.run(updateQuery, updateParams);

    return newRating;
  } catch (error) {
    console.error("Error decreasing rating in graph:", error);
    throw error;
  } finally {
    await session.close();
  }
};

export const deleteNode = async (topicName) => {
  const session = driver.session();

  try {
    const deleteQuery = `
        MATCH (n:Subject {name: $topicName})
        DETACH DELETE (n)
    `;
    const deleteParams = { topicName };
    await session.run(deleteQuery, deleteParams);
  } catch (error) {
    console.error("Error deleting node", topicName);
  } finally {
    await session.close;
  }
};

export const getFormData = async (topicName) => {
  const session = driver.session();

  try {
    const formDataQuery = `
      MATCH (n:Subject{name: $topicName})-[:HAS_FORM_DATA]->(m)
      RETURN m
    `;
    const formDataParams = { topicName };

    const result = await session.run(formDataQuery, formDataParams);
    const formNodeRecord = result.records[0];
    if (formNodeRecord) {
      const formNode = formNodeRecord.get("m").properties;
      return formNode;
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error fetching form data:", error);
    throw error;
  } finally {
    await session.close();
  }
};

