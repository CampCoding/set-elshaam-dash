
import api from "../axios";
import { ADMIN_NEWS_ENDPOINTS } from "../endpoints";

const newsService = {
  getNews: async () => {
    const response = await api.get(ADMIN_NEWS_ENDPOINTS.GET_NEWS);
    return response.data;
  },

  createNews: async (formData) => {
    const response = await api.post(ADMIN_NEWS_ENDPOINTS.CREATE_NEWS, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  updateNews: async (id, formData) => {
    const response = await api.put(ADMIN_NEWS_ENDPOINTS.UPDATE_NEWS(id), formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  deleteNews: async (id) => {
    const response = await api.delete(ADMIN_NEWS_ENDPOINTS.DELETE_NEWS(id));
    return response.data;
  },
};

export default newsService;
