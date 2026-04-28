// src/pages/dashboard/services/useServicesPage.jsx
import { useState, useEffect } from "react";
import { message, Modal } from "antd";
import servicesService from "../../../api/services/services.service";

export const useServicesPage = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  // Modal States - للإضافة والتعديل
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);

  // Modal State - للتفاصيل
  const [isDetailsModalVisible, setIsDetailsModalVisible] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);

  const fetchServices = async (page = pagination.current, limit = pagination.pageSize) => {
    setLoading(true);
    try {
      const response = await servicesService.getServices({ page, limit });
      setData(response.data || []);
      setPagination({
        ...pagination,
        current: response.current_page || page,
        total: response.total || 0,
      });
    } catch (error) {
      console.error("Error fetching services:", error);
      message.error("فشل في جلب بيانات الخدمات");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const handleTableChange = (newPagination) => {
    fetchServices(newPagination.current, newPagination.pageSize);
  };

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

  const handleOpenDetails = (record) => {
    setSelectedRecord(record);
    setIsDetailsModalVisible(true);
  };

  const handleCloseDetails = () => {
    setIsDetailsModalVisible(false);
    setSelectedRecord(null);
  };

  const handleSave = async (values) => {
    setLoading(true);
    const formData = new FormData();

    formData.append("title_ar", values.name);
    formData.append("subtitle_ar", values.subtitle);
    formData.append("description_ar", values.description.join("\n"));
    formData.append("slug", values.slug);

    formData.append("category", values.category);
    formData.append("status", values.status);
    formData.append("requires_login", values.requiresLogin ? 1 : 0);
    formData.append("cta_text_ar", values.cta_text_ar || "احجز الآن");

    // Send File objects
    if (values.slider_files && values.slider_files.length > 0) {
      formData.append("main_image", values.slider_files[0]);

      values.slider_files.forEach((file) => {
        formData.append("slider_images", file);
      });
    }

    if (values.gallery_files && values.gallery_files.length > 0) {
      console.log("kkkkkkkkk");

      values.gallery_files.forEach((file) => {
        formData.append("gallery_images", file);
      });
    }

    if (values.faqs && values.faqs.length > 0) {
      values.faqs.forEach((faq, index) => {
        formData.append(`faqs[${index}][question]`, faq.question);
        formData.append(`faqs[${index}][answer]`, faq.answer);
      });
    }

    try {
      if (editingRecord) {
        await servicesService.updateService(editingRecord.id, formData);
        message.success("تم تعديل الخدمة بنجاح");
      } else {
        await servicesService.createService(formData);
        message.success("تم إضافة الخدمة بنجاح");
      }
      handleCloseModal();
      fetchServices();
    } catch (error) {
      console.error("Error saving service:", error);
      message.error("فشل في حفظ البيانات");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (record) => {
    Modal.confirm({
      title: "تأكيد الحذف",
      content: `هل أنت متأكد من حذف خدمة "${record.title_ar || record.name}"؟`,
      okText: "نعم، احذف",
      cancelText: "إلغاء",
      okButtonProps: { danger: true },
      onOk: async () => {
        try {
          await servicesService.deleteService(record.id);
          message.success("تم حذف الخدمة بنجاح");
          fetchServices();
        } catch (error) {
          console.error("Error deleting service:", error);
          message.error("فشل في الحذف");
        }
      },
    });
  };

  return {
    data,
    loading,
    pagination,
    handleTableChange,
    isModalVisible,
    editingRecord,
    handleOpenAdd,
    handleOpenEdit,
    handleCloseModal,
    handleSave,
    handleDelete,
    isDetailsModalVisible,
    selectedRecord,
    handleOpenDetails,
    handleCloseDetails,
  };
};

