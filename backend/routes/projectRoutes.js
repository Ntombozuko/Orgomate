const express = require("express");
const pool = require("../db");
const authenticateToken = require("../authMiddleware");

const router = express.Router();

// GET all projects for a user with owner's full name and formatted date
router.get("/", authenticateToken, async (req, res) => {
  try {
    console.log("Authenticated User ID:", req.user.id);

    const result = await pool.query(
      `SELECT 
        p.id, 
        p.name, 
        p.project_key, 
        p.created_at, 
        u.first_name, 
        u.last_name 
      FROM projects p
      JOIN users u ON p.owner_id = u.id
      WHERE p.owner_id = $1`,
      [req.user.id]
    );

    console.log("Query Result:", result.rows); // Verify the fetched data

    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching projects:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// CREATE a new project
router.post("/", authenticateToken, async (req, res) => {
  try {
    console.log("Received request body:", req.body);
    console.log("Authenticated user ID:", req.user.id);

    const { name, project_key } = req.body;

    if (!name || !project_key) {
      console.error("Missing required fields:", { name, project_key });
      return res
        .status(400)
        .json({ error: "Project name and key are required" });
    }

    const newProject = await pool.query(
      `INSERT INTO projects (name, project_key, owner_id) 
       VALUES ($1, $2, $3) RETURNING *`,
      [name, project_key, req.user.id]
    );

    res.status(201).json(newProject.rows[0]);
  } catch (err) {
    if (err.code === "23505") {
      return res.status(400).json({ error: "Project key already exists" });
    }

    console.error("Error creating project:", err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
