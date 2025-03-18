import React from "react";
import { Link } from "react-router-dom";
import "../styles/Home.css";

function Home() {
  return (
    <div className="home-container">
      <h1>Effortless Project Management for Every Team</h1>
      <p>
        The versatile project management solution designed to help teams
        collaborate, organize and deliver outstanding results.
      </p>
      <Link to="/SignUp">
        <button className="home-button">Get Started Free</button>
      </Link>
    </div>
  );
}
export default Home;
