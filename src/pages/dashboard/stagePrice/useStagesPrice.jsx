// src/pages/dashboard/stagePrice/useStagesPrice.jsx
import { useState } from "react";
import { message, Modal } from "antd";

const initialMockData = [
  {
    id: 1,
    name: "المرحلة الأولى - تقديم الطلب",
    price: 500,
    description: "تشمل هذه المرحلة تقديم الطلب.",
    status: "active",
  },
  {
    id: 2,
    name: "المرحلة الثانية - قبول الطلب وجاري البحث عن شريك",
    price: 1500,
    description: "تشمل هذه المرحلة قبول الطلب وجاري البحث عن شريك.",
    status: "active",
  },
  {
    id: 3,
    name: "المرحلة الثالثة - نزول مقابلة بين الطرفين",
    price: 5000,
    description: "تشمل هذه المرحلة نزول مقابلة بين الطرفين.",
    status: "inactive",
  },
];

export const useStagesPrice = () => {
  const [data, setData] = useState(initialMockData);
  const [loading, setLoading] = useState(false);

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
    setLoading(true);
    setTimeout(() => {
      if (editingRecord) {
        const updatedData = data.map((item) =>
          item.id === editingRecord.id ? { ...item, ...values } : item
        );
        setData(updatedData);
        message.success("تم تعديل المرحلة بنجاح");
      } else {
        const newRecord = {
          ...values,
          id: Date.now(),
        };
        setData([newRecord, ...data]);
        message.success("تم إضافة المرحلة بنجاح");
      }
      setLoading(false);
      handleCloseModal();
    }, 500);
  };

  const handleDelete = (record) => {
    Modal.confirm({
      title: "تأكيد الحذف",
      content: `هل أنت متأكد من حذف مرحلة "${record.name}"؟`,
      okText: "نعم، احذف",
      cancelText: "إلغاء",
      okButtonProps: { danger: true },
      onOk: () => {
        const newData = data.filter((item) => item.id !== record.id);
        setData(newData);
        message.success("تم حذف المرحلة بنجاح");
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
