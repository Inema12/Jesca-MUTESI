const express = require("express");
const router = express.Router();

const { enrollCourse, getMyCourses, dropCourse } = require("../controllers/enrollmentController");
const verifyToken = require("../middleware/auth");

// All enrollment routes require a logged-in user
router.post("/", verifyToken, enrollCourse);
router.get("/my-courses", verifyToken, getMyCourses);
router.delete("/:courseId", verifyToken, dropCourse);

module.exports = router;
