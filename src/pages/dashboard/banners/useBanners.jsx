
import { useState, useEffect } from "react";
import { message, Modal } from "antd";
import bannersService from "../../../api/services/banners.service";

export const useBanners = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);


  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);

  const fetchBanners = async () => {
    setLoading(true);
    try {
      const res = await bannersService.getBanners();
      setData(res.data || []);
    } catch (error) {
      console.error("Error fetching banners:", error);
      message.error("فشل في جلب البنرات");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBanners();
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
    formData.append("sub_title_ar", values.sub_title_ar);
    formData.append("description_ar", values.description_ar);
    formData.append("page_name", values.page_name);
    formData.append("media_type", values.media_type);

    if (values.media_file) {
      formData.append("media", values.media_file);
    }

    if (editingRecord) {
      formData.append("is_active", values.is_active ? "1" : "0");
    }

    try {
      if (editingRecord) {
        await bannersService.updateBanner(editingRecord.id, formData);
        message.success("تم تحديث البنر بنجاح");
      } else {
        await bannersService.createBanner(formData);
        message.success("تم إضافة البنر بنجاح");
      }
      fetchBanners();
      handleCloseModal();
    } catch (error) {
      console.error("Error saving banner:", error);
      message.error("فشل في حفظ البنر");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (record) => {
    Modal.confirm({
      title: "تأكيد الحذف",
      content: `هل أنت متأكد من حذف البنر الخاص بصفحة "${record.page_name}"؟`,
      okText: "نعم، احذف",
      cancelText: "إلغاء",
      okButtonProps: { danger: true },
      onOk: async () => {
        try {
          await bannersService.deleteBanner(record.id);
          message.success("تم حذف البنر بنجاح");
          fetchBanners();
        } catch (error) {
          console.error("Error deleting banner:", error);
          message.error("فشل في حذف البنر");
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
