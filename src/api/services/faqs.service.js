// src/api/services/faqs.service.js
import axiosInstance from "../axios";
import { ADMIN_FAQ_ENDPOINTS } from "../endpoints";

const faqsService = {
  getFaqs: async (params) => {
    const response = await axiosInstance.get(ADMIN_FAQ_ENDPOINTS.GET_FAQS(params));
    return response.data;
  },

  createFaq: async (faqData) => {
    const response = await axiosInstance.post(ADMIN_FAQ_ENDPOINTS.CREATE_FAQ, faqData);
    return response.data;
  },

  updateFaq: async (id, faqData) => {
    const response = await axiosInstance.put(ADMIN_FAQ_ENDPOINTS.UPDATE_FAQ(id), faqData);
    return response.data;
  },

  deleteFaq: async (id) => {
    const response = await axiosInstance.delete(ADMIN_FAQ_ENDPOINTS.DELETE_FAQ(id));
    return response.data;
  },
};

export default faqsService;
