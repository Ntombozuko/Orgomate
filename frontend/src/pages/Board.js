import React, { useState, useCallback } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Dropdown from "react-bootstrap/Dropdown";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import TaskModal from "./TaskModal";
import "../styles/Board.css";

const TYPE_COLORS = {
  Task: "#007bff",
  Bug: "#dc3545",
  Feature: "#28a745",
  Story: "#6610f2",
  Issue: "#fd7e14",
  "Change Request": "#ffc107",
};

const PRIORITY_COLORS = {
  High: "danger",
  Medium: "warning",
  Low: "success",
};

const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
};

const move = (source, destination, droppableSource, droppableDestination) => {
  const sourceClone = Array.from(source);
  const destClone = Array.from(destination);
  const [removed] = sourceClone.splice(droppableSource.index, 1);

  destClone.splice(droppableDestination.index, 0, removed);

  return {
    [droppableSource.droppableId]: sourceClone,
    [droppableDestination.droppableId]: destClone,
  };
};

function Board() {
  const [columns, setColumns] = useState([
    "To Do",
    "In Progress",
    "Review",
    "Done",
  ]);
  const [tasksByColumn, setTasksByColumn] = useState({
    "To Do": [],
    "In Progress": [],
    Review: [],
    Done: [],
  });

  // Modal control
  const [modalMode, setModalMode] = useState(null); // "create" or "edit" or null
  const [selectedTask, setSelectedTask] = useState(null);
  const [newTask, setNewTask] = useState({
    title: "",
    type: "Task",
    description: "",
    assignedTo: "",
    dueDate: "",
    priority: "Medium",
    status: "To Do",
    comments: [],
  });

  const addColumn = () => {
    const newColumn = prompt("Enter column name:");
    if (newColumn && !columns.includes(newColumn)) {
      setColumns([...columns, newColumn]);
      setTasksByColumn((prev) => ({
        ...prev,
        [newColumn]: [],
      }));
    }
  };

  const editColumn = (index) => {
    const oldName = columns[index];
    const newName = prompt("Enter new column name:", oldName);
    if (newName && newName !== oldName && !columns.includes(newName)) {
      const updatedColumns = [...columns];
      updatedColumns[index] = newName;
      setColumns(updatedColumns);

      // Update tasksByColumn with new key
      setTasksByColumn((prev) => {
        const updated = { ...prev };
        updated[newName] = updated[oldName].map((task) => ({
          ...task,
          status: newName,
        }));
        delete updated[oldName];
        return updated;
      });
    }
  };

  const deleteColumn = (index) => {
    if (window.confirm("Are you sure you want to delete this column?")) {
      const colName = columns[index];
      setColumns(columns.filter((_, i) => i !== index));
      setTasksByColumn((prev) => {
        const updated = { ...prev };
        delete updated[colName];
        return updated;
      });
    }
  };

  // Comment input state
  const [newComment, setNewComment] = useState("");

  // Handle drag and drop of tasks
  const onDragEnd = useCallback(
    (result) => {
      const { source, destination } = result;
      if (!destination) return;

      const sourceColumn = source.droppableId;
      const destColumn = destination.droppableId;

      if (sourceColumn === destColumn) {
        const items = reorder(
          tasksByColumn[sourceColumn],
          source.index,
          destination.index
        );
        setTasksByColumn((prev) => ({ ...prev, [sourceColumn]: items }));
      } else {
        const resultMove = move(
          tasksByColumn[sourceColumn],
          tasksByColumn[destColumn],
          source,
          destination
        );
        // Update status of moved task
        if (resultMove[destColumn][destination.index]) {
          resultMove[destColumn][destination.index].status = destColumn;
        }
        setTasksByColumn((prev) => ({ ...prev, ...resultMove }));
      }
    },
    [tasksByColumn]
  );

  // Open modal for creating a new task
  const openCreateModal = () => {
    setNewTask({
      title: "",
      type: "Task",
      description: "",
      assignedTo: "",
      dueDate: "",
      priority: "Medium",
      status: columns[0],
      comments: [],
    });
    setNewComment("");
    setModalMode("create");
  };

  // Open modal for editing a task
  const openEditModal = (task) => {
    setSelectedTask({ ...task }); // clone to avoid mutation
    setNewComment("");
    setModalMode("edit");
  };

  // Close modal and reset modal state
  const closeModal = () => {
    setModalMode(null);
    setSelectedTask(null);
    setNewComment("");
    setNewTask({
      title: "",
      type: "Task",
      description: "",
      assignedTo: "",
      dueDate: "",
      priority: "Medium",
      status: columns[0],
      comments: [],
    });
  };

  // Save a new task (from create modal)
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
      createdDate: new Date().toISOString().split("T")[0],
      comments: [...newTask.comments], // ensure copy
    };

    setTasksByColumn((prev) => ({
      ...prev,
      [newTask.status]: [...prev[newTask.status], taskToAdd],
    }));

    closeModal();
  };

  // Update an existing task (from edit modal)
  const handleUpdateTask = () => {
    if (
      !selectedTask.title ||
      !selectedTask.type ||
      !selectedTask.dueDate ||
      !selectedTask.priority
    ) {
      alert("Please fill in all required fields.");
      return;
    }

    const oldStatus = Object.keys(tasksByColumn).find((col) =>
      tasksByColumn[col].some((task) => task.id === selectedTask.id)
    );
    const newStatus = selectedTask.status;

    setTasksByColumn((prev) => {
      const updated = { ...prev };

      // Remove task from old column if status changed
      if (oldStatus !== newStatus) {
        updated[oldStatus] = updated[oldStatus].filter(
          (task) => task.id !== selectedTask.id
        );
        updated[newStatus] = [...updated[newStatus], selectedTask];
      } else {
        // Update task in the same column
        updated[newStatus] = updated[newStatus].map((task) =>
          task.id === selectedTask.id ? selectedTask : task
        );
      }

      return updated;
    });

    closeModal();
  };

  // Add comment only in edit mode
  const handleAddComment = () => {
    if (!newComment.trim()) return;

    const timestamp = new Date().toLocaleString();
    const comment = { text: newComment.trim(), timestamp };

    const updatedTask =
      modalMode === "edit"
        ? {
            ...selectedTask,
            comments: [...(selectedTask.comments || []), comment],
          }
        : {
            ...newTask,
            comments: [...(newTask.comments || []), comment],
          };

    if (modalMode === "edit") {
      setSelectedTask(updatedTask);

      setTasksByColumn((prev) => {
        const updated = { ...prev };
        updated[updatedTask.status] = updated[updatedTask.status].map((t) =>
          t.id === updatedTask.id ? updatedTask : t
        );
        return updated;
      });
    } else {
      setNewTask(updatedTask);
    }

    setNewComment("");
  };

  // Delete a task
  const handleDeleteTask = (id) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      setTasksByColumn((prev) => {
        const updated = { ...prev };
        Object.keys(updated).forEach((col) => {
          updated[col] = updated[col].filter((task) => task.id !== id);
        });
        return updated;
      });
      closeModal();
    }
  };

  return (
    <div className="content">
      <Container fluid>
        <h2 className="board-title">Task Management</h2>
        <div className="topbar-container">
          <input className="search-input" placeholder="Search task..." />
          <button className="create-btn" onClick={openCreateModal}>
            Create Item
          </button>
        </div>

        <DragDropContext onDragEnd={onDragEnd}>
          <Row className="board-container g-1">
            {columns.map((col, ci) => (
              <Col key={col} className="column">
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
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.droppableProps}
                          className="task-drop-area"
                        >
                          {(tasksByColumn[col] || []).map((task, ti) => (
                            <Draggable
                              key={task.id}
                              draggableId={task.id}
                              index={ti}
                            >
                              {(provided, snapshot) => (
                                <Card
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  className="task-card mt-2"
                                  style={{
                                    borderLeft: `4px solid ${
                                      TYPE_COLORS[task.type] || "#007bff"
                                    }`,
                                    ...provided.draggableProps.style,
                                    opacity: snapshot.isDragging ? 0.8 : 1,
                                  }}
                                  onClick={() =>
                                    !snapshot.isDragging && openEditModal(task)
                                  }
                                >
                                  <Card.Body style={{ fontSize: "0.85rem" }}>
                                    {/* Title */}
                                    <strong className="d-block mb-1">
                                      {task.title}
                                    </strong>

                                    {/* Priority and Created Date */}
                                    <div className="d-flex justify-content-between align-items-center mb-1">
                                      <span
                                        className={`badge bg-${
                                          PRIORITY_COLORS[task.priority]
                                        }`}
                                      >
                                        {task.priority}
                                      </span>
                                      <small className="text-muted">
                                        Created: {task.createdDate || "N/A"}
                                      </small>
                                    </div>

                                    {/* Task Type */}
                                    <div className="text-muted mb-1">
                                      <span>{task.type}</span>
                                    </div>

                                    {/* Due Date and Assigned To */}
                                    <div className="d-flex justify-content-between text-muted">
                                      <small>
                                        Due: {task.dueDate || "N/A"}
                                      </small>
                                      <small>
                                        👤 {task.assignedTo || "Unassigned"}
                                      </small>
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

      {/* Task Modal shared by create & edit */}
      {(modalMode === "create" || modalMode === "edit") && (
        <TaskModal
          mode={modalMode}
          show={true}
          onClose={closeModal}
          onSave={modalMode === "create" ? handleSaveTask : handleUpdateTask}
          onDelete={modalMode === "edit" ? handleDeleteTask : undefined}
          task={modalMode === "create" ? newTask : selectedTask}
          setTask={modalMode === "create" ? setNewTask : setSelectedTask}
          newComment={newComment}
          setNewComment={setNewComment}
          onAddComment={handleAddComment}
          statusOptions={columns}
          priorityOptions={["High", "Medium", "Low"]}
          typeOptions={Object.keys(TYPE_COLORS)}
        />
      )}
    </div>
  );
}

export default Board;
