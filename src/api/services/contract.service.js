

import api from "../axios";

export const contractService = {
  getContract: async () => {
    const response = await api.get("/admin/contract");
    return response.data;
  },

  updateContract: async (data) => {
    const response = await api.put(`/admin/contract`, data);
    return response.data;
  },
};
