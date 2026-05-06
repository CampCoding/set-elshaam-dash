
import { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { message, Modal } from "antd";
import { usersService } from "../../../api/services/users.service";
import useDebounce from "../../../hooks/useDebounce";

const parseNullableNumber = (value) => {
  if (value === null || value === undefined || value === "") return null;
  const num = Number(value);
  return Number.isNaN(num) ? null : num;
};

const cleanObject = (obj) =>
  Object.fromEntries(
    Object.entries(obj).filter(
      ([, value]) => value !== null && value !== undefined && value !== ""
    )
  );

const getStateFromSearchParams = (searchParams) => ({
  search: searchParams.get("search") || "",
  page: Number(searchParams.get("page") || 1),
  limit: Number(searchParams.get("limit") || 10),
  gender: searchParams.get("gender") || null,
  has_profile: parseNullableNumber(searchParams.get("has_profile")),
  has_target_profile: parseNullableNumber(
    searchParams.get("has_target_profile")
  ),
  is_verified: parseNullableNumber(searchParams.get("is_verified")),
  sort_by: searchParams.get("sort_by") || "created_at",
  sort_order: searchParams.get("sort_order") || "desc",
});

export const useUsersPage = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();


  const initialState = useMemo(
    () => getStateFromSearchParams(searchParams),

    []
  );


  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);


  const [searchValue, setSearchValue] = useState(initialState.search);
  const debouncedSearch = useDebounce(searchValue, 500);


  const [tableParams, setTableParams] = useState({
    page: initialState.page,
    limit: initialState.limit,
    gender: initialState.gender,
    has_profile: initialState.has_profile,
    has_target_profile: initialState.has_target_profile,
    is_verified: initialState.is_verified,
    sort_by: initialState.sort_by,
    sort_order: initialState.sort_order,
  });


  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);


  const requestParams = useMemo(() => {
    return cleanObject({
      ...tableParams,
      search: debouncedSearch || null,
    });
  }, [tableParams, debouncedSearch]);


  useEffect(() => {
    const urlParams = cleanObject({
      ...tableParams,
      search: debouncedSearch || null,
    });

    setSearchParams(urlParams, { replace: true });
  }, [tableParams, debouncedSearch, setSearchParams]);


  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const response = await usersService.getUsers(requestParams);

      setData(response.data || []);
      setTotal(response.pagination?.total || response.data?.length || 0);
    } catch (error) {
      console.error("Fetch Users Error:", error);
      message.error("فشل في جلب قائمة المستخدمين");
    } finally {
      setLoading(false);
    }
  }, [requestParams]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);


  const handleTableChange = useCallback((pagination, filters, sorter) => {
    setTableParams((prev) => ({
      ...prev,
      page: pagination.current || 1,
      limit: pagination.pageSize || 10,


      gender: filters.gender?.[0] || null,
      has_profile: filters.has_profile?.[0] ?? null,
      is_verified: filters.is_verified?.[0] ?? null,


      sort_by: sorter?.field || "created_at",
      sort_order: sorter?.order === "ascend" ? "asc" : "desc",
    }));
  }, []);


  const handleSearch = useCallback((value) => {
    setSearchValue(value);


    setTableParams((prev) => (prev.page === 1 ? prev : { ...prev, page: 1 }));
  }, []);

  const handleClearSearch = useCallback(() => {
    setSearchValue("");
    setTableParams((prev) => (prev.page === 1 ? prev : { ...prev, page: 1 }));
  }, []);


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

  const handleOpenDetails = useCallback(
    (record) => {
      navigate(`/users/${record.id}`);
    },
    [navigate]
  );


  const handleSave = useCallback(
    async (dataToSave) => {
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
        await fetchUsers();
      } catch (error) {
        console.error("Save User Error:", error);
        message.error(
          editingRecord ? "فشل تحديث المستخدم" : "فشل إضافة المستخدم"
        );
      } finally {
        setLoading(false);
      }
    },
    [editingRecord, fetchUsers]
  );

  const handleDelete = useCallback(
    (record) => {
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
    },
    [fetchUsers]
  );

  const handleToggleBlock = useCallback(
    async (record) => {
      try {
        const response = await usersService.toggleBlock(record.id);
        message.success(response.message || "تم تغيير حالة المستخدم");
        fetchUsers();
      } catch (error) {
        message.error("حدث خطأ أثناء تغيير حالة المستخدم");
      }
    },
    [fetchUsers]
  );

  const handleRefresh = useCallback(() => {
    fetchUsers();
  }, [fetchUsers]);

  return {
    data,
    loading,
    total,

    tableParams,
    handleTableChange,

    searchValue,
    handleSearch,
    handleClearSearch,

    isModalVisible,
    editingRecord,
    handleOpenAdd,
    handleOpenEdit,
    handleCloseModal,
    handleSave,

    handleDelete,
    handleToggleBlock,
    handleOpenDetails,
    handleRefresh,
  };
};
