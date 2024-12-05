/* eslint-disable no-useless-catch */
import api from "../utilities/apiConfig";

const Enrollments = {
  async enroll(course_id, student_id) {
    try {
      const response = await api.post(`/enrollments/course/${course_id}`, {
        student_id: student_id,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  async unenroll(course_id, student_id) {
    try {
      const response = await api.delete(`/enrollments/course/${course_id}`, {
        data: { student_id: student_id },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export default Enrollments;
