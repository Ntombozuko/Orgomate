import React, { useState } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Dropdown from "react-bootstrap/Dropdown";
import "../styles/Board.css";

function Board() {
    const [columns, setColumns] = useState(["To Do", "In Progress", "Review", "Done"]);

    const addColumn = () => {
        const newColumn = prompt("Enter column name:");
        if (newColumn) {
            setColumns([...columns, newColumn]);
        }
    };

    const editColumn = (index) => {
        const newName = prompt("Enter new column name:", columns[index]);
        if (newName) {
            const updatedColumns = [...columns];
            updatedColumns[index] = newName;
            setColumns(updatedColumns);
        }
    };

    const deleteColumn = (index) => {
        if (window.confirm("Are you sure you want to delete this column?")) {
            setColumns(columns.filter((_, colIndex) => colIndex !== index));
        }
    };

    return (
        <div className="content"> 
          <Container fluid>
            <h2 className="board-title">Task Management</h2>
            <Row className="board-container g-1">
                {columns.map((col, index) => (
                    <Col key={index} className="column">
                        <Card className="column-card">
                            <Card.Body>
                                <div className="column-header">
                                    <span className="column-title">{col}</span>
                                    <Dropdown className="column-options">
                                        <Dropdown.Toggle id={`dropdown-${index}`} variant="light">
                                            ⋮
                                        </Dropdown.Toggle>
                                        <Dropdown.Menu>
                                            <Dropdown.Item onClick={() => editColumn(index)}>Edit</Dropdown.Item>
                                            <Dropdown.Item onClick={() => deleteColumn(index)}>Delete</Dropdown.Item>
                                        </Dropdown.Menu>
                                    </Dropdown>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
                <Col className="column">
                    <Button variant="primary" onClick={addColumn} className="add-column-btn">+</Button>
                </Col>
            </Row>
          </Container>
        </div>
    );
}

export default Board;
