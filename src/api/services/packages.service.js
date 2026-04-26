// src/api/services/packages.service.js
import api from "../axios";
import { ADMIN_PACKAGES_ENDPOINTS } from "../endpoints";

const packagesService = {
  getPackages: async () => {
    const response = await api.get(ADMIN_PACKAGES_ENDPOINTS.GET_PACKAGES);
    return response.data;
  },

  createPackage: async (packageData) => {
    const response = await api.post(ADMIN_PACKAGES_ENDPOINTS.CREATE_PACKAGE, packageData);
    return response.data;
  },

  updatePackage: async (id, packageData) => {
    const response = await api.put(ADMIN_PACKAGES_ENDPOINTS.UPDATE_PACKAGE(id), packageData);
    return response.data;
  },

  deletePackage: async (id) => {
    const response = await api.delete(ADMIN_PACKAGES_ENDPOINTS.DELETE_PACKAGE(id));
    return response.data;
  },
};

export default packagesService;
