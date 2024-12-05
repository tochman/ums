/* eslint-disable no-debugger */
import { Stack, Table } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import Students from "../../resources/Students";
import StudentDetails from "./StudentDetails";

const StudentsList = () => {
  const [students, setStudents] = useState([]);

  const fetchStudents = async () => {
    const data = await Students.index();
    setStudents(data.students);
  };
  useEffect(() => {
    fetchStudents();
  }, []);

  return (
    <Stack gap="10">
      <Table.Root size="sm" striped>
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeader>Name</Table.ColumnHeader>
            <Table.ColumnHeader>Courses</Table.ColumnHeader>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {students.map((item) => (
            <Table.Row key={item.id}>
              <Table.Cell>{item.name}</Table.Cell>
              <Table.Cell><StudentDetails student={item}/></Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
    </Stack>
  );
};

export default StudentsList;
