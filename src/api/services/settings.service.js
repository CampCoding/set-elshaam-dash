
import api from "../axios";
import { ADMIN_SETTINGS_ENDPOINTS } from "../endpoints";

const settingsService = {
  getSettings: async () => {
    const response = await api.get(ADMIN_SETTINGS_ENDPOINTS.GET_SETTINGS);
    return response.data;
  },

  updateSetting: async (formData) => {



    const response = await api.put(`${ADMIN_SETTINGS_ENDPOINTS.UPDATE_SETTING}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },
};

export default settingsService;
