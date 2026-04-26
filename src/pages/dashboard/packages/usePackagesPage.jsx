// src/pages/dashboard/packages/usePackagesPage.jsx
import { useState, useEffect } from "react";
import { message, Modal } from "antd";
import packagesService from "../../../api/services/packages.service";

export const usePackagesPage = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  // Modal States
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);

  const fetchPackages = async () => {
    setLoading(true);
    try {
      const res = await packagesService.getPackages();
      setData(res.data || []);
    } catch (error) {
      console.error("Error fetching packages:", error);
      message.error("فشل في جلب الباقات");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPackages();
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
    
    // Mapping UI fields to API fields
    const payload = {
      name_ar: values.name_ar || values.name,
      features_ar: values.features_ar || values.services || [],
      price_text_ar: values.price_text_ar || values.price,
      is_active: values.is_active !== undefined ? (values.is_active ? 1 : 0) : 1,
    };

    try {
      if (editingRecord) {
        await packagesService.updatePackage(editingRecord.id, payload);
        message.success("تم تعديل الباقة بنجاح");
      } else {
        await packagesService.createPackage(payload);
        message.success("تم إضافة الباقة بنجاح");
      }
      fetchPackages();
      handleCloseModal();
    } catch (error) {
      console.error("Error saving package:", error);
      message.error("فشل في حفظ الباقة");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (record) => {
    Modal.confirm({
      title: "تأكيد الحذف",
      content: `هل أنت متأكد من حذف "${record.name_ar || record.name}"؟`,
      okText: "نعم، احذف",
      cancelText: "إلغاء",
      okButtonProps: { danger: true },
      onOk: async () => {
        try {
          await packagesService.deletePackage(record.id);
          message.success("تم حذف الباقة بنجاح");
          fetchPackages();
        } catch (error) {
          console.error("Error deleting package:", error);
          message.error("فشل في حذف الباقة");
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
