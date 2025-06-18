import React, { useState, useCallback, useRef, useEffect } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Dropdown from "react-bootstrap/Dropdown";
import {
  DndContext,
  closestCenter,
  useSensor,
  useSensors,
  PointerSensor,
  DragOverlay,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useDroppable, useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
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

function DroppableColumn({ id, children }) {
  const { setNodeRef } = useDroppable({ id });
  return (
    <div ref={setNodeRef} className="task-drop-area">
      {children}
    </div>
  );
}

function DraggableTask({ task, children, onClick }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useDraggable({
    id: task.id,
    data: { task },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style}>
      <div
        {...attributes}
        {...listeners}
        style={{ cursor: "grab", padding: "4px", display: "inline-block" }}
      >
        ... {/* Drag handle */}
      </div>
      <div onClick={() => onClick?.(task)} style={{ cursor: "pointer" }}>
        {children}
      </div>
    </div>
  );
}

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

  const [activeTask, setActiveTask] = useState(null);
  const sensors = useSensors(useSensor(PointerSensor));

  const [modalMode, setModalMode] = useState(null);
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

  const [newComment, setNewComment] = useState("");

  const findContainer = (taskId) => {
    return Object.keys(tasksByColumn).find((col) =>
      tasksByColumn[col].some((t) => t.id === taskId)
    );
  };

  const onDragStart = (event) => {
    const { active } = event;
    const containerId = findContainer(active.id);
    const task = tasksByColumn[containerId].find((t) => t.id === active.id);
    setActiveTask(task);
  };

  const onDragEnd = (event) => {
    const { active, over } = event;
    setActiveTask(null);
    if (!over) return;

    const sourceColumn = findContainer(active.id);
    const destColumn = over.id;

    if (sourceColumn && destColumn) {
      const sourceItems = tasksByColumn[sourceColumn];
      const destinationItems = [...tasksByColumn[destColumn]];

      const draggedTask = sourceItems.find((t) => t.id === active.id);
      if (!draggedTask) return;

      if (sourceColumn === destColumn) return;

      const updatedSource = sourceItems.filter((t) => t.id !== active.id);
      draggedTask.status = destColumn;
      destinationItems.push(draggedTask);

      setTasksByColumn((prev) => ({
        ...prev,
        [sourceColumn]: updatedSource,
        [destColumn]: destinationItems,
      }));
    }
  };

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

  const openEditModal = (task) => {
    console.log("Clicked task:", task);
    setSelectedTask({ ...task });
    setNewComment("");
    setModalMode("edit");
  };

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
    };

    setTasksByColumn((prev) => ({
      ...prev,
      [newTask.status]: [...prev[newTask.status], taskToAdd],
    }));

    closeModal();
  };

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

    const oldStatus = findContainer(selectedTask.id);
    const newStatus = selectedTask.status;

    setTasksByColumn((prev) => {
      const updated = { ...prev };

      if (oldStatus !== newStatus) {
        updated[oldStatus] = updated[oldStatus].filter(
          (task) => task.id !== selectedTask.id
        );
        updated[newStatus] = [...updated[newStatus], selectedTask];
      } else {
        updated[newStatus] = updated[newStatus].map((task) =>
          task.id === selectedTask.id ? selectedTask : task
        );
      }

      return updated;
    });

    closeModal();
  };

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
    } else {
      setNewTask(updatedTask);
    }

    setNewComment("");
  };

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

        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={onDragStart}
          onDragEnd={onDragEnd}
        >
          <Row className="board-container g-1">
            <SortableContext
              items={columns}
              strategy={verticalListSortingStrategy}
            >
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

                      <DroppableColumn id={col}>
                        {(tasksByColumn[col] || []).map((task) => (
                          <DraggableTask
                            key={task.id}
                            task={task}
                            onClick={() => openEditModal(task)}
                          >
                            <Card
                              className="task-card mt-2"
                              style={{
                                borderLeft: `4px solid ${
                                  TYPE_COLORS[task.type] || "#007bff"
                                }`,
                              }}
                            >
                              <Card.Body style={{ fontSize: "0.85rem" }}>
                                <strong className="d-block mb-1">
                                  {task.title}
                                </strong>
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
                                <div className="text-muted mb-1">
                                  <span>{task.type}</span>
                                </div>
                                <div className="d-flex justify-content-between text-muted">
                                  <small>Due: {task.dueDate || "N/A"}</small>
                                  <small>
                                    👤 {task.assignedTo || "Unassigned"}
                                  </small>
                                </div>
                              </Card.Body>
                            </Card>
                          </DraggableTask>
                        ))}
                      </DroppableColumn>
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
            </SortableContext>
          </Row>
          <DragOverlay>
            {activeTask ? (
              <Card
                className="task-card"
                style={{
                  borderLeft: `4px solid ${TYPE_COLORS[activeTask.type]}`,
                }}
              >
                <Card.Body>{activeTask.title}</Card.Body>
              </Card>
            ) : null}
          </DragOverlay>
        </DndContext>
      </Container>

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
