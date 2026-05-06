
import { useEffect, useState } from "react";
import {
  Modal,
  Form,
  Input,
  Select,
  Upload,
  message,
  Image,
  Radio,
} from "antd";
import {
  Plus,
  Trash2,
  Upload as UploadIcon,
  FileText,
  Image as ImageIcon,
  Film,
  X,
} from "lucide-react";
import Button from "../../../../components/common/Button";
import RichTextEditor from "../../../../components/common/RichTextEditor";

const { TextArea } = Input;
const { Option } = Select;

const ContentModal = ({ visible, onCancel, onSave, initialData }) => {
  const [form] = Form.useForm();
  const [mainMediaUrl, setMainMediaUrl] = useState("");
  const [extraMediaUrls, setExtraMediaUrls] = useState([]);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (visible) {
      if (initialData) {
        form.setFieldsValue({
          ...initialData,
          content_ar: initialData.content_ar || "",
          content_en: initialData.content_en || "",
        });
        setMainMediaUrl(initialData.main_media || "");
        setExtraMediaUrls(
          Array.isArray(initialData.extra_media) ? initialData.extra_media : []
        );
      } else {
        form.resetFields();
        form.setFieldsValue({
          media_type: "image",
          content_ar: "",
          content_en: "",
        });
        setMainMediaUrl("");
        setExtraMediaUrls([]);
      }
    }
  }, [visible, initialData, form]);

  const handleMainUpload = (info) => {
    if (info.file.status === "uploading") {
      setUploading(true);
      return;
    }
    if (info.file.originFileObj) {
      setUploading(false);
      const url = URL.createObjectURL(info.file.originFileObj);
      setMainMediaUrl(url);
      form.setFieldsValue({ main_media_file: info.file.originFileObj });
      message.success("تم تجهيز الميديا الأساسية");
    }
  };

  const handleExtraUpload = (info) => {
    if (info.file.originFileObj) {
      const url = URL.createObjectURL(info.file.originFileObj);
      setExtraMediaUrls((prev) => [...prev, url]);

      const currentFiles = form.getFieldValue("extra_media_files") || [];
      form.setFieldsValue({
        extra_media_files: [...currentFiles, info.file.originFileObj],
      });

      message.success("تم إضافة صورة إضافية");
    }
  };

  const handleRemoveExtra = (indexToRemove) => {
    setExtraMediaUrls((prev) =>
      prev.filter((_, index) => index !== indexToRemove)
    );
    const currentFiles = form.getFieldValue("extra_media_files") || [];
    form.setFieldsValue({
      extra_media_files: currentFiles.filter(
        (_, index) => index !== indexToRemove
      ),
    });
  };

  const customRequest = ({ file, onSuccess }) => {
    setTimeout(() => onSuccess("ok"), 500);
  };

  const handleSubmit = () => {
    form
      .validateFields()
      .then((values) => {
        onSave(values);
      })
      .catch((info) => console.log("Validate Failed:", info));
  };

  return (
    <Modal
      title={
        <div className="flex items-center gap-3 text-right" dir="rtl">
          <div className="p-2 bg-primary/10 rounded-xl">
            <FileText className="w-5 h-5 text-primary" />
          </div>
          <span className="text-lg font-bold">
            {initialData ? "تعديل محتوى الصفحة" : "إضافة محتوى جديد"}
          </span>
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
      styles={{
        body: {
          direction: "rtl",
          padding: "24px",
          maxHeight: "85vh",
          overflowY: "auto",
        },
        header: { direction: "rtl" },
      }}
    >
      <Form form={form} layout="vertical" dir="rtl">
        <Form.Item name="main_media_file" hidden>
          <Input />
        </Form.Item>
        <Form.Item name="extra_media_files" hidden>
          <Input />
        </Form.Item>

        <div className="space-y-8">
          {/* Section: Arabic Content */}
          <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm space-y-4">
            <div className="flex items-center gap-2 text-primary font-bold border-b border-gray-100 pb-3 mb-2">
              <span className="w-2 h-6 bg-primary rounded-full"></span>
              المحتوى العربي
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Form.Item
                name="title_ar"
                label="العنوان بالعربي"
                rules={[{ required: true }]}
              >
                <Input placeholder="العنوان الرئيسي" size="large" />
              </Form.Item>
              <Form.Item name="sub_title_ar" label="عنوان فرعي بالعربي">
                <Input placeholder="عنوان ثانوي" size="large" />
              </Form.Item>
            </div>
            <Form.Item
              name="content_ar"
              label="المحتوى التفصيلي (بالعربي)"
              trigger="onChange"
              validateTrigger={["onBlur"]}
            >
              <RichTextEditor placeholder="اكتب المحتوى العربي هنا..." />
            </Form.Item>
            <Form.Item name="button_text_ar" label="نص الزر بالعربي">
              <Input placeholder="مثال: اكتشف المزيد" size="large" />
            </Form.Item>
          </div>
        </div>

        <div className="mt-6 bg-gray-50 rounded-xl p-5 border border-gray-100">
          <h4 className="text-sm font-bold text-primary mb-4">
            الإعدادات والميديا
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Form.Item name="button_link" label="رابط الزر">
              <Input placeholder="https://example.com" size="large" />
            </Form.Item>
            <Form.Item name="media_type" label="نوع الميديا">
              <Radio.Group>
                <Radio value="image">صورة</Radio>
                <Radio value="video">فيديو</Radio>
              </Radio.Group>
            </Form.Item>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                الميديا الأساسية (صورة أو فيديو)
              </label>
              <div className="flex items-start gap-4">
                <Upload
                  showUploadList={false}
                  customRequest={customRequest}
                  onChange={handleMainUpload}
                  accept={
                    form.getFieldValue("media_type") === "video"
                      ? "video/*"
                      : "image/*"
                  }
                >
                  <div className="w-40 h-40 border-2 border-dashed border-gray-200 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-primary transition-colors bg-white overflow-hidden">
                    {mainMediaUrl ? (
                      form.getFieldValue("media_type") === "video" ? (
                        <Film className="w-10 h-10 text-gray-400" />
                      ) : (
                        <Image
                          src={mainMediaUrl}
                          width="100%"
                          height="100%"
                          preview={false}
                          style={{ objectFit: "cover" }}
                        />
                      )
                    ) : (
                      <>
                        <UploadIcon className="w-8 h-8 text-gray-400 mb-2" />
                        <span className="text-xs text-gray-500">اختر ملف</span>
                      </>
                    )}
                  </div>
                </Upload>
                {mainMediaUrl && (
                  <Button
                    type="text"
                    danger
                    onClick={() => {
                      setMainMediaUrl("");
                      form.setFieldsValue({ main_media_file: null });
                    }}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                مجموعة صور إضافية (حتى 5 ملفات)
              </label>
              <div className="flex flex-wrap gap-2">
                {extraMediaUrls.map((url, index) => (
                  <div
                    key={index}
                    className="relative w-20 h-20 rounded-lg overflow-hidden border border-gray-200 group"
                  >
                    <Image
                      src={url}
                      width="100%"
                      height="100%"
                      style={{ objectFit: "cover" }}
                      preview={false}
                    />
                    <button
                      onClick={() => handleRemoveExtra(index)}
                      className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
                {extraMediaUrls.length < 5 && (
                  <Upload
                    showUploadList={false}
                    customRequest={customRequest}
                    onChange={handleExtraUpload}
                    accept="image/*"
                  >
                    <div className="w-20 h-20 border-2 border-dashed border-gray-200 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-primary transition-colors bg-white">
                      <Plus className="w-6 h-6 text-gray-400" />
                    </div>
                  </Upload>
                )}
              </div>
            </div>
          </div>
        </div>
      </Form>
    </Modal>
  );
};

export default ContentModal;
