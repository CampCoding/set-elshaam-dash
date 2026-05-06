

import { useState, useEffect } from "react";
import { message, Modal } from "antd";
import { stagesService } from "../../../api/services/stage.service";

export const useStagesPrice = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);

  const fetchStages = async () => {
    setLoading(true);
    try {
      const response = await stagesService.getStages();
      setData(response.data || []);
    } catch (error) {
      console.error("Fetch Stages Error:", error);
      message.error("فشل في تحميل البيانات");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStages();
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
    try {
      if (editingRecord) {
        await stagesService.updateStage(editingRecord.id, values);
        message.success("تم تعديل المرحلة بنجاح");
      } else {
        await stagesService.createStage(values);
        message.success("تم إضافة المرحلة بنجاح");
      }
      await fetchStages();
      handleCloseModal();
    } catch (error) {
      console.error("Save Stage Error:", error);
      message.error("فشل في حفظ البيانات");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (record) => {
    Modal.confirm({
      title: "تأكيد الحذف",
      content: `هل أنت متأكد من حذف مرحلة "${record.title}"؟`,
      okText: "نعم، احذف",
      cancelText: "إلغاء",
      okButtonProps: { danger: true },
      onOk: async () => {
        try {
          await stagesService.deleteStage(record.id);
          message.success("تم حذف المرحلة بنجاح");
          await fetchStages();
        } catch (error) {
          console.error("Delete Stage Error:", error);
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
