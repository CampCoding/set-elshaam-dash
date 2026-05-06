
import { useState, useEffect } from "react";
import { message, Modal } from "antd";
import newsService from "../../../api/services/news.service";

export const useNews = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);


  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);

  const fetchNews = async () => {
    setLoading(true);
    try {
      const res = await newsService.getNews();
      setData(res.data || []);
    } catch (error) {
      console.error("Error fetching news:", error);
      message.error("فشل في جلب الأخبار");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
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
    formData.append("title_ar", values.title_ar);
    formData.append("slug", values.slug);
    formData.append("summary_ar", values.summary_ar);
    formData.append("content_ar", values.content_ar);
    formData.append("category_ar", values.category_ar);

    if (values.image_file) {
      formData.append("image", values.image_file);
    }

    try {
      if (editingRecord) {
        await newsService.updateNews(editingRecord.id, formData);
        message.success("تم تحديث الخبر بنجاح");
      } else {
        await newsService.createNews(formData);
        message.success("تم إضافة الخبر بنجاح");
      }
      fetchNews();
      handleCloseModal();
    } catch (error) {
      console.error("Error saving news:", error);
      message.error("فشل في حفظ الخبر");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (record) => {
    Modal.confirm({
      title: "تأكيد الحذف",
      content: `هل أنت متأكد من حذف الخبر "${record.title_ar}"؟`,
      okText: "نعم، احذف",
      cancelText: "إلغاء",
      okButtonProps: { danger: true },
      onOk: async () => {
        try {
          await newsService.deleteNews(record.id);
          message.success("تم حذف الخبر بنجاح");
          fetchNews();
        } catch (error) {
          console.error("Error deleting news:", error);
          message.error("فشل في حذف الخبر");
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
