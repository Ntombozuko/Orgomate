import React from "react";
import "../styles/About.css";
import { Link } from "react-router-dom";

function About() {
  return (
    <div className="about-content">
      <h1 className="title">About Orgomate</h1>
      <p>
        At Orgomate, we believe that great teamwork starts with smart
        organization. The name <b>Orgomate</b> comes from <b>"Organize"</b> and{" "}
        <b>"Teammate"</b>, reflecting our commitment to helping teams stay
        structured, efficient, and connected.
      </p>
      <p>
        Our mission is to empower teams of all sizes with an intuitive,
        flexible, and powerful project management solution. Whether you're
        managing complex projects, tracking tasks, or enhancing team
        collaboration, Orgomate provides the tools you need to stay productive
        and focused.
      </p>
      <br />
      <h2 className="subtitle">Why Choose Orgomate?</h2>
      <ul className="features-list">
        <li>
          <b>Seamless Collaboration</b> - Connect with teammates effortlessly
          and manage projects in real-time.{" "}
        </li>
        <li>
          <b>Task Management</b> - Organize, assign, and track tasks with ease.{" "}
        </li>
        <li>
          <b>Productivity Boost</b> - Keep your team focused and aligned with
          shared goals.{" "}
        </li>
        <li>
          <b>User-Friendly Interface</b> - Simple, clean, and easy to navigate
          for maximum efficiency.
        </li>
      </ul>
      <p>
        Our goal is to simplify project management so you can focus on what
        truly matters—delivering results.
      </p>
      <p>
        Join thousands of teams using Orgomate to streamline their workflow.
        <b>Let’s build success together!</b>
      </p>

      <ul>
        <li>
          {" "}
          <Link to="/Projects">Projects</Link>{" "}
        </li>
        <li> <Link to="/Board">Board</Link></li>
      </ul>
    </div>
  );
}

export default About;
