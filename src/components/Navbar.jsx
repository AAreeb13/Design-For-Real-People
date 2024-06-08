import React, { useState } from "react";
import { Link } from "react-router-dom";
import NavbarDropdown from "./NavbarDropdown";
import AuthFormOverlay from "./FormOverlay"; 
import SearchBar from "./SearchBar";

const MyNavbar = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [formType, setFormType] = useState(""); 

  const handleOpenForm = (type) => { 
    setIsFormOpen(true);
    setFormType(type); 
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  const ourLogo = {
    padding: "5px 5px 5px 5px",
    width: "150px",
  };

  const navStyle = {
    backgroundColor: "#2c3e50",
    color: "white",
    padding: "1rem 2rem",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    position: "fixed",
    width: "100%",
    top: "0",
  };

  const loginStyle = {
    marginLeft: "20%",
    marginRight: "2%",
  };

  const addTopicStyle = {
    marginRight: "20px",
  };

  const logoutStyle = {
    marginLeft: "27%",
  };

  return (
    <div>
      <nav className="navbar navbar-expand-lg bg-body-tertiary" style={navStyle}>
        <div className="container-fluid">
          <Link className="navbar-brand" to="/" style={ourLogo}>
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

          <div className="collapse navbar-collapse">
            <ul className="navbar-nav mr-auto">
              <li className="nav-item">
                <button className="btn btn-success" onClick={() => handleOpenForm("add")} style={addTopicStyle}>
                  Add a Topic
                </button>
              </li>
            </ul>
          </div>

          <SearchBar />

          {!isLoggedIn ? (
            <>
              <button className="btn btn-outline-success" style={loginStyle} onClick={() => handleOpenForm("login")}>
                Login
              </button>
              <button className="btn btn-outline-success" onClick={() => handleOpenForm("signup")}>
                Sign Up
              </button>
            </>
          ) : (
            <button className="btn btn-outline-danger" style={logoutStyle} onClick={handleLogout}>
              Logout
            </button>
          )}
        </div>
      </nav>
      {isFormOpen && <AuthFormOverlay onClose={handleCloseForm} formType={formType} />}
    </div>
  );
};

export default MyNavbar;
