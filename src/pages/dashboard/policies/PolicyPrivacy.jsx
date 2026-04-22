import React, { useState, useEffect, useRef, useMemo } from "react";
import { Button, Card, Typography, Spin, Tabs, message } from "antd";
import { Save, ShieldCheck, Languages } from "lucide-react";
import JoditEditor from "jodit-react";
import { informationService } from "../../../api/services/information.service";

const { Text } = Typography;

const PolicyPrivacy = () => {
  const [data, setData] = useState({
    privacy_ar: "",
    privacy_en: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await informationService.getInformation();
      if (response.data) {
        setData({
          privacy_ar: response.data.privacy_ar || "",
          privacy_en: response.data.privacy_en || "",
        });
      }
    } catch (error) {
      console.error("Error fetching privacy policy:", error);
      message.error("فشل في تحميل البيانات");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      await informationService.updateInformation({
        privacy_ar: data.privacy_ar,
        privacy_en: data.privacy_en,
      });
      message.success("تم حفظ سياسة الخصوصية بنجاح");
    } catch (error) {
      console.error("Error saving privacy policy:", error);
      message.error("فشل في حفظ البيانات");
    } finally {
      setSaving(false);
    }
  };

  const config = useMemo(() => ({
    readonly: false,
    height: 500,
    language: "ar",
    direction: "rtl",
    placeholder: "ابدأ الكتابة هنا...",
    toolbarButtonSize: "middle",
    buttons: [
      "bold", "italic", "underline", "strikethrough", "|",
      "ul", "ol", "|",
      "font", "fontsize", "brush", "paragraph", "|",
      "image", "table", "link", "|",
      "align", "undo", "redo", "|",
      "hr", "eraser", "fullsize"
    ]
  }), []);

  const configEn = useMemo(() => ({
    ...config,
    language: "en",
    direction: "ltr",
  }), [config]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spin size="large" tip="جاري التحميل..." />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto" dir="rtl">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-primary flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-xl">
              <ShieldCheck className="w-6 h-6 text-primary" />
            </div>
            سياسة الخصوصية
          </h1>
          <p className="text-gray-500 mt-1">إدارة نصوص سياسة الخصوصية بالعربية والإنجليزية</p>
        </div>
        <Button
          type="primary"
          icon={<Save className="w-4 h-4 ml-2" />}
          size="large"
          onClick={handleSave}
          loading={saving}
          className="bg-primary hover:bg-primary/90 flex items-center"
        >
          حفظ التغييرات
        </Button>
      </div>

      <Card className="rounded-2xl shadow-sm border-gray-100 overflow-hidden">
        <Tabs
          defaultActiveKey="ar"
          type="card"
          items={[
            {
              key: "ar",
              label: (
                <span className="flex items-center gap-2 px-4">
                  <Languages size={16} />
                  اللغة العربية
                </span>
              ),
              children: (
                <div className="p-2">
                  <JoditEditor
                    value={data.privacy_ar}
                    config={config}
                    onBlur={(newContent) => setData(prev => ({ ...prev, privacy_ar: newContent }))}
                  />
                </div>
              ),
            },
            {
              key: "en",
              label: (
                <span className="flex items-center gap-2 px-4 text-left" dir="ltr">
                  <Languages size={16} />
                  English
                </span>
              ),
              children: (
                <div className="p-2" dir="ltr">
                  <JoditEditor
                    value={data.privacy_en}
                    config={configEn}
                    onBlur={(newContent) => setData(prev => ({ ...prev, privacy_en: newContent }))}
                  />
                </div>
              ),
            },
          ]}
        />
      </Card>
    </div>
  );
};

export default PolicyPrivacy;
