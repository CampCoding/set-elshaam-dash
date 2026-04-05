// ============ ADMIN AUTH ============
export const ADMIN_AUTH_ENDPOINTS = {
  LOGIN: "/admin/auth/login",
  PROFILE: "/admin/auth/profile",
};

// ============ ADMIN USER MANAGEMENT ============
export const ADMIN_USER_ENDPOINTS = {
  GET_USERS: (page = 1, limit = 10) => `/admin/users?page=${page}&limit=${limit}`,
  GET_USER_DETAILS: (id) => `/admin/users/${id}`,
  CREATE_USER: "/admin/users",
  UPDATE_USER: (id) => `/admin/users/${id}`,
  DELETE_USER: (id) => `/admin/users/${id}`,
  TOGGLE_BLOCK: (id) => `/admin/users/${id}/block`,
};

// ============ PROFILE MANAGEMENT ============
export const PROFILE_MANAGEMENT_ENDPOINTS = {
  GET_PROFILE: (id, type = "main") => `/admin/users/${id}/profile?type=${type}`,
  UPSERT_PROFILE: (id, type = "main") => `/admin/users/${id}/profile?type=${type}`,
  DELETE_FILE: (id) => `/admin/users/${id}/profile/file`,
  GET_TARGET_PROFILE: (id) => `/admin/users/${id}/profile/target`,
  UPSERT_TARGET_PROFILE: (id) => `/admin/users/${id}/profile/target`,
};
