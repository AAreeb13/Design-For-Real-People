import neo4j from 'neo4j-driver';

const URI = 'neo4j+s://1ac9a69f.databases.neo4j.io';
const USERNAME = 'neo4j' // todo remove later since shouldnt expose our data
const PASSWORD = 'ddMjBybR78Yb4FXEmjeQBLscuVgGGD4BX2FCoT5BlDU'

const driver = neo4j.driver(
    URI,
    neo4j.auth.basic(USERNAME, PASSWORD)
);

const runQuery = async (query, params = {}) => {
  const session = driver.session();
  try {
      const result = await session.run(query, params);

      const nodes = new Map();
      const relationships = new Map();

      result.records.forEach(record => {
          const n = record.get('n');
          const m = record.get('m');
          const r = record.get('r');

          nodes.set(n.identity.toString(), n);
          nodes.set(m.identity.toString(), m);
          relationships.set(r.identity.toString(), r);
      });

      return {
          nodes: Array.from(nodes.values()),
          relationships: Array.from(relationships.values())
      };
  } finally {
      await session.close();
  }
};

const closeDriver = async () => {
    await driver.close();
};

const getGraphData = async () => {
  let nodes = {}
  let relationships = []
  try {
      let results = await runQuery("MATCH (n)-[r]->(m) RETURN n, r, m");
      results.nodes.forEach(function (n) {
        nodes[n.identity.low] = {name: n.properties.name, type: n.properties.type}
      });
      relationships = results.relationships;
      
      relationships = relationships.map(function (r) {
        return {source: nodes[r.start.low].name, target: nodes[r.end.low].name}
      })


      nodes = Object.entries(nodes)
        .sort(([a], [b]) => a - b)
        .map(([, value]) => value);
      
  } catch (error) {
      console.error('Error fetching graph data:', error);
  }
  return {nodes, relationships}
};

const nodeExists = async (label, properties) => {
  const session = driver.session();
  try {
    const query = `MATCH (n:${label} {name: $name}) RETURN n LIMIT 1`;
    const result = await session.run(query, { name: properties.name });
    return result.records.length > 0;
  } finally {
    await session.close();
  }
};

export { getGraphData, runQuery, nodeExists };