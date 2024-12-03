const express = require("express");
const pool = require("./db");

const app = express();
app.use(express.json());

app.get("/students", async (req, res) => {
  const query = "SELECT * from students;";
  const result = await pool.query(query);
  const students = result.rows;
  res.json({ students });
});

app.listen(3000, () => console.log("listening on port 3000. Yay!"));
