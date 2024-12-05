import { useEffect, useState } from "react";
import Students from "../../resources/Students";
import { length } from "../../../node_modules/stylis/src/Tokenizer";

/* eslint-disable react/prop-types */
const StudentDetails = ({ student }) => {
  const [studentDetails, setStudentDetails] = useState();
  const fetchStudentDetails = async () => {
    const data = await Students.show(student.id);
    setStudentDetails(data.student);
  };

  useEffect(() => {
    fetchStudentDetails();
  }, []);

  return (
    <>
      {studentDetails && studentDetails.courses && (
        <div>
          {studentDetails.courses.map((course, index) => {
            return <p key={student.name+index}>{course.course_title}</p>;
          })}
        </div>
      )}
    </>
  );
};

export default StudentDetails;
