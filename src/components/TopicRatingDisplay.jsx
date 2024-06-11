import React, { useState, useEffect } from "react";
import { BsEmojiSmile, BsEmojiNeutral, BsEmojiFrown } from "react-icons/bs";
import { getRating } from "../../database/firebase";

const TopicRatingDisplay = ({ userEmail, topicName }) => {

  useEffect(() => {
    const fetchRating = async () => {
      try {
        const rating = await getRating(userEmail, topicName);
        setSelectedRating(rating);
      } catch (error) {
        console.error("Error fetching rating:", error);
      }
    };

    fetchRating();
  }, [userEmail, topicName]);

  return (
    <div className="rating-icons" style={{ display: "flex", justifyContent: "center", gap: "20px" }}>
      <div style={{ color: "green" }}>
        <BsEmojiSmile size={50} />
        <span style={{ display: "block", textAlign: "center", color: "black" }}>Good</span>
      </div>
      <div style={{ color: "yellow"}}>
        <BsEmojiNeutral size={50} />
        <span style={{ display: "block", textAlign: "center", color: "black" }}>Alright</span>
      </div>
      <div style={{ color: "red" }}>
        <BsEmojiFrown size={50} />
        <span style={{ display: "block", textAlign: "center", color: "black" }}>Bad</span>
      </div>
    </div>
  );
};

export default TopicRatingDisplay;
