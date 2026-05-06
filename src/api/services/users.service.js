
import api from "../axios";
import { ADMIN_USER_ENDPOINTS } from "../endpoints";

export const usersService = {

  getUsers: async (params = {}) => {
    try {
      const response = await api.get(ADMIN_USER_ENDPOINTS.GET_USERS(params));
      return response.data;
    } catch (error) {
      console.error("Get Users API Error:", error);
      throw error;
    }
  },


  getUserById: async (id) => {
    try {
      const response = await api.get(ADMIN_USER_ENDPOINTS.GET_USER_DETAILS(id));
      return response.data;
    } catch (error) {
      console.error("Get User API Error:", error);
      throw error;
    }
  },


  createUser: async (userData) => {
    try {
      const isFormData = userData instanceof FormData;
      const headers = isFormData
        ? { "Content-Type": "multipart/form-data" }
        : {};
      const response = await api.post(
        ADMIN_USER_ENDPOINTS.CREATE_USER,
        userData,
        { headers }
      );
      return response.data;
    } catch (error) {
      console.error("Create User API Error:", error);
      throw error;
    }
  },


  updateUser: async (id, userData) => {
    try {
      const isFormData = userData instanceof FormData;
      const headers = isFormData
        ? { "Content-Type": "multipart/form-data" }
        : {};
      const response = await api.put(
        ADMIN_USER_ENDPOINTS.UPDATE_USER(id),
        userData,
        { headers }
      );
      return response.data;
    } catch (error) {
      console.error("Update User API Error:", error);
      throw error;
    }
  },


  deleteUser: async (id) => {
    try {
      const response = await api.delete(ADMIN_USER_ENDPOINTS.DELETE_USER(id));
      return response.data;
    } catch (error) {
      console.error("Delete User API Error:", error);
      throw error;
    }
  },


  toggleBlock: async (id) => {
    try {
      const response = await api.patch(ADMIN_USER_ENDPOINTS.TOGGLE_BLOCK(id));
      return response.data;
    } catch (error) {
      console.error("Toggle Block API Error:", error);
      throw error;
    }
  },


  sendDirectEmail: async (id, formData) => {
    try {
      const response = await api.post(
        ADMIN_USER_ENDPOINTS.SEND_DIRECT_EMAIL(id),
        formData
      );
      return response.data;
    } catch (error) {
      console.error("Send Direct Email API Error:", error);
      throw error;
    }
  },


  listDirectEmails: async (id) => {
    try {
      const response = await api.get(ADMIN_USER_ENDPOINTS.LIST_DIRECT_EMAILS(id));
      return response.data;
    } catch (error) {
      console.error("List Direct Emails API Error:", error);
      throw error;
    }
  },
};

export default usersService;
