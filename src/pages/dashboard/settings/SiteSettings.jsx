
import { Card, Input, Button, Upload, Image, Space, Typography, Spin, Divider, Badge } from "antd";
import { Settings, Upload as UploadIcon, Save, Image as ImageIcon, Type, Layout, Globe, Smartphone } from "lucide-react";
import { useSiteSettings } from "./useSiteSettings";

const { Title, Text } = Typography;

const SiteSettings = () => {
  const { settings, loading, updatingKey, handleUpdate } = useSiteSettings();

  const renderSettingItem = (item) => {
    const isLogo = item.key.toLowerCase().includes("logo") || item.key.toLowerCase().includes("icon");
    const isUpdating = updatingKey === item.key;

    return (
      <Card
        key={item.key}
        className="shadow-sm border-gray-100 hover:shadow-md transition-shadow duration-300 rounded-2xl overflow-hidden"
        styles={{ body: { padding: '20px' } }}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center gap-3 mb-4">
            <div className={`p-2 rounded-xl ${isLogo ? 'bg-blue-50 text-blue-500' : 'bg-purple-50 text-purple-500'}`}>
              {isLogo ? <ImageIcon size={20} /> : <Type size={20} />}
            </div>
            <div>
              <Text className="font-bold text-gray-800 block uppercase tracking-wider text-xs">
                {item.key.replace(/_/g, ' ')}
              </Text>
              <Text type="secondary" className="text-[10px]">
                {isLogo ? "إعداد الشعار / الصورة" : "إعداد نصي"}
              </Text>
            </div>
          </div>

          <div className="flex-1 space-y-4">
            {isLogo && (
              <div className="flex flex-col items-center justify-center bg-gray-50 rounded-xl p-4 border border-dashed border-gray-200 min-h-[150px]">
                {item.value || item.image ? (
                  <div className="relative group">
                    <Image
                      src={item.image || item.value}
                      alt={item.key}
                      height={100}
                      className="object-contain"
                    />
                  </div>
                ) : (
                  <div className="text-gray-300 flex flex-col items-center">
                    <ImageIcon size={40} strokeWidth={1} />
                    <span className="text-xs mt-2">لا يوجد صورة</span>
                  </div>
                )}
              </div>
            )}

            {!isLogo ? (
              <Input.TextArea
                defaultValue={item.value}
                placeholder="أدخل القيمة هنا..."
                autoSize={{ minRows: 2, maxRows: 6 }}
                className="rounded-lg border-gray-200 focus:border-primary"
                onChange={(e) => (item._tempValue = e.target.value)}
              />
            ) : (
              <Upload
                showUploadList={false}
                beforeUpload={(file) => {
                  handleUpdate(item.key, item.value, file);
                  return false;
                }}
              >
                <Button
                  icon={<UploadIcon size={16} className="ml-2" />}
                  className="w-full h-10 rounded-lg border-blue-200 text-blue-600 hover:text-blue-700 hover:border-blue-300"
                  loading={isUpdating}
                >
                  تغيير الصورة
                </Button>
              </Upload>
            )}
          </div>

          {!isLogo && (
            <Button
              type="primary"
              icon={<Save size={16} className="ml-2" />}
              className="w-full mt-4 h-10 rounded-lg bg-primary"
              loading={isUpdating}
              onClick={() => handleUpdate(item.key, item._tempValue || item.value, null)}
            >
              حفظ التغييرات
            </Button>
          )}
        </div>
      </Card>
    );
  };

  const categories = [
    { title: "الهوية والشعارات", keys: ["header_logo", "footer_logo", "tab_logo", "favicon"], icon: <Layout size={18} /> },
    { title: "إعدادات العمل والنظام", keys: ["ytj_number", "age_limit_exemption", "working_hours_days_ar", "working_hours_time_ar", "map_link"], icon: <Globe size={18} /> },
    { title: "روابط التواصل والتحميل", keys: ["whatsapp_number", "email_support", "facebook_link", "tiktok_link_1", "tiktok_link_2", "google_play_link", "app_store_link"], icon: <Smartphone size={18} /> },
  ];

  return (
    <div className="space-y-8" dir="rtl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div>
          <Title level={2} className="!m-0 !text-primary flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-xl">
              <Settings className="w-6 h-6 text-primary" />
            </div>
            إعدادات الموقع
          </Title>
          <Text type="secondary" className="mt-1 block">
            إدارة الشعارات، النصوص العامة، وروابط التواصل الاجتماعي للموقع.
          </Text>
        </div>
        <Badge
          status="processing"
          text="مزامنة حية"
          className="bg-gray-50 px-4 py-2 rounded-full border border-gray-100"
        />
      </div>

      {loading && settings.length === 0 ? (
        <div className="flex justify-center items-center h-64">
          <Spin size="large" tip="جاري تحميل الإعدادات..." />
        </div>
      ) : (
        <div className="space-y-10">
          {categories.map((cat, idx) => {
            const settingsArray = Array.isArray(settings) ? settings : [];
            const catSettings = settingsArray.filter(
              (s) =>
                cat.keys.includes(s.key) ||
                (!categories.some((c) => c.keys.includes(s.key)) &&
                  idx === categories.length - 1)
            );

            if (catSettings.length === 0 && idx < categories.length - 1) return null;

            return (
              <div key={idx} className="space-y-4">

                {/* ✅ Fixed Section Header */}
                <div className="flex items-center gap-3 px-1">
                  {/* Icon + Title pill */}
                  <div className="flex items-center gap-2 bg-gray-100 text-gray-600 font-bold px-3 py-1.5 rounded-full text-sm whitespace-nowrap shrink-0">
                    <span className="text-primary">{cat.icon}</span>
                    <span>{cat.title}</span>
                  </div>

                  {/* Divider line */}
                  <div className="flex-1 h-px bg-gray-200 rounded-full" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {catSettings.map(renderSettingItem)}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default SiteSettings;