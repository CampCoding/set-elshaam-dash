
import api from "../axios";
import { PROFILE_ENDPOINTS } from "../endpoints";

export const profilesService = {

  getProfiles: async (params = {}) => {
    const response = await api.get(PROFILE_ENDPOINTS.GET_PROFILES(params));
    return response.data;
  },


  getProfile: async (id, type = "main") => {
    const response = await api.get(PROFILE_ENDPOINTS.GET_PROFILE(id, type));
    return response.data;
  },


  updateProfile: async (id, data, type = "main") => {
    const response = await api.put(
      PROFILE_ENDPOINTS.UPDATE_PROFILE(id, type),
      data
    );
    return response.data;
  },


  deleteProfile: async (id) => {
    const response = await api.delete(PROFILE_ENDPOINTS.DELETE_PROFILE(id));
    return response.data;
  },


  toggleVerify: async (id) => {
    const response = await api.patch(PROFILE_ENDPOINTS.TOGGLE_VERIFY(id));
    return response.data;
  },


  toggleBlock: async (id) => {
    const response = await api.patch(PROFILE_ENDPOINTS.TOGGLE_BLOCK(id));
    return response.data;
  },
};
