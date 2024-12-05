/* eslint-disable no-useless-catch */
import api from "../utilities/apiConfig";

const Courses = {
  async index() {
    try {
      const response = await api.get("/courses");
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  async show(course_id) {
    try {
      const response = await api.get(`/courses/${course_id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export default Courses;
