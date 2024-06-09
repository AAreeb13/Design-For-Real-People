import React, { useState, useEffect } from "react";
import { getGraphData } from "../../database/graphData";

const TopicEntry = ({ node }) => {
  const [topicNode, setTopicNode] = useState(null);
  const [error, setError] = useState(null);
  const [completed, setCompleted] = useState(false); // State to track completion status

  useEffect(() => {
    const fetchTopic = async () => {
      try {
        const fetchedTopic = await getTopic(node);
        if (fetchedTopic.length > 0) {
          setTopicNode(fetchedTopic[0]);
        } else {
          setError("Topic not found.");
        }
      } catch (err) {
        setError("Failed to fetch topic data.");
      }
    };
    
    fetchTopic();
  }, [node]);

  const toggleCompletion = () => {
    setCompleted(!completed);
  };

  if (error) {
    return <div>{error}</div>;
  }

  if (!topicNode) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <button
        style={{
          position: "fixed",
          top: "10px",
          right: "10px",
          zIndex: "9999",
          marginTop: "80px"
        }}
        onClick={toggleCompletion}
      >
        {completed ? "Completed ✔️" : "Mark as Completed"}
      </button>
      <div>
        <h1 className="topic-header">{topicNode.subject}</h1>
        <h2 className="topic-name">{topicNode.name}</h2>
  
        <h3>Description:</h3>
        <p className="topic-description">{topicNode.description}</p>
  
        <h3>Learning Objectives:</h3>
        <ul>
          {topicNode.learning_objectives.map((o, index) => (
            <li key={index}>{o}</li>
          ))}
        </ul>
  
        <h3>Prerequisites:</h3>
        <ul>
          {topicNode.requires.map((o, index) => (
            <li key={index}>{o}</li>
          ))}
        </ul>
        
        <h3>Resources:</h3>
        <ul>
          {topicNode.resources.map((o, index) => (
            <li key={index}>{o}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

const getTopic = async (name) => {
  console.log("we got here");
  const { nodes, relationships } = await getGraphData();
  
  return nodes.filter((n) => n.name === name);
};

export default TopicEntry;
