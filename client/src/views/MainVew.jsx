import { Button, Tabs } from "@chakra-ui/react";
import StudentsList from "./students/StudentsList";
import CoursesList from "./courses/CoursesList";
import { useColorMode } from "../components/ui/color-mode";
import EnrollmentProcessing from "./enrollments/EnrollmentProcessing";

Tabs;
const MainVew = () => {
  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <>
      <Button size={'sm'} onClick={toggleColorMode}>
        {colorMode === "light" ? "Mörk" : "Ljus"}
      </Button>
      <Tabs.Root defaultValue={"enrollments"}>
        <Tabs.List>
          <Tabs.Trigger value="students">Students</Tabs.Trigger>
          <Tabs.Trigger value="courses">Courses</Tabs.Trigger>
          <Tabs.Trigger value="enrollments">Enrollments</Tabs.Trigger>
        </Tabs.List>
        <Tabs.Content value="students">
          <StudentsList />
        </Tabs.Content>
        <Tabs.Content value="courses">
          <CoursesList />
        </Tabs.Content>
        <Tabs.Content value="enrollments"><EnrollmentProcessing /></Tabs.Content>
      </Tabs.Root>
    </>
  );
};

export default MainVew;
