import React, { useState } from "react";
import { BsEmojiSmile, BsEmojiNeutral, BsEmojiFrown } from "react-icons/bs";

const TopicRatingButtons = ({ onRatingChange }) => {
  const [selectedRating, setSelectedRating] = useState(null);
  const [hoveredRating, setHoveredRating] = useState(null);

  const handleRatingHover = (rating) => {
    setHoveredRating(rating);
  };

  const handleRatingClick = (rating) => {
    if (selectedRating === rating) {
      setSelectedRating(null);
    } else {
      setSelectedRating(rating);
      onRatingChange(rating);
    }
  };

  return (
    <div className="rating-icons" style={{ display: "flex", justifyContent: "center", gap: "20px" }}>
      <div 
        onClick={() => handleRatingClick("good")} 
        onMouseEnter={() => handleRatingHover("good")}
        onMouseLeave={() => handleRatingHover(null)}
        style={{ cursor: "pointer", color: (selectedRating === "good" || hoveredRating === "good") ? "green" : "black" }}
      >
        <BsEmojiSmile size={50} />
        <span style={{ display: "block", textAlign: "center" }}>Good</span>
      </div>
      <div 
        onClick={() => handleRatingClick("alright")} 
        onMouseEnter={() => handleRatingHover("alright")}
        onMouseLeave={() => handleRatingHover(null)}
        style={{ cursor: "pointer", color: (selectedRating === "alright" || hoveredRating === "alright") ? "yellow" : "black" }}
      >
        <BsEmojiNeutral size={50} />
        <span style={{ display: "block", textAlign: "center" }}>Alright</span>
      </div>
      <div 
        onClick={() => handleRatingClick("bad")} 
        onMouseEnter={() => handleRatingHover("bad")}
        onMouseLeave={() => handleRatingHover(null)}
        style={{ cursor: "pointer", color: (selectedRating === "bad" || hoveredRating === "bad") ? "red" : "black" }}
      >
        <BsEmojiFrown size={50} />
        <span style={{ display: "block", textAlign: "center" }}>Bad</span>
      </div>
    </div>
  );
};

export default TopicRatingButtons;
