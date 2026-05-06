
import { useState, useEffect } from "react";
import { message, Modal } from "antd";
import galleryService from "../../../../api/services/gallery.service";

export const useGalleryItems = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);

  const fetchGallery = async () => {
    setLoading(true);
    try {
      const response = await galleryService.getGallery();
      setData(response.data || []);
    } catch (error) {
      console.error("Error fetching gallery:", error);
      message.error("فشل في جلب بيانات المعرض");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGallery();
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

    if (values.image_file) {
      formData.append("image", values.image_file);
    }

    formData.append("category_ar", values.category_ar);

    if (!editingRecord) {
      formData.append("title_ar", values.title_ar);
    }

    try {
      if (editingRecord) {
        await galleryService.updateGallery(editingRecord.id, formData);
        message.success("تم تعديل الصورة بنجاح");
      } else {
        await galleryService.createGallery(formData);
        message.success("تم إضافة الصورة بنجاح");
      }
      handleCloseModal();
      fetchGallery();
    } catch (error) {
      console.error("Error saving gallery item:", error);
      message.error("فشل في حفظ البيانات");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (record) => {
    Modal.confirm({
      title: "تأكيد الحذف",
      content: `هل أنت متأكد من حذف "${record.title_ar || 'هذه الصورة'}"؟`,
      okText: "نعم، احذف",
      cancelText: "إلغاء",
      okButtonProps: { danger: true },
      onOk: async () => {
        try {
          await galleryService.deleteGallery(record.id);
          message.success("تم الحذف بنجاح");
          fetchGallery();
        } catch (error) {
          console.error("Error deleting gallery item:", error);
          message.error("فشل في الحذف");
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
