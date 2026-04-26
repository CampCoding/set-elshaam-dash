import api from "../axios";
import { ADMIN_GALLERY_ENDPOINTS } from "../endpoints";

const galleryService = {
  getGallery: async () => {
    const response = await api.get(ADMIN_GALLERY_ENDPOINTS.GET_GALLERY);
    return response.data;
  },

  createGallery: async (formData) => {
    const response = await api.post(ADMIN_GALLERY_ENDPOINTS.CREATE_GALLERY, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  updateGallery: async (id, formData) => {
    // Some APIs expect POST with _method=PUT for multipart/form-data
    // but the user explicitly said PUT. If it fails, I might need to change it.
    const response = await api.put(ADMIN_GALLERY_ENDPOINTS.UPDATE_GALLERY(id), formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  deleteGallery: async (id) => {
    const response = await api.delete(ADMIN_GALLERY_ENDPOINTS.DELETE_GALLERY(id));
    return response.data;
  },
};

export default galleryService;
