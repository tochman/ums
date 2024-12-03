const express = require("express");
const router = express.Router();
const pool = require("../db");

router.get("/", async (req, res) => {
  try {
    const query = "SELECT * from students;";
    const result = await pool.query(query);
    const students = result.rows;
    res.json({ students });
  } catch (error) {
    res.json({ error }).status(500);
  }
});

router.get("/:student_id", async (req, res) => {
  try {
    const { student_id } = req.params;
    const query = "SELECT id, name FROM students where id = $1";
    const result = await pool.query(query, [student_id]);
    const student = result.rows[0];

    const coursesQuery = `
    SELECT 
      c.id AS course_id,
      c.title AS course_title,
      e.status AS enrollment_status,
      e.enrollment_date
    FROM enrollments e
    JOIN courses c ON e.course_id = c.id
    WHERE e.student_id = $1
  `;

    const coursesResults = await pool.query(coursesQuery, [student_id]);

    student.courses = coursesResults.rows.map((course) => ({
      course_id: course.course_id,
      course_title: course.course_title,
      enrollment_status: course.enrollment_status,
      enrollment_date: new Date(course.enrollment_date)
        .toISOString()
        .split("T")[0],
    }));

    res.json({ student });
  } catch (error) {
    res.json({ error: "this did not fly at all!" });
  }
});

module.exports = router;
