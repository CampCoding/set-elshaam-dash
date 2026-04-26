// src/pages/dashboard/banners/components/BannerModal.jsx
import { useEffect, useState } from "react";
import { Modal, Form, Input, Select, Upload, message, Image, Radio, Switch } from "antd";
import { Plus, Trash2, Upload as UploadIcon, Layout, Film, Image as ImageIcon } from "lucide-react";
import Button from "../../../../components/common/Button";

const { TextArea } = Input;
const { Option } = Select;

const BannerModal = ({ visible, onCancel, onSave, initialData }) => {
  const [form] = Form.useForm();
  const [mediaUrl, setMediaUrl] = useState("");
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (visible) {
      if (initialData) {
        form.setFieldsValue({
          ...initialData,
          is_active: initialData.is_active === 1 || initialData.is_active === true,
        });
        setMediaUrl(initialData.media || "");
      } else {
        form.resetFields();
        form.setFieldsValue({ media_type: "image", is_active: true });
        setMediaUrl("");
      }
    }
  }, [visible, initialData, form]);

  const handleUpload = (info) => {
    if (info.file.status === "uploading") {
      setUploading(true);
      return;
    }
    if (info.file.originFileObj) {
      setUploading(false);
      const url = URL.createObjectURL(info.file.originFileObj);
      setMediaUrl(url);
      form.setFieldsValue({ media_file: info.file.originFileObj });
      message.success("تم تجهيز الملف");
    }
  };

  const customRequest = ({ file, onSuccess }) => {
    setTimeout(() => onSuccess("ok"), 500);
  };

  const handleSubmit = () => {
    form.validateFields().then((values) => {
      onSave(values);
    }).catch(info => console.log("Validate Failed:", info));
  };

  return (
    <Modal
      title={
        <div className="flex items-center gap-3 text-right" dir="rtl">
          <div className="p-2 bg-primary/10 rounded-xl">
            <Layout className="w-5 h-5 text-primary" />
          </div>
          <span className="text-lg font-bold">{initialData ? "تعديل البنر" : "إضافة بنر جديد"}</span>
        </div>
      }
      open={visible}
      onOk={handleSubmit}
      onCancel={onCancel}
      okText="حفظ"
      cancelText="إلغاء"
      okButtonProps={{ className: "bg-primary h-10 px-6", loading: uploading }}
      destroyOnClose
      width={700}
      centered
      styles={{ body: { direction: "rtl", padding: "24px", maxHeight: "80vh", overflowY: "auto" }, header: { direction: "rtl" } }}
    >
      <Form form={form} layout="vertical" dir="rtl">
        <Form.Item name="media_file" hidden><Input /></Form.Item>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Form.Item name="page_name" label="اسم الصفحة" rules={[{ required: true }]}>
            <Select size="large" placeholder="اختر الصفحة">
              <Option value="home">الرئيسية</Option>
              <Option value="about">من نحن</Option>
              <Option value="services">الخدمات</Option>
              <Option value="packages">الباقات</Option>
              <Option value="contact">اتصل بنا</Option>
            </Select>
          </Form.Item>

          <Form.Item name="media_type" label="نوع الميديا" rules={[{ required: true }]}>
            <Radio.Group>
              <Radio value="image">صورة</Radio>
              <Radio value="video">فيديو</Radio>
            </Radio.Group>
          </Form.Item>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Form.Item name="title_ar" label="العنوان (بالعربية)" rules={[{ required: true }]}><Input placeholder="العنوان الرئيسي" size="large" /></Form.Item>
          <Form.Item name="sub_title_ar" label="عنوان فرعي (بالعربية)"><Input placeholder="العنوان الفرعي" size="large" /></Form.Item>
        </div>

        <Form.Item name="description_ar" label="الوصف (بالعربية)"><TextArea placeholder="وصف موجز..." autoSize={{ minRows: 3 }} /></Form.Item>

        <div className="bg-gray-50 rounded-2xl p-6 border-2 border-dashed border-gray-100 flex flex-col items-center">
          <label className="text-sm font-bold text-gray-500 mb-4 text-center block w-full">ملف الميديا (صورة أو فيديو)</label>
          <Upload showUploadList={false} customRequest={customRequest} onChange={handleUpload} accept={form.getFieldValue("media_type") === "video" ? "video/*" : "image/*"}>
            <div className="w-full max-w-[400px] h-48 bg-white rounded-2xl border border-gray-200 flex items-center justify-center cursor-pointer hover:border-primary transition-all overflow-hidden shadow-sm">
              {mediaUrl ? (
                form.getFieldValue("media_type") === "video" ? (
                  <div className="flex flex-col items-center"><Film className="w-12 h-12 text-primary mb-2" /><span className="text-xs text-gray-400">فيديو تم اختياره</span></div>
                ) : <Image src={mediaUrl} width="100%" height="100%" preview={false} style={{ objectFit: "cover" }} />
              ) : (
                <div className="flex flex-col items-center">
                  <UploadIcon className="w-10 h-10 text-gray-300 mb-2" />
                  <span className="text-xs text-gray-400">اضغط لرفع الملف</span>
                </div>
              )}
            </div>
          </Upload>
          {mediaUrl && <Button type="text" danger className="mt-2" onClick={() => { setMediaUrl(""); form.setFieldsValue({ media_file: null }); }}>حذف الملف</Button>}
        </div>

        {initialData && (
          <Form.Item name="is_active" label="حالة البنر" valuePropName="checked" className="mt-4">
            <Switch checkedChildren="مفعل" unCheckedChildren="معطل" />
          </Form.Item>
        )}
      </Form>
    </Modal>
  );
};

export default BannerModal;
