// src/pages/dashboard/gallery/items/GalleryItemModal.jsx
import { useEffect, useState } from "react";
import {
  Modal,
  Form,
  Input,
  Select,
  Upload,
  Button,
  message,
  Image,
} from "antd";
import {
  ImagePlus,
  Image as ImageIcon,
  Upload as UploadIcon,
  X,
} from "lucide-react";

const { Option } = Select;

const CATEGORIES = [
  "زواج",
  "خطوبة",
  "حفلات",
  "قاعات",
  "تراث",
  "ضيافة",
  "تصوير",
  "بدلات عروس",
  "أخرى",
];

const OTHER_VALUE = "أخرى";

const GalleryItemModal = ({ visible, onCancel, onSave, initialData }) => {
  const [form] = Form.useForm();
  const [imageUrl, setImageUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [isOtherCategory, setIsOtherCategory] = useState(false);

  useEffect(() => {
    if (visible) {
      if (initialData) {
        const categoryValue = initialData.category_ar;
        const isPredefined = CATEGORIES.includes(categoryValue);

        if (isPredefined && categoryValue !== OTHER_VALUE) {
          // التصنيف موجود في القائمة المحددة مسبقاً
          form.setFieldsValue({
            category_ar: categoryValue,
            custom_category: "",
            title_ar: initialData.title_ar,
          });
          setIsOtherCategory(false);
        } else {
          // التصنيف مخصص (غير موجود في القائمة) → نختار "أخرى" ونملأ الحقل المخصص
          form.setFieldsValue({
            category_ar: OTHER_VALUE,
            custom_category: categoryValue === OTHER_VALUE ? "" : categoryValue,
            title_ar: initialData.title_ar,
          });
          setIsOtherCategory(true);
        }

        setImageUrl(initialData.image_path || initialData.image || "");
      } else {
        form.resetFields();
        setImageUrl("");
        setIsOtherCategory(false);
      }
    }
  }, [visible, initialData, form]);

  const handleCategoryChange = (value) => {
    if (value === OTHER_VALUE) {
      setIsOtherCategory(true);
      form.setFieldsValue({ custom_category: "" });
    } else {
      setIsOtherCategory(false);
      form.setFieldsValue({ custom_category: "" });
    }
  };

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
      message.success("تم تجهيز الصورة للرفع");
    }
  };

  const customRequest = ({ file, onSuccess }) => {
    setTimeout(() => onSuccess("ok"), 500);
  };

  const handleSubmit = () => {
    form
      .validateFields()
      .then((values) => {
        // لو المستخدم اختار "أخرى" → نستبدل category_ar بالقيمة المخصصة
        const finalValues = { ...values };

        if (values.category_ar === OTHER_VALUE) {
          finalValues.category_ar = values.custom_category?.trim();
        }

        // حذف الحقل المؤقت
        delete finalValues.custom_category;

        onSave(finalValues);
      })
      .catch((info) => {
        console.log("Validate Failed:", info);
      });
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
      okButtonProps={{ className: "bg-primary h-10 px-6", loading: uploading }}
      cancelButtonProps={{ className: "h-10 px-6" }}
      destroyOnClose
      width={550}
      centered
      styles={{
        body: { direction: "rtl", padding: "24px" },
        header: { direction: "rtl" },
      }}
    >
      <Form form={form} layout="vertical" dir="rtl" className="mt-2">
        <Form.Item name="image_file" hidden>
          <Input />
        </Form.Item>

        <div className="bg-gray-50 rounded-xl p-5 border border-gray-100 space-y-4">
          {/* Title */}
          <Form.Item
            name="title_ar"
            label="عنوان الصورة"
            rules={[
              {
                required: !initialData,
                message: "يرجى إدخال عنوان الصورة",
              },
            ]}
            hidden={!!initialData}
          >
            <Input
              placeholder="مثال: صورة قاعة الأفراح"
              size="large"
              className="rounded-lg"
            />
          </Form.Item>

          {/* Category */}
          <Form.Item
            name="category_ar"
            label="التصنيف"
            rules={[{ required: true, message: "يرجى اختيار تصنيف" }]}
          >
            <Select
              size="large"
              placeholder="اختر تصنيف"
              className="rounded-lg"
              onChange={handleCategoryChange}
            >
              {CATEGORIES.map((cat) => (
                <Option key={cat} value={cat}>
                  {cat}
                </Option>
              ))}
            </Select>
          </Form.Item>

          {/* Custom Category — يظهر فقط عند اختيار "أخرى" */}
          {isOtherCategory && (
            <Form.Item
              name="custom_category"
              label="اكتب التصنيف"
              rules={[
                { required: true, message: "يرجى كتابة اسم التصنيف" },
                {
                  whitespace: true,
                  message: "التصنيف لا يمكن أن يكون فارغاً",
                },
              ]}
              className="animate-fadeIn"
            >
              <Input
                placeholder="مثال: ديكورات، إكسسوارات، كوش..."
                size="large"
                className="rounded-lg"
                autoFocus
              />
            </Form.Item>
          )}

          {/* Image Upload */}
          <div>
            <span className="font-medium text-sm text-gray-600 block mb-3">
              ملف الصورة
            </span>
            <div className="flex flex-col sm:flex-row gap-4 items-start">
              <div className="w-full sm:w-44 h-36 rounded-xl border-2 border-dashed border-gray-200 overflow-hidden bg-white flex items-center justify-center shadow-sm">
                {imageUrl ? (
                  <Image
                    src={imageUrl}
                    width="100%"
                    height="100%"
                    style={{ objectFit: "cover" }}
                    preview={false}
                  />
                ) : (
                  <div className="text-center text-gray-400 flex flex-col items-center gap-1">
                    <ImageIcon size={28} strokeWidth={1} />
                    <span className="text-xs">معاينة</span>
                  </div>
                )}
              </div>
              <div className="flex-1 space-y-2">
                <Upload
                  showUploadList={false}
                  customRequest={customRequest}
                  onChange={handleUpload}
                  accept="image/*"
                  maxCount={1}
                >
                  <Button
                    icon={<UploadIcon className="w-4 h-4 ml-1" />}
                    loading={uploading}
                    className="h-10 rounded-lg w-full"
                  >
                    {initialData ? "تغيير الصورة" : "رفع صورة"}
                  </Button>
                </Upload>
                {imageUrl && (
                  <Button
                    type="text"
                    danger
                    size="small"
                    icon={<X size={14} />}
                    onClick={() => {
                      setImageUrl("");
                      form.setFieldsValue({ image_file: null });
                    }}
                  >
                    حذف الصورة
                  </Button>
                )}
                <p className="text-xs text-gray-400">
                  PNG, JPG, WEBP — بحد أقصى 5MB
                </p>
              </div>
            </div>
          </div>
        </div>
      </Form>
    </Modal>
  );
};

export default GalleryItemModal;
