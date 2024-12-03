const express = require("express");
const router = express.Router();
const pool = require("../db");

router.get("/", async (req, res) => {
  try {
    const query = `
    SELECT 
      c.id AS course_id,
      c.title AS course_title,
      cp.prerequisite_id,
      p.title AS prerequisite_title,
      cp.minimum_grade
    FROM courses c
    LEFT JOIN course_prerequisites cp ON c.id = cp.course_id
    LEFT JOIN courses p ON cp.prerequisite_id = p.id
  `;

    const results = await pool.query(query);
    const courses = results.rows;
    res.json({ courses });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

router.get("/:course_id", async (req, res) => {
  const { course_id } = req.params;

  const query = ` SELECT 
        c.id AS course_id,
        c.title AS course_title,
        JSON_AGG(
          JSON_BUILD_OBJECT(
            'id', s.id,
            'name', s.name,
            'status', e.status,
            'enrollment_date', e.enrollment_date
          )
        ) AS students
      FROM courses c
      LEFT JOIN enrollments e ON c.id = e.course_id
      LEFT JOIN students s ON e.student_id = s.id
      WHERE c.id = $1
      GROUP BY c.id;`;
  const results = await pool.query(query, [course_id]);
  const course = results.rows[0];
  res.json({ course });
});

module.exports = router;
