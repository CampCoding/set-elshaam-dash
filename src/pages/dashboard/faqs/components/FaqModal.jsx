// src/pages/dashboard/faqs/components/FaqModal.jsx
import { useEffect, useState, useRef } from "react";
import { Modal, Form, Input, Select, Divider, Space, Button } from "antd";
import { MessageCircleQuestion, Plus } from "lucide-react";

const { TextArea } = Input;

const FaqModal = ({
  visible,
  onCancel,
  onSave,
  initialData,
  servicesList,
  setServicesList,
}) => {
  const [form] = Form.useForm();
  const [newServiceName, setNewServiceName] = useState("");
  const inputRef = useRef(null);

  useEffect(() => {
    if (visible) {
      if (initialData) {
        form.setFieldsValue(initialData);
      } else {
        form.resetFields();
        form.setFieldsValue({ relatedService: "عام" }); // قيمة افتراضية
      }
    }
  }, [visible, initialData, form]);

  // دالة لإضافة خدمة جديدة للـ Select List أثناء الكتابة
  const onServiceAdd = (e) => {
    e.preventDefault();
    if (newServiceName && !servicesList.includes(newServiceName)) {
      setServicesList([...servicesList, newServiceName]);
      setNewServiceName("");
      setTimeout(() => {
        inputRef.current?.focus();
      }, 0);
    }
  };

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
            <MessageCircleQuestion className="w-5 h-5 text-primary" />
          </div>
          <span className="text-lg font-bold">
            {initialData ? "تعديل السؤال" : "إضافة سؤال جديد"}
          </span>
        </div>
      }
      open={visible}
      onOk={handleSubmit}
      onCancel={onCancel}
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
        <div className="bg-gray-50 rounded-xl p-5 border border-gray-100 space-y-4">
          <Form.Item
            name="question"
            label={<span className="font-medium">السؤال</span>}
            rules={[{ required: true, message: "يرجى إدخال السؤال" }]}
          >
            <Input
              placeholder="مثال: كيف تتم عملية المطابقة؟"
              size="large"
              className="rounded-lg"
            />
          </Form.Item>

          <Form.Item
            name="answer"
            label={<span className="font-medium">الإجابة</span>}
            rules={[{ required: true, message: "يرجى إدخال الإجابة" }]}
          >
            <TextArea
              placeholder="اكتب الإجابة التفصيلية هنا..."
              autoSize={{ minRows: 4, maxRows: 8 }}
              className="rounded-lg"
            />
          </Form.Item>
        </div>
      </Form>
    </Modal>
  );
};

export default FaqModal;
