
import { useEffect } from "react";
import { Modal, Form, Input, Select, Switch } from "antd";
import { PackagePlus, PackageCheck } from "lucide-react";

const { Option } = Select;


const defaultFeatures = [
  "البحث عن شريك",
  "حجز صالة الأفراح",
  "بوفيه طعام",
  "فرقة زفة ودقة ستي للسيدات",
  "زغاريد",
  "فرقة العراضة الشامية رجال",
  "تأجير بدلات",
  "تصوير المناسبات",
  "DJ",
];

const PackageModal = ({ visible, onCancel, onSave, initialData }) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (visible) {
      if (initialData) {
        form.setFieldsValue({
          ...initialData,
          name_ar: initialData.name_ar || initialData.name,
          features_ar: initialData.features_ar || initialData.services || [],
          price_text_ar: initialData.price_text_ar || initialData.price,
          is_active: initialData.is_active === 1 || initialData.is_active === true,
        });
      } else {
        form.resetFields();
        form.setFieldsValue({ is_active: true, features_ar: [] });
      }
    }
  }, [visible, initialData, form]);

  const handleSubmit = () => {
    form
      .validateFields()
      .then((values) => {
        onSave(values);
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
              <PackageCheck className="w-5 h-5 text-primary" />
            ) : (
              <PackagePlus className="w-5 h-5 text-primary" />
            )}
          </div>
          <span className="text-lg font-bold">
            {initialData ? "تعديل الباقة" : "إضافة باقة جديدة"}
          </span>
        </div>
      }
      open={visible}
      onOk={handleSubmit}
      onCancel={onCancel}
      okText="حفظ الباقة"
      cancelText="إلغاء"
      okButtonProps={{ className: "bg-primary h-10 px-6" }}
      cancelButtonProps={{ className: "h-10 px-6" }}
      destroyOnClose
      width={600}
      centered
      styles={{
        body: { direction: "rtl", padding: "24px" },
        header: { direction: "rtl" },
      }}
    >
      <Form form={form} layout="vertical" className="mt-2" dir="rtl">
        <div className="bg-gray-50 rounded-xl p-5 border border-gray-100 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Form.Item
              name="name_ar"
              label={<span className="font-medium">اسم الباقة</span>}
              rules={[{ required: true, message: "يرجى إدخال اسم الباقة" }]}
            >
              <Input
                placeholder="مثال: الباقة الملكية"
                size="large"
                className="rounded-lg"
              />
            </Form.Item>

            <Form.Item
              name="price_text_ar"
              label={<span className="font-medium">السعر (نصي)</span>}
              rules={[{ required: true, message: "يرجى إدخال سعر الباقة" }]}
            >
              <Input
                placeholder="مثال: 3500 ريال أو اسأل عن السعر"
                size="large"
                className="rounded-lg"
              />
            </Form.Item>
          </div>

          <Form.Item
            name="features_ar"
            label={
              <span className="font-medium">الميزات المشمولة في الباقة</span>
            }
            rules={[
              { required: true, message: "يرجى اختيار ميزة واحدة على الأقل" },
            ]}
          >
            <Select
              mode="tags"
              size="large"
              placeholder="اختر الميزات أو اكتب ميزة جديدة..."
              className="rounded-lg"
              maxTagCount="responsive"
              allowClear
            >
              {defaultFeatures.map((feature) => (
                <Option key={feature} value={feature}>
                  {feature}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="is_active"
            label={<span className="font-medium">حالة الباقة</span>}
            valuePropName="checked"
          >
            <Switch checkedChildren="مفعلة" unCheckedChildren="معطلة" />
          </Form.Item>
        </div>
      </Form>
    </Modal>
  );
};

export default PackageModal;
