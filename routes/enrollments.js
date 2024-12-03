const express = require("express");
const router = express.Router();
const pool = require("../db");

router.post("/course/:course_id", async (req, res) => {
  const { course_id } = req.params;
  const { student_id } = req.body;

  // Ensure both course and student exist
  const [studentCheck, courseCheck] = await Promise.all([
    pool.query("SELECT id, name FROM students WHERE id = $1", [student_id]),
    pool.query("SELECT id, title FROM courses WHERE id = $1", [course_id]),
  ]);

  if (studentCheck.rowCount === 0) {
    return res.status(404).json({ error: "Student not found." });
  }

  if (courseCheck.rowCount === 0) {
    return res.status(404).json({ error: "Course not found." });
  }

  // Check for existing enrollment
  const existingEnrollmentQuery = `
    SELECT * 
    FROM enrollments
    WHERE student_id = $1 AND course_id = $2;
  `;
  const existingEnrollmentResult = await pool.query(existingEnrollmentQuery, [
    student_id,
    course_id,
  ]);

  if (existingEnrollmentResult.rowCount > 0) {
    return res.status(409).json({
      error: "Student is already enrolled in this course.",
    });
  }
  // Validate prerequisites

  const prerequisitesMetQuery = `
  WITH BestGrades AS (
    SELECT 
      ah.student_id,
      ah.course_id,
      MAX(ah.grade) AS best_grade
    FROM academic_history ah
    WHERE ah.student_id = $1
    GROUP BY ah.student_id, ah.course_id
  )
  SELECT 
    NOT EXISTS (
      SELECT 1
      FROM course_prerequisites cp
      LEFT JOIN BestGrades bg
        ON cp.prerequisite_id = bg.course_id
      WHERE cp.course_id = $2
        AND (bg.best_grade IS NULL OR bg.best_grade < cp.minimum_grade)
    ) AS prerequisites_met;
`;

  const prerequisitesResult = await pool.query(prerequisitesMetQuery, [
    student_id,
    course_id,
  ]);

  const prerequisitesMet = prerequisitesResult.rows[0].prerequisites_met;

  if (!prerequisitesMet) {
    return res
      .status(400)
      .json({ error: "Student does not meet prerequisites." });
  }
  const enrollmentQuery = `
  INSERT INTO enrollments (student_id, course_id, status)
  VALUES ($1, $2, 'active')
  RETURNING *;
`;
  const enrollmentResults = await pool.query(enrollmentQuery, [
    student_id,
    course_id,
  ]);
  const enrollment = enrollmentResults.rows[0];
  res.json({ enrollment }).status(201);
});

router.delete("/course/:course_id", async (req, res) => {
  try {
    const { course_id } = req.params; // Course to unenroll from
    const { student_id } = req.body; // Student attempting to unenroll

    // Ensure both course_id and student_id exist
    if (!course_id || !student_id) {
      return res
        .status(400)
        .json({ error: "Course ID and Student ID are required." });
    }

    // Check if the student is enrolled in the course
    const enrollmentCheckQuery = `
      SELECT e.id, e.student_id, e.course_id, e.enrollment_date, e.status,
             s.name AS student_name, c.title AS course_title
      FROM enrollments e
      JOIN students s ON e.student_id = s.id
      JOIN courses c ON e.course_id = c.id
      WHERE e.student_id = $1 AND e.course_id = $2
    `;
    const enrollmentCheckResult = await pool.query(enrollmentCheckQuery, [
      student_id,
      course_id,
    ]);

    if (enrollmentCheckResult.rowCount === 0) {
      return res.status(404).json({
        error: "Enrollment not found. Student is not enrolled in the course.",
      });
    }

    const enrollment = enrollmentCheckResult.rows[0];

    // Delete the enrollment
    const unenrollQuery = `
      DELETE FROM enrollments
      WHERE student_id = $1 AND course_id = $2
      RETURNING *;
    `;
    await pool.query(unenrollQuery, [student_id, course_id]);

    // Format response JSON
    const response = {
      message: "Unenrollment successful!",
      enrollment: {
        id: enrollment.id,
        student_id: enrollment.student_id,
        student_name: enrollment.student_name,
        course_id: enrollment.course_id,
        course_title: enrollment.course_title,
        enrollment_date: new Date(enrollment.enrollment_date)
          .toISOString()
          .split("T")[0], // Format date
        status: enrollment.status,
      },
    };

    res.status(200).json(response);
  } catch (err) {
    console.error("Error during unenrollment:", err.message);
    res.status(500).json({ error: "Server error. Please try again later." });
  }
});

module.exports = router;
