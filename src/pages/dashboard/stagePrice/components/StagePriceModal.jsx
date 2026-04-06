// src/pages/dashboard/stagePrice/components/StagePriceModal.jsx
import { useEffect } from "react";
import { Modal, Form, Input, Select, InputNumber } from "antd";
import { Plus, DollarSign } from "lucide-react";

const { TextArea } = Input;
const { Option } = Select;

const StagePriceModal = ({ visible, onCancel, onSave, initialData }) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (visible) {
      if (initialData) {
        form.setFieldsValue(initialData);
      } else {
        form.resetFields();
        form.setFieldsValue({
          status: "active",
        });
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

  const handleCancel = () => {
    form.resetFields();
    onCancel();
  };

  return (
    <Modal
      title={
        <div className="flex items-center gap-3 text-right" dir="rtl">
          <div className="p-2 rounded-xl">
            {initialData ? (
              <div className="w-full flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-white bg-primary rounded-full p-1" />
                <span className="text-lg font-bold text-primary">
                  تعديل المرحلة
                </span>
              </div>
            ) : (
              <div className="w-full flex items-center gap-2">
                <Plus className="w-5 h-5 text-white bg-primary rounded-full p-1" />
                <span className="text-lg font-bold text-primary">
                  إضافة مرحلة جديدة
                </span>
              </div>
            )}
          </div>
          <span className="text-lg font-bold">
            {initialData ? "تعديل المرحلة" : "إضافة مرحلة جديدة"}
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
      width={600}
      centered
      styles={{
        body: { direction: "rtl", padding: "24px" },
        header: { direction: "rtl" },
      }}
    >
      <Form form={form} layout="vertical" className="mt-2" dir="rtl">
        <div className="bg-gray-50 rounded-xl p-4 mb-5 border border-gray-100">
          <h4 className="text-sm font-bold text-gray-600 mb-4">
            معلومات المرحلة
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Form.Item
              name="name"
              label={<span className="font-medium">اسم المرحلة</span>}
              rules={[{ required: true, message: "يرجى إدخال اسم المرحلة" }]}
            >
              <Input
                placeholder="مثال: المرحلة الأولى"
                size="large"
                className="rounded-lg"
              />
            </Form.Item>

            <Form.Item
              name="price"
              label={<span className="font-medium">التكلفة (السعر)</span>}
              rules={[{ required: true, message: "يرجى إدخال السعر" }]}
            >
              <InputNumber
                className="w-full! rounded-lg"
                size="large"
                min={0}
                placeholder="أدخل السعر..."
                addonAfter="€"
              />
            </Form.Item>
          </div>

          <Form.Item
            name="description"
            label={<span className="font-medium">الوصف والملاحظات</span>}
            rules={[{ required: true, message: "يرجى إدخال الوصف" }]}
            className="mt-4"
          >
            <TextArea
              placeholder="اكتب وصفاً أو ملاحظات حول المرحلة..."
              autoSize={{ minRows: 3, maxRows: 6 }}
              className="rounded-lg"
            />
          </Form.Item>
        </div>

        <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
          <h4 className="text-sm font-bold text-gray-600 mb-4">الإعدادات</h4>
          <Form.Item
            name="status"
            label={<span className="font-medium">الحالة</span>}
            className="mb-0 w-full sm:w-1/2"
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
                  <span className="w-2 h-2 bg-red-500 rounded-full"></span>
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
