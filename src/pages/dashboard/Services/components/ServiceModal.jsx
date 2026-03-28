// src/pages/dashboard/services/components/ServiceModal.jsx
import { useEffect, useState } from "react";
import {
  Modal,
  Form,
  Input,
  Select,
  Switch,
  Upload,
  message,
  Image,
  AutoComplete, // ✅ تم استدعاء AutoComplete
} from "antd";
import {
  Plus,
  Trash2,
  Upload as UploadIcon,
  Image as ImageIcon,
  X,
  Images,
  MessageCircleQuestion,
} from "lucide-react";
import Button from "../../../../components/common/Button";

const { TextArea } = Input;
const { Option } = Select;

// ✅ داتا الأسئلة الشائعة العامة (تقدر بعدين تجيبها من الـ API)
const globalFaqData = [
  {
    id: 1,
    question: "كيف تتم عملية المطابقة؟",
    answer:
      "نقوم بدراسة ملفك الشخصي بعناية فائقة، ثم نستخدم نظاماً متقدماً لمطابقة المعايير الشخصية والثقافية والدينية. بعد ذلك نرشح لك أنسب الخيارات المتوافقة مع تطلعاتك، ونرتب لقاءات آمنة ومريحة لضمان أفضل تجربة.",
  },
  {
    id: 2,
    question: "هل تقدمون باقات شاملة؟",
    answer:
      "نعم، نقدم باقات متنوعة تشمل تنظيم حفلات الزفاف الكاملة من الألف إلى الياء، بما في ذلك التصوير، الديكور، الإضاءة، الموسيقى، وتنسيق كافة تفاصيل اليوم المميز.",
  },
  {
    id: 3,
    question: "هل التصوير يشمل داخلي وخارجي؟",
    answer:
      "بالتأكيد! باقاتنا للتصوير تشمل جلسات داخلية في قاعات الأفراح وجلسات خارجية في أجمل المواقع الطبيعية أو التاريخية.",
  },
  {
    id: 4,
    question: "هل يمكن الدفع بالتقسيط؟",
    answer:
      "نعم، نوفر خيارات دفع مرنة تشمل الدفع بالتقسيط على عدة أشهر، حسب الباقة المختارة. نهدف لتسهيل عملية التخطيط المالي لضمان راحتكم.",
  },
  {
    id: 5,
    question: "ماذا يحدث في حال إلغاء الحجز؟",
    answer:
      "سياسة الإلغاء تختلف حسب وقت الإلغاء ونوع الباقة. في حال الإلغاء قبل موعد الفعالية بفترة كافية (عادة شهر أو أكثر)، يمكن استرداد جزء من المبلغ أو تأجيل الحجز.",
  },
  {
    id: 6,
    question: "هل الفرق الاستعراضية خاصة بكم؟",
    answer:
      "نتعاون مع أفضل الفرق الاستعراضية والفنية في المنطقة، ونضمن لك تجربة ترفيهية احترافية ومميزة. يمكنك اختيار نوع العروض التي تناسب ذوقك وثقافة الحفل.",
  },
];

const ServiceModal = ({ visible, onCancel, onSave, initialData }) => {
  const [form] = Form.useForm();
  const [imageUrl, setImageUrl] = useState("");
  const [uploading, setUploading] = useState(false);

  // صور المعرض الفرعية
  const [galleryImages, setGalleryImages] = useState([]);
  const [galleryUploading, setGalleryUploading] = useState(false);
  const [galleryUrlInput, setGalleryUrlInput] = useState("");

  useEffect(() => {
    if (visible) {
      if (initialData) {
        form.setFieldsValue({
          ...initialData,
          descriptionList: initialData.description?.map((text) => ({
            text,
          })) || [{ text: "" }],
          faqs: initialData.faqs || [], // تحميل الأسئلة
        });
        setImageUrl(initialData.image || "");
        setGalleryImages(initialData.images || []);
      } else {
        form.resetFields();
        form.setFieldsValue({
          status: "active",
          category: "زواج",
          requiresLogin: false,
          descriptionList: [{ text: "" }],
          faqs: [], // تهيئة الأسئلة
        });
        setImageUrl("");
        setGalleryImages([]);
      }
    }
  }, [visible, initialData, form]);

  // ✅ دالة لاكتشاف اختيار سؤال من القائمة لملء الإجابة تلقائياً
  const handleFaqSelect = (selectedValue, fieldName) => {
    const foundFaq = globalFaqData.find(
      (faq) => faq.question === selectedValue
    );
    if (foundFaq) {
      // تحديث حقل "الإجابة" لنفس الاندكس في المصفوفة
      form.setFieldValue(["faqs", fieldName, "answer"], foundFaq.answer);
      message.success("تم جلب الإجابة تلقائياً");
    }
  };

  const handleUpload = (info) => {
    if (info.file.status === "uploading") {
      setUploading(true);
      return;
    }
    setUploading(false);
    const fakeUrl = URL.createObjectURL(info.file.originFileObj);
    setImageUrl(fakeUrl);
    form.setFieldsValue({ image: fakeUrl });
    message.success("تم رفع الصورة بنجاح");
  };

  const handleGalleryUpload = (info) => {
    if (info.file.status === "uploading") {
      setGalleryUploading(true);
      return;
    }
    setGalleryUploading(false);
    const fakeUrl = URL.createObjectURL(info.file.originFileObj);
    setGalleryImages((prev) => [...prev, fakeUrl]);
    message.success("تم إضافة الصورة للمعرض");
  };

  const handleRemoveGalleryImage = (indexToRemove) => {
    setGalleryImages((prev) =>
      prev.filter((_, index) => index !== indexToRemove)
    );
    message.success("تم حذف الصورة");
  };

  const handleAddGalleryUrl = () => {
    if (galleryUrlInput.trim()) {
      setGalleryImages((prev) => [...prev, galleryUrlInput.trim()]);
      setGalleryUrlInput("");
      message.success("تم إضافة الصورة للمعرض");
    }
  };

  const customUpload = ({ file, onSuccess }) => {
    setTimeout(() => {
      onSuccess("ok");
    }, 1000);
  };

  const handleSubmit = () => {
    form
      .validateFields()
      .then((values) => {
        const processedValues = {
          ...values,
          description:
            values.descriptionList
              ?.map((item) => item?.text?.trim())
              .filter((text) => text && text !== "") || [],
          image: imageUrl || values.image,
          images: galleryImages,
          faqs: values.faqs || [], // إرسال الأسئلة (سواء من الداتا أو جديدة)
        };
        delete processedValues.descriptionList;
        onSave(processedValues);
      })
      .catch((info) => {
        console.log("Validate Failed:", info);
      });
  };

  const handleCancel = () => {
    form.resetFields();
    setImageUrl("");
    setGalleryImages([]);
    setGalleryUrlInput("");
    onCancel();
  };

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
      okButtonProps={{ className: "bg-primary h-10 px-6" }}
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
        {/* ===== القسم الأول: المعلومات الأساسية ===== */}
        <div className="bg-gray-50 rounded-xl p-4 mb-5 border border-gray-100">
          <h4 className="text-sm font-bold text-gray-600 mb-4 flex items-center gap-2">
            المعلومات الأساسية
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Form.Item
              name="name"
              label={<span className="font-medium">اسم الخدمة</span>}
              rules={[{ required: true, message: "يرجى إدخال اسم الخدمة" }]}
            >
              <Input
                placeholder="مثال: البحث عن شريك"
                size="large"
                className="rounded-lg"
              />
            </Form.Item>

            <Form.Item
              name="category"
              label={<span className="font-medium">التصنيف</span>}
              rules={[{ required: true, message: "يرجى اختيار التصنيف" }]}
            >
              <Select
                size="large"
                placeholder="اختر تصنيف الخدمة"
                className="rounded-lg"
              >
                <Option value="زواج">زواج</Option>
                <Option value="قاعات">قاعات</Option>
                <Option value="ضيافة">ضيافة</Option>
                <Option value="فرق موسيقية">فرق موسيقية</Option>
                <Option value="تراث">تراث</Option>
                <Option value="ملابس">ملابس</Option>
                <Option value="صوتيات">صوتيات</Option>
                <Option value="تصوير">تصوير</Option>
              </Select>
            </Form.Item>
          </div>

          <Form.Item
            name="subtitle"
            label={<span className="font-medium">العنوان الفرعي</span>}
            rules={[{ required: true, message: "يرجى إدخال العنوان الفرعي" }]}
          >
            <Input
              placeholder="مثال: خدمة التوفيق بين الراغبين في الزواج"
              size="large"
              className="rounded-lg"
            />
          </Form.Item>
        </div>

        {/* ===== القسم الثاني: الوصف التفصيلي ===== */}
        <div className="bg-gray-50 rounded-xl p-4 mb-5 border border-gray-100">
          <h4 className="text-sm font-bold text-gray-600 mb-4 flex items-center gap-2">
            الوصف التفصيلي
            <span className="text-xs font-normal text-gray-400 me-auto">
              أضف فقرة أو أكثر
            </span>
          </h4>

          <Form.List name="descriptionList">
            {(fields, { add, remove }) => (
              <div className="space-y-3">
                {fields.map((field, index) => (
                  <div
                    key={field.key}
                    className="flex gap-2 items-start bg-white p-3 rounded-lg border border-gray-200"
                  >
                    <div className="flex-shrink-0 w-7 h-7 bg-primary/10 text-primary rounded-full flex items-center justify-center text-xs font-bold mt-1">
                      {index + 1}
                    </div>
                    <Form.Item
                      {...field}
                      name={[field.name, "text"]}
                      className="flex-1 mb-0"
                      rules={[
                        {
                          required: index === 0,
                          message: "يرجى إدخال الفقرة الأولى على الأقل",
                        },
                      ]}
                    >
                      <TextArea
                        placeholder={`الفقرة ${index + 1}...`}
                        autoSize={{ minRows: 2, maxRows: 4 }}
                        className="rounded-lg"
                      />
                    </Form.Item>
                    {fields.length > 1 && (
                      <Button
                        type="text"
                        danger
                        onClick={() => remove(field.name)}
                        className="flex-shrink-0 mt-1 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                ))}
                <Button
                  onClick={() => add({ text: "" })}
                  block
                  className="h-10 rounded-lg border-primary/30 text-white hover:border-accent flex items-center justify-center gap-2 bg-white"
                >
                  <Plus className="w-4 h-4" /> إضافة فقرة جديدة
                </Button>
              </div>
            )}
          </Form.List>
        </div>

        {/* ===== القسم الثالث: الأسئلة الشائعة (FAQ) ===== */}
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

                    {/* ✅ استخدام AutoComplete هنا بدلاً من Input */}
                    <Form.Item
                      {...field}
                      name={[field.name, "question"]}
                      label="السؤال"
                      rules={[{ required: true, message: "يرجى إدخال السؤال" }]}
                      className="mb-3"
                      extra="يمكنك الاختيار من القائمة لجلب الإجابة تلقائياً، أو كتابة سؤالك الخاص."
                    >
                      <AutoComplete
                        options={globalFaqData.map((faq) => ({
                          value: faq.question,
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

        {/* ===== القسم الرابع: الصورة الرئيسية ===== */}
        <div className="bg-gray-50 rounded-xl p-4 mb-5 border border-gray-100">
          <h4 className="text-sm font-bold text-gray-600 mb-4 flex items-center gap-2">
            الصورة الرئيسية
          </h4>

          <div className="flex flex-col sm:flex-row gap-4">
            <div className="w-full sm:w-40 h-32 rounded-xl border-2 border-dashed border-gray-300 overflow-hidden bg-white flex items-center justify-center">
              {imageUrl ? (
                <img
                  src={imageUrl}
                  alt="Preview"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = "https://via.placeholder.com/150?text=خطأ";
                  }}
                />
              ) : (
                <div className="text-center text-gray-400">
                  <ImageIcon className="w-8 h-8 mx-auto mb-1 opacity-50" />
                  <span className="text-xs">معاينة</span>
                </div>
              )}
            </div>

            <div className="flex-1 space-y-3">
              <Upload
                name="image"
                showUploadList={false}
                customRequest={customUpload}
                onChange={handleUpload}
                accept="image/*"
              >
                <Button
                  icon={<UploadIcon className="w-4 h-4" />}
                  loading={uploading}
                  className="h-10 rounded-lg flex items-center gap-2"
                >
                  {uploading ? "جاري الرفع..." : "رفع صورة من جهازك"}
                </Button>
              </Upload>

              <div className="flex items-center gap-2 text-gray-400 text-xs">
                <div className="flex-1 h-px bg-gray-200"></div>
                <span>أو</span>
                <div className="flex-1 h-px bg-gray-200"></div>
              </div>

              <Form.Item
                name="image"
                className="mb-0"
                rules={[
                  {
                    required: !imageUrl,
                    message: "يرجى رفع صورة أو إدخال رابط",
                  },
                ]}
              >
                <Input
                  placeholder="أدخل رابط الصورة مباشرة..."
                  size="large"
                  dir="ltr"
                  className="rounded-lg text-left"
                  onChange={(e) => setImageUrl(e.target.value)}
                />
              </Form.Item>
            </div>
          </div>
        </div>

        {/* ===== القسم الخامس: معرض الصور الفرعية ===== */}
        <div className="bg-gray-50 rounded-xl p-4 mb-5 border border-gray-100">
          <h4 className="text-sm font-bold text-gray-600 mb-4 flex items-center gap-2">
            معرض الصور
            <span className="text-xs font-normal text-gray-400 me-auto">
              ({galleryImages.length} صور)
            </span>
          </h4>

          {galleryImages.length > 0 && (
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 mb-4">
              <Image.PreviewGroup>
                {galleryImages.map((img, index) => (
                  <div
                    key={index}
                    className="relative aspect-square rounded-lg overflow-hidden border-2 border-gray-200 group"
                  >
                    <Image
                      src={img}
                      alt={`صورة ${index + 1}`}
                      width="100%"
                      height="100%"
                      style={{ objectFit: "cover" }}
                      className="!w-full !h-full"
                      fallback="https://via.placeholder.com/100?text=خطأ"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveGalleryImage(index)}
                      className="absolute top-1 right-1 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                    >
                      <X className="w-3 h-3" />
                    </button>
                    <div className="absolute bottom-1 left-1 bg-black/60 text-white text-xs px-1.5 py-0.5 rounded">
                      {index + 1}
                    </div>
                  </div>
                ))}
              </Image.PreviewGroup>
            </div>
          )}

          <div className="space-y-3">
            <div className="flex gap-2">
              <Upload
                name="gallery"
                showUploadList={false}
                customRequest={customUpload}
                onChange={handleGalleryUpload}
                accept="image/*"
                multiple
              >
                <Button
                  icon={<UploadIcon className="w-4 h-4" />}
                  loading={galleryUploading}
                  className="h-10 rounded-lg flex items-center gap-2"
                >
                  {galleryUploading ? "جاري الرفع..." : "رفع صور متعددة"}
                </Button>
              </Upload>
            </div>

            <div className="flex items-center gap-2 text-gray-400 text-xs">
              <div className="flex-1 h-px bg-gray-200"></div>
              <span>أو أضف رابط</span>
              <div className="flex-1 h-px bg-gray-200"></div>
            </div>

            <div className="flex gap-2">
              <Input
                placeholder="أدخل رابط الصورة..."
                size="large"
                dir="ltr"
                className="rounded-lg text-left flex-1"
                value={galleryUrlInput}
                onChange={(e) => setGalleryUrlInput(e.target.value)}
                onPressEnter={handleAddGalleryUrl}
              />
              <Button
                icon={<Plus className="w-4 h-4" />}
                onClick={handleAddGalleryUrl}
                disabled={!galleryUrlInput.trim()}
                className="h-10 rounded-lg bg-primary text-white hover:bg-primary/90 flex items-center gap-1"
              >
                إضافة
              </Button>
            </div>

            {galleryImages.length === 0 && (
              <div className="text-center py-4 text-gray-400 text-sm">
                <Images className="w-8 h-8 mx-auto mb-2 opacity-50" />
                لم يتم إضافة صور للمعرض بعد
              </div>
            )}
          </div>
        </div>

        {/* ===== القسم السادس: الإعدادات ===== */}
        <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
          <h4 className="text-sm font-bold text-gray-600 mb-4 flex items-center gap-2">
            الإعدادات
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Form.Item
              name="status"
              label={<span className="font-medium">حالة الخدمة</span>}
              className="mb-0"
            >
              <Select size="large" className="rounded-lg">
                <Option value="active">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    مفعّل
                  </div>
                </Option>
                <Option value="inactive">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-red-500 rounded-full"></span>غير
                    مفعّل
                  </div>
                </Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="requiresLogin"
              label={<span className="font-medium">صلاحية الوصول</span>}
              valuePropName="checked"
              className="mb-0"
            >
              <div className="bg-white border border-gray-200 rounded-lg p-3 flex items-center justify-between">
                <span className="text-gray-600 text-sm">تتطلب تسجيل دخول</span>
                <Switch
                  checkedChildren="نعم"
                  unCheckedChildren="لا"
                  className="bg-gray-300"
                />
              </div>
            </Form.Item>
          </div>
        </div>
      </Form>
    </Modal>
  );
};

export default ServiceModal;
