import React, { useState } from "react";
import ReactDOM from "react-dom";
import LoginForm from "./LoginForm";
import SignupForm from "./SignupForm";
import TopicAdderForm, { handleTopicAdderSubmit } from "./TopicAdderForm.jsx";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../database/firebase.js";
import { addDoc } from "firebase/firestore";
import { collection } from "firebase/firestore";
import { db } from "../../database/firebase.js";
import "../styles/FormOverlay.css"

const FormOverlay = ({ onClose, formType }) => {
  const usersCollectionRef = collection(db, "Users");

  const [selectedType, setSelectedType] = useState("");
  const [formData, setFormData] = useState({
    type: "",
    name: "",
    theme: "",
    subject: "",
    prerequisites: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [userEmail, setUserEmail] = useState("");

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
    let errorMessage = "";

    
    if (formType == "signup" && formData.password !== formData.confirmPassword) {
      errorMessage = "Password and confirm password must match."; 
    } else {
      const signingUp = async () => {
        try {
          await createUserWithEmailAndPassword(auth, formData.email, formData.password);
          console.log("formdata.email", formData.email)
          setUserEmail(formData.email);
          await addDoc(usersCollectionRef, { email: formData.email, privilege: "member" });
          isValid = true;
        } catch (error) {
          console.error(error);
          errorMessage = "Signup failed. Please try again."; 
        }
      };
    
      const loggingIn = async () => {
        try {
          await signInWithEmailAndPassword(auth, formData.email, formData.password);
          setUserEmail(formData.email);
          isValid = true;
        } catch (error) {
          console.error(error);
          errorMessage = "Login failed. Please try again."; 
        }
      };
    
      if (formType === "login") {
        await loggingIn();
      } else if (formType === "signup") {
        await signingUp();
      } else {
        isValid = await handleTopicAdderSubmit(formData, isValid);
      }
    }

    if (isValid) {
      onClose();
    } else {
      setFormData((prevData) => ({
        ...prevData,
        password: "", 
        confirmPassword: "", 
      }));
      alert(errorMessage);
    }
  };

  
  const renderForm = () => {
    if (formType === "login") {
      return (
        <LoginForm
          formData={formData}
          handleChange={handleChange}
          handleSubmit={handleSubmit}
        />
      );
    } else if (formType === "signup") {
      return (
        <SignupForm
          formData={formData}
          handleChange={handleChange}
          handleSubmit={handleSubmit}
        />
      );
    } else {
      return (
        <TopicAdderForm
          formData={formData}
          selectedType={selectedType}
          handleChange={handleChange}
          handleTypeChange={handleTypeChange}
          handleSubmit={handleSubmit}
        />
      );
    }
  };

  return ReactDOM.createPortal(
    <div className="auth-form-overlay auth-form-overlay">
      <div className="form-container form-container-2">
        <button className="close-button close-button-2" onClick={onClose} aria-label="Close form">
          &times;
        </button>
        <h2>{formType === 'login' ? 'Login' : formType === 'signup' ? 'Sign Up' : 'Add a New Entry'}</h2>
        {renderForm()}
      </div>
    </div>,
    document.body
  );
};


export default FormOverlay;
