const pool = require("../config/db");

// GET /api/courses
async function getCourses(req, res) {
  try {
    const { search, category, sort } = req.query;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    let whereClause = "WHERE 1=1";
    const params = [];

    if (search) {
      whereClause += " AND (title LIKE ? OR category LIKE ?)";
      params.push(`%${search}%`, `%${search}%`);
    }

    if (category) {
      whereClause += " AND category = ?";
      params.push(category);
    }

    let orderClause = "ORDER BY created_at DESC";
    if (sort === "price_asc") orderClause = "ORDER BY price ASC";
    if (sort === "price_desc") orderClause = "ORDER BY price DESC";

    const [countRows] = await pool.query(
      `SELECT COUNT(*) AS total FROM courses ${whereClause}`,
      params
    );
    const total = countRows[0].total;

    const [courses] = await pool.query(
      `SELECT * FROM courses ${whereClause} ${orderClause} LIMIT ? OFFSET ?`,
      [...params, limit, offset]
    );

    return res.status(200).json({
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      courses,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Failed to fetch courses" });
  }
}

// GET /api/courses/:id
async function getCourseById(req, res) {
  try {
    const { id } = req.params;
    const [courses] = await pool.query("SELECT * FROM courses WHERE id = ?", [id]);
    const course = courses[0];

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    return res.status(200).json({ course });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Failed to fetch course" });
  }
}

// 🆕 POST /api/courses (Create a Course)
async function createCourse(req, res) {
  try {
    const { title, description, category, price } = req.body;

    // Simple validation block
    if (!title || !description || !category || price === undefined) {
      return res.status(400).json({ message: "All course fields are required." });
    }

    const [result] = await pool.query(
      "INSERT INTO courses (title, description, category, price, created_at) VALUES (?, ?, ?, ?, NOW())",
      [title, description, category, price]
    );

    return res.status(201).json({
      message: "Course created successfully",
      courseId: result.insertId
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Failed to create course" });
  }
}

// 🆕 PUT /api/courses/:id (Edit a Course)
async function updateCourse(req, res) {
  try {
    const { id } = req.params;
    const { title, description, category, price } = req.body;

    // First check if the course exists before attempting modifications
    const [existing] = await pool.query("SELECT * FROM courses WHERE id = ?", [id]);
    if (existing.length === 0) {
      return res.status(404).json({ message: "Course not found" });
    }

    await pool.query(
      "UPDATE courses SET title = ?, description = ?, category = ?, price = ? WHERE id = ?",
      [title, description, category, price, id]
    );

    return res.status(200).json({ message: "Course updated successfully" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Failed to update course" });
  }
}

// 🆕 DELETE /api/courses/:id (Delete a Course)
async function deleteCourse(req, res) {
  try {
    const { id } = req.params;

    // Verify course lifecycle exists before deletion
    const [existing] = await pool.query("SELECT * FROM courses WHERE id = ?", [id]);
    if (existing.length === 0) {
      return res.status(404).json({ message: "Course not found" });
    }

    await pool.query("DELETE FROM courses WHERE id = ?", [id]);

    return res.status(200).json({ message: "Course deleted successfully from directory" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Failed to delete course" });
  }
}

module.exports = { 
  getCourses, 
  getCourseById, 
  createCourse, 
  updateCourse, 
  deleteCourse 
};
