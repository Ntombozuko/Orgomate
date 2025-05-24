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

const TYPE_COLORS = {
  Task: "#007bff",
  Bug: "#dc3545",
  Feature: "#28a745",
  Story: "#6610f2",
  Issue: "#fd7e14",
  "Change Request": "#ffc107",
};

function Board() {
  const [columns, setColumns] = useState([
    "To Do",
    "In Progress",
    "Review",
    "Done",
  ]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editTaskId, setEditTaskId] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [newTask, setNewTask] = useState({
    title: "",
    type: "Task",
    description: "",
    assignedTo: "",
    dueDate: "",
    priority: "Medium",
  });
  const [newComment, setNewComment] = useState("");

  const addColumn = () => {
    const newColumn = prompt("Enter column name:");
    if (newColumn) setColumns([...columns, newColumn]);
  };

  const editColumn = (index) => {
    const newName = prompt("Enter new column name:", columns[index]);
    if (newName) {
      const updated = [...columns];
      updated[index] = newName;
      setColumns(updated);
    }
  };

  const deleteColumn = (index) => {
    if (window.confirm("Are you sure you want to delete this column?")) {
      const colName = columns[index];
      setTasks(tasks.filter((t) => t.status !== colName));
      setColumns(columns.filter((_, i) => i !== index));
    }
  };

  const onDragEnd = (result) => {
    const { source, destination } = result;
    if (!destination) return;

    // If the task is dropped in the same position, do nothing
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return;
    }

    const updatedTasks = Array.from(tasks);
    const [movedTask] = updatedTasks.splice(
      tasks.findIndex(
        (task) =>
          task.status === source.droppableId &&
          tasks.filter((t) => t.status === source.droppableId).indexOf(task) ===
            source.index
      ),
      1
    );

    movedTask.status = destination.droppableId;

    // Insert task at the new position
    const filteredTasks = updatedTasks.filter(
      (t) => t.status !== destination.droppableId
    );
    const destTasks = updatedTasks.filter(
      (t) => t.status === destination.droppableId
    );
    destTasks.splice(destination.index, 0, movedTask);

    setTasks([...filteredTasks, ...destTasks]);
  };

  const openEditModal = (task) => {
    setSelectedTask(task);
    setEditTaskId(task.id);
    setShowEditModal(true);
  };

  const handleSaveTask = () => {
    if (
      !newTask.title ||
      !newTask.type ||
      !newTask.dueDate ||
      !newTask.priority
    ) {
      alert("Please fill in all required fields.");
      return;
    }
    const taskToAdd = {
      ...newTask,
      id: Date.now().toString(),
      status: columns[0],
      comments: [],
    };
    setTasks([...tasks, taskToAdd]);
    setNewTask({
      title: "",
      type: "Task",
      description: "",
      assignedTo: "",
      dueDate: "",
      priority: "Medium",
    });
    setShowCreateModal(false);
  };

  const handleUpdateTask = () => {
    setTasks((prev) =>
      prev.map((task) => (task.id === editTaskId ? { ...selectedTask } : task))
    );
    setShowEditModal(false);
    setSelectedTask(null);
    setEditTaskId(null);
  };

  const handleAddComment = () => {
    if (!newComment.trim()) return;
    const timestamp = new Date().toLocaleString();
    const comment = { text: newComment, timestamp };
    setSelectedTask((prev) => ({
      ...prev,
      comments: [...(prev.comments || []), comment],
    }));
    setNewComment("");
  };

  const handleDeleteTask = (id) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      setTasks(tasks.filter((task) => task.id !== id));
      setShowEditModal(false);
    }
  };

  return (
    <div className="content">
      <Container fluid>
        <h2 className="board-title">Task Management</h2>
        <div className="topbar-container">
          <input
            type="text"
            className="search-input"
            placeholder="Search task..."
          />
          <button
            className="create-btn"
            onClick={() => setShowCreateModal(true)}
          >
            Create Item
          </button>
        </div>

        <DragDropContext onDragEnd={onDragEnd}>
          <Row className="board-container g-1">
            {columns.map((col, ci) => (
              <Col key={ci} className="column">
                <Card className="column-card">
                  <Card.Body>
                    <div className="column-header">
                      <span className="column-title">{col}</span>
                      <Dropdown className="column-options">
                        <Dropdown.Toggle variant="light">⋮</Dropdown.Toggle>
                        <Dropdown.Menu>
                          <Dropdown.Item onClick={() => editColumn(ci)}>
                            Edit
                          </Dropdown.Item>
                          <Dropdown.Item onClick={() => deleteColumn(ci)}>
                            Delete
                          </Dropdown.Item>
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
                            .filter((t) => t.status === col)
                            .map((task, ti) => (
                              <Draggable
                                key={task.id}
                                draggableId={task.id}
                                index={ti}
                              >
                                {(prov) => (
                                  <Card
                                    ref={prov.innerRef}
                                    {...prov.draggableProps}
                                    {...prov.dragHandleProps}
                                    className="task-card mt-2"
                                    style={{
                                      borderLeft: `4px solid ${
                                        TYPE_COLORS[task.type] || "#007bff"
                                      }`,
                                    }}
                                    onClick={() => openEditModal(task)}
                                  >
                                    <Card.Body>
                                      <strong>{task.title}</strong>
                                      <div className="small text-muted">
                                        {task.priority} • {task.type}
                                      </div>
                                      <div className="small text-muted">
                                        Due: {task.dueDate || "N/A"} •{" "}
                                        {task.assignedTo || "Unassigned"}
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
              <Button
                variant="primary"
                onClick={addColumn}
                className="add-column-btn"
              >
                +
              </Button>
            </Col>
          </Row>
        </DragDropContext>
      </Container>

      {/* Create Task Modal */}
      <Modal
        show={showCreateModal}
        onHide={() => setShowCreateModal(false)}
        centered
      >
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
                onChange={(e) =>
                  setNewTask({ ...newTask, title: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Item Type</Form.Label>
              <Form.Select
                value={newTask.type}
                onChange={(e) =>
                  setNewTask({ ...newTask, type: e.target.value })
                }
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
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={newTask.description}
                onChange={(e) =>
                  setNewTask({ ...newTask, description: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Assigned To</Form.Label>
              <Form.Control
                type="text"
                value={newTask.assignedTo}
                onChange={(e) =>
                  setNewTask({ ...newTask, assignedTo: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Due Date</Form.Label>
              <Form.Control
                type="date"
                value={newTask.dueDate}
                onChange={(e) =>
                  setNewTask({ ...newTask, dueDate: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Priority</Form.Label>
              <Form.Select
                value={newTask.priority}
                onChange={(e) =>
                  setNewTask({ ...newTask, priority: e.target.value })
                }
              >
                <option>Low</option>
                <option>Medium</option>
                <option>High</option>
              </Form.Select>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowCreateModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSaveTask}>
            Add Item
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Edit Task Modal */}
      <Modal
        show={showEditModal}
        onHide={() => setShowEditModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Edit Task</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedTask && (
            <>
              <Form.Group className="mb-3">
                <Form.Label>Status</Form.Label>
                <Form.Select
                  value={selectedTask.status}
                  onChange={(e) =>
                    setSelectedTask({ ...selectedTask, status: e.target.value })
                  }
                >
                  {columns.map((col) => (
                    <option key={col}>{col}</option>
                  ))}
                </Form.Select>
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Description</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={selectedTask.description}
                  onChange={(e) =>
                    setSelectedTask({
                      ...selectedTask,
                      description: e.target.value,
                    })
                  }
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Add Comment</Form.Label>
                <Form.Control
                  type="text"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                />
                <Button variant="link" onClick={handleAddComment}>
                  Add
                </Button>
              </Form.Group>
              <div>
                <strong>Comments:</strong>
                {selectedTask.comments &&
                  selectedTask.comments.map((c, i) => (
                    <div key={i} className="border-bottom small p-1">
                      {c.text} <br />{" "}
                      <em className="text-muted">{c.timestamp}</em>
                    </div>
                  ))}
              </div>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={() => handleDeleteTask(editTaskId)}>
            Delete
          </Button>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleUpdateTask}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default Board;
