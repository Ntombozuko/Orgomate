import React from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import "bootstrap/dist/css/bootstrap.min.css";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import "../styles/LogIn.css";
import { Link } from "react-router-dom";

function LogIn() {
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

          <Form className="form-container">
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Control type="email" placeholder="Email" />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Control type="password" placeholder="Password" />
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
