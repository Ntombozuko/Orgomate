import React from "react";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import GitHubIcon from "@mui/icons-material/GitHub";
import EmailIcon from "@mui/icons-material/Email";
import "../styles/Footer.css";

function Footer() {
  return (
    <div className="footer">
      <div className="socialMedia">
        <LinkedInIcon /> <GitHubIcon /> <EmailIcon />
      </div>
      <p>&copy; 2025 Orgomate. All rights reserved. </p>
    </div>
  );
}
export default Footer;
