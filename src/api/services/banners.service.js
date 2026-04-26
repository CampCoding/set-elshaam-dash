// src/api/services/banners.service.js
import api from "../axios";
import { ADMIN_BANNERS_ENDPOINTS } from "../endpoints";

const bannersService = {
  getBanners: async () => {
    const response = await api.get(ADMIN_BANNERS_ENDPOINTS.GET_BANNERS);
    return response.data;
  },

  createBanner: async (formData) => {
    const response = await api.post(ADMIN_BANNERS_ENDPOINTS.CREATE_BANNER, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  updateBanner: async (id, formData) => {
    // Using POST with _method=PUT for multipart/form-data compatibility
    const response = await api.put(`${ADMIN_BANNERS_ENDPOINTS.UPDATE_BANNER(id)}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  deleteBanner: async (id) => {
    const response = await api.delete(ADMIN_BANNERS_ENDPOINTS.DELETE_BANNER(id));
    return response.data;
  },
};

export default bannersService;
