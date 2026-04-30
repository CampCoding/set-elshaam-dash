// src/api/services/pagesContent.service.js
import api from "../axios";
import { ADMIN_PAGES_CONTENT_ENDPOINTS } from "../endpoints";

const pagesContentService = {
  getContent: async () => {
    const response = await api.get(ADMIN_PAGES_CONTENT_ENDPOINTS.GET_CONTENT);
    return response.data;
  },

  createContent: async (formData) => {
    const response = await api.post(
      ADMIN_PAGES_CONTENT_ENDPOINTS.CREATE_CONTENT,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  },

  updateContent: async (id, formData) => {
    const response = await api.patch(
      `${ADMIN_PAGES_CONTENT_ENDPOINTS.UPDATE_CONTENT(id)}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  },

  deleteContent: async (id) => {
    const response = await api.delete(
      ADMIN_PAGES_CONTENT_ENDPOINTS.DELETE_CONTENT(id)
    );
    return response.data;
  },
};

export default pagesContentService;
