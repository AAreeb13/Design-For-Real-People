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
      return result.records.map(record => record.toObject());
    } finally {
      await session.close();
    }
};

const closeDriver = async () => {
    await driver.close();
};

function getGraphData() {

    const results = runQuery("MATCH (n)-[r]->(m) RETURN n, r, m")


    console.log(results)
}

export { getGraphData };
