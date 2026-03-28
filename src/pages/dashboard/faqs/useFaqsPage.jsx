// src/pages/dashboard/faqs/useFaqsPage.jsx
import { useState } from "react";
import { message, Modal } from "antd";

// البيانات المبدئية للأسئلة الشائعة
const initialMockData = [
  {
    id: 1,
    question: "كيف تتم عملية المطابقة؟",
    answer:
      "نقوم بدراسة ملفك الشخصي بعناية فائقة، ثم نستخدم نظاماً متقدماً لمطابقة المعايير الشخصية والثقافية والدينية. بعد ذلك نرشح لك أنسب الخيارات المتوافقة مع تطلعاتك.",
    relatedService: "البحث عن شريك",
  },
  {
    id: 2,
    question: "هل تقدمون باقات شاملة؟",
    answer:
      "نعم، نقدم باقات متنوعة تشمل تنظيم حفلات الزفاف الكاملة من الألف إلى الياء، بما في ذلك التصوير، الديكور، الإضاءة، الموسيقى.",
    relatedService: "عام",
  },
  {
    id: 3,
    question: "هل التصوير يشمل داخلي وخارجي؟",
    answer:
      "بالتأكيد! باقاتنا للتصوير تشمل جلسات داخلية في قاعات الأفراح وجلسات خارجية في أجمل المواقع الطبيعية أو التاريخية.",
    relatedService: "تصوير المناسبات",
  },
  {
    id: 4,
    question: "هل يمكن الدفع بالتقسيط؟",
    answer:
      "نعم، نوفر خيارات دفع مرنة تشمل الدفع بالتقسيط على عدة أشهر، حسب الباقة المختارة. نهدف لتسهيل عملية التخطيط المالي.",
    relatedService: "عام",
  },
  {
    id: 5,
    question: "ماذا يحدث في حال إلغاء الحجز؟",
    answer:
      "سياسة الإلغاء تختلف حسب وقت الإلغاء ونوع الباقة. في حال الإلغاء قبل موعد الفعالية بفترة كافية، يمكن استرداد جزء من المبلغ.",
    relatedService: "حجز صالة الأفراح",
  },
  {
    id: 6,
    question: "هل الفرق الاستعراضية خاصة بكم؟",
    answer:
      "نتعاون مع أفضل الفرق الاستعراضية والفنية في المنطقة، ونضمن لك تجربة ترفيهية احترافية ومميزة. يمكنك اختيار نوع العروض.",
    relatedService: "فرقة العراضة الشامية رجال",
  },
];

// قائمة الخدمات الافتراضية اللي هتظهر في الـ Select
const defaultServices = [
  "عام",
  "البحث عن شريك",
  "حجز صالة الأفراح",
  "بوفيه طعام",
  "تصوير المناسبات",
  "فرقة العراضة الشامية رجال",
];

export const useFaqsPage = () => {
  const [data, setData] = useState(initialMockData);
  const [servicesList, setServicesList] = useState(defaultServices);
  const [loading, setLoading] = useState(false);

  // Modal States
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
        // تعديل
        const updatedData = data.map((item) =>
          item.id === editingRecord.id ? { ...item, ...values } : item
        );
        setData(updatedData);
        message.success("تم تعديل السؤال بنجاح");
      } else {
        // إضافة
        const newRecord = {
          ...values,
          id: Date.now(),
        };
        setData([newRecord, ...data]);
        message.success("تم إضافة السؤال بنجاح");
      }

      setLoading(false);
      handleCloseModal();
    }, 500);
  };

  const handleDelete = (record) => {
    Modal.confirm({
      title: "تأكيد الحذف",
      content: `هل أنت متأكد من حذف سؤال "${record.question}"؟`,
      okText: "نعم، احذف",
      cancelText: "إلغاء",
      okButtonProps: { danger: true },
      onOk: () => {
        const newData = data.filter((item) => item.id !== record.id);
        setData(newData);
        message.success("تم حذف السؤال بنجاح");
      },
    });
  };

  return {
    data,
    loading,
    servicesList,
    setServicesList,
    isModalVisible,
    editingRecord,
    handleOpenAdd,
    handleOpenEdit,
    handleCloseModal,
    handleSave,
    handleDelete,
  };
};
