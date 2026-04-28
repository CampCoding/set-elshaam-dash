// src/api/services/settings.service.js
import api from "../axios";
import { ADMIN_SETTINGS_ENDPOINTS } from "../endpoints";

const settingsService = {
  getSettings: async () => {
    const response = await api.get(ADMIN_SETTINGS_ENDPOINTS.GET_SETTINGS);
    return response.data;
  },

  updateSetting: async (formData) => {
    // Note: User specified PUT, but with multipart/form-data (images), 
    // many backends require POST with _method=PUT or just POST.
    // I'll use the _method=PUT convention to be safe if it's Laravel/PHP.
    const response = await api.put(`${ADMIN_SETTINGS_ENDPOINTS.UPDATE_SETTING}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },
};

export default settingsService;
