import { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import React, { useEffect } from 'react';
import Graph from "./components/Graph";
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { getGraphData } from '../database/graphData';
import Navbar from './components/Navbar';
import GridMenu from './pages/GridMenu';
import Home from './pages/Home';

function App() {
  const [graphData, setGraphData] = useState({ nodes: [], links: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  let oldData = null;

  const fetchData = async () => {
    try {
      const data = await getGraphData();
      if (oldData === null || !isEqualData(oldData, data)) {
        oldData = data;
        setGraphData(data);
      } 
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(); // Fetch data initially

    const intervalId = setInterval(fetchData, 5000); // Fetch data every 5 seconds

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error loading graph data: {error.message}</div>;
  }

  return (
    <Router>
      <div>
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage graphData={graphData} />} />
          <Route path="/grid-menu" element={<GridMenu />} />
        </Routes>
      </div>
    </Router>
  );
}

function HomePage({ graphData }) {
  const ourExploreButton = {
    width: "275px"
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px' }}>
      <div style={{ flex: 1, margin: '10px' }}>
        <h1>StudyChain</h1>
        <h3>Studying Made Simple</h3>
        <Link to="/grid-menu">
          <button type="button" className="btn btn-dark" style={ourExploreButton}>Explore Our Topics</button>
        </Link>
      </div>

      <div style={{ flex: 2, margin: '10px' }}>
        <Graph 
          nodes={graphData.nodes}
          links={graphData.relationships}
          subject={"calculus"} 
        />
      </div>
    </div>
  );
}

function isEqualData(oldData, data) {
  oldData.relationships = oldData.relationships.map((n) => {
    if (n.source.name != null) {
      return { source: n.source.name, target: n.target.name }
    } else {
      return { source: n.source, target: n.target }
    }
  });

  if (oldData.nodes.length !== data.nodes.length || oldData.relationships.length !== data.relationships.length) {
    return false;
  }

  const nodesEqual = oldData.nodes.every((node, index) => node.name === data.nodes[index].name);

  const relationshipsEqual = oldData.relationships.every((rel, index) => {
    return rel.source === data.relationships[index].source && rel.target === data.relationships[index].target;
  });

  return nodesEqual && relationshipsEqual;
}

export default App;
