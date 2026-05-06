
import { useState, useEffect } from "react";
import { message, Modal } from "antd";
import pagesContentService from "../../../api/services/pagesContent.service";

export const usePagesContent = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);


  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);

  const fetchContent = async () => {
    setLoading(true);
    try {
      const res = await pagesContentService.getContent();
      setData(res.data || []);
    } catch (error) {
      console.error("Error fetching pages content:", error);
      message.error("فشل في جلب محتوى الصفحات");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContent();
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
    formData.append("title_en", values.title_en);
    formData.append("sub_title_ar", values.sub_title_ar);
    formData.append("sub_title_en", values.sub_title_en);
    formData.append("content_ar", values.content_ar);
    formData.append("content_en", values.content_en);
    formData.append("button_text_ar", values.button_text_ar);
    formData.append("button_text_en", values.button_text_en);
    formData.append("button_link", values.button_link);
    formData.append("media_type", values.media_type);


    if (values.main_media_file) {
      formData.append("main_media", values.main_media_file);
    }

    if (values.extra_media_files && values.extra_media_files.length > 0) {
      values.extra_media_files.forEach((file) => {
        formData.append("extra_media[]", file);
      });
    }

    try {
      if (editingRecord) {

        await pagesContentService.updateContent(editingRecord.id, formData);
        message.success("تم تعديل المحتوى بنجاح");
      } else {
        await pagesContentService.createContent(formData);
        message.success("تم إضافة المحتوى بنجاح");
      }
      fetchContent();
      handleCloseModal();
    } catch (error) {
      console.error("Error saving content:", error);
      message.error("فشل في حفظ المحتوى");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (record) => {
    Modal.confirm({
      title: "تأكيد الحذف",
      content: `هل أنت متأكد من حذف "${record.title_ar}"؟`,
      okText: "نعم، احذف",
      cancelText: "إلغاء",
      okButtonProps: { danger: true },
      onOk: async () => {
        try {
          await pagesContentService.deleteContent(record.id);
          message.success("تم حذف المحتوى بنجاح");
          fetchContent();
        } catch (error) {
          console.error("Error deleting content:", error);
          message.error("فشل في حذف المحتوى");
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
