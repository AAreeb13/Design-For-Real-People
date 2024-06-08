import React, { useState } from "react";
import ReactDOM from "react-dom";
import LoginForm from "./LoginForm";
import SignupForm from "./SignupForm";
import TopicAdderForm from "./TopicAdderForm.jsx";
import { addMainSubjectToGraph, addMiniSubjectToGraph, addTopicToGraph, mainSubjectExists, subjectExists, nodeExists } from "../../database/graphData";



const FormOverlay = ({ onClose, formType }) => {
  const overlayStyle = {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  };

  const formContainerStyle = {
    backgroundColor: "white",
    padding: "20px",
    borderRadius: "8px",
    position: "relative",
    boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
    width: "600px",
  };

  const closeButtonStyle = {
    position: "absolute",
    top: "10px",
    right: "10px",
    background: "none",
    border: "none",
    fontSize: "24px",
    cursor: "pointer",
    color: "#333",
  };

  const submitButtonStyle = {
    marginTop: "30px"
  };

  const [selectedType, setSelectedType] = useState("");
  const [formData, setFormData] = useState({
    type: "",
    name: "",
    theme: "",
    subject: "",
    prerequisites: "",
    username: "",
    password: "",
    confirmPassword: "",
  });

  const handleTypeChange = (event) => {
    const newType = event.target.value;
    setFormData((prevData) => ({
      ...prevData,
      type: newType,
    }));
    setSelectedType(newType);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log("formdata", formData);
    let isValid = false;

    if (formType === "login") {
      isValid = true // todo backend for
    } else if (formType === "signup") {
      isValid = true // todo backend for
    } else {
      isValid = await handleTopicAdderSubmit(formData, isValid, validateMainSubject, validateMiniSubject, validateTopic);
    }

    if (isValid) {
      onClose();
    }
  };


  const renderForm = () => {
    if (formType === "login") {
      return <LoginForm 
                formData={formData} 
                handleChange={handleChange} 
                handleSubmit={handleSubmit} 
                submitButtonStyle={submitButtonStyle} 
              />;
    } else if (formType === "signup") {
      return <SignupForm 
                formData={formData} 
                handleChange={handleChange} 
                handleSubmit={handleSubmit} 
                submitButtonStyle={submitButtonStyle}
              />;
    } else {
      return <TopicAdderForm 
                formData={formData} 
                selectedType={selectedType} 
                handleChange={handleChange} 
                handleTypeChange={handleTypeChange} 
                handleSubmit={handleSubmit} 
                submitButtonStyle={submitButtonStyle} 
              />
    }
  };

  return ReactDOM.createPortal(
    <div className="auth-form-overlay" style={overlayStyle}>
      <div className="form-container" style={formContainerStyle}>
        <button className="close-button" style={closeButtonStyle} onClick={onClose} aria-label="Close form">
          &times;
        </button>
        <h2>{formType === 'login' ? 'Login' : formType === 'signup' ? 'Sign Up' : 'Add a New Entry'}</h2>
        {renderForm()}
      </div>
    </div>,
    document.body
  );
};



async function handleTopicAdderSubmit(formData, isValid, validateMainSubject, validateMiniSubject, validateTopic) {
  if (formData.type === "main-subject") {
    isValid = await validateMainSubject(formData);
    if (isValid) {
      addMainSubjectToGraph(formData.name, formData.theme);
    } else {
      alert("Please ensure all fields are filled, and that the subject doesn't currently exist");
    }
  } else if (formData.type === "mini-subject") {
    isValid = await validateMiniSubject(formData);
    if (isValid) {
      addMiniSubjectToGraph(formData.name, formData.subject, formData.prerequisites);
    } else {
      alert("Please ensure that all fields are filled, the name doesn't exist, the subject does exist and that the prerequisites are correctly spelled");
    }
  } else if (formData.type === "topic") {
    isValid = await validateTopic(formData);
    if (isValid) {
      addTopicToGraph(formData.name, formData.subject, formData.prerequisites);
    } else {
      alert("Please ensure that all fields are filled, the name doesn't exist, the subject does exist and that the prerequisites are correctly spelled");
    }
  }
  return isValid;
}

const validateMainSubject = async (data) => {
  const nonEmpty = data.name.trim() !== "" && data.theme.trim() !== "";
  const subjectExists = await mainSubjectExists("Subject", data)
  return nonEmpty && !subjectExists
};

const validateMiniSubject = async (data) => {
  const nonEmpty = data.name.trim() !== "" && data.subject.trim() !== "" && data.prerequisites.trim() !== "";
  const mainSubExst = await mainSubjectExists("Subject", data);
  const minSubExst = await subjectExists("Subject", data);

  const prerequisitesArray = data.prerequisites.split(',').map(prereq => prereq.trim());

  for (const prerequisite of prerequisitesArray) {
    const exists = await nodeExists("Subject", {name: prerequisite});
    if (!exists) return false;
  }
  
  return nonEmpty && mainSubExst && !minSubExst
};

const validateTopic = async (data) => {
  const nonEmpty = data.name.trim() !== "" && data.subject.trim() !== "" && data.prerequisites.trim() !== "";
  const mainSubExst = await mainSubjectExists("Subject", data, false);
  const topicExst = await nodeExists("Subject", data);

  const prerequisitesArray = data.prerequisites.split(',').map(prereq => prereq.trim());
  for (const prerequisite of prerequisitesArray) {
    const exists = await nodeExists("Subject", {name: prerequisite});
    if (!exists) return false;
  }

  return nonEmpty && mainSubExst && !topicExst    
};


export default FormOverlay;