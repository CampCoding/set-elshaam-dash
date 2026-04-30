// src/pages/dashboard/services/components/ServiceModal.jsx
import { useEffect, useState } from "react";
import {
  Modal,
  Form,
  Input,
  Select,
  Upload,
  message,
  Image,
  AutoComplete,
  Spin,
} from "antd";
import {
  Plus,
  Trash2,
  Upload as UploadIcon,
  Image as ImageIcon,
  X,
  MessageCircleQuestion,
  ServerCrash,
} from "lucide-react";
import Button from "../../../../components/common/Button";
import faqsService from "../../../../api/services/faqs.service";

const { TextArea } = Input;
const { Option } = Select;

// ✅ مكوّن صورة واحدة مع زر حذف
const ImageItem = ({ src, onRemove, isServer, removing }) => (
  <div className="relative aspect-square rounded-lg overflow-hidden border-2 border-gray-200 group">
    <Image
      src={src}
      width="100%"
      height="100%"
      style={{ objectFit: "cover" }}
      className="!w-full !h-full"
    />
    {/* badge يوضح إن الصورة من السيرفر */}
    {isServer && (
      <div className="absolute bottom-1 left-1 bg-blue-500/80 text-white text-[9px] px-1.5 py-0.5 rounded-full">
        محفوظة
      </div>
    )}
    <button
      onClick={onRemove}
      disabled={removing}
      className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-50"
    >
      {removing ? <Spin size="small" /> : <X className="w-3 h-3" />}
    </button>
  </div>
);

const ServiceModal = ({
  visible,
  onCancel,
  onSave,
  initialData,
  loading,
  onRemoveServerImage, // ✅ prop جديد
}) => {
  const [form] = Form.useForm();

  // صور السلايدر
  // serverSliderUrls = URLs موجودة على السيرفر
  // newSliderUrls    = URLs محلية (blob) للصور الجديدة
  const [serverSliderUrls, setServerSliderUrls] = useState([]);
  const [newSliderUrls, setNewSliderUrls] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [removingSlider, setRemovingSlider] = useState(null); // index اللي بيتمسح

  // صور المعرض
  const [serverGalleryUrls, setServerGalleryUrls] = useState([]);
  const [newGalleryUrls, setNewGalleryUrls] = useState([]);
  const [galleryUploading, setGalleryUploading] = useState(false);
  const [removingGallery, setRemovingGallery] = useState(null);

  const [globalFaqs, setGlobalFaqs] = useState([]);

  useEffect(() => {
    const fetchFaqs = async () => {
      try {
        const res = await faqsService.getFaqs({ limit: 100 });
        setGlobalFaqs(res.data || []);
      } catch (error) {
        console.error("Error fetching FAQs:", error);
      }
    };

    if (visible) {
      fetchFaqs();

      if (initialData) {
        const descriptionList = initialData.description_ar
          ? initialData.description_ar
              .split("\n")
              .filter((t) => t.trim())
              .map((text) => ({ text }))
          : [{ text: "" }];

        form.setFieldsValue({
          title_ar: initialData.title_ar,
          subtitle_ar: initialData.subtitle_ar,
          slug: initialData.slug,
          cta_text_ar: initialData.cta_text_ar,
          is_active: initialData.is_active,
          descriptionList,
          faqs: initialData.faqs || [],
        });

        // ✅ فصل صور السيرفر عن الجديدة
        const slider = Array.isArray(initialData.slider_images)
          ? initialData.slider_images.map((img) =>
              typeof img === "string" ? img : img.path
            )
          : [];
        setServerSliderUrls(slider);
        setNewSliderUrls([]);

        const gallery = Array.isArray(initialData.gallery_images)
          ? initialData.gallery_images.map((img) =>
              typeof img === "string" ? img : img.path
            )
          : [];
        setServerGalleryUrls(gallery);
        setNewGalleryUrls([]);
      } else {
        form.resetFields();
        form.setFieldsValue({
          is_active: 1,
          descriptionList: [{ text: "" }],
          faqs: [],
        });
        setServerSliderUrls([]);
        setNewSliderUrls([]);
        setServerGalleryUrls([]);
        setNewGalleryUrls([]);
      }
    }
  }, [visible, initialData, form]);

  // ✅ مسح صورة سيرفر من السلايدر
  const handleRemoveServerSlider = async (url, index) => {
    if (!initialData?.id || !onRemoveServerImage) return;
    setRemovingSlider(index);
    const success = await onRemoveServerImage(initialData.id, url, "slider");
    if (success) {
      setServerSliderUrls((prev) => prev.filter((_, i) => i !== index));
    }
    setRemovingSlider(null);
  };

  // ✅ مسح صورة سيرفر من الجاليري
  const handleRemoveServerGallery = async (url, index) => {
    if (!initialData?.id || !onRemoveServerImage) return;
    setRemovingGallery(index);
    const success = await onRemoveServerImage(initialData.id, url, "gallery");
    if (success) {
      setServerGalleryUrls((prev) => prev.filter((_, i) => i !== index));
    }
    setRemovingGallery(null);
  };

  // مسح صورة جديدة (لسه مرفعتش) من السلايدر
  const handleRemoveNewSlider = (index) => {
    setNewSliderUrls((prev) => prev.filter((_, i) => i !== index));
    const currentFiles = form.getFieldValue("slider_files") || [];
    form.setFieldsValue({
      slider_files: currentFiles.filter((_, i) => i !== index),
    });
    message.success("تم حذف الصورة");
  };

  // مسح صورة جديدة من الجاليري
  const handleRemoveNewGallery = (index) => {
    setNewGalleryUrls((prev) => prev.filter((_, i) => i !== index));
    const currentFiles = form.getFieldValue("gallery_files") || [];
    form.setFieldsValue({
      gallery_files: currentFiles.filter((_, i) => i !== index),
    });
    message.success("تم حذف الصورة");
  };

  const customUpload = ({ file, onSuccess }) => {
    setTimeout(() => onSuccess("ok"), 500);
  };

  const handleUpload = (info) => {
    if (info.file.status === "uploading") {
      setUploading(true);
      return;
    }
    if (info.file.status === "done") {
      setUploading(false);
      const url = URL.createObjectURL(info.file.originFileObj);
      setNewSliderUrls((prev) => [...prev, url]);
      const currentFiles = form.getFieldValue("slider_files") || [];
      form.setFieldsValue({
        slider_files: [...currentFiles, info.file.originFileObj],
      });
      message.success("تم إضافة الصورة للسلايدر");
    }
  };

  const handleGalleryUpload = (info) => {
    if (info.file.status === "uploading") {
      setGalleryUploading(true);
      return;
    }
    if (info.file.status === "done") {
      setGalleryUploading(false);
      const url = URL.createObjectURL(info.file.originFileObj);
      setNewGalleryUrls((prev) => [...prev, url]);
      const currentFiles = form.getFieldValue("gallery_files") || [];
      form.setFieldsValue({
        gallery_files: [...currentFiles, info.file.originFileObj],
      });
      message.success("تم تجهيز الصورة للمعرض");
    }
  };

  const handleFaqSelect = (selectedValue, fieldName) => {
    const foundFaq = globalFaqs.find(
      (faq) => (faq.question_ar || faq.question) === selectedValue
    );
    if (foundFaq) {
      form.setFieldValue(
        ["faqs", fieldName, "answer"],
        foundFaq.answer_ar || foundFaq.answer
      );
      message.success("تم جلب الإجابة تلقائياً");
    }
  };

  const handleSubmit = () => {
    form
      .validateFields()
      .then((values) => {
        const allValues = form.getFieldsValue(true);
        onSave({ ...allValues, ...values });
      })
      .catch((info) => console.log("Validate Failed:", info));
  };

  const handleCancel = () => {
    form.resetFields();
    setServerSliderUrls([]);
    setNewSliderUrls([]);
    setServerGalleryUrls([]);
    setNewGalleryUrls([]);
    onCancel();
  };

  const totalSlider = serverSliderUrls.length + newSliderUrls.length;
  const totalGallery = serverGalleryUrls.length + newGalleryUrls.length;

  return (
    <Modal
      title={
        <div className="flex items-center gap-3 text-right" dir="rtl">
          <div className="p-2 rounded-xl">
            {initialData ? (
              <ImageIcon className="w-5 h-5 text-primary" />
            ) : (
              <Plus className="w-5 h-5 text-primary" />
            )}
          </div>
          <span className="text-lg font-bold">
            {initialData ? "تعديل الخدمة" : "إضافة خدمة جديدة"}
          </span>
        </div>
      }
      open={visible}
      onOk={handleSubmit}
      onCancel={handleCancel}
      okText="حفظ"
      cancelText="إلغاء"
      okButtonProps={{
        className: "bg-primary h-10 px-6",
        loading: loading || uploading || galleryUploading,
      }}
      cancelButtonProps={{ className: "h-10 px-6" }}
      destroyOnClose
      width={750}
      centered
      styles={{
        body: {
          direction: "rtl",
          padding: "24px",
          maxHeight: "75vh",
          overflowY: "auto",
        },
        header: { direction: "rtl" },
      }}
    >
      <Form form={form} layout="vertical" className="mt-2" dir="rtl">
        <Form.Item name="slider_files" hidden>
          <Input />
        </Form.Item>
        <Form.Item name="gallery_files" hidden>
          <Input />
        </Form.Item>

        {/* المعلومات الأساسية */}
        <div className="bg-gray-50 rounded-xl p-4 mb-5 border border-gray-100">
          <h4 className="text-sm font-bold text-gray-600 mb-4">
            المعلومات الأساسية
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Form.Item
              name="title_ar"
              label="اسم الخدمة"
              rules={[{ required: true, message: "يرجى إدخال اسم الخدمة" }]}
            >
              <Input placeholder="اسم الخدمة" size="large" />
            </Form.Item>
            <Form.Item
              name="slug"
              label="الرابط (Slug)"
              rules={[{ required: true, message: "يرجى إدخال الرابط" }]}
            >
              <Input placeholder="slug" size="large" />
            </Form.Item>
          </div>
          <Form.Item
            name="subtitle_ar"
            label="العنوان الفرعي"
            rules={[{ required: true, message: "يرجى إدخال العنوان الفرعي" }]}
          >
            <Input placeholder="العنوان الفرعي" size="large" />
          </Form.Item>
          <Form.Item name="cta_text_ar" label="نص الزر">
            <Input placeholder="احجز الآن" size="large" />
          </Form.Item>
        </div>

        {/* صور السلايدر */}
        <div className="bg-gray-50 rounded-xl p-4 mb-5 border border-gray-100">
          <h4 className="text-sm font-bold text-gray-600 mb-4 flex items-center gap-2">
            صور السلايدر (Slider)
            <span className="text-xs font-normal text-gray-400 me-auto">
              ({totalSlider} صور)
            </span>
          </h4>

          {totalSlider > 0 && (
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 mb-4">
              <Image.PreviewGroup>
                {/* صور السيرفر */}
                {serverSliderUrls.map((img, index) => (
                  <ImageItem
                    key={`server-slider-${index}`}
                    src={img}
                    isServer
                    removing={removingSlider === index}
                    onRemove={() => handleRemoveServerSlider(img, index)}
                  />
                ))}
                {/* صور جديدة */}
                {newSliderUrls.map((img, index) => (
                  <ImageItem
                    key={`new-slider-${index}`}
                    src={img}
                    isServer={false}
                    onRemove={() => handleRemoveNewSlider(index)}
                  />
                ))}
              </Image.PreviewGroup>
            </div>
          )}

          <Upload
            showUploadList={false}
            customRequest={customUpload}
            onChange={handleUpload}
            accept="image/*"
            multiple
          >
            <Button
              icon={<UploadIcon className="w-4 h-4" />}
              loading={uploading}
              className="h-10"
            >
              رفع صور للسلايدر
            </Button>
          </Upload>
        </div>

        {/* الوصف التفصيلي */}
        <div className="bg-gray-50 rounded-xl p-4 mb-5 border border-gray-100">
          <h4 className="text-sm font-bold text-gray-600 mb-4">
            الوصف التفصيلي
          </h4>
          <Form.List name="descriptionList">
            {(fields, { add, remove }) => (
              <div className="space-y-3">
                {fields.map((field, index) => (
                  <div
                    key={field.key}
                    className="flex gap-2 items-start bg-white p-3 rounded-lg border border-gray-100"
                  >
                    <Form.Item
                      {...field}
                      name={[field.name, "text"]}
                      className="flex-1 mb-0"
                    >
                      <TextArea
                        placeholder={`الفقرة ${index + 1}...`}
                        autoSize={{ minRows: 2 }}
                      />
                    </Form.Item>
                    {fields.length > 1 && (
                      <Button
                        type="text"
                        danger
                        onClick={() => remove(field.name)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                ))}
                <Button
                  onClick={() => add({ text: "" })}
                  block
                  icon={<Plus className="w-4 h-4" />}
                >
                  إضافة فقرة
                </Button>
              </div>
            )}
          </Form.List>
        </div>

        {/* معرض الصور */}
        <div className="bg-gray-50 rounded-xl p-4 mb-5 border border-gray-100">
          <h4 className="text-sm font-bold text-gray-600 mb-4 flex items-center gap-2">
            معرض الصور الفرعية
            <span className="text-xs font-normal text-gray-400 me-auto">
              ({totalGallery} صور)
            </span>
          </h4>

          {totalGallery > 0 && (
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 mb-4">
              <Image.PreviewGroup>
                {/* صور السيرفر */}
                {serverGalleryUrls.map((img, index) => (
                  <ImageItem
                    key={`server-gallery-${index}`}
                    src={img}
                    isServer
                    removing={removingGallery === index}
                    onRemove={() => handleRemoveServerGallery(img, index)}
                  />
                ))}
                {/* صور جديدة */}
                {newGalleryUrls.map((img, index) => (
                  <ImageItem
                    key={`new-gallery-${index}`}
                    src={img}
                    isServer={false}
                    onRemove={() => handleRemoveNewGallery(index)}
                  />
                ))}
              </Image.PreviewGroup>
            </div>
          )}

          <Upload
            showUploadList={false}
            customRequest={customUpload}
            onChange={handleGalleryUpload}
            accept="image/*"
            multiple
          >
            <Button
              icon={<UploadIcon className="w-4 h-4" />}
              loading={galleryUploading}
              className="h-10"
            >
              رفع صور للمعرض
            </Button>
          </Upload>
        </div>

        {/* الأسئلة الشائعة */}
        <div className="bg-gray-50 rounded-xl p-4 mb-5 border border-gray-100">
          <h4 className="text-sm font-bold text-gray-600 mb-4 flex items-center gap-2">
            الأسئلة الشائعة (FAQ)
            <span className="text-xs font-normal text-gray-400 me-auto">
              اختر سؤالاً مسبقاً أو اكتب سؤالاً جديداً
            </span>
          </h4>
          <Form.List name="faqs">
            {(fields, { add, remove }) => (
              <div className="space-y-4">
                {fields.map((field, index) => (
                  <div
                    key={field.key}
                    className="relative bg-white p-4 rounded-lg border border-gray-200"
                  >
                    <button
                      type="button"
                      onClick={() => remove(field.name)}
                      className="absolute top-3 left-3 text-red-400 hover:text-red-600 bg-red-50 hover:bg-red-100 p-1.5 rounded-md transition-colors z-10"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <div className="flex gap-2 items-center mb-3">
                      <div className="w-6 h-6 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center text-xs font-bold">
                        {index + 1}
                      </div>
                      <span className="font-semibold text-gray-700 text-sm">
                        سؤال وإجابة
                      </span>
                    </div>
                    <Form.Item
                      {...field}
                      name={[field.name, "question"]}
                      label="السؤال"
                      rules={[{ required: true, message: "يرجى إدخال السؤال" }]}
                      className="mb-3"
                    >
                      <AutoComplete
                        options={globalFaqs.map((faq) => ({
                          value: faq.question_ar || faq.question,
                        }))}
                        onSelect={(value) => handleFaqSelect(value, field.name)}
                        placeholder="ابحث في الأسئلة أو اكتب سؤالاً جديداً..."
                        filterOption={(inputValue, option) =>
                          option.value
                            .toUpperCase()
                            .indexOf(inputValue.toUpperCase()) !== -1
                        }
                        className="w-full"
                        size="large"
                      />
                    </Form.Item>
                    <Form.Item
                      {...field}
                      name={[field.name, "answer"]}
                      label="الإجابة"
                      rules={[
                        { required: true, message: "يرجى إدخال الإجابة" },
                      ]}
                      className="mb-0"
                    >
                      <TextArea
                        placeholder="اكتب الإجابة التفصيلية هنا..."
                        autoSize={{ minRows: 2, maxRows: 5 }}
                        className="rounded-lg"
                      />
                    </Form.Item>
                  </div>
                ))}
                <Button
                  onClick={() => add()}
                  block
                  className="h-10 rounded-lg border-purple-300 text-purple-600 hover:text-purple-700 hover:border-purple-400 flex items-center justify-center gap-2 bg-white"
                >
                  <MessageCircleQuestion className="w-4 h-4" /> إضافة سؤال
                </Button>
              </div>
            )}
          </Form.List>
        </div>

        {/* الإعدادات */}
        <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
          <h4 className="text-sm font-bold text-gray-600 mb-4">الإعدادات</h4>
          <Form.Item name="is_active" label="حالة الخدمة">
            <Select size="large">
              <Option value={1}>مفعّل</Option>
              <Option value={0}>غير مفعّل</Option>
            </Select>
          </Form.Item>
        </div>
      </Form>
    </Modal>
  );
};

export default ServiceModal;
