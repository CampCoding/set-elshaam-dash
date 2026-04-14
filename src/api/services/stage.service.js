// src/api/services/stages.service.js

import api from "../axios";

export const stagesService = {
  getStages: async () => {
    const response = await api.get("/admin/stages");
    return response.data;
  },

  createStage: async (data) => {
    const response = await api.post("/admin/stages", data);
    return response.data;
  },

  updateStage: async (id, data) => {
    const response = await api.put(`/admin/stages/${id}`, data);
    return response.data;
  },

  deleteStage: async (id) => {
    const response = await api.delete(`/admin/stages/${id}`);
    return response.data;
  },
};
