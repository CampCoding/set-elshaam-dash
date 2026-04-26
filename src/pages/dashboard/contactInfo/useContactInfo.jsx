// src/pages/dashboard/contactInfo/useContactInfo.jsx
import { useState, useEffect } from "react";
import { message, Modal } from "antd";
import contactInfoService from "../../../api/services/contactInfo.service";

export const useContactInfo = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  // Modal States
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);

  const fetchContactInfo = async () => {
    setLoading(true);
    try {
      const res = await contactInfoService.getContactInfo();
      setData(res.data || []);
    } catch (error) {
      console.error("Error fetching contact info:", error);
      message.error("فشل في جلب بيانات التواصل");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContactInfo();
  }, []);

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

  const handleSave = async (values) => {
    setLoading(true);
    const formData = new FormData();
    formData.append("type", values.type);
    formData.append("value", values.value);
    
    if (values.icon_file) {
      formData.append("icon", values.icon_file);
    }

    if (editingRecord) {
      formData.append("is_active", values.is_active ? "1" : "0");
    }

    try {
      if (editingRecord) {
        await contactInfoService.updateContactInfo(editingRecord.id, formData);
        message.success("تم تحديث بيانات التواصل بنجاح");
      } else {
        await contactInfoService.createContactInfo(formData);
        message.success("تم إضافة بيانات التواصل بنجاح");
      }
      fetchContactInfo();
      handleCloseModal();
    } catch (error) {
      console.error("Error saving contact info:", error);
      message.error("فشل في حفظ البيانات");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (record) => {
    Modal.confirm({
      title: "تأكيد الحذف",
      content: `هل أنت متأكد من حذف "${record.value}"؟`,
      okText: "نعم، احذف",
      cancelText: "إلغاء",
      okButtonProps: { danger: true },
      onOk: async () => {
        try {
          await contactInfoService.deleteContactInfo(record.id);
          message.success("تم الحذف بنجاح");
          fetchContactInfo();
        } catch (error) {
          console.error("Error deleting contact info:", error);
          message.error("فشل في حذف البيانات");
        }
      },
    });
  };

  return {
    data,
    loading,
    isModalVisible,
    editingRecord,
    handleOpenAdd,
    handleOpenEdit,
    handleCloseModal,
    handleSave,
    handleDelete,
  };
};
