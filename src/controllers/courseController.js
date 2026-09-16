const pool = require("../config/db");

// GET /api/courses?search=&category=&sort=price_asc|price_desc&page=1&limit=10
async function getCourses(req, res) {
  try {
    const { search, category, sort } = req.query;

    // Read pagination params, with safe defaults
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit; // this is the "correct offset" the assessment asks for

    // We build the WHERE clause step by step so we only filter
    // on the fields that were actually provided.
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

    // Only allow specific, known sort values - never insert user input
    // directly into ORDER BY, that would be a SQL injection risk.
    let orderClause = "ORDER BY created_at DESC";
    if (sort === "price_asc") orderClause = "ORDER BY price ASC";
    if (sort === "price_desc") orderClause = "ORDER BY price DESC";

    // Get the total count too, so the frontend can build pagination controls
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

module.exports = { getCourses, getCourseById };
