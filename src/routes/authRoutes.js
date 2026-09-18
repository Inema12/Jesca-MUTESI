const express = require("express");
const router = express.Router();
const { 
  getCourses, 
  getCourseById, 
  createCourse, 
  updateCourse, 
  deleteCourse 
} = require("../controllers/courseController"); //

const { register, login, getProfile } = require("../controllers/authController");
const verifyToken = require("../middleware/auth");

router.post("/register", register);
router.post("/login", login);

// Protected route - needs a valid token
router.get("/profile", verifyToken, getProfile);
router.put("/:id", verifyToken, updateCourse);
router.delete("/:id", verifyToken, deleteCourse);

module.exports = router;
