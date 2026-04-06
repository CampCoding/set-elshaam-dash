// src/api/services/profiles.service.js
import api from "../axios";
import { PROFILE_ENDPOINTS } from "../endpoints";

export const profilesService = {
  // Get all profiles with filters
  getProfiles: async (params = {}) => {
    const response = await api.get(PROFILE_ENDPOINTS.GET_PROFILES(params));
    return response.data;
  },

  // Get single profile
  getProfile: async (id, type = "main") => {
    const response = await api.get(PROFILE_ENDPOINTS.GET_PROFILE(id, type));
    return response.data;
  },

  // Update profile
  updateProfile: async (id, data, type = "main") => {
    const response = await api.put(
      PROFILE_ENDPOINTS.UPDATE_PROFILE(id, type),
      data
    );
    return response.data;
  },

  // Delete profile
  deleteProfile: async (id) => {
    const response = await api.delete(PROFILE_ENDPOINTS.DELETE_PROFILE(id));
    return response.data;
  },

  // Toggle verify
  toggleVerify: async (id) => {
    const response = await api.patch(PROFILE_ENDPOINTS.TOGGLE_VERIFY(id));
    return response.data;
  },

  // Toggle block
  toggleBlock: async (id) => {
    const response = await api.patch(PROFILE_ENDPOINTS.TOGGLE_BLOCK(id));
    return response.data;
  },
};
