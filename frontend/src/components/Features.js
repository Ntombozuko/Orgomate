import React from "react";
import Card from "react-bootstrap/Card";
import "../styles/Features.css";
import AssignmentIcon from '@mui/icons-material/Assignment';
import AssessmentIcon from '@mui/icons-material/Assessment';
import GroupIcon from '@mui/icons-material/Group';

function Features() {
  return (
    <div className="features-container">
      <h1 className="features-heading">Key Features</h1>
      
      <div className="feature-card">
        <Card>
          <Card.Body>
            <AssignmentIcon className="feature-icon"/>
            <Card.Title>Task Management</Card.Title>
            <Card.Text>
              Create, assign, and track tasks with ease. Set priorities, deadlines, and dependencies.
            </Card.Text>
          </Card.Body>
        </Card>
      </div>

      <div className="feature-card">
        <Card>
          <Card.Body>
            <AssessmentIcon className="feature-icon" />
            <Card.Title>Visual Dashboard</Card.Title>
            <Card.Text>
              Get a comprehensive view of your project's progress with customizable dashboards.
            </Card.Text>
          </Card.Body>
        </Card>
      </div>

      <div className="feature-card">
        <Card>
          <Card.Body>
            <GroupIcon className="feature-icon" />
            <Card.Title>Team Collaboration</Card.Title>
            <Card.Text>
              Foster seamless communication with real-time updates and integrated messaging.
            </Card.Text>
          </Card.Body>
        </Card>
      </div>
    </div>
  );
}

export default Features;
