import { useState, useEffect, useCallback } from "react";
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
  
  // Direct Emails State
  const [emails, setEmails] = useState([]);
  const [loadingEmails, setLoadingEmails] = useState(false);

  const fetchProfiles = useCallback(async () => {
    if (!id) return;

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
  }, [id]);

  const fetchEmails = useCallback(async () => {
    if (!id) return;
    setLoadingEmails(true);
    try {
      const response = await usersService.listDirectEmails(id);
      setEmails(response.data || []);
    } catch (error) {
      console.error("Fetch Emails Error:", error);
    } finally {
      setLoadingEmails(false);
    }
  }, [id]);

  useEffect(() => {
    fetchProfiles();
  }, [fetchProfiles]);

  useEffect(() => {
    if (activeTab === "emails") {
      fetchEmails();
    }
  }, [activeTab, fetchEmails]);

  const handleOpenEdit = useCallback(() => {
    setIsEditModalVisible(true);
  }, []);

  const handleCloseEdit = useCallback(() => {
    setIsEditModalVisible(false);
  }, []);

  const handleUpdateProfile = useCallback(
    async (values, type = "main") => {
      setIsSaving(true);
      try {
        await profileService.upsertProfile(id, values, type);
        message.success("تم تحديث البيانات بنجاح");
        handleCloseEdit();
        await fetchProfiles();
      } catch (error) {
        console.error("Update Profile Error:", error);
        message.error("فشل في تحديث البيانات");
      } finally {
        setIsSaving(false);
      }
    },
    [id, fetchProfiles, handleCloseEdit]
  );

  const handleDeleteFile = useCallback(
    async (fileData) => {
      try {
        await profileService.deleteFile(id, fileData);
        message.success("تم حذف الملف بنجاح");
        await fetchProfiles();
      } catch (error) {
        message.error("فشل في حذف الملف");
      }
    },
    [id, fetchProfiles]
  );

  const handleDeleteUser = useCallback(() => {
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
  }, [id, navigate]);

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
    // Email related
    emails,
    loadingEmails,
    fetchEmails
  };
};
