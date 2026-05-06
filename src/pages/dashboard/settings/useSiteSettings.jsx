
import { useState, useEffect } from "react";
import { message } from "antd";
import settingsService from "../../../api/services/settings.service";

export const useSiteSettings = () => {
  const [settings, setSettings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [updatingKey, setUpdatingKey] = useState(null);

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const res = await settingsService.getSettings();
      const data = res.data || {};


      if (Array.isArray(data.settings)) {

        const mapped = data.settings.map(s => ({
          key: s.key,
          value: s.value,

          image: (s.key.includes('logo') || s.key.includes('favicon')) ? s.value : null
        }));
        setSettings(mapped);
      } else if (Array.isArray(data)) {
        setSettings(data);
      } else if (typeof data === "object") {

        const transformed = Object.entries(data).map(([key, value]) => ({
          key,
          value: typeof value === "object" ? (value.value || JSON.stringify(value)) : value,
          image: (key.includes('logo') || key.includes('favicon')) ? (value.value || value) : null
        }));
        setSettings(transformed);
      } else {
        setSettings([]);
      }


    } catch (error) {
      console.error("Error fetching settings:", error);
      message.error("فشل في جلب الإعدادات");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleUpdate = async (key, value, imageFile) => {
    setUpdatingKey(key);
    const formData = new FormData();
    formData.append("key", key);
    if (value !== undefined && value !== null) {
      formData.append("value", value);
    }
    if (imageFile) {
      formData.append("image", imageFile);
    }

    try {
      await settingsService.updateSetting(formData);
      message.success("تم تحديث الإعداد بنجاح");
      fetchSettings();
    } catch (error) {
      console.error(`Error updating setting ${key}:`, error);
      message.error("فشل في تحديث الإعداد");
    } finally {
      setUpdatingKey(null);
    }
  };

  return {
    settings,
    loading,
    updatingKey,
    handleUpdate,
    fetchSettings,
  };
};
