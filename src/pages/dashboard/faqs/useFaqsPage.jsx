// src/pages/dashboard/faqs/useFaqsPage.jsx
import { useState, useEffect } from "react";
import { message, Modal } from "antd";
import faqsService from "../../../api/services/faqs.service";

export const useFaqsPage = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  // Modal States
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);

  const fetchFaqs = async (page = pagination.current, limit = pagination.pageSize) => {
    setLoading(true);
    try {
      const res = await faqsService.getFaqs({ page, limit });
      setData(res.data || []);
      setPagination({
        ...pagination,
        current: page,
        total: res.total || res.data?.length || 0,
      });
    } catch (error) {
      console.error("Error fetching FAQs:", error);
      message.error("فشل في جلب الأسئلة الشائعة");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFaqs();
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
      question_ar: values.question_ar || values.question,
      answer_ar: values.answer_ar || values.answer,
      order_index: values.order_index || 0,
    };

    try {
      if (editingRecord) {
        await faqsService.updateFaq(editingRecord.id, payload);
        message.success("تم تعديل السؤال بنجاح");
      } else {
        await faqsService.createFaq(payload);
        message.success("تم إضافة السؤال بنجاح");
      }
      fetchFaqs();
      handleCloseModal();
    } catch (error) {
      console.error("Error saving FAQ:", error);
      message.error("فشل في حفظ السؤال");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (record) => {
    Modal.confirm({
      title: "تأكيد الحذف",
      content: `هل أنت متأكد من حذف سؤال "${record.question_ar || record.question}"؟`,
      okText: "نعم، احذف",
      cancelText: "إلغاء",
      okButtonProps: { danger: true },
      onOk: async () => {
        try {
          await faqsService.deleteFaq(record.id);
          message.success("تم حذف السؤال بنجاح");
          fetchFaqs();
        } catch (error) {
          console.error("Error deleting FAQ:", error);
          message.error("فشل في حذف السؤال");
        }
      },
    });
  };

  return {
    data,
    loading,
    pagination,
    fetchFaqs,
    isModalVisible,
    editingRecord,
    handleOpenAdd,
    handleOpenEdit,
    handleCloseModal,
    handleSave,
    handleDelete,
  };
};
