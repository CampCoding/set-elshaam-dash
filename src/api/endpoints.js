// ============ ADMIN AUTH ============
export const ADMIN_AUTH_ENDPOINTS = {
  LOGIN: "/admin/auth/login",
  PROFILE: "/admin/auth/profile",
};
export const ADMIN_USER_ENDPOINTS = {
  GET_USERS: (params = {}) => {
    const query = new URLSearchParams();

    if (params.page) query.append("page", params.page);
    if (params.limit) query.append("limit", params.limit);
    if (params.search) query.append("search", params.search);
    if (params.gender) query.append("gender", params.gender);
    if (params.has_profile !== undefined && params.has_profile !== null) {
      query.append("has_profile", params.has_profile);
    }
    if (
      params.has_target_profile !== undefined &&
      params.has_target_profile !== null
    ) {
      query.append("has_target_profile", params.has_target_profile);
    }
    if (params.is_verified !== undefined && params.is_verified !== null) {
      query.append("is_verified", params.is_verified);
    }
    if (params.sort_by) query.append("sort_by", params.sort_by);
    if (params.sort_order) query.append("sort_order", params.sort_order);

    const queryString = query.toString();
    return `/admin/users${queryString ? `?${queryString}` : ""}`;
  },
  GET_USER_DETAILS: (id) => `/admin/users/${id}`,
  CREATE_USER: "/admin/users",
  UPDATE_USER: (id) => `/admin/users/${id}`,
  DELETE_USER: (id) => `/admin/users/${id}`,
  TOGGLE_BLOCK: (id) => `/admin/users/${id}/block`,
};
// ============ PROFILE MANAGEMENT ============

export const PROFILE_ENDPOINTS = {
  // Get profiles list with filters - لا ترسل null values
  GET_PROFILES: (params = {}) => {
    const query = new URLSearchParams();

    // Basic params
    if (params.type) query.append("type", params.type);
    if (params.page) query.append("page", params.page);
    if (params.limit) query.append("limit", params.limit);
    if (params.search) query.append("search", params.search);

    // Filters - فقط لو القيمة موجودة ومش null
    if (params.gender) query.append("gender", params.gender);
    if (params.nationality) query.append("nationality", params.nationality);
    if (params.marital_status)
      query.append("marital_status", params.marital_status);
    if (params.religion) query.append("religion", params.religion);
    if (params.residency_type)
      query.append("residency_type", params.residency_type);
    if (params.income_source)
      query.append("income_source", params.income_source);
    if (params.education_level)
      query.append("education_level", params.education_level);

    // Boolean filters (0 or 1)
    if (params.is_verified !== undefined && params.is_verified !== null) {
      query.append("is_verified", params.is_verified);
    }
    if (params.has_children !== undefined && params.has_children !== null) {
      query.append("has_children", params.has_children);
    }
    if (params.is_smoker !== undefined && params.is_smoker !== null) {
      query.append("is_smoker", params.is_smoker);
    }
    if (
      params.has_criminal_record !== undefined &&
      params.has_criminal_record !== null
    ) {
      query.append("has_criminal_record", params.has_criminal_record);
    }
    if (params.has_debts !== undefined && params.has_debts !== null) {
      query.append("has_debts", params.has_debts);
    }

    // Religion commitment
    if (params.religion_commitment) {
      query.append("religion_commitment", params.religion_commitment);
    }

    const queryString = query.toString();
    return `/admin/users/profiles/list${queryString ? `?${queryString}` : ""}`;
  },

  GET_PROFILE: (id, type = "main") => `/admin/users/${id}/profile?type=${type}`,
  UPDATE_PROFILE: (id, type = "main") =>
    `/admin/users/${id}/profile?type=${type}`,
  DELETE_PROFILE: (id) => `/admin/users/${id}/profile`,
  TOGGLE_VERIFY: (id) => `/admin/users/${id}/verify`,
  TOGGLE_BLOCK: (id) => `/admin/users/${id}/block`,
};

export const PROFILE_MANAGEMENT_ENDPOINTS = {
  GET_PROFILE: (id, type = "main") => `/admin/users/${id}/profile?type=${type}`,
  UPSERT_PROFILE: (id, type = "main") =>
    `/admin/users/${id}/profile?type=${type}`,
  DELETE_FILE: (id) => `/admin/users/${id}/profile/file`,
  GET_TARGET_PROFILE: (id) => `/admin/users/${id}/profile/target`,
  UPSERT_TARGET_PROFILE: (id) => `/admin/users/${id}/profile/target`,
};
