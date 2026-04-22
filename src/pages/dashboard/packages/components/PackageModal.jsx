// src/pages/dashboard/packages/components/PackageModal.jsx
import { useEffect } from "react";
import { Modal, Form, Input, Select, InputNumber } from "antd";
import { PackagePlus, PackageCheck } from "lucide-react";
import { availableServicesList } from "../usePackagesPage";

const { Option } = Select;

const PackageModal = ({ visible, onCancel, onSave, initialData }) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (visible) {
      if (initialData) {
        form.setFieldsValue(initialData);
      } else {
        form.resetFields();
      }
    }
  }, [visible, initialData, form]);

  const handleSubmit = () => {
    form
      .validateFields()
      .then((values) => {
        onSave({
          ...values,
          price: String(values.price),
        });
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
              name="name"
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
              name="price"
              label={<span className="font-medium">السعر (باليورو €)</span>}
              rules={[{ required: true, message: "يرجى إدخال سعر الباقة" }]}
            >
              <InputNumber
                placeholder="مثال: 1200"
                size="large"
                className="w-full! rounded-lg"
                min={0}
                addonAfter="€"
              />
            </Form.Item>
          </div>

          <Form.Item
            name="services"
            label={
              <span className="font-medium">الخدمات المشمولة في الباقة</span>
            }
            rules={[
              { required: true, message: "يرجى اختيار خدمة واحدة على الأقل" },
            ]}
          >
            <Select
              mode="multiple"
              size="large"
              placeholder="اختر الخدمات..."
              className="rounded-lg"
              maxTagCount="responsive"
              allowClear
            >
              {availableServicesList.map((service) => (
                <Option key={service} value={service}>
                  {service}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </div>
      </Form>
    </Modal>
  );
};

export default PackageModal;
