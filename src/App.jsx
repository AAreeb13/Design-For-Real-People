import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.css";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useParams,
} from "react-router-dom";
import HomePage from "./pages/HomePage";
import Graph from "./components/Graph";
import Navbar from "./components/Navbar";
import GridMenu from "./pages/GridMenu";
import { getGraphData } from "../database/graphData";
import { initAuthStateListener, auth } from "../database/firebase";
import TopicEntry from "./components/TopicEntry";

function App() {
  const [graphData, setGraphData] = useState({ nodes: [], links: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userData, setUserData] = useState(null);
  const [key, setKey] = useState(0); // to force re-render

  let oldData = null;

  const fetchData = async () => {
    try {
      const data = await getGraphData();
      if (oldData === null || !isEqualData(oldData, data)) {
        oldData = data;
        setGraphData(data);
        console.log("data is now", data);
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

  useEffect(() => {
    initAuthStateListener();

    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUserData(user);
      setKey((prevKey) => prevKey + 1); // forced re-render
      console.log(user ? "User data: " + user : "No user is signed in");
    });

    return () => unsubscribe();
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
        <Routes key={key}>
          <Route path="/" element={<HomePage />} />
          <Route path="/grid-menu" element={<GridMenu />} />
          <Route
            path="/graph/:subject"
            element={
              <GraphRouteWrapper graphData={graphData} userData={userData} />
            }
          />
          <Route
            path="/topic/:node"
            element={<TopicRouteWrapper graphData={graphData} userData={userData} />}
          />
          <Route
            path="/subgraph/:topicName"
            element={
              <SubgraphRouteWrapper graphData={graphData} userData={userData} />
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

function TopicRouteWrapper({ graphData, userData }) {
  const { node } = useParams();

  useEffect(() => {
    console.log("TopicRouteWrapper userData changed:", userData);
  }, [userData]);

  return <TopicEntry node={node} graphData={graphData} userData={userData} />;
}

function GraphRouteWrapper({ graphData, userData }) {
  const { subject } = useParams();

  useEffect(() => {
    console.log("GraphRouteWrapper userData changed:", userData);
  }, [userData]);

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

function SubgraphRouteWrapper({ graphData, userData }) {
  const { topicName } = useParams();
  const node = graphData.nodes.find((n) => n.name === topicName);
  const subject = node.subject;

  useEffect(() => {
    console.log("SubgraphRouteWrapper userData changed:", userData);
  }, [userData]);

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

function isEqualData(oldData, data) {
  const transformedOldData = {
    nodes: oldData.nodes,
    relationships: oldData.relationships.map((n) => {
      if (n.source.name != null) {
        return { source: n.source.name, target: n.target.name };
      } else {
        return { source: n.source, target: n.target };
      }
    }),
  };

  if (
    transformedOldData.nodes.length !== data.nodes.length ||
    transformedOldData.relationships.length !== data.relationships.length
  ) {
    return false;
  }

  const nodesEqual = transformedOldData.nodes.every(
    (node, index) => node.name === data.nodes[index].name
  );

  const relationshipsEqual = transformedOldData.relationships.every(
    (rel, index) => {
      return (
        rel.source === data.relationships[index].source &&
        rel.target === data.relationships[index].target
      );
    }
  );

  return nodesEqual && relationshipsEqual;
}

export default App;
