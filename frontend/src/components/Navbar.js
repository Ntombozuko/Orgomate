import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import ReorderIcon from "@mui/icons-material/Reorder";
import Icon from "../assets/Icon.png";
import "../styles/Navbar.css";

function Navbar({ scrollToFeatures }) {
  const [viewLinks, setViewLinks] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const storedUser = localStorage.getItem("user");
  const user =
    storedUser && storedUser !== "undefined" ? JSON.parse(storedUser) : null;

  const toggleNavbar = () => {
    setViewLinks(!viewLinks);
  };

  const handleFeaturesClick = (e) => {
    e.preventDefault();
    setViewLinks(false);
    if (location.pathname !== "/") {
      navigate("/");
      setTimeout(scrollToFeatures, 100);
    } else {
      scrollToFeatures();
    }
  };

  const handleLogoClick = (e) => {
    e.preventDefault();
    setViewLinks(false);
    if (location.pathname !== "/") {
      navigate("/");
      setTimeout(() => window.scrollTo({ top: 0, behavior: "smooth" }), 100);
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    window.location.reload();
  };

  return (
    <>
      <div className="navbar">
        {!user ? (
          <>
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
          </>
        ) : (
          <div className="user-nav">
            <span>Welcome, {user.first_name}</span>
            <button onClick={handleLogout}>Logout</button>
          </div>
        )}
      </div>

      {/* Mobile menu */}
      {!user && (
        <div className={`HiddenLinks ${viewLinks ? "show" : ""}`}>
          <a href="#features" onClick={handleFeaturesClick}>
            Features
          </a>
          <Link to="/About" onClick={() => setViewLinks(false)}>
            About
          </Link>
          <Link to="/Contact" onClick={() => setViewLinks(false)}>
            Contact
          </Link>
          <Link to="/Login" onClick={() => setViewLinks(false)}>
            Log In
          </Link>
          <Link to="/SignUp" onClick={() => setViewLinks(false)}>
            Sign Up
          </Link>
        </div>
      )}
    </>
  );
}

export default Navbar;
