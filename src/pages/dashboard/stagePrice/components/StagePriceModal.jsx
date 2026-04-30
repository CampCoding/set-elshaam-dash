// src/pages/dashboard/stagePrice/components/StagePriceModal.jsx

import { useEffect } from "react";
import { Modal, Form, Input, Select, InputNumber } from "antd";
import { Plus, Euro } from "lucide-react";

const { TextArea } = Input;
const { Option } = Select;

const StagePriceModal = ({
  visible,
  onCancel,
  onSave,
  initialData,
  loading,
}) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (visible) {
      if (initialData) {
        form.setFieldsValue({
          title: initialData.title,
          price: parseFloat(initialData.price),
          description: initialData.description,
          details: initialData.details,
          is_active: initialData.is_active,
        });
      } else {
        form.resetFields();
        form.setFieldsValue({ is_active: 1 });
      }
    }
  }, [visible, initialData, form]);

  const handleSubmit = () => {
    form
      .validateFields()
      .then((values) => {
        // ✅ بيبعت بالظبط زي الـ API body
        const payload = {
          title: values.title,
          description: values.description,
          price: values.price,
          details: values.details,
          is_active: values.is_active?.toString(),
        };
        onSave(payload);
      })
      .catch((info) => {
        console.log("Validate Failed:", info);
      });
  };

  const handleCancel = () => {
    form.resetFields();
    onCancel();
  };

  return (
    <Modal
      title={
        <div className="flex items-center gap-2" dir="rtl">
          {initialData ? (
            <Euro className="w-5 h-5 text-white bg-primary rounded-full p-1" />
          ) : (
            <Plus className="w-5 h-5 text-white bg-primary rounded-full p-1" />
          )}
          <span className="text-lg font-bold text-primary">
            {initialData ? "تعديل المرحلة" : "إضافة مرحلة جديدة"}
          </span>
        </div>
      }
      open={visible}
      onOk={handleSubmit}
      onCancel={handleCancel}
      okText="حفظ"
      cancelText="إلغاء"
      confirmLoading={loading}
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
        {/* معلومات المرحلة */}
        <div className="bg-gray-50 rounded-xl p-4 mb-5 border border-gray-100">
          <h4 className="text-sm font-bold text-gray-600 mb-4">
            معلومات المرحلة
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* title */}
            <Form.Item
              name="title"
              label={<span className="font-medium">اسم المرحلة</span>}
              rules={[{ required: true, message: "يرجى إدخال اسم المرحلة" }]}
            >
              <Input
                placeholder="مثال: مرحلة الاشتراك"
                size="large"
                className="rounded-lg"
              />
            </Form.Item>

            {/* price */}
            <Form.Item
              name="price"
              label={<span className="font-medium">السعر</span>}
              rules={[{ required: true, message: "يرجى إدخال السعر" }]}
            >
              <InputNumber
                className="w-full! rounded-lg"
                size="large"
                min={0}
                placeholder="أدخل السعر..."
                addonAfter="EUR"
              />
            </Form.Item>
          </div>

          {/* details */}
          <Form.Item
            name="details"
            label={<span className="font-medium">تفاصيل السعر</span>}
          >
            <Input
              placeholder="مثال: 40 يورو + القيمة المضافة (10 يورو)"
              size="large"
              className="rounded-lg"
            />
          </Form.Item>

          {/* description */}
          <Form.Item
            name="description"
            label={<span className="font-medium">الوصف والملاحظات</span>}
            rules={[{ required: true, message: "يرجى إدخال الوصف" }]}
          >
            <TextArea
              placeholder="اكتب وصفاً أو ملاحظات حول المرحلة..."
              autoSize={{ minRows: 3, maxRows: 6 }}
              className="rounded-lg"
            />
          </Form.Item>
        </div>

        {/* الإعدادات */}
        <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
          <h4 className="text-sm font-bold text-gray-600 mb-4">الإعدادات</h4>
          <Form.Item
            name="is_active"
            label={<span className="font-medium">الحالة</span>}
            className="mb-0 w-full sm:w-1/2"
          >
            <Select size="large" className="rounded-lg">
              <Option value={1}>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full" />
                  مفعّل
                </div>
              </Option>
              <Option value={0}>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-red-500 rounded-full" />
                  غير مفعّل
                </div>
              </Option>
            </Select>
          </Form.Item>
        </div>
      </Form>
    </Modal>
  );
};

export default StagePriceModal;
