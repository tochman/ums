/* eslint-disable no-debugger */
import { useEffect, useState } from "react";
import {
  NativeSelectField,
  NativeSelectRoot,
} from "../../components/ui/native-select";
import Enrollments from "../../resources/Enrollments";
import Courses from "../../resources/Courses";
import Students from "../../resources/Students";
import { Box, Button, Heading } from "@chakra-ui/react";

const EnrollmentProcessing = () => {
  const [courses, setCourses] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState();
  const [selectedStudent, setSelectedStudent] = useState();

  const fetchStudents = async () => {
    const data = await Students.index();
    setStudents(data.students);
  };

  const fetchCourses = async () => {
    const data = await Courses.index();
    setCourses(data.courses);
  };

  useEffect(() => {
    fetchStudents();
    fetchCourses();
  }, []);

  const enrollStudent = async () => {
    debugger;
    await Enrollments.enroll(selectedCourse, selectedStudent);
  };

  return (
    <>
      <Heading>Select a student</Heading>
      <NativeSelectRoot>
        <NativeSelectField
          key={selectedStudent}
          value={selectedStudent}
          onChange={(e) => setSelectedStudent(e.target.value)}
        >
          {students.map((student) => {
            return (
              <option key={student.id} value={student.id}>
                {student.name}
              </option>
            );
          })}
        </NativeSelectField>
      </NativeSelectRoot>
      <Heading>Select a course</Heading>
      <NativeSelectRoot>
        <NativeSelectField
          key={selectedCourse}
          value={selectedCourse}
          onChange={(e) => setSelectedCourse(e.target.value)}
        >
          {courses.map((course) => {
            return (
              <option key={course.course_id} value={course.course_id}>
                {course.course_title}
              </option>
            );
          })}
        </NativeSelectField>
      </NativeSelectRoot>
      <Box>
        <Button onClick={() => enrollStudent()}>Enroll</Button>
      </Box>
    </>
  );
};

export default EnrollmentProcessing;
