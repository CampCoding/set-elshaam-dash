import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { message, Modal } from "antd";
import { profileService } from "../../../api/services/profile.service";
import { usersService } from "../../../api/services/users.service";

export const useUserProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [mainProfile, setMainProfile] = useState(null);
  const [targetProfile, setTargetProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("main");
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const fetchProfiles = async () => {
    setLoading(true);
    try {
      const [mainRes, targetRes] = await Promise.all([
        profileService.getProfile(id, "main"),
        profileService.getProfile(id, "target"),
      ]);
      setMainProfile(mainRes.data);
      setTargetProfile(targetRes.data);
    } catch (error) {
      console.error("Fetch Profile Error:", error);
      message.error("فشل في جلب بيانات الملف الشخصي");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchProfiles();
    }
  }, [id]);

  const handleOpenEdit = () => {
    setIsEditModalVisible(true);
  };

  const handleCloseEdit = () => {
    setIsEditModalVisible(false);
  };

  const handleUpdateProfile = async (values, type = "main") => {
    setIsSaving(true);
    try {
      await profileService.upsertProfile(id, values, type);
      message.success("تم تحديث البيانات بنجاح");
      handleCloseEdit();
      fetchProfiles();
    } catch (error) {
      console.error("Update Profile Error:", error);
      message.error("فشل في تحديث البيانات");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteFile = async (fileData) => {
    try {
      await profileService.deleteFile(id, fileData);
      message.success("تم حذف الملف بنجاح");
      fetchProfiles();
    } catch (error) {
      message.error("فشل في حذف الملف");
    }
  };

  const handleDeleteUser = () => {
    Modal.confirm({
      title: "هل أنت متأكد من حذف هذا الحساب؟",
      content:
        "سيتم حذف كافة البيانات والوثائق المرتبطة بهذا المستخدم نهائياً.",
      okText: "حذف الآن",
      okType: "danger",
      cancelText: "إلغاء",
      onOk: async () => {
        try {
          await usersService.deleteUser(id);
          message.success("تم حذف الحساب بنجاح");
          navigate("/users");
        } catch (error) {
          message.error("فشل في حذف الحساب");
        }
      },
    });
  };

  return {
    id,
    mainProfile,
    targetProfile,
    loading,
    activeTab,
    setActiveTab,
    isEditModalVisible,
    isSaving,
    handleOpenEdit,
    handleCloseEdit,
    handleUpdateProfile,
    handleDeleteFile,
    handleDeleteUser,
    refresh: fetchProfiles,
  };
};
