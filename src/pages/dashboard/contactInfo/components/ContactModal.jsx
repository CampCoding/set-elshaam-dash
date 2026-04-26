// src/pages/dashboard/contactInfo/components/ContactModal.jsx
import { useEffect, useState } from "react";
import { Modal, Form, Input, Select, Upload, message, Image, Switch } from "antd";
import { Plus, Trash2, Upload as UploadIcon, Phone, Mail, Globe, CheckCircle2 } from "lucide-react";
import Button from "../../../../components/common/Button";

const { Option } = Select;

const ContactModal = ({ visible, onCancel, onSave, initialData }) => {
  const [form] = Form.useForm();
  const [iconUrl, setIconUrl] = useState("");
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (visible) {
      if (initialData) {
        form.setFieldsValue({
          ...initialData,
          is_active: initialData.is_active === 1 || initialData.is_active === true,
        });
        setIconUrl(initialData.icon || "");
      } else {
        form.resetFields();
        form.setFieldsValue({ type: "phone", is_active: true });
        setIconUrl("");
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
      setIconUrl(url);
      form.setFieldsValue({ icon_file: info.file.originFileObj });
      message.success("تم تجهيز الأيقونة");
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
            <Globe className="w-5 h-5 text-primary" />
          </div>
          <span className="text-lg font-bold">{initialData ? "تعديل بيانات التواصل" : "إضافة بيانات تواصل جديدة"}</span>
        </div>
      }
      open={visible}
      onOk={handleSubmit}
      onCancel={onCancel}
      okText="حفظ"
      cancelText="إلغاء"
      okButtonProps={{ className: "bg-primary h-10 px-6", loading: uploading }}
      destroyOnClose
      width={500}
      centered
      styles={{ body: { direction: "rtl", padding: "24px" }, header: { direction: "rtl" } }}
    >
      <Form form={form} layout="vertical" dir="rtl">
        <Form.Item name="icon_file" hidden><Input /></Form.Item>

        <div className="space-y-4">
          <Form.Item name="type" label="نوع التواصل" rules={[{ required: true }]}>
            <Select size="large">
              <Option value="phone">هاتف</Option>
              <Option value="email">بريد إلكتروني</Option>
              <Option value="whatsapp">واتساب</Option>
              <Option value="address">عنوان</Option>
              <Option value="link">رابط آخر</Option>
            </Select>
          </Form.Item>

          <Form.Item name="value" label="القيمة (الرقم أو الإيميل)" rules={[{ required: true }]}>
            <Input placeholder="مثال: +358465202214" size="large" className="rounded-lg" />
          </Form.Item>

          <div className="flex flex-col items-center justify-center p-6 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-100">
            <label className="text-sm font-bold text-gray-500 mb-3">أيقونة التواصل (اختياري)</label>
            <Upload showUploadList={false} customRequest={customRequest} onChange={handleUpload} accept="image/*">
              <div className="w-24 h-24 bg-white rounded-2xl border border-gray-200 flex items-center justify-center cursor-pointer hover:border-primary transition-all overflow-hidden shadow-sm">
                {iconUrl ? (
                  <Image src={iconUrl} width="100%" height="100%" preview={false} style={{ objectFit: "contain" }} />
                ) : (
                  <UploadIcon className="w-8 h-8 text-gray-300" />
                )}
              </div>
            </Upload>
            {iconUrl && <Button type="text" danger size="small" className="mt-2" onClick={() => { setIconUrl(""); form.setFieldsValue({ icon_file: null }); }}>حذف الأيقونة</Button>}
          </div>

          {initialData && (
            <Form.Item name="is_active" label="الحالة" valuePropName="checked">
              <Switch checkedChildren="مفعل" unCheckedChildren="معطل" />
            </Form.Item>
          )}
        </div>
      </Form>
    </Modal>
  );
};

export default ContactModal;
