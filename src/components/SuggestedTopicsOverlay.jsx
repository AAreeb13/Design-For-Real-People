import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import { RiDeleteBin6Line } from "react-icons/ri"; // Import the delete bin icon
import "../styles/SuggestedTopicsOverlay.css";
import { getSuggestionData } from "../../database/firebase";

const SuggestedTopicsOverlay = ({ open, onClose }) => {
  const [suggestedTopics, setSuggestedTopics] = useState([]);

  useEffect(() => {
    const fetchSuggestedTopics = async () => {
      try {
        const topics = await getSuggestionData();
        console.log("topics", topics);
        setSuggestedTopics(topics);
      } catch (error) {
        console.error("Error fetching suggested topics:", error);
      }
    };

    if (open) {
      fetchSuggestedTopics();
    }
  }, [open]);

  if (!open) return null;

  const handleDeleteTopic = (index) => {
    // Implement delete functionality here
    console.log("Delete topic with index:", index);
    // You can call an API to delete the topic from the database
  };

  return ReactDOM.createPortal(
    <div className="auth-form-overlay overlay-container" onClick={onClose}>
      <div
        className="form-container overlay-content"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="overlay-header">
          <span className="suggested-topics-title">Suggested Topics</span>
          <button className="close-button" onClick={onClose}>
            &times;
          </button>
        </div>
        {suggestedTopics.length === 0 ? (
          <div>No suggested topics available.</div>
        ) : (
          <div className="suggested-topics-container">
            {suggestedTopics.map((topic, index) => (
              <div className="suggested-topic" key={index}>
                <div className="topic-info">
                  <div className="suggested-topic-name">{topic.name}</div>
                  <div>
                    Type:
                    {topic.type === "main-subject"
                      ? " Main Subject"
                      : topic.type === "mini-subject"
                      ? " Mini Subject"
                      : topic.type === "topic"
                      ? " Topic"
                      : " Unknown"}
                  </div>
                  {topic.type === "main-subject" && (
                    <div>Theme: {topic.theme}</div>
                  )}
                  {topic.type === "mini-subject" && (
                    <div>
                      Subject: {topic.subject}
                      <br />
                      Prerequisites: {topic.prerequisites.join(", ")}
                    </div>
                  )}
                  {topic.type === "topic" && (
                    <div>
                      Subject: {topic.subject}
                      <br />
                      Prerequisites: {topic.prerequisites.join(", ")}
                    </div>
                  )}
                </div>
                <div className="delete-icon-container">
                  {/* Bin icon for deleting the topic */}
                  <button
                    className="btn btn-danger delete-button"
                    onClick={() => handleDeleteTopic(index)}
                  >
                    <RiDeleteBin6Line className="delete-icon" />
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>,
    document.body
  );
};

export default SuggestedTopicsOverlay;
