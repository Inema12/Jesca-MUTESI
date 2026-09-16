const pool = require("../config/db");

// POST /api/enrollments   body: { course_id }
// Uses a MySQL transaction: either everything succeeds, or nothing is saved.
async function enrollCourse(req, res) {
  const connection = await pool.getConnection();

  try {
    const userId = req.user.id;
    const { course_id } = req.body;

    if (!course_id) {
      connection.release();
      return res.status(400).json({ message: "course_id is required" });
    }

    await connection.beginTransaction();

    // 1. Make sure the course actually exists
    const [courses] = await connection.query("SELECT id FROM courses WHERE id = ?", [course_id]);
    if (courses.length === 0) {
      await connection.rollback();
      connection.release();
      return res.status(404).json({ message: "Course not found" });
    }

    // 2. Try to insert the enrollment.
    // The "unique_enrollment" constraint on (user_id, course_id) is what
    // actually stops duplicate enrollments at the database level.
    try {
      await connection.query(
        "INSERT INTO enrollments (user_id, course_id) VALUES (?, ?)",
        [userId, course_id]
      );
    } catch (insertErr) {
      // MySQL error code for a duplicate unique key
      if (insertErr.code === "ER_DUP_ENTRY") {
        await connection.rollback();
        connection.release();
        return res.status(409).json({ message: "You are already enrolled in this course" });
      }
      throw insertErr;
    }

    // If we reach here, everything worked - save the changes permanently
    await connection.commit();
    connection.release();

    return res.status(201).json({ message: "Enrolled successfully" });
  } catch (err) {
    await connection.rollback();
    connection.release();
    console.error(err);
    return res.status(500).json({ message: "Failed to enroll in course" });
  }
}

// GET /api/enrollments/my-courses
// Joins enrollments with courses so we return full course details,
// not just course ids.
async function getMyCourses(req, res) {
  try {
    const userId = req.user.id;

    const [rows] = await pool.query(
      `SELECT courses.id, courses.title, courses.description, courses.category,
              courses.price, enrollments.enrolled_at
       FROM enrollments
       JOIN courses ON enrollments.course_id = courses.id
       WHERE enrollments.user_id = ?
       ORDER BY enrollments.enrolled_at DESC`,
      [userId]
    );

    return res.status(200).json({ courses: rows });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Failed to fetch your courses" });
  }
}

// DELETE /api/enrollments/:courseId
// Lets a student drop a course they are enrolled in.
async function dropCourse(req, res) {
  try {
    const userId = req.user.id;
    const { courseId } = req.params;

    const [result] = await pool.query(
      "DELETE FROM enrollments WHERE user_id = ? AND course_id = ?",
      [userId, courseId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "You are not enrolled in this course" });
    }

    return res.status(200).json({ message: "Course dropped successfully" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Failed to drop course" });
  }
}

module.exports = { enrollCourse, getMyCourses, dropCourse };
