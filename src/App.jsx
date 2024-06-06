import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.css";
import { BrowserRouter as Router, Route, Routes, useParams } from "react-router-dom";
import HomePage from "./pages/HomePage";
import Graph from "./components/Graph";
import Navbar from "./components/Navbar";
import GridMenu from "./pages/GridMenu";
import { getGraphData } from "../database/graphData";
import TopicEntry from "./components/TopicEntry";
import SubGraph from "./components/SubGraph";
import SearchBar from "./components/SearchBar"; // Ensure this import

function App() {
  const [graphData, setGraphData] = useState({ nodes: [], links: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      const data = await getGraphData();
      setGraphData(data);
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
        <SearchBar nodes={graphData.nodes} /> {/* Pass nodes to SearchBar */}
        <Routes>
          <Route path="/" element={<HomePage graphData={graphData} />} />
          <Route path="/grid-menu" element={<GridMenu />} />
          <Route path="/graph/:subject" element={<GraphRouteWrapper graphData={graphData} />} />
          <Route path="/topic/:node" element={<TopicRouteWrapper />} />
          <Route path="/subgraph/:topicName" element={<SubGraphRouteWrapper />} /> {/* Add new route */}
        </Routes>
      </div>
    </Router>
  );
}

function TopicRouteWrapper() {
  const { node } = useParams();
  return <TopicEntry node={node} />;
}

const GraphRouteWrapper = ({ graphData }) => {
  const { subject } = useParams();
  return (
    <Graph
      nodes={graphData.nodes}
      links={graphData.links}
      width={800}
      height={600}
      subject={subject}
      style={{ margin: "auto" }}
    />
  );
};

const SubGraphRouteWrapper = () => {
  const { topicName } = useParams();
  return <SubGraph topicName={topicName} />;
};

export default App;
