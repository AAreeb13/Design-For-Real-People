import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.css";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Link,
  useParams,
} from "react-router-dom";
import HomePage from "./pages/HomePage";
import Graph from "./components/Graph";
import Navbar from "./components/Navbar";
import GridMenu from "./pages/GridMenu";
import { getGraphData } from "../database/graphData";
import SubGraph from "./components/SubGraph";
import TopicEntry from "./components/TopicEntry";

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
          <Route
            path="/graph/:subject"
            element={<GraphRouteWrapper graphData={graphData} />}
          />
          <Route path="/topic/:node" element={<TopicRouteWrapper />} />
          <Route path="/subgraph/:topicName" element={<SubgraphRouteWrapper />}/>
        </Routes>
      </div>
    </Router>
  );
}

function TopicRouteWrapper() {
  const { node } = useParams();
  return <TopicEntry node={node} />;
}

function GraphRouteWrapper({ graphData }) {
  const { subject } = useParams();
  console.log("Graph Route wrapper")
  console.log("nodes", graphData.nodes)
  console.log("Relationships", graphData.relationships)
  return (
    <Graph
      nodes={graphData.nodes}
      links={graphData.relationships}
      subject={subject}
      width={1500}
      height={600}
    />
  );
}

function SubgraphRouteWrapper() {
  const { topicName } = useParams();
  return <SubGraph topicName={topicName}/>
}

function isEqualData(oldData, data) {
  oldData.relationships = oldData.relationships.map((n) => {
    if (n.source.name != null) {
      return { source: n.source.name, target: n.target.name };
    } else {
      return { source: n.source, target: n.target };
    }
  });

  if (
    oldData.nodes.length !== data.nodes.length ||
    oldData.relationships.length !== data.relationships.length
  ) {
    return false;
  }

  const nodesEqual = oldData.nodes.every(
    (node, index) => node.name === data.nodes[index].name
  );

  const relationshipsEqual = oldData.relationships.every((rel, index) => {
    return (
      rel.source === data.relationships[index].source &&
      rel.target === data.relationships[index].target
    );
  });

  return nodesEqual && relationshipsEqual;
}

export default App;
