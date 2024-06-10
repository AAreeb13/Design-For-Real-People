import React from "react";
import ReactDOM from "react-dom";
import "../styles/SuggestedTopicsOverlay.css";

const SuggestedTopicsOverlay = ({ open, onClose, suggestedTopics }) => {
  if (!open) return null;

  return ReactDOM.createPortal(
    <div className="overlay-container" onClick={onClose}>
      <div className="overlay-content" onClick={(e) => e.stopPropagation()}>
        <div className="overlay-header">
          <span>Suggested Topics</span>
          <button className="close-button" onClick={onClose}>
            &times;
          </button>
        </div>
        {suggestedTopics.length === 0 ? (
          <div>No suggested topics available.</div>
        ) : (
          <ul>
            {suggestedTopics.map((topic, index) => (
              <li className="suggested-topic" key={index}>
                {topic.name}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>,
    document.body
  );
};

export default SuggestedTopicsOverlay;
