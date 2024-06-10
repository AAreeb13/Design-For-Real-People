import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import NavbarDropdown from "./NavbarDropdown";
import AuthFormOverlay from "./FormOverlay"; 
import SearchBar from "./SearchBar";
import { auth } from "../../database/firebase";
import "../styles/Navbar.css";

const MyNavbar = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formType, setFormType] = useState(""); 
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      setIsLoggedIn(user);
    });
    return unsubscribe;
  }, []);

  const handleLogout = () => {
    auth.signOut().then(() => {
      console.log("User logged out");
    }).catch((error) => {
      console.error("Error signing out:", error);
    });
  };

  const handleOpenForm = (type) => {
    setIsFormOpen(true);
    setFormType(type);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
  };

  return (
    <div>
      <nav className="navbar navbar-expand-lg bg-body-tertiary our-navbar">
        <div className="container-fluid">

          <LogoAndDropdown />

          <TopicAdder handleOpenForm={handleOpenForm} />

          <SearchBar />

          {!isLoggedIn ? (
            <LoggedOutButtons handleOpenForm={handleOpenForm} />
          ) : (
            <LoggedInButtons handleLogout={handleLogout} />
          )}
          
        </div>
      </nav>
      {isFormOpen && <AuthFormOverlay onClose={handleCloseForm} formType={formType} />}
    </div>
  );
};

const LogoAndDropdown = () => (
  <>
    <Link className="navbar-brand our-logo" to="/">
      StudyChain
    </Link>
    <button
      className="navbar-toggler"
      type="button"
      aria-label="Toggle navigation"
    >
      <span className="navbar-toggler-icon"></span>
    </button>
    <NavbarDropdown />
  </>
);

const TopicAdder = ({ handleOpenForm }) => (
  <div className="collapse navbar-collapse">
    <ul className="navbar-nav mr-auto">
      <li className="nav-item">
        <button className="btn btn-success add-topic-style" onClick={() => handleOpenForm("add")}>
          Add a Topic
        </button>
      </li>
    </ul>
  </div>
);

const LoggedOutButtons = ({ handleOpenForm }) => (
  <>
    <button className="btn btn-outline-success login-style" onClick={() => handleOpenForm("login")}>
      Login
    </button>
    <button className="btn btn-outline-success" onClick={() => handleOpenForm("signup")}>
      Sign Up
    </button>
  </>
);

const LoggedInButtons = ({ handleLogout }) => (
  <button className="btn btn-outline-danger logout-style" onClick={handleLogout}>
    Logout
  </button>
);

export default MyNavbar;
