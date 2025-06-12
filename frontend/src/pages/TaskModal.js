import React from "react";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

const TaskModal = ({
  mode,
  show,
  onClose,
  onSave,
  onDelete,
  task,
  setTask,
  comments = [],
  newComment,
  setNewComment,
  onAddComment,
  statusOptions = [],
}) => {
  if (!task) return null;

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (newComment.trim()) {
        onAddComment();
      }
    }
  };

  return (
    <Modal show={show} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>
          {mode === "edit" ? "Edit Task" : "Create Task"}
        </Modal.Title>
      </Modal.Header>

      {mode === "edit" && task?.createdDate && (
        <div className="px-4 pt-2 text-muted" style={{ fontSize: "0.9rem" }}>
          Created on: {task.createdDate}
        </div>
      )}

      <Modal.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Task Title</Form.Label>
            <Form.Control
              type="text"
              value={task.title}
              readOnly={mode === "edit"}
              onChange={(e) => setTask({ ...task, title: e.target.value })}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Item Type</Form.Label>
            <Form.Select
              value={task.type}
              disabled={mode === "edit"}
              onChange={(e) => setTask({ ...task, type: e.target.value })}
            >
              {[
                "Task",
                "Bug",
                "Feature",
                "Story",
                "Issue",
                "Change Request",
              ].map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={6}
              value={task.description}
              readOnly={mode === "edit"}
              onChange={(e) =>
                setTask({ ...task, description: e.target.value })
              }
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Assigned To</Form.Label>
            <Form.Control
              type="text"
              value={task.assignedTo}
              onChange={(e) => setTask({ ...task, assignedTo: e.target.value })}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Due Date</Form.Label>
            <Form.Control
              type="date"
              value={task.dueDate}
              onChange={(e) => setTask({ ...task, dueDate: e.target.value })}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Priority</Form.Label>
            <Form.Select
              value={task.priority}
              onChange={(e) => setTask({ ...task, priority: e.target.value })}
            >
              {["Low", "Medium", "High"].map((priority) => (
                <option key={priority} value={priority}>
                  {priority}
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          {/* Status only editable in edit mode */}
          {mode === "edit" && (
            <Form.Group className="mb-3">
              <Form.Label>Status</Form.Label>
              <Form.Select
                value={task.status}
                onChange={(e) => setTask({ ...task, status: e.target.value })}
              >
                {statusOptions.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          )}

          {/* Comments only in edit mode */}
          {mode === "edit" && (
            <>
              <hr />
              <Form.Group className="mb-3">
                <Form.Label>Add Comment</Form.Label>
                <Form.Control
                  type="text"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                />
                <Button variant="link" onClick={onAddComment}>
                  Add
                </Button>
              </Form.Group>

              {task.comments && task.comments.length > 0 && (
                <div>
                  <strong>Comments:</strong>
                  {task.comments.map((c, i) => (
                    <div key={i} className="border-bottom small p-1">
                      {c.text}
                      <br />
                      <em className="text-muted">{c.timestamp}</em>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </Form>
      </Modal.Body>

      <Modal.Footer>
        {mode === "edit" && (
          <Button variant="danger" onClick={() => onDelete(task.id)}>
            Delete
          </Button>
        )}
        <Button variant="secondary" onClick={onClose}>
          Cancel
        </Button>
        <Button variant="primary" onClick={onSave}>
          Save
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default TaskModal;
