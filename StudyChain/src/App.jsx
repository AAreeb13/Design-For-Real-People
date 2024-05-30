import React, { useEffect, useState } from 'react';
import Graph from "./components/Graph";
import TempButton from './components/TempButton';
import 'bootstrap/dist/css/bootstrap.css';
import { getGraphData } from '../database/graphData';

function App() {
  const [graphData, setGraphData] = useState({ nodes: [], links: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getGraphData();
        console.log("data", data)
        setGraphData(data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error loading graph data: {error.message}</div>;
  }

  return (
    <>
      <h1>Hello World</h1>
      <div>Graph should be here</div>
      <Graph 
        nodes={graphData.nodes.map((n) => {return {name: n}})}
        links={graphData.relationships} 
      />
      <TempButton />
    </>
  );
}

export default App;
