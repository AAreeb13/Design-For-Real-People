import React, { useState } from 'react';

function MyNavbar() {

    const ourLogo = { 
        padding: '5px 5% 5px 5px' ,
        width: '200px'

    };
    const ourDropDown = {
        padding: '5px 5px 5px 5%',
        width: '300px'
    };
    const ourTopicAdder = {
        padding: '5px 5px 5px 5px'
    }

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
    }
    
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    return (
        <nav className="navbar navbar-expand-lg bg-body-tertiary" style={navStyle}> 
            <div className="container-fluid">
                <a className="navbar-brand" href="index.html" style={ourLogo}>StudyChain</a>

                <button className="navbar-toggler" type="button" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className={`collapse navbar-collapse ${isDropdownOpen ? 'show' : ''}`}>

                    <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                        
                        <li className="nav-item dropdown" style={ourDropDown}>
                            <a className="nav-link dropdown-toggle" href="#" role="button" onMouseEnter={toggleDropdown} onMouseLeave={toggleDropdown} aria-expanded={isDropdownOpen ? 'true' : 'false'}>
                                Explore Our topics
                            </a>
                            <ul className={`dropdown-menu ${isDropdownOpen ? 'show' : ''}`}>
                                <li><a className="dropdown-item" href="#">Calculus</a></li>
                                <li><a className="dropdown-item" href="#">Networking</a></li>
                                <li><a className="dropdown-item" href="#">Programming</a></li>
                            </ul>
                        </li>
                        
                        <li className="nav-item" style={ourTopicAdder}>
                            <a className="nav-link disabled" aria-disabled="true">Add a Topic</a>
                        </li>
                    
                    </ul>

                    <form className="d-flex" role="search">
                        <input className="form-control me-2" type="search" placeholder="Enter a Topic" aria-label="Search" />
                        <button className="btn btn-outline-success" type="submit">Search</button>
                    </form>

                </div>
            </div>
        </nav>
    );
}

export default MyNavbar;