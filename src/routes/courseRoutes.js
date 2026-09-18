const express = require("express");
const router = express.Router();

const { 
  getCourses, 
    getCourseById, 
    createCourse, 
    updateCourse, 
    deleteCourse  
} = require("../controllers/courseController");

// Public routes - open data layer
router.get("/", getCourses);
router.get("/:id", getCourseById);

// 🆕 Management routes - mutations
router.post("/", createCourse);       // POST request creates a new course
router.put("/:id", updateCourse);     // PUT request modifies specific ID properties
router.delete("/:id", deleteCourse);  // DELETE request drops a course matching an ID

module.exports = router;
