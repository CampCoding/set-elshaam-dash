// src/api/services/users.service.js
import api from "../axios";
import { ADMIN_USER_ENDPOINTS } from "../endpoints";

export const usersService = {
  // ============ GET ALL USERS ============
  getUsers: async (page = 1, limit = 10) => {
    try {
      const response = await api.get(ADMIN_USER_ENDPOINTS.GET_USERS(page, limit));
      return response.data;
    } catch (error) {
      console.error("Get Users API Error:", error);
      throw error;
    }
  },

  // ============ CREATE USER ============
  createUser: async (userData) => {
    try {
      const isFormData = userData instanceof FormData;
      const headers = isFormData ? { "Content-Type": "multipart/form-data" } : {};
      const response = await api.post(ADMIN_USER_ENDPOINTS.CREATE_USER, userData, { headers });
      return response.data;
    } catch (error) {
      console.error("Create User API Error:", error);
      throw error;
    }
  },

  // ============ UPDATE USER ============
  updateUser: async (id, userData) => {
    try {
      const isFormData = userData instanceof FormData;
      const headers = isFormData ? { "Content-Type": "multipart/form-data" } : {};
      
      // Some servers require POST for FormData even if logically it's a PUT
      // But we try PUT first as per standard.
      const response = await api.put(ADMIN_USER_ENDPOINTS.UPDATE_USER(id), userData, { headers });
      return response.data;
    } catch (error) {
      console.error("Update User API Error:", error);
      throw error;
    }
  },

  // ============ DELETE USER ============
  deleteUser: async (id) => {
    try {
      const response = await api.delete(ADMIN_USER_ENDPOINTS.DELETE_USER(id));
      return response.data;
    } catch (error) {
      console.error("Delete User API Error:", error);
      throw error;
    }
  },

  // ============ TOGGLE BLOCK STATUS ============
  toggleBlock: async (id, currentStatus) => {
    try {
      const newStatus = currentStatus === "active" ? "blocked" : "active";
      const response = await api.patch(ADMIN_USER_ENDPOINTS.TOGGLE_BLOCK(id), {
        status: newStatus,
      });
      return response.data;
    } catch (error) {
      console.error("Toggle Block API Error:", error);
      throw error;
    }
  },
};
