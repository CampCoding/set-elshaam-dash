// src/pages/dashboard/Profiles/useProfilesPage.js
import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { message, Modal } from "antd";
import useDebounce from "../../../hooks/useDebounce";
import useUrlFilters from "../../../hooks/useUrlFilters";
import { profilesService } from "../../../api/services/profiles.service";

// Configuration for URL filters
const URL_FILTERS_CONFIG = {
  defaultValues: {
    page: 1,
    limit: 10,
    search: "",
    gender: null,
    marital_status: null,
    nationality: null,
    is_verified: null,
    is_smoker: null,
    religion_commitment: null,
    income_source: null,
  },
  numericFields: ["page", "limit"],
  booleanFields: ["is_verified", "is_smoker"],
};

export const useProfilesPage = () => {
  const navigate = useNavigate();
  const isFirstRender = useRef(true);

  // URL Filters Hook
  const {
    params: urlParams,
    setParams,
    resetParams,
    hasActiveFilters,
    activeFiltersCount,
  } = useUrlFilters(URL_FILTERS_CONFIG);

  // Data States
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);

  // Modal States
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);

  // Payment Modal States
  const [isPaymentModalVisible, setIsPaymentModalVisible] = useState(false);
  const [paymentRecord, setPaymentRecord] = useState(null);

  // Local search state (for input control)
  const [searchValue, setSearchValue] = useState(urlParams.search || "");
  const debouncedSearch = useDebounce(searchValue, 500);

  // Derived filters object (for UI)
  const filters = useMemo(
    () => ({
      gender: urlParams.gender,
      marital_status: urlParams.marital_status,
      nationality: urlParams.nationality,
      is_verified: urlParams.is_verified,
      is_smoker: urlParams.is_smoker,
      religion_commitment: urlParams.religion_commitment,
      income_source: urlParams.income_source,
    }),
    [urlParams]
  );

  // Table params (for DataTable)
  const tableParams = useMemo(
    () => ({
      page: urlParams.page || 1,
      limit: urlParams.limit || 10,
      type: "main",
    }),
    [urlParams.page, urlParams.limit]
  );

  // Build API params
  const buildApiParams = useCallback(() => {
    const apiParams = {
      page: urlParams.page || 1,
      limit: urlParams.limit || 10,
      type: "main",
    };

    // Add search
    if (urlParams.search) {
      apiParams.search = urlParams.search;
    }

    // Add filters (only non-null values)
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== "") {
        apiParams[key] = value;
      }
    });

    return apiParams;
  }, [urlParams, filters]);

  // Fetch Profiles
  const fetchProfiles = useCallback(async () => {
    setLoading(true);
    try {
      const apiParams = buildApiParams();
      const response = await profilesService.getProfiles(apiParams);

      setData(response.data || []);
      setTotal(response.pagination?.total || 0);
    } catch (error) {
      console.error("Fetch Profiles Error:", error);
      message.error("فشل في جلب قائمة البروفايلات");
    } finally {
      setLoading(false);
    }
  }, [buildApiParams]);

  // Fetch on URL params change
  useEffect(() => {
    fetchProfiles();
  }, [fetchProfiles]);

  // Sync debounced search to URL
  useEffect(() => {
    // Skip first render to avoid unnecessary URL update
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    // Only update if value actually changed
    if (debouncedSearch !== (urlParams.search || "")) {
      setParams({ search: debouncedSearch || null }, { resetPage: true });
    }
  }, [debouncedSearch]);

  // Sync URL search to local state when URL changes externally
  useEffect(() => {
    const urlSearch = urlParams.search || "";
    if (urlSearch !== searchValue && !isFirstRender.current) {
      setSearchValue(urlSearch);
    }
  }, [urlParams.search]);

  // ============ Handlers ============

  // Search handler
  const handleSearch = useCallback((value) => {
    setSearchValue(value);
  }, []);

  // Filter change handler
  const handleFilterChange = useCallback(
    (key, value) => {
      setParams({ [key]: value ?? null }, { resetPage: true });
    },
    [setParams]
  );

  // Reset all filters
  const handleResetFilters = useCallback(() => {
    setSearchValue("");
    resetParams();
  }, [resetParams]);

  // Table pagination change
  const handleTableChange = useCallback(
    (pagination) => {
      setParams({
        page: pagination.current,
        limit: pagination.pageSize,
      });
    },
    [setParams]
  );

  // Refresh data
  const handleRefresh = useCallback(() => {
    fetchProfiles();
  }, [fetchProfiles]);

  // ============ Modal Handlers ============

  const handleOpenAdd = useCallback(() => {
    setEditingRecord(null);
    setIsModalVisible(true);
  }, []);

  const handleOpenEdit = useCallback((record) => {
    setEditingRecord(record);
    setIsModalVisible(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setIsModalVisible(false);
    setEditingRecord(null);
  }, []);

  const handleViewProfile = useCallback(
    (record) => {
      navigate(`/users/${record.user_id}`);
    },
    [navigate]
  );

  const handleOpenPayment = useCallback((record) => {
    setPaymentRecord(record);
    setIsPaymentModalVisible(true);
  }, []);

  const handleClosePayment = useCallback(() => {
    setIsPaymentModalVisible(false);
    setPaymentRecord(null);
  }, []);

  const handleSendInvoice = useCallback((stage) => {
    setTimeout(() => {
      message.success(`تم إرسال فاتورة ${stage.title} بنجاح`);
    }, 500);
  }, []);

  const handleSave = useCallback(
    async (dataToSave) => {
      setLoading(true);
      try {
        if (editingRecord) {
          await profilesService.updateProfile(
            editingRecord.user_id,
            dataToSave
          );
          message.success("تم تحديث البروفايل بنجاح");
        }
        setIsModalVisible(false);
        setEditingRecord(null);
        fetchProfiles();
      } catch (error) {
        console.error("Save Profile Error:", error);
        message.error("فشل تحديث البروفايل");
      } finally {
        setLoading(false);
      }
    },
    [editingRecord, fetchProfiles]
  );

  const handleDelete = useCallback(
    (record) => {
      Modal.confirm({
        title: "هل أنت متأكد من حذف هذا البروفايل؟",
        content: `سيتم حذف بروفايل "${record.full_name}" نهائياً.`,
        okText: "حذف",
        okType: "danger",
        cancelText: "إلغاء",
        centered: true,
        onOk: async () => {
          try {
            await profilesService.deleteProfile(record.user_id);
            message.success("تم حذف البروفايل بنجاح");
            fetchProfiles();
          } catch (error) {
            message.error("فشل في حذف البروفايل");
          }
        },
      });
    },
    [fetchProfiles]
  );

  const handleToggleVerify = useCallback(
    async (record) => {
      try {
        await profilesService.toggleVerify(record.user_id);
        message.success(
          record.is_verified
            ? "تم إلغاء التحقق من البروفايل"
            : "تم التحقق من البروفايل"
        );
        fetchProfiles();
      } catch (error) {
        message.error("حدث خطأ أثناء تغيير حالة التحقق");
      }
    },
    [fetchProfiles]
  );

  const handleToggleBlock = useCallback(
    async (record) => {
      try {
        await profilesService.toggleBlock(record.user_id);
        message.success("تم تغيير حالة الحظر");
        fetchProfiles();
      } catch (error) {
        message.error("حدث خطأ أثناء تغيير حالة الحظر");
      }
    },
    [fetchProfiles]
  );

  return {
    // Data
    data,
    loading,
    total,

    // Search
    searchValue,
    handleSearch,

    // Table
    tableParams,
    handleTableChange,

    // Filters
    filters,
    handleFilterChange,
    handleResetFilters,
    handleRefresh,

    // Filter indicators
    hasActiveFilters,
    activeFiltersCount,

    // Modal
    isModalVisible,
    editingRecord,
    handleOpenAdd,
    handleOpenEdit,
    handleCloseModal,
    handleSave,

    // Actions
    handleDelete,
    handleToggleVerify,
    handleToggleBlock,
    handleViewProfile,

    // Payment Modal
    isPaymentModalVisible,
    paymentRecord,
    handleOpenPayment,
    handleClosePayment,
    handleSendInvoice,
  };
};
