import React, { useState, useEffect } from "react";
import { BsEmojiSmile, BsEmojiNeutral, BsEmojiFrown } from "react-icons/bs";
import { RiDeleteBin6Line, RiEdit2Line } from "react-icons/ri";
import { getNode } from "../../database/graphData";
import '../styles/TopicRatingDisplay.css'; 

const TopicRatingDisplay = ({ topicName }) => {
  const [topicNode, setTopicNode] = useState(null);

  useEffect(() => {
    const fetchTopicNode = async () => {
      const node = await getNode(topicName);
      setTopicNode(node);
    };

    fetchTopicNode();

    const interval = setInterval(fetchTopicNode, 2000);

    return () => clearInterval(interval);
  }, [topicName]);

  const handleDelete = () => {
    console.log("Delete button clicked for topic:", topicName);

  };

  const handleEdit = () => {
    console.log("Edit button clicked for topic:", topicName);

  };

  if (!topicNode) {
    return <div>Loading...</div>;
  }

  return (
    <div className="rating-icons-container">
      <button className="btn btn-outline-danger" onClick={handleDelete}>
        <RiDeleteBin6Line size={30} className="icon" />
        <span className="button-text">Delete</span>
      </button>

      <div className="rating-icons" style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "20px" }}>
        <div style={{ color: "green" }}>
          <BsEmojiSmile size={50} />
          <span style={{ display: "block", textAlign: "center", color: "black" }}>{topicNode.good.low}</span>
        </div>

        <div style={{ color: "yellow" }}>
          <BsEmojiNeutral size={50} />
          <span style={{ display: "block", textAlign: "center", color: "black" }}>{topicNode.alright.low}</span>
        </div>

        <div style={{ color: "red" }}>
          <BsEmojiFrown size={50} />
          <span style={{ display: "block", textAlign: "center", color: "black" }}>{topicNode.bad.low}</span>
        </div>
      </div>

      <button className="btn btn-outline-secondary edit-button" onClick={handleEdit}>
        <RiEdit2Line size={30} className="icon" />
        <span className="button-text">Edit</span>
      </button>
    </div>
  );
};

export default TopicRatingDisplay;
