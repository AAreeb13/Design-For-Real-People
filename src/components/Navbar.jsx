import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import NavbarDropdown from "./NavbarDropdown";
import AuthFormOverlay from "./FormOverlay"; 
import SearchBar from "./SearchBar";
import { auth, getUserPrivledge } from "../../database/firebase";
import "../styles/Navbar.css";

const MyNavbar = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formType, setFormType] = useState(""); 
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [privilegeLevel, setPrivilegeLevel] = useState("guest");

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      setIsLoggedIn(!!user);
      if (user) {
        try {
          const privilege = await getUserPrivledge(user.email);
          setPrivilegeLevel(privilege);
        } catch (error) {
          console.error("Error fetching user privilege:", error);
        }
      } else {
        setPrivilegeLevel("guest");
      }
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

          {privilegeLevel === "guest" ? (
            <DisabledTopicAdder />
          ) : privilegeLevel === "member" ? (
            <TopicSuggester handleOpenForm={handleOpenForm} />
          ) : privilegeLevel === "moderator" ? (
            <>
              <SeeSuggestedTopics />
              <TopicAdder handleOpenForm={handleOpenForm} />
            </>
          ) : (
            <h1>ERROR: Not guest, member or moderator</h1>
          )}

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

const DisabledTopicAdder = () => (
  <div className="collapse navbar-collapse">
    <ul className="navbar-nav mr-auto">
      <li className="nav-item">
        <button className="btn btn-success disabled-button-style" disabled style={{ fontSize: '12px' }}>
          Login to add a topic
        </button>
      </li>
    </ul>
  </div>
);

const TopicSuggester = ({ handleOpenForm }) => (
  <div className="collapse navbar-collapse">
    <ul className="navbar-nav mr-auto">
      <li className="nav-item">
        <button className="btn btn-success suggest-topic-style" onClick={() => handleOpenForm("suggest")}>
          Suggest a Topic
        </button>
      </li>
    </ul>
  </div>
);

const SeeSuggestedTopics = () => (
  <div className="collapse navbar-collapse">
    <ul className="navbar-nav mr-auto">
      <li className="nav-item">
        <button className="btn btn-warning see-suggested-topics-style">
          See Suggested Topics
        </button>
      </li>
    </ul>
  </div>
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
