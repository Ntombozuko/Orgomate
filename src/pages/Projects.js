import React, { useEffect, useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

function Projects() {
  const [projects, setProjects] = useState([]);
  const [show, setShow] = useState(false);
  const [name, setName] = useState("");
  const [projectKey, setProjectKey] = useState("");
  const [error, setError] = useState("");

  const handleClose = () => {
    setShow(false);
    setName("");
    setProjectKey("");
    setError("");
  };

  useEffect(() => {
    const fetchProjects = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token found, authentication issue");
        return;
      }

      try {
        const response = await axios.get("http://localhost:5000/api/projects", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.data.length === 0) {
          console.log("No projects found for this user.");
        } else {
          setProjects(response.data);
        }
      } catch (err) {
        console.error(
          "Error fetching projects:",
          err.response?.data || err.message
        );
      }
    };

    fetchProjects();
  }, []);

  // Handle Save Button Click
  const handleSave = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No token found, authentication issue");
      return;
    }

    const projectData = {
      name: "New Project", // Replace with actual form data
      project_key: "NP123",
    };

    console.log("Sending project data:", projectData);

    try {
      const response = await axios.post(
        "http://localhost:5000/api/projects", // Ensure this matches backend URL
        projectData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Project created:", response.data);
    } catch (err) {
      console.error("Error creating project", err);
      if (err.response) console.error("Server Response:", err.response.data);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center min-vh-100 bg-light">
      <div className="card shadow-lg p-4 w-50">
        <h3 className="text-primary text-center">Projects</h3>
        <p className="text-muted text-center">
          Manage and create your projects easily.
        </p>

        {projects.length === 0 ? (
          // Show "Create a Project" when there are no projects
          <div className="text-center mt-3">
            <button className="btn btn-primary" onClick={() => setShow(true)}>
              + Create a Project
            </button>
          </div>
        ) : (
          // Show list of projects when there are projects
          <ul className="list-group">
            {projects.map((project) => (
              <li key={project.id} className="list-group-item">
                {project.name}
              </li>
            ))}
          </ul>
        )}
      </div>
      <Modal show={show} onHide={handleClose} dialogClassName="modal-90w">
        <Modal.Header closeButton>
          <Modal.Title id="example-custom-modal-styling-title">
            Create New Project
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {error && <p className="text-danger">{error}</p>}
          <Form>
            <Form.Group>
              <Form.Label>Project Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Project 1"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Project Key</Form.Label>
              <Form.Control
                type="text"
                placeholder="PRT"
                value={projectKey}
                onChange={(e) => setProjectKey(e.target.value)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <div style={{ display: "flex", gap: "8px" }}>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
            <Button variant="primary" onClick={handleSave}>
              Save
            </Button>
          </div>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default Projects;
