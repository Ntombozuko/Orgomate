import React from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import "bootstrap/dist/css/bootstrap.min.css";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import "../styles/SignUp.css";
import { Link } from "react-router-dom";

function SignUp() {
  return (
    <Container className="main-content">
      <Row className="justify-content-center">
        <Col md={6} className="left-side border p-3">
          <h3>Welcome!</h3>
          <p>
            Are you a member?{" "}
            <b>
              <Link to="/LogIn">Log in now</Link>
            </b>
          </p>
        </Col>

        <Col md={6} className="right-side border p-3">
          <h4>Register with your email</h4>

          <Form className="form-container">
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3" controlId="formFirstName">
                  <Form.Control type="text" placeholder="First Name" />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3" controlId="formLastName">
                  <Form.Control type="text" placeholder="Last Name" />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Control type="email" placeholder="Email" />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Control type="password" placeholder="Password" />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formConfirmPassword">
              <Form.Control type="password" placeholder="Repeat password" />
            </Form.Group>

            <div className="d-grid gap-2">
              <Button className="btn btn-secondary btn-lg" type="submit">
                Sign Up
              </Button>
            </div>
          </Form>
        </Col>
      </Row>
    </Container>
  );
}

export default SignUp;
