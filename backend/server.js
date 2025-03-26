require("dotenv").config();

/* console.log("Environment Variables:");
console.log("PORT:", process.env.PORT);
console.log("DB_USER:", process.env.DB_USER);
console.log("DB_HOST:", process.env.DB_HOST);
console.log("DB_NAME:", process.env.DB_NAME);
console.log("DB_PASSWORD:", process.env.DB_PASSWORD);
console.log("DB_PORT:", process.env.DB_PORT);
console.log("JWT_SECRET:", process.env.JWT_SECRET); */

const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

const authRoutes = require("./authRoutes");
app.use("/auth", authRoutes);

const projectRoutes = require("./routes/projectRoutes");
app.use("/api/projects", projectRoutes);

// Simple route for testing API
app.get("/", (req, res) => {
  res.send("API is running...");
});

console.log("JWT Secret:", process.env.JWT_SECRET);

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
