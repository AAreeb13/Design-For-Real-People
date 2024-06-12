import React, { useState } from "react";
import "../styles/SuggestionOverlay.css";

const SuggestionOverlay = ({ onClose }) => {
  const [suggestion, setSuggestion] = useState("");
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  const handleInputChange = (event) => {
    setSuggestion(event.target.value);
    setShowSuccessMessage(false);
  };

  const handleSubmit = () => {
    console.log("Suggestion submitted:", suggestion);

    // todo backend


    setSuggestion("");
    setShowSuccessMessage(true);
    setTimeout(() => {
      setShowSuccessMessage(false);
    }, 3000);
  };

  return (
    <div className="overlay">
      <div className="overlay-content">
        <div className="overlay-header">
          <h2>Suggest Topic</h2>
          <button className="close-btn" onClick={onClose}>x</button>
        </div>
        <div className="input-group mb-3">
          <input
            type="text"
            className="form-control"
            value={suggestion}
            onChange={handleInputChange}
            placeholder="Enter your suggestion..."
          />
        </div>
        <button
          className="btn btn-outline-primary btn-block"
          type="button"
          onClick={handleSubmit}
        >
          Submit
        </button>
        {showSuccessMessage && (
          <div className="success-message">Suggestion submitted successfully!</div>
        )}
      </div>
    </div>
  );
};

export default SuggestionOverlay;
