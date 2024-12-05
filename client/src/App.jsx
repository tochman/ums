import { Container, Heading } from "@chakra-ui/react";
import Courses from "./resources/Courses";
import Enrollments from "./resources/Enrollments";
import Students from "./resources/Students";
import MainVew from "./views/MainVew";
window.Enrollments = Enrollments;
window.Courses = Courses;
window.Students = Students;


const App = () => {
  return (
    <Container mt={10}>
      <Heading>University Management System</Heading>
      <MainVew />
    </Container>
  );
};

export default App;
