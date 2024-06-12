import React, { useState, useEffect } from "react";
import { getFormData, getNode } from "../../database/graphData";
import "../styles/TopicEditForm.css";
import Button from 'react-bootstrap/Button'; 

const TopicEditForm = ({ topicName }) => {
  const [topicNode, setTopicNode] = useState(null);
  const [formData, setFormData] = useState(null);

  useEffect(() => {
    const fetchTopicData = async () => {
      try {
        const fetchedTopicNode = await getNode(topicName);
        const fetchedFormData = await getFormData(topicName);
        setTopicNode(fetchedTopicNode);
        setFormData(fetchedFormData);
      } catch (error) {
        console.error("Error fetching topic data:", error);
      }
    };

    fetchTopicData();
  }, [topicName]);

  const handleInputChange = (e, label, isTopicNode) => {
    const newValue = e.target.value;
    if (isTopicNode) {
      setTopicNode(prevState => ({
        ...prevState,
        [label]: newValue
      }));
    } else {
      setFormData(prevState => ({
        ...prevState,
        [label]: newValue
      }));
    }
  };

  const renderFormElement = (label, value, isTopicNode) => {
    const topicNodePropsToUse = ["name", "subject", "description", "learning_objectives"];

    if (isTopicNode) {
      if (topicNodePropsToUse.includes(label)) {
        return (
          <div key={label} className="form-group">
            <label className="form-label">{label === "learning_objectives" ? "Learning Objectives" : asTitle(label)}: </label>
            {label === "name" || label === "subject" ? (
              <input type="text" value={value} onChange={(e) => handleInputChange(e, label, true)} className="form-control disabled-input" disabled />
            ) : label === "description" || label === "learning_objectives" ? (
              <textarea value={value} onChange={(e) => handleInputChange(e, label, true)} className="form-control" rows="5" />
            ) : (
              <input type="text" value={value} onChange={(e) => handleInputChange(e, label, true)} className="form-control" />
            )}
          </div>
        );
      }
    } else {
      return (
        <div key={label} className="form-group">
          <label className="form-label">{asTitle(label)}: </label>
          <input type="text" value={value} onChange={(e) => handleInputChange(e, label, false)} className="form-control" />
        </div>
      );
    }
  };

  const renderForm = () => {
    if (!topicNode || !formData) return null;

    const topicNodeElements = Object.entries(topicNode).map(([key, value]) =>
      renderFormElement(key, value, true)
    );

    const formDataElements = Object.entries(formData).map(([key, value]) =>
      renderFormElement(key, value, false)
    );

    return (
      <div>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <Button variant="dark" onClick={() => window.location.assign(`/topic/${topicName}`)} className="our-back-button">Go Back</Button>
        </div>
        <h1>Editing Topic: {topicName}</h1>
        <h2 style={{marginTop: "30px", marginBottom: "20px"}}>Required Topic Details</h2>
        {topicNodeElements}
        <h2 style={{marginTop: "80px", marginBlock: "20px"}}>Extra Details</h2>
        {formDataElements}
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div></div>
          <Button variant="success" className="our-submit-button float-right">Submit</Button> 
        </div>
      </div>
    );
  };

  return renderForm();
};

const asTitle = (str) => {
  return str.replace(/\b\w/g, char => char.toUpperCase());
}


export default TopicEditForm;
