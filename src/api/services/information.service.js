import axiosInstance from "../axios";
import { INFORMATION_ENDPOINTS } from "../endpoints";

export const informationService = {
  getInformation: async () => {
    const response = await axiosInstance.get(INFORMATION_ENDPOINTS.GET_INFORMATION);
    return response.data;
  },

  updateInformation: async (data) => {
    const response = await axiosInstance.put(
      INFORMATION_ENDPOINTS.UPDATE_INFORMATION,
      data
    );
    return response.data;
  },
};
