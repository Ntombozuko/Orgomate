import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import "bootstrap/dist/css/bootstrap.min.css";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import "../styles/LogIn.css";
import { Link } from "react-router-dom";
import axios from "axios";

function LogIn({ setUser }) {
  // State for form data
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  // State for messages
  const [message, setMessage] = useState("");

  // React Router navigation hook
  const navigate = useNavigate();

  // Handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(""); // Reset previous messages

    try {
      // Send login request
      const response = await axios.post("http://localhost:5000/auth/login", {
        email: formData.email,
        password: formData.password,
      });

      const { token, user } = response.data;

      // Store token securely (consider sessionStorage for better security)
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      // Update user state in App.js using setUser
      setUser(user);
      setMessage("Login successful! Redirecting...");

      // Redirect to dashboard or home page
      setTimeout(() => {
        navigate("/Projects");
      }, 1000);
    } catch (error) {
      console.error("Login error:", error);
      setMessage(
        error.response?.data?.message || "Invalid email or password. Try again."
      );
    }
  };

  return (
    <Container className="main-content">
      <Row className="justify-content-center">
        <Col md={6} className="left-side border p-3">
          <h3>Welcome Back!</h3>
          <p>
            Not a member yet?{" "}
            <b>
              <Link to="/SignUp">Register now</Link>
            </b>
          </p>
        </Col>
        <Col md={6} className="right-side border p-3">
          <h4>Please login to your account</h4>

          {message && <p className="alert alert-info">{message}</p>}

          <Form className="form-container" onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Control
                type="email"
                placeholder="Email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Control
                type="password"
                placeholder="Password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <div className="d-grid gap-2">
              <Button className="btn btn-secondary btn-lg" type="submit">
                Log In
              </Button>
            </div>
            <p>Forgot your password?</p>
          </Form>
        </Col>
      </Row>
    </Container>
  );
}

export default LogIn;
