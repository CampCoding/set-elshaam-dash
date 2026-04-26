// src/api/endpoints.js

// ============ ADMIN AUTH ============
export const ADMIN_AUTH_ENDPOINTS = {
  LOGIN: "/admin/auth/login",
  PROFILE: "/admin/auth/profile",
};

// ============ ADMIN USERS ============
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
  SEND_DIRECT_EMAIL: (id) => `/admin/users/${id}/email`,
  LIST_DIRECT_EMAILS: (id) => `/admin/users/${id}/emails`,
};

// ============ PROFILE MANAGEMENT ============
export const PROFILE_ENDPOINTS = {
  GET_PROFILES: (params = {}) => {
    const query = new URLSearchParams();

    if (params.type) query.append("type", params.type);
    if (params.page) query.append("page", params.page);
    if (params.limit) query.append("limit", params.limit);
    if (params.search) query.append("search", params.search);

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

// ============ TICKETS MANAGEMENT ============
export const ADMIN_TICKETS_ENDPOINTS = {
  GET_TICKETS: "/admin/tickets",
  GET_TICKET_DETAILS: (id) => `/admin/tickets/${id}`,
  REPLY_TICKET: (id) => `/admin/tickets/${id}/reply`,
  CLOSE_TICKET: (id) => `/admin/tickets/${id}/close`,
};

// ============ INFORMATION MANAGEMENT ============
export const INFORMATION_ENDPOINTS = {
  GET_INFORMATION: "/information",
  UPDATE_INFORMATION: "/information",
};



// ============ SERVICES MANAGEMENT ============
export const ADMIN_SERVICES_ENDPOINTS = {
  GET_SERVICES: (params = {}) => {
    const query = new URLSearchParams();
    if (params.page) query.append("page", params.page);
    if (params.limit) query.append("limit", params.limit);
    const queryString = query.toString();
    return `/admin/services${queryString ? `?${queryString}` : ""}`;
  },
  CREATE_SERVICE: "/admin/services",
  UPDATE_SERVICE: (id) => `/admin/services/${id}`,
  DELETE_SERVICE: (id) => `/admin/services/${id}`,
};

// ============ FAQ MANAGEMENT ============
export const ADMIN_FAQ_ENDPOINTS = {
  GET_FAQS: (params = {}) => {
    const query = new URLSearchParams();
    if (params.page) query.append("page", params.page);
    if (params.limit) query.append("limit", params.limit);
    const queryString = query.toString();
    return `/admin/faqs${queryString ? `?${queryString}` : ""}`;
  },
  CREATE_FAQ: "/admin/faqs",
  UPDATE_FAQ: (id) => `/admin/faqs/${id}`,
  DELETE_FAQ: (id) => `/admin/faqs/${id}`,
};

// ============ PACKAGES MANAGEMENT ============
export const ADMIN_PACKAGES_ENDPOINTS = {
  GET_PACKAGES: "/admin/packages",
  CREATE_PACKAGE: "/admin/packages",
  UPDATE_PACKAGE: (id) => `/admin/packages/${id}`,
  DELETE_PACKAGE: (id) => `/admin/packages/${id}`,
};

// ============ PAGES CONTENT MANAGEMENT ============
export const ADMIN_PAGES_CONTENT_ENDPOINTS = {
  GET_CONTENT: "/admin/pages/content",
  CREATE_CONTENT: "/admin/pages/content",
  UPDATE_CONTENT: (id) => `/admin/pages/content/${id}`,
  DELETE_CONTENT: (id) => `/admin/pages/content/${id}`,
};

// ============ SITE SETTINGS MANAGEMENT ============
export const ADMIN_SETTINGS_ENDPOINTS = {
  GET_SETTINGS: "/pages/settings",
  UPDATE_SETTING: "/admin/pages/settings",
};

// ============ CONTACT INFO MANAGEMENT ============
export const ADMIN_CONTACT_INFO_ENDPOINTS = {
  GET_CONTACT_INFO: "/admin/pages/contact-info",
  CREATE_CONTACT_INFO: "/admin/pages/contact-info",
  UPDATE_CONTACT_INFO: (id) => `/admin/pages/contact-info/${id}`,
  DELETE_CONTACT_INFO: (id) => `/admin/pages/contact-info/${id}`,
};

// ============ BANNERS MANAGEMENT ============
export const ADMIN_BANNERS_ENDPOINTS = {
  GET_BANNERS: "/admin/banners",
  CREATE_BANNER: "/admin/banners",
  UPDATE_BANNER: (id) => `/admin/banners/${id}`,
  DELETE_BANNER: (id) => `/admin/banners/${id}`,
};

// ============ NEWS MANAGEMENT ============
export const ADMIN_NEWS_ENDPOINTS = {
  GET_NEWS: "/admin/news",
  CREATE_NEWS: "/admin/news",
  UPDATE_NEWS: (id) => `/admin/news/${id}`,
  DELETE_NEWS: (id) => `/admin/news/${id}`,
};

// ============ GALLERY MANAGEMENT ============
export const ADMIN_GALLERY_ENDPOINTS = {
  GET_GALLERY: "/admin/gallery",
  CREATE_GALLERY: "/admin/gallery",
  UPDATE_GALLERY: (id) => `/admin/gallery/${id}`,
  DELETE_GALLERY: (id) => `/admin/gallery/${id}`,
};







