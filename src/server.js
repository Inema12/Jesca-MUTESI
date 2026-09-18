const express = require("express");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/authRoutes");
const courseRoutes = require("./routes/courseRoutes");
const enrollmentRoutes = require("./routes/enrollmentRoutes");
const errorHandler = require("./middleware/errorHandler");

const app = express();
require('dotenv').config();


// Lets us read JSON request bodies (req.body)
app.use(express.json());
app.use(cors());

// A simple health check route - useful to confirm the server is running
app.get("/", (req, res) => {
  res.status(200).json({ message: "CodeBridge API is running" });
});

// Route groups
app.use("/api/auth", authRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/enrollments", enrollmentRoutes);

// Catch-all for unknown routes
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Centralized error handler - must be registered last
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`CodeBridge API running on http://localhost:${PORT}`);
});
