import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function MyNavbar() {
    const ourLogo = { 
        padding: '5px 5px 5px 5px',
        width: '150px'
    };

    const ourTopicAdder = {
        padding: '5px 5px 5px 5px',
        marginRight: "10%"
    };

    const navStyle = {
        backgroundColor: '#2c3e50',
        color: 'white',
        padding: '1rem 2rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        boxShadow:'0 4px 6px rgba(0, 0, 0, 0.1)',
        position: 'fixed',
        width: '100%',
        top: '0'
    };

    const loginStyle = {
        marginLeft: "20%",
        marginRight: "2%",
    };

    const dropDownMenuStyle = {
        width: "200px"
    };

    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const handleMouseEnter = () => {
        setIsDropdownOpen(true);
    };

    const handleMouseLeave = () => {
        setIsDropdownOpen(false);
    };

    return (
        <nav className="navbar navbar-expand-lg bg-body-tertiary" style={navStyle}> 
            <div className="container-fluid">
                <Link className="navbar-brand" to="/" style={ourLogo}>StudyChain</Link>

                <button className="navbar-toggler" type="button" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className={`collapse navbar-collapse ${isDropdownOpen ? 'show' : ''}`} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} style={dropDownMenuStyle}>
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0" style={dropDownMenuStyle}>
                        <li className="nav-item dropdown" style={dropDownMenuStyle}>
                            <Link className="nav-link dropdown-toggle" to="/grid-menu" role="button" aria-expanded={isDropdownOpen ? 'true' : 'false'}>
                                Explore Our Topics
                            </Link>
                            <ul className={`dropdown-menu ${isDropdownOpen ? 'show' : ''}`}>
                                <li><Link className="dropdown-item" to="/calculus">Calculus</Link></li>
                                <li><Link className="dropdown-item" to="/networking">Networking</Link></li>
                                <li><Link className="dropdown-item" to="/programming">Programming</Link></li>
                            </ul>
                        </li>
                    </ul>
                </div>

                <li className="nav-item" style={ourTopicAdder}>
                    <a className="btn btn-outline-success" aria-disabled="true">Add a Topic</a>
                </li>

                <form className="d-flex" role="search">
                    <input className="form-control me-2" type="search" placeholder="Enter a Topic" aria-label="Search" />
                    <button className="btn btn-outline-success" type="submit">Search</button>
                </form>

                <button className="btn btn-outline-success" style={loginStyle}>Login</button>
                <button className="btn btn-outline-success">Sign Up</button>

            </div>
        </nav>
    );
}

export default MyNavbar;
