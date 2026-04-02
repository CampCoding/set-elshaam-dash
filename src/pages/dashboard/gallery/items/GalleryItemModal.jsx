// src/pages/dashboard/gallery/items/GalleryItemModal.jsx
import { useEffect, useState } from "react";
import { Modal, Form, Input, Select, Upload, Button, message } from "antd";
import {
  ImagePlus,
  Image as ImageIcon,
  Upload as UploadIcon,
} from "lucide-react";

const { Option } = Select;

const GalleryItemModal = ({
  visible,
  onCancel,
  onSave,
  initialData,
  categories,
}) => {
  const [form] = Form.useForm();
  const [imageUrl, setImageUrl] = useState("");
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (visible) {
      if (initialData) {
        form.setFieldsValue(initialData);
        setImageUrl(initialData.url || "");
      } else {
        form.resetFields();
        setImageUrl("");
      }
    }
  }, [visible, initialData, form]);

  const handleUpload = (info) => {
    if (info.file.status === "uploading") {
      setUploading(true);
      return;
    }
    setUploading(false);
    const fakeUrl = URL.createObjectURL(info.file.originFileObj);
    setImageUrl(fakeUrl);
    form.setFieldsValue({ url: fakeUrl });
    message.success("تم الرفع");
  };

  const handleSubmit = () => {
    form
      .validateFields()
      .then((values) => onSave({ ...values, url: imageUrl || values.url }));
  };

  return (
    <Modal
      title={
        <div className="flex items-center gap-3 text-right" dir="rtl">
          <div className="p-2 bg-primary/10 rounded-xl">
            {initialData ? (
              <ImageIcon className="w-5 h-5 text-primary" />
            ) : (
              <ImagePlus className="w-5 h-5 text-primary" />
            )}
          </div>
          <span className="text-lg font-bold">
            {initialData ? "تعديل الصورة" : "إضافة صورة"}
          </span>
        </div>
      }
      open={visible}
      onOk={handleSubmit}
      onCancel={onCancel}
      okText="حفظ"
      cancelText="إلغاء"
      okButtonProps={{ className: "bg-primary h-10 px-6" }}
      cancelButtonProps={{ className: "h-10 px-6" }}
      destroyOnClose
      width={600}
      centered
      styles={{
        body: { direction: "rtl" },
        header: { direction: "rtl" },
      }}
    >
      <Form form={form} layout="vertical" dir="rtl" className="mt-2">
        <div className="bg-gray-50 rounded-xl p-5 border border-gray-100 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Form.Item
              name="label"
              label="عنوان الصورة"
              rules={[{ required: true, message: "مطلوب" }]}
            >
              <Input
                placeholder="مثال: صورة قاعة"
                size="large"
                className="rounded-lg"
              />
            </Form.Item>
            <Form.Item
              name="category"
              label="التصنيف"
              rules={[{ required: true, message: "مطلوب" }]}
            >
              <Select
                size="large"
                placeholder="اختر تصنيف"
                className="rounded-lg"
              >
                {categories.map((cat) => (
                  <Option key={cat.id} value={cat.id}>
                    {cat.label}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </div>
          <div>
            <span className="font-medium block mb-2">ملف الصورة</span>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="w-full sm:w-40 h-32 rounded-xl border-2 border-dashed border-gray-300 overflow-hidden bg-white flex items-center justify-center">
                {imageUrl ? (
                  <img src={imageUrl} className="w-full h-full object-cover" />
                ) : (
                  <div className="text-center text-gray-400">
                    <span className="text-xs">معاينة</span>
                  </div>
                )}
              </div>
              <div className="flex-1 space-y-3">
                <Upload
                  showUploadList={false}
                  customRequest={({ onSuccess }) =>
                    setTimeout(() => onSuccess("ok"), 500)
                  }
                  onChange={handleUpload}
                  accept="image/*"
                >
                  <Button
                    icon={<UploadIcon className="w-4 h-4" />}
                    loading={uploading}
                    className="h-10 rounded-lg"
                  >
                    رفع صورة
                  </Button>
                </Upload>
                <div className="flex items-center gap-2 text-gray-400 text-xs">
                  <div className="flex-1 h-px bg-gray-200"></div>
                  <span>أو</span>
                  <div className="flex-1 h-px bg-gray-200"></div>
                </div>
                <Form.Item
                  name="url"
                  className="mb-0"
                  rules={[{ required: !imageUrl, message: "مطلوب" }]}
                >
                  <Input
                    placeholder="رابط مباشر..."
                    size="large"
                    dir="ltr"
                    className="rounded-lg text-left"
                    onChange={(e) => setImageUrl(e.target.value)}
                  />
                </Form.Item>
              </div>
            </div>
          </div>
        </div>
      </Form>
    </Modal>
  );
};
export default GalleryItemModal;
