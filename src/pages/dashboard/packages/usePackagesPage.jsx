// src/pages/dashboard/packages/usePackagesPage.jsx
import { useState } from "react";
import { message, Modal } from "antd";

// البيانات المبدئية للباقات
const initialMockData = [
  {
    id: 1,
    name: "الباقة الملكية",
    price: "1200",
    services: [
      "البحث عن شريك",
      "فرقة زفة ودقة ستي للسيدات",
      "فرقة العراضة الشامية رجال",
      "تأجير بدلات",
    ],
  },
  {
    id: 2,
    name: "الباقة المميزة",
    price: "900",
    services: [
      "البحث عن شريك",
      "فرقة زفة ودقة ستي للسيدات",
      "فرقة العراضة الشامية رجال",
      "تأجير بدلات",
    ],
  },
  {
    id: 3,
    name: "الباقة الاقتصادية",
    price: "500",
    services: [
      "البحث عن شريك",
      "فرقة زفة ودقة ستي للسيدات",
      "فرقة العراضة الشامية رجال",
      "تأجير بدلات",
    ],
  },
];

// قائمة بكل الخدمات المتاحة في النظام (للاستخدام في الـ Select)
export const availableServicesList = [
  "البحث عن شريك",
  "حجز صالة الأفراح",
  "بوفيه طعام",
  "فرقة زفة ودقة ستي للسيدات",
  "زغاريد",
  "فرقة العراضة الشامية رجال",
  "تأجير بدلات",
  "تصوير المناسبات",
  "DJ",
];

export const usePackagesPage = () => {
  const [data, setData] = useState(initialMockData);
  const [loading, setLoading] = useState(false);

  // Modal States
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);

  // 1. فتح مودال الإضافة
  const handleOpenAdd = () => {
    setEditingRecord(null);
    setIsModalVisible(true);
  };

  // 2. فتح مودال التعديل
  const handleOpenEdit = (record) => {
    setEditingRecord(record);
    setIsModalVisible(true);
  };

  // 3. إغلاق المودال
  const handleCloseModal = () => {
    setIsModalVisible(false);
    setEditingRecord(null);
  };

  // 4. حفظ البيانات (إضافة أو تعديل)
  const handleSave = (values) => {
    setLoading(true);

    setTimeout(() => {
      if (editingRecord) {
        // تعديل
        const updatedData = data.map((item) =>
          item.id === editingRecord.id ? { ...item, ...values } : item
        );
        setData(updatedData);
        message.success("تم تعديل الباقة بنجاح");
      } else {
        // إضافة
        const newRecord = {
          ...values,
          id: Date.now(), // ID وهمي
        };
        setData([newRecord, ...data]);
        message.success("تم إضافة الباقة بنجاح");
      }

      setLoading(false);
      handleCloseModal();
    }, 500);
  };

  // 5. حذف عنصر
  const handleDelete = (record) => {
    Modal.confirm({
      title: "تأكيد الحذف",
      content: `هل أنت متأكد من حذف "${record.name}"؟`,
      okText: "نعم، احذف",
      cancelText: "إلغاء",
      okButtonProps: { danger: true },
      onOk: () => {
        const newData = data.filter((item) => item.id !== record.id);
        setData(newData);
        message.success("تم حذف الباقة بنجاح");
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
