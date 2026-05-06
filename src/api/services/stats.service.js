

import api from "../axios";

export const statsService = {
  getStats: async () => {
    const response = await api.get("/admin/statistics");
    return response.data;
  },
};
