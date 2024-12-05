/* eslint-disable no-debugger */
import { Stack, Table } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import Courses from "../../resources/Courses";


const CoursesList = () => {
  const [courses, setCourses] = useState([]);

  const fetchCourses = async () => {
    const data = await Courses.index();
    setCourses(data.courses);
  };
  useEffect(() => {
    fetchCourses();
  }, []);

  return (
    <Stack gap="10">
      <Table.Root size="sm" striped>
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeader>Title</Table.ColumnHeader>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {courses.map((item) => (
            <Table.Row key={item.course_title+item.id}>
              <Table.Cell>{item.course_title}</Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
    </Stack>
  );
};

export default CoursesList;
