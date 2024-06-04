import { Link } from "react-router-dom"
import { useState } from "react";

const NavbarDropdown = () => {

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
    )
}

export default NavbarDropdown