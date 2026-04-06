// src/pages/dashboard/Users/useUsersPage.js
import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { message, Modal } from "antd";
import { usersService } from "../../../api/services/users.service";
import useDebounce from "../../../hooks/useDebounce";

export const useUsersPage = () => {
  const navigate = useNavigate();

  // Data States
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);

  // Search State (separate for debounce)
  const [searchValue, setSearchValue] = useState("");
  const debouncedSearch = useDebounce(searchValue, 500);

  // Pagination & Filters
  const [tableParams, setTableParams] = useState({
    page: 1,
    limit: 10,
    gender: null,
    has_profile: null,
    has_target_profile: null,
    is_verified: null,
    sort_by: "created_at",
    sort_order: "desc",
  });

  // Modal States
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);

  // Fetch Users
  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      // Build params with debounced search
      const params = {
        ...tableParams,
        search: debouncedSearch || undefined,
      };

      // Clean params - remove null/empty values
      Object.keys(params).forEach((key) => {
        const value = params[key];
        if (value === null || value === "" || value === undefined) {
          delete params[key];
        }
      });

      const response = await usersService.getUsers(params);

      setData(response.data || []);
      setTotal(response.pagination?.total || response.data?.length || 0);
    } catch (error) {
      console.error("Fetch Users Error:", error);
      message.error("فشل في جلب قائمة المستخدمين");
    } finally {
      setLoading(false);
    }
  }, [tableParams, debouncedSearch]);

  // Fetch when params or debounced search changes
  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Reset page to 1 when search changes
  useEffect(() => {
    if (debouncedSearch !== undefined) {
      setTableParams((prev) => ({
        ...prev,
        page: 1,
      }));
    }
  }, [debouncedSearch]);

  // ============ Table Change Handler ============
  const handleTableChange = (pagination, filters, sorter) => {
    setTableParams((prev) => ({
      ...prev,
      page: pagination.current || 1,
      limit: pagination.pageSize || 10,
      // Filters from table columns
      gender: filters.gender?.[0] || null,
      has_profile: filters.has_profile?.[0] ?? null,
      is_verified: filters.is_verified?.[0] ?? null,
      // Sorting
      sort_by: sorter.field || "created_at",
      sort_order: sorter.order === "ascend" ? "asc" : "desc",
    }));
  };

  // ============ Search Handler (just update local state) ============
  const handleSearch = (value) => {
    setSearchValue(value);
  };

  // ============ Modal Handlers ============
  const handleOpenAdd = () => {
    setEditingRecord(null);
    setIsModalVisible(true);
  };

  const handleOpenEdit = (record) => {
    setEditingRecord(record);
    setIsModalVisible(true);
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
    setEditingRecord(null);
  };

  const handleOpenDetails = (record) => {
    navigate(`/users/${record.id}`);
  };

  // ============ CRUD Handlers ============
  const handleSave = async (dataToSave) => {
    setLoading(true);
    try {
      if (editingRecord) {
        await usersService.updateUser(editingRecord.id, dataToSave);
        message.success("تم تحديث بيانات المستخدم بنجاح");
      } else {
        await usersService.createUser(dataToSave);
        message.success("تم إضافة المستخدم بنجاح");
      }
      setIsModalVisible(false);
      setEditingRecord(null);
      fetchUsers();
    } catch (error) {
      console.error("Save User Error:", error);
      message.error(
        editingRecord ? "فشل تحديث المستخدم" : "فشل إضافة المستخدم"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (record) => {
    Modal.confirm({
      title: "هل أنت متأكد من حذف هذا المستخدم؟",
      content: `سيتم حذف "${record.full_name}" وكافة البيانات المرتبطة به نهائياً.`,
      okText: "حذف",
      okType: "danger",
      cancelText: "إلغاء",
      centered: true,
      onOk: async () => {
        try {
          await usersService.deleteUser(record.id);
          message.success("تم حذف المستخدم بنجاح");
          fetchUsers();
        } catch (error) {
          message.error("فشل في حذف المستخدم");
        }
      },
    });
  };

  const handleToggleBlock = async (record) => {
    try {
      const response = await usersService.toggleBlock(record.id);
      message.success(response.message || "تم تغيير حالة المستخدم");
      fetchUsers();
    } catch (error) {
      message.error("حدث خطأ أثناء تغيير حالة المستخدم");
    }
  };

  const handleRefresh = () => {
    fetchUsers();
  };

  // ============ Clear Search ============
  const handleClearSearch = () => {
    setSearchValue("");
  };

  return {
    // Data
    data,
    loading,
    total,

    // Table Params
    tableParams,
    handleTableChange,

    // Search (with debounce)
    searchValue,
    handleSearch,
    handleClearSearch,

    // Modal
    isModalVisible,
    editingRecord,
    handleOpenAdd,
    handleOpenEdit,
    handleCloseModal,
    handleSave,

    // Actions
    handleDelete,
    handleToggleBlock,
    handleOpenDetails,
    handleRefresh,
  };
};
