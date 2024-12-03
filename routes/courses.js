const express = require("express");
const router = express.Router();
const pool = require("../db");

router.use("/", async (req, res) => {
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

module.exports = router;
