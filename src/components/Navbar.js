import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import ReorderIcon from "@mui/icons-material/Reorder";
import Icon from "../assets/Icon.png";
import "../styles/Navbar.css";

function Navbar({ scrollToFeatures }) {
  const [viewLinks, setViewLinks] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const toggleNavbar = () => {
    setViewLinks(!viewLinks);
  };

  // Click on "Features" -> Scroll or Navigate to Home first
  const handleFeaturesClick = (e) => {
    e.preventDefault();
    if (location.pathname !== "/") {
      navigate("/");
      setTimeout(scrollToFeatures, 100);
    } else {
      scrollToFeatures();
    }
  };

  // Click on "Orgomate" -> Always Navigate to Home and Scroll to Top
  const handleLogoClick = (e) => {
    e.preventDefault();
    if (location.pathname !== "/") {
      navigate("/");
      setTimeout(() => window.scrollTo({ top: 0, behavior: "smooth" }), 100);
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <div className="navbar">
      <div className="leftSide">
        <Link to="/" className="brand" onClick={handleLogoClick}>
          <img src={Icon} alt="Icon" className="logo" />
          <span>Orgomate</span>
        </Link>
      </div>
      <div className="rightSide">
        <a href="#features" onClick={handleFeaturesClick}>
          Features
        </a>
        <Link to="/About">About</Link>
        <Link to="/Contact">Contact</Link>
        <Link to="/Login">Log In</Link>
        <Link to="/SignUp">Sign Up</Link>
        <button className="menu-button" onClick={toggleNavbar}>
          <ReorderIcon />
        </button>
      </div>
    </div>
  );
}

export default Navbar;
