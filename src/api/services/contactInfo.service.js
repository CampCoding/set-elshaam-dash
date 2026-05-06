
import api from "../axios";
import { ADMIN_CONTACT_INFO_ENDPOINTS } from "../endpoints";

const contactInfoService = {
  getContactInfo: async () => {
    const response = await api.get(
      ADMIN_CONTACT_INFO_ENDPOINTS.GET_CONTACT_INFO
    );
    return response.data;
  },

  createContactInfo: async (formData) => {
    const response = await api.post(
      ADMIN_CONTACT_INFO_ENDPOINTS.CREATE_CONTACT_INFO,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  },

  updateContactInfo: async (id, formData) => {

    const response = await api.patch(
      `${ADMIN_CONTACT_INFO_ENDPOINTS.UPDATE_CONTACT_INFO(id)}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  },

  deleteContactInfo: async (id) => {
    const response = await api.delete(
      ADMIN_CONTACT_INFO_ENDPOINTS.DELETE_CONTACT_INFO(id)
    );
    return response.data;
  },
};

export default contactInfoService;
