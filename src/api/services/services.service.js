// src/api/services/services.service.js
import api from "../axios";
import { ADMIN_SERVICES_ENDPOINTS } from "../endpoints";

const servicesService = {
  getServices: async (params) => {
    const response = await api.get(
      ADMIN_SERVICES_ENDPOINTS.GET_SERVICES(params)
    );
    return response.data;
  },

  createService: async (formData) => {
    const response = await api.post(
      ADMIN_SERVICES_ENDPOINTS.CREATE_SERVICE,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  },

  updateService: async (id, formData) => {
    const response = await api.put(
      `${ADMIN_SERVICES_ENDPOINTS.UPDATE_SERVICE(id)}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  },

  deleteService: async (id) => {
    const response = await api.delete(
      ADMIN_SERVICES_ENDPOINTS.DELETE_SERVICE(id)
    );
    return response.data;
  },

  // ✅
  removeImage: async (id, data) => {
    const response = await api.delete(
      ADMIN_SERVICES_ENDPOINTS.REMOVE_SERVICE_IMAGE(id),
      { data }
    );
    return response.data;
  },
};

export default servicesService;
