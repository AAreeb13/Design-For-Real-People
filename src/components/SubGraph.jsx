import React, { useState } from "react";
import Graph from "./Graph";
import { getGraphData } from "../../database/graphData";

const SubGraph = ({ topicName }) => {
  const [nodes, setNodes] = useState([])
  const [relationships, setRelationships] = useState([])

  useEffect(() => {
    const fetchGraphData = async () => {
      try {
        const { nodes, relationships } = await getGraphData();
        setNodes(nodes);
        setRelationships(relationships)
      } catch (error) {
        console.error("Failed to getch graph data:", error)
      }

      fetchGraphData();
    }
  }, [])


  return (
    <div>
      <h2>SubGraph for {topicName}</h2>
      <Graph
        nodes={ nodes }
        links={ relationships}
        width={800}
        height={600}
        subject={topicName}
        style={{ margin: "auto" }}
      />
    </div>
  );
};

export default SubGraph;
