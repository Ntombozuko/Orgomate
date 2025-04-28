import React, { useState } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Dropdown from "react-bootstrap/Dropdown";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import "../styles/Board.css";

function Board() {
  const [columns, setColumns] = useState(["To Do", "In Progress", "Review", "Done"]);
  const [showModal, setShowModal] = useState(false);
  const [tasks, setTasks] = useState([]);

  const [newTask, setNewTask] = useState({
    title: "",
    type: "Task",
    description: "",
    assignedTo: "",
    dueDate: "",
    priority: "Medium",
  });

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
      setTasks(tasks.filter(task => task.status !== columns[index]));
    }
  };

  const onDragEnd = (result) => {
    const { source, destination } = result;
    if (!destination) return;
  
    const sourceCol = source.droppableId;
    const destCol = destination.droppableId;
  
    const sourceTasks = tasks.filter(task => task.status === sourceCol);
    const destTasks = tasks.filter(task => task.status === destCol);
  
    const [movedTask] = sourceTasks.splice(source.index, 1);
    movedTask.status = destCol;
  
    const updatedTasks = tasks
      .filter(task => task.status !== sourceCol && task.status !== destCol)
      .concat(sourceTasks, destTasks);
  
    setTasks(updatedTasks);
  };
  

  return (
    <div className="content">
      <Container fluid>
        <h2 className="board-title">Task Management</h2>
        <div className="topbar-container">
          <input type="text" className="search-input" placeholder="Search task..." />
          <button className="create-btn" onClick={() => setShowModal(true)}>Create Item</button>
        </div>

        <DragDropContext onDragEnd={onDragEnd}>
          <Row className="board-container g-1">
            {columns.map((col, colIndex) => (
              <Col key={colIndex} className="column">
                <Card className="column-card">
                  <Card.Body>
                    <div className="column-header">
                      <span className="column-title">{col}</span>
                      <Dropdown className="column-options">
                        <Dropdown.Toggle id={`dropdown-${colIndex}`} variant="light">
                          ⋮
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                          <Dropdown.Item onClick={() => editColumn(colIndex)}>Edit</Dropdown.Item>
                          <Dropdown.Item onClick={() => deleteColumn(colIndex)}>Delete</Dropdown.Item>
                        </Dropdown.Menu>
                      </Dropdown>
                    </div>

                    <Droppable droppableId={col}>
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.droppableProps}
                          className="task-drop-area"
                        >
                          {tasks
                            .filter((task) => task.status === col)
                            .map((task, taskIndex) => (
                              <Draggable key={task.id} draggableId={`${task.id}`} index={taskIndex}>
                                {(provided) => (
                                  <Card
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                    className="task-card mt-2"
                                  >
                                    <Card.Body>
                                      <strong>{task.title}</strong>
                                      <div className="small text-muted">
                                        {task.priority} • {task.type}
                                      </div>
                                      <div className="small text-muted">
                                        Due: {task.dueDate || "N/A"} • {task.assignedTo || "Unassigned"}
                                      </div>
                                    </Card.Body>
                                  </Card>
                                )}
                              </Draggable>
                            ))}
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>
                  </Card.Body>
                </Card>
              </Col>
            ))}
            <Col className="column">
              <Button variant="primary" onClick={addColumn} className="add-column-btn">+</Button>
            </Col>
          </Row>
        </DragDropContext>
      </Container>

      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Create New Task</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Task Title</Form.Label>
              <Form.Control
                type="text"
                value={newTask.title}
                onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Item Type</Form.Label>
              <Form.Select
                value={newTask.type}
                onChange={(e) => setNewTask({ ...newTask, type: e.target.value })}
              >
                <option>Task</option>
                <option>Bug</option>
                <option>Feature</option>
                <option>Story</option>
                <option>Issue</option>
                <option>Change Request</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Assigned To</Form.Label>
              <Form.Control
                type="text"
                value={newTask.assignedTo}
                onChange={(e) => setNewTask({ ...newTask, assignedTo: e.target.value })}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Due Date</Form.Label>
              <Form.Control
                type="date"
                value={newTask.dueDate}
                onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Priority</Form.Label>
              <Form.Select
                value={newTask.priority}
                onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
              >
                <option>Low</option>
                <option>Medium</option>
                <option>High</option>
              </Form.Select>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
          <Button
            variant="primary"
            onClick={() => {
              setTasks([
                ...tasks,
                { ...newTask, status: columns[0], id: Date.now().toString() }
              ]);
              setNewTask({
                title: "",
                type: "Task",
                description: "",
                assignedTo: "",
                dueDate: "",
                priority: "Medium",
              });
              setShowModal(false);
            }}
          >
            Add Item
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default Board;
