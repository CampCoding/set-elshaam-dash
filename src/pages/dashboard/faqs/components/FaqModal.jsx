
import { useEffect } from "react";
import { Modal, Form, Input, InputNumber } from "antd";
import { MessageCircleQuestion } from "lucide-react";

const { TextArea } = Input;

const FaqModal = ({
  visible,
  onCancel,
  onSave,
  initialData,
}) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (visible) {
      if (initialData) {
        form.setFieldsValue({
          ...initialData,
          question_ar: initialData.question_ar || initialData.question,
          answer_ar: initialData.answer_ar || initialData.answer,
          order_index: initialData.order_index || 0,
        });
      } else {
        form.resetFields();
        form.setFieldsValue({ order_index: 0 });
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
            name="question_ar"
            label={<span className="font-medium">السؤال (بالعربية)</span>}
            rules={[{ required: true, message: "يرجى إدخال السؤال" }]}
          >
            <Input
              placeholder="مثال: كيف تتم عملية المطابقة؟"
              size="large"
              className="rounded-lg"
            />
          </Form.Item>

          <Form.Item
            name="answer_ar"
            label={<span className="font-medium">الإجابة (بالعربية)</span>}
            rules={[{ required: true, message: "يرجى إدخال الإجابة" }]}
          >
            <TextArea
              placeholder="اكتب الإجابة التفصيلية هنا..."
              autoSize={{ minRows: 4, maxRows: 8 }}
              className="rounded-lg"
            />
          </Form.Item>

          <Form.Item
            name="order_index"
            label={<span className="font-medium">ترتيب العرض</span>}
          >
            <InputNumber
              min={0}
              className="w-full rounded-lg"
              size="large"
              placeholder="مثال: 10"
            />
          </Form.Item>
        </div>
      </Form>
    </Modal>
  );
};

export default FaqModal;
