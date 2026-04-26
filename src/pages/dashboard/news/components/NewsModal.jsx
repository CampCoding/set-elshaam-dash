// src/pages/dashboard/news/components/NewsModal.jsx
import { useEffect, useState } from "react";
import { Modal, Form, Input, Select, Upload, message, Image } from "antd";
import { Plus, Trash2, Upload as UploadIcon, Newspaper, Tag, Link as LinkIcon } from "lucide-react";
import Button from "../../../../components/common/Button";
import RichTextEditor from "../../../../components/common/RichTextEditor";

const { TextArea } = Input;
const { Option } = Select;

const NewsModal = ({ visible, onCancel, onSave, initialData }) => {
  const [form] = Form.useForm();
  const [imageUrl, setImageUrl] = useState("");
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (visible) {
      if (initialData) {
        form.setFieldsValue({
          ...initialData,
          content_ar: initialData.content_ar || "",
        });
        setImageUrl(initialData.image || "");
      } else {
        form.resetFields();
        form.setFieldsValue({ content_ar: "", category_ar: "أخبار" });
        setImageUrl("");
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
      setImageUrl(url);
      form.setFieldsValue({ image_file: info.file.originFileObj });
      message.success("تم تجهيز الصورة");
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
            <Newspaper className="w-5 h-5 text-primary" />
          </div>
          <span className="text-lg font-bold">{initialData ? "تعديل الخبر" : "إضافة خبر جديد"}</span>
        </div>
      }
      open={visible}
      onOk={handleSubmit}
      onCancel={onCancel}
      okText="حفظ"
      cancelText="إلغاء"
      okButtonProps={{ className: "bg-primary h-10 px-6", loading: uploading }}
      destroyOnClose
      width={1000}
      centered
      styles={{ body: { direction: "rtl", padding: "24px", maxHeight: "85vh", overflowY: "auto" }, header: { direction: "rtl" } }}
    >
      <Form form={form} layout="vertical" dir="rtl">
        <Form.Item name="image_file" hidden><Input /></Form.Item>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Main Info */}
          <div className="space-y-4">
            <Form.Item name="title_ar" label="عنوان الخبر" rules={[{ required: true }]}><Input placeholder="العنوان الرئيسي للخبر" size="large" /></Form.Item>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Form.Item name="slug" label="الرابط (Slug)" rules={[{ required: true }]}>
                <Input prefix={<LinkIcon size={14} className="text-gray-400" />} placeholder="slug-name" size="large" />
              </Form.Item>
              <Form.Item name="category_ar" label="التصنيف" rules={[{ required: true }]}>
                <Select size="large" placeholder="اختر تصنيف">
                  <Option value="أخبار">أخبار</Option>
                  <Option value="مقالات">مقالات</Option>
                  <Option value="فعاليات">فعاليات</Option>
                  <Option value="تحديثات">تحديثات</Option>
                </Select>
              </Form.Item>
            </div>

            <Form.Item name="summary_ar" label="ملخص الخبر" rules={[{ required: true }]}>
              <TextArea placeholder="وصف موجز يظهر في القائمة..." autoSize={{ minRows: 3 }} />
            </Form.Item>
          </div>

          {/* Image Upload */}
          <div className="flex flex-col items-center justify-center bg-gray-50 rounded-2xl border-2 border-dashed border-gray-100 p-6">
            <label className="text-sm font-bold text-gray-500 mb-4">صورة الخبر الرئيسية</label>
            <Upload showUploadList={false} customRequest={customRequest} onChange={handleUpload} accept="image/*">
              <div className="w-full max-w-[300px] aspect-video bg-white rounded-2xl border border-gray-200 flex items-center justify-center cursor-pointer hover:border-primary transition-all overflow-hidden shadow-sm">
                {imageUrl ? (
                  <Image src={imageUrl} width="100%" height="100%" preview={false} style={{ objectFit: "cover" }} />
                ) : (
                  <div className="flex flex-col items-center">
                    <UploadIcon className="w-10 h-10 text-gray-300 mb-2" />
                    <span className="text-xs text-gray-400">اضغط لرفع الصورة</span>
                  </div>
                )}
              </div>
            </Upload>
          </div>
        </div>

        <div className="mt-6">
          <Form.Item name="content_ar" label="محتوى الخبر التفصيلي" trigger="onChange" validateTrigger={['onBlur']}>
            <RichTextEditor placeholder="ابدأ بكتابة تفاصيل الخبر هنا..." />
          </Form.Item>
        </div>
      </Form>
    </Modal>
  );
};

export default NewsModal;
