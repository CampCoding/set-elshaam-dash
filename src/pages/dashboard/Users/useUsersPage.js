import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { message, Modal } from "antd";
import { usersService } from "../../../api/services/users.service";

export const useUsersPage = () => {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Modal states
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [isDetailsModalVisible, setIsDetailsModalVisible] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);

  const fetchUsers = async (page = 1, limit = 10) => {
    setLoading(true);
    try {
      const response = await usersService.getUsers(page, limit);
      setData(response.data || []);
      setTotal(response.pagination?.total || (response.data?.length || 0));
    } catch (error) {
      console.error("Fetch Users Error:", error);
      message.error("فشل في جلب قائمة المستخدمين");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers(currentPage, pageSize);
  }, [currentPage, pageSize]);

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

  const handleCloseDetails = () => {
    setIsDetailsModalVisible(false);
    setSelectedRecord(null);
  };

  const handleSave = async (dataToSave) => {
    setLoading(true);
    try {
      if (editingRecord) {
        // Handle update
        // If it's FormData, get ID from it or use editingRecord.id
        const id = (dataToSave instanceof FormData) ? editingRecord.id : editingRecord.id;
        await usersService.updateUser(id, dataToSave);
        message.success("تم تحديث بيانات المستخدم بنجاح");
      } else {
        // Handle create
        await usersService.createUser(dataToSave);
        message.success("تم إضافة المستخدم بنجاح");
      }
      setIsModalVisible(false);
      fetchUsers(currentPage, pageSize);
    } catch (error) {
      console.error("Save User Error:", error);
      message.error(editingRecord ? "فشل تحديث المستخدم" : "فشل إضافة المستخدم");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (record) => {
    Modal.confirm({
      title: "هل أنت متأكد من حذف هذا المستخدم؟",
      content: "سيتم حذف كافة البيانات المرتبطة بهذا المستخدم نهائياً.",
      okText: "حذف",
      okType: "danger",
      cancelText: "إلغاء",
      onOk: async () => {
        try {
          await usersService.deleteUser(record.id);
          message.success("تم حذف المستخدم بنجاح");
          fetchUsers(currentPage, pageSize);
        } catch (error) {
          message.error("فشل في حذف المستخدم");
        }
      },
    });
  };

  const handleToggleBlock = async (record) => {
    try {
      await usersService.toggleBlock(record.id);
      message.success(record.is_verified ? "تم حظر المستخدم" : "تم إلغاء حظر المستخدم");
      fetchUsers(currentPage, pageSize);
    } catch (error) {
      message.error("حدث خطأ أثناء تغيير حالة المستخدم");
    }
  };

  return {
    data,
    loading,
    total,
    currentPage,
    pageSize,
    setCurrentPage,
    setPageSize,
    isModalVisible,
    editingRecord,
    handleOpenAdd,
    handleOpenEdit,
    handleCloseModal,
    handleSave,
    handleDelete,
    handleToggleBlock,
    isDetailsModalVisible,
    selectedRecord,
    handleOpenDetails,
    handleCloseDetails,
  };
};
