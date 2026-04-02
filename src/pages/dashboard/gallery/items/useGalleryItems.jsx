// src/pages/dashboard/gallery/items/useGalleryItems.jsx
import { useState } from "react";
import { message, Modal } from "antd";
import { mockGalleryItems, mockCategories } from "../mockData";

export const useGalleryItems = () => {
  const [data, setData] = useState(mockGalleryItems);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);

  // نجلب التصنيفات الحديثة من الـ Mock Data
  const categories = mockCategories;

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

  const handleSave = (values) => {
    if (editingRecord) {
      const updated = data.map((item) =>
        item.id === editingRecord.id ? { ...item, ...values } : item
      );
      setData(updated);
      message.success("تم تعديل الصورة بنجاح");
    } else {
      const newRecord = { id: Date.now(), ...values };
      setData([newRecord, ...data]);
      message.success("تم إضافة الصورة بنجاح");
    }
    handleCloseModal();
  };

  const handleDelete = (record) => {
    Modal.confirm({
      title: "تأكيد الحذف",
      content: "هل أنت متأكد من الحذف؟",
      okText: "نعم",
      cancelText: "إلغاء",
      okButtonProps: { danger: true },
      onOk: () => {
        setData(data.filter((item) => item.id !== record.id));
        message.success("تم الحذف");
      },
    });
  };

  const getCategoryLabel = (catId) => {
    return categories.find((c) => c.id === catId)?.label || catId;
  };

  return {
    data,
    categories,
    getCategoryLabel,
    isModalVisible,
    editingRecord,
    handleOpenAdd,
    handleOpenEdit,
    handleCloseModal,
    handleSave,
    handleDelete,
  };
};
