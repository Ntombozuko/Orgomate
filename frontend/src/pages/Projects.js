import React, { useEffect, useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Table from "react-bootstrap/Table";

function Projects() {
  const [projects, setProjects] = useState([]);
  const [show, setShow] = useState(false);
  const [name, setName] = useState("");
  const [projectKey, setProjectKey] = useState("");
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  const handleClose = () => {
    setShow(false);
    setName("");
    setProjectKey("");
    setError("");
  };

  // Fetch projects from backend
  const fetchProjects = async () => {
    if (!token) {
      console.error("No token found, authentication issue");
      return;
    }

    try {
      const response = await axios.get("http://localhost:5000/api/projects", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProjects(response.data);
    } catch (err) {
      console.error(
        "Error fetching projects:",
        err.response?.data || err.message
      );
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  // Handle Save Button Click
  const handleSave = async () => {
    if (!token) {
      console.error("No token found, authentication issue");
      return;
    }

    if (!name.trim() || !projectKey.trim()) {
      setError("Project Name and Key are required.");
      return;
    }

    const projectData = { name, project_key: projectKey };

    try {
      const response = await axios.post(
        "http://localhost:5000/api/projects",
        projectData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setProjects([...projects, response.data]);
      handleClose();
    } catch (err) {
      console.error("Error creating project", err);
      setError(err.response?.data?.message || "Failed to create project.");
    }
  };

  return (
    <div className="container mt-5">
      <h3 className="text-primary text-center">Projects</h3>
      <p className="text-muted text-center">
        Manage and create your projects easily.
      </p>

      {projects.length === 0 ? (
        <div className="d-flex justify-content-center align-items-center min-vh-100 bg-light">
          <div className="card shadow-lg p-4 w-50">
            <h3 className="text-primary text-center">Projects</h3>
            <p className="text-muted text-center">
              Manage and create your projects easily.
            </p>
            <div className="text-center mt-3">
              <button className="btn btn-primary" onClick={() => setShow(true)}>
                + Create a Project
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div>
          <div className="d-flex align-items-center gap-2 mb-3">
            <input
              type="text"
              className="form-control"
              placeholder="Search projects..."
            />
            <button className="btn btn-primary" onClick={() => setShow(true)}>
              + Create a Project
            </button>
          </div>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Project Name</th>
                <th>Project Key</th>
                <th>Created By</th>
                <th>Creation Date</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((project) => (
                <tr key={project.id}>
                  <td>{project.name}</td>
                  <td>{project.project_key}</td>
                  <td>
                    {project.first_name && project.last_name
                      ? `${project.first_name} ${project.last_name}`
                      : "Unknown"}
                  </td>

                  <td>{new Date(project.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      )}

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Create New Project</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {error && <p className="text-danger">{error}</p>}
          <Form>
            <Form.Group>
              <Form.Label>Project Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter project name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Project Key</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter project key"
                value={projectKey}
                onChange={(e) => setProjectKey(e.target.value)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer className="d-flex justify-content-end gap-2">
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSave}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default Projects;
