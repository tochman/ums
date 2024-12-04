const express = require("express");
const cors = require("cors");

const studentsRoutes = require("./routes/students");
const coursesRoutes = require("./routes/courses");
const enrollmentsRoutes = require("./routes/enrollments");

const app = express();
app.use(cors()); // Allow all origins

app.use(express.json());

app.use("/students", studentsRoutes);
app.use("/courses", coursesRoutes);
app.use("/enrollments", enrollmentsRoutes);


app.listen(3000, () => console.log("listening on port 3000. Yay!"));
