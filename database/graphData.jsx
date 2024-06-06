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

const getGraphData = async () => {
  let nodes = {};
  let relationships = [];
  try {
    let results = await runQuery("MATCH (n)-[r]->(m) RETURN n, r, m");
    results.nodes.forEach(function (n) {
      nodes[n.identity.low] = n.properties;
    });
    relationships = results.relationships;

    relationships = relationships.map(function (r) {
      return { source: nodes[r.start.low].name, target: nodes[r.end.low].name };
    });

    nodes = Object.entries(nodes)
      .sort(([a], [b]) => a - b)
      .map(([, value]) => value);
  } catch (error) {
    console.error("Error fetching graph data:", error);
  }
  return { nodes, relationships };
};

const nodeExists = async (label, properties) => {
  const session = driver.session();
  const name = properties.name;
  const params = { name }
  try {
    const query = `MATCH (n:${label} {name: $name}) RETURN n LIMIT 1`;
    const result = await session.run(query, params);
    return result.records.length > 0;
  } finally {
    await session.close();
  }
};

const subjectExists = async (label, properties, isMainSubject=true) => {
  const session = driver.session();
  const name = isMainSubject ? properties.name : properties.subject
  const params = { name };
  try {
    const query = `MATCH (n:${label} {name: $name, type: 'subject'}) RETURN n`;
    const result = await session.run(query, params);
    return result.records.length > 0;
  } finally {
    await session.close();
  }
}

const mainSubjectExists = async (label, properties) => {
  const session = driver.session();
  let name = properties.name;
  let params = { name };
  try {
    const query = `MATCH (n:${label} {name: $name, type: 'subject'}) RETURN n`;
    let result = await session.run(query, params);
    if (result.records.length == 0) {
      name = properties.subject
      params = { name };
      const query = `MATCH (n:${label} {name: $name, type: 'subject'}) RETURN n`;
      result = await session.run(query, params);
    }
    return result.records.length > 0
  } finally {
    await session.close();
  }
}



const getMainSubjects = async () => {
  let nodes = await getAllNodes("MATCH (n:Subject{type: 'subject', mainSubject: True}) RETURN (n)");
  nodes = nodes.filter((n) => n.type === "subject" && n.mainSubject);
  return nodes;
};

const addMainSubjectToGraph = async (name, theme) => {
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

const addMiniSubjectToGraph = async (name, subject, prerequisites) => {
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

  const prereqAsList = prerequisites.split(',').map(item => item.trim())

  return addRelationshipsToGraph(prereqAsList, name);
};

const addTopicToGraph = async (name, subject, prerequisites) => {
  const formattedPrerequisites = `[${prerequisites.split(',').map(item => `'${item.trim()}'`).join(', ')}]`;

  let query = `
    CREATE (n:Subject{
      name: $name,
      subject: $subject,
      type: 'topic',
      description: 'to add later',
      requires: $formattedPrerequisites,
      links: '',
      approvals: 0,
      rejections: 0,
      comments: [],
      suggestions: [],
      resources: [],
      learning_objectives: []
    });
  `;

  const params = { name, subject, formattedPrerequisites };
  const results = await runQuery(query, params);
  const prereqAsList = prerequisites.split(',').map(item => item.trim())


  return !results ? 
    results : (prereqAsList.length <= 0) ?  
      addRelationshipsToGraph([subject], name) :
      addRelationshipsToGraph(prereqAsList, name);
};

function addRelationshipsToGraph(prerequisites, name) {
  
  prerequisites.forEach(async (prerequisite) => {
    const query = `
  MATCH (title:Subject{name: $prerequisite}), (subject:Subject{name: $name})
  CREATE (title) - [:IS_USED_IN] -> (subject);
  `;
    const params = { prerequisite, name };
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
    return Array.from(nodes.values()).map(n => n.properties);
  } catch {
    return false;
  } finally {
    await session.close();
  }
};

const getDependencyGraph = async (topicName) => {
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
        nodes.set(startNode.id.toString(), { ...startNode, ...startNode.properties });
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






export { 
  getGraphData, 
  mainSubjectExists,
  subjectExists,
  nodeExists,
  getMainSubjects, 
  addMainSubjectToGraph, 
  addMiniSubjectToGraph, 
  addTopicToGraph,
  getDependencyGraph
};

