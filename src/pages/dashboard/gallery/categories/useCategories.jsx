
import { useState } from "react";
import { message, Modal } from "antd";
import { mockCategories } from "../mockData";

export const useCategories = () => {
  const [data, setData] = useState(mockCategories);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);

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

      mockCategories.length = 0;
      mockCategories.push(...updated);
      message.success("تم تعديل التصنيف بنجاح");
    } else {
      const newRecord = {
        id: `cat_${Date.now()}`,
        ...values,
      };
      setData([newRecord, ...data]);
      mockCategories.push(newRecord);
      message.success("تم إضافة التصنيف بنجاح");
    }
    handleCloseModal();
  };

  const handleDelete = (record) => {
    Modal.confirm({
      title: "تأكيد الحذف",
      content: `هل أنت متأكد من حذف تصنيف "${record.label}"؟`,
      okText: "نعم، احذف",
      cancelText: "إلغاء",
      okButtonProps: { danger: true },
      onOk: () => {
        const filtered = data.filter((item) => item.id !== record.id);
        setData(filtered);
        mockCategories.length = 0;
        mockCategories.push(...filtered);
        message.success("تم الحذف بنجاح");
      },
    });
  };

  return {
    data,
    isModalVisible,
    editingRecord,
    handleOpenAdd,
    handleOpenEdit,
    handleCloseModal,
    handleSave,
    handleDelete,
  };
};
