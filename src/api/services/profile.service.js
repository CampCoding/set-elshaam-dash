import api from "../axios";
import { PROFILE_MANAGEMENT_ENDPOINTS } from "../endpoints";

export const profileService = {
  // ============ GET PROFILE ============
  getProfile: async (id, type = "main") => {
    try {
      const response = await api.get(PROFILE_MANAGEMENT_ENDPOINTS.GET_PROFILE(id, type));
      return response.data;
    } catch (error) {
      console.error("Get Profile API Error:", error);
      throw error;
    }
  },

  // ============ UPSERT PROFILE (JSON or MULTIPART) ============
  upsertProfile: async (id, profileData, type = "main") => {
    try {
      const isFormData = profileData instanceof FormData;
      const headers = isFormData
        ? { "Content-Type": "multipart/form-data" }
        : { "Content-Type": "application/json" };

      const response = await api.post(
        PROFILE_MANAGEMENT_ENDPOINTS.UPSERT_PROFILE(id, type),
        profileData,
        { headers }
      );
      return response.data;
    } catch (error) {
      console.error("Upsert Profile API Error:", error);
      throw error;
    }
  },

  // ============ DELETE PROFILE FILE ============
  deleteFile: async (id, fileData) => {
    try {
      const response = await api.delete(PROFILE_MANAGEMENT_ENDPOINTS.DELETE_FILE(id), {
        data: fileData,
      });
      return response.data;
    } catch (error) {
      console.error("Delete Profile File API Error:", error);
      throw error;
    }
  },

  // ============ GET TARGET PROFILE ============
  getTargetProfile: async (id) => {
    try {
      const response = await api.get(PROFILE_MANAGEMENT_ENDPOINTS.GET_TARGET_PROFILE(id));
      return response.data;
    } catch (error) {
      console.error("Get Target Profile API Error:", error);
      throw error;
    }
  },

  // ============ UPSERT TARGET PROFILE ============
  upsertTargetProfile: async (id, targetData) => {
    try {
      const response = await api.post(
        PROFILE_MANAGEMENT_ENDPOINTS.UPSERT_TARGET_PROFILE(id),
        targetData
      );
      return response.data;
    } catch (error) {
      console.error("Upsert Target Profile API Error:", error);
      throw error;
    }
  },
};
