import React, { useState, useEffect } from "react";
import { getGraphData } from "../../database/graphData";
import {
  getCurrentUserData,
  getCurrentUserDocData,
  updateCompletionStatus,
} from "../../database/firebase"; // Import updateCompletionStatus function

const TopicEntry = ({ node }) => {
  const [topicNode, setTopicNode] = useState(null);
  const [error, setError] = useState(null);
  const [completed, setCompleted] = useState(false); // State to track completion status
  const [userEmail, setUserEmail] = useState(null); // State to store user email
  const [userId, setUserId] = useState(null); // State to store user ID

  useEffect(() => {
    const fetchTopic = async () => {
      try {
        const fetchedTopic = await getTopic(node);
        if (fetchedTopic.length > 0) {
          setTopicNode(fetchedTopic[0]);
          const userData = await getCurrentUserData();
          if (userData) {
            setUserEmail(userData.email); // Store user email
            setUserId(userData.uid); // Store user ID
            const userDoc = await getCurrentUserDocData(userData.email);

            if (userDoc && userDoc.subjectProgress) {
              setCompleted(
                userDoc.subjectProgress[fetchedTopic[0].name] || false
              );
            } else {
              setCompleted(false);
            }
          }
        } else {
          setError("Topic not found.");
        }
      } catch (err) {
        setError("Failed to fetch topic data.");
      }
    };

    fetchTopic();
  }, [node]);

  const toggleCompletion = async () => {
    const newStatus = !completed;
    setCompleted(newStatus);

    if (userEmail && topicNode) {
      const topicKey = topicNode.name;
      await updateCompletionStatus(userEmail, topicKey, newStatus);
    }
  };

  if (error) {
    return <div>{error}</div>;
  }

  if (!topicNode) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      {userEmail && (
        <button
          style={{
            position: "fixed",
            top: "10px",
            right: "10px",
            zIndex: "9999",
            marginTop: "80px",
          }}
          onClick={toggleCompletion}
        >
          {completed ? "Completed ✔️" : "Mark as Completed"}
        </button>
      )}
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
