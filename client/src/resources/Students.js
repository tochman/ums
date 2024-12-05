/* eslint-disable no-useless-catch */
import api from "../utilities/apiConfig";

const Students = {
  async index() {
    try {
      const response = await api.get("/students");
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  async show(student_id) {
    try {
      const response = await api.get(`/students/${student_id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export default Students;
