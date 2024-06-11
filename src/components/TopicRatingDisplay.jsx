import React, { useState, useEffect } from "react";
import { BsEmojiSmile, BsEmojiNeutral, BsEmojiFrown } from "react-icons/bs";
import { getRating } from "../../database/firebase";
import { getNode } from "../../database/graphData";

const TopicRatingDisplay = ({ topicName }) => {
  const [topicNode, setTopicNode] = useState(null);

  useEffect(() => {
    const fetchTopicNode = async () => {
      const node = await getNode(topicName);
      setTopicNode(node);
    };

    // Fetch initial data
    fetchTopicNode();

    // Setup interval to check for updates every 5 seconds
    const interval = setInterval(fetchTopicNode, 2000);

    // Cleanup function to clear interval
    return () => clearInterval(interval);
  }, [topicName]); // Dependency array ensures useEffect runs when topicName changes

  if (!topicNode) {
    return <div>Loading...</div>;
  }

  return (
    <div className="rating-icons" style={{ display: "flex", justifyContent: "center", gap: "20px" }}>
      <div style={{ color: "green" }}>
        <BsEmojiSmile size={50} />
        <span style={{ display: "block", textAlign: "center", color: "black" }}>{topicNode.good.low}</span>
      </div>
      <div style={{ color: "yellow"}}>
        <BsEmojiNeutral size={50} />
        <span style={{ display: "block", textAlign: "center", color: "black" }}>{topicNode.alright.low}</span>
      </div>
      <div style={{ color: "red" }}>
        <BsEmojiFrown size={50} />
        <span style={{ display: "block", textAlign: "center", color: "black" }}>{topicNode.bad.low}</span>
      </div>
    </div>
  );
};

export default TopicRatingDisplay;
