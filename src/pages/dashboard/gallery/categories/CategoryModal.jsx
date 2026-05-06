
import { useEffect } from "react";
import { Modal, Form, Input } from "antd";
import { FolderPlus, FolderEdit } from "lucide-react";

const CategoryModal = ({ visible, onCancel, onSave, initialData }) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (visible) {
      if (initialData) form.setFieldsValue(initialData);
      else form.resetFields();
    }
  }, [visible, initialData, form]);

  const handleSubmit = () => {
    form.validateFields().then(onSave);
  };

  return (
    <Modal
      title={
        <div className="flex items-center gap-3 text-right" dir="rtl">
          <div className="p-2 bg-primary/10 rounded-xl">
            {initialData ? (
              <FolderEdit className="w-5 h-5 text-primary" />
            ) : (
              <FolderPlus className="w-5 h-5 text-primary" />
            )}
          </div>
          <span className="text-lg font-bold text-primary">
            {initialData ? "تعديل التصنيف" : "تصنيف جديد"}
          </span>
        </div>
      }
      open={visible}
      onOk={handleSubmit}
      onCancel={onCancel}
      okText="حفظ"
      cancelText="إلغاء"
      okButtonProps={{ className: "bg-primary" }}
      destroyOnClose
      centered
      styles={{
        body: { direction: "rtl" },
        header: { direction: "rtl" },
      }}
    >
      <Form form={form} layout="vertical" dir="rtl" className="mt-4">
        <Form.Item
          name="label"
          label={<span className="font-medium">اسم التصنيف</span>}
          rules={[{ required: true, message: "مطلوب" }]}
        >
          <Input
            placeholder="مثال: حفلات تخرج"
            size="large"
            className="rounded-lg"
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};
export default CategoryModal;
