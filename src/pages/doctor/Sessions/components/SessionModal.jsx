// src/pages/doctor/Sessions/components/SessionModal.jsx
import { useEffect } from "react";
import {
  Modal,
  Form,
  Input,
  DatePicker,
  TimePicker,
  InputNumber,
  Button,
} from "antd";
import { X, BookOpen } from "lucide-react";
import dayjs from "dayjs";

const SessionModal = ({ open, onClose, onSave, session, loading }) => {
  const [form] = Form.useForm();
  const isEditing = !!session;

  // Reset form when modal opens
  useEffect(() => {
    if (open) {
      if (session) {
        // Edit mode - populate form
        form.setFieldsValue({
          title: session.title,
          topic: session.topic,
          session_date: session.session_date
            ? dayjs(session.session_date)
            : null,
          session_time: session.session_time
            ? dayjs(session.session_time, "HH:mm:ss")
            : null,
          address: session.address,
          student_limit: session.student_limit,
        });
      } else {
        // Create mode - reset form
        form.resetFields();
      }
    }
  }, [open, session, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();

      const sessionData = {
        title: values.title,
        topic: values.topic,
        session_date: values.session_date.format("YYYY-MM-DD"),
        session_time: values.session_time.format("HH:mm:ss"),
        address: values.address,
        student_limit: values.student_limit,
      };

      const success = await onSave(sessionData, session?.id);
      if (success) {
        form.resetFields();
        onClose();
      }
    } catch (error) {
      console.error("Validation failed:", error);
    }
  };

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      centered
      width={500}
      closeIcon={<X className="w-5 h-5" />}
      title={
        <div className="flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-primary" />
          <span>{isEditing ? "Edit Session" : "Create New Session"}</span>
        </div>
      }
      destroyOnClose
    >
      <Form form={form} layout="vertical" className="mt-4" requiredMark={false}>
        {/* Title */}
        <Form.Item
          name="title"
          label="Session Title"
          rules={[{ required: true, message: "Please enter session title" }]}
        >
          <Input placeholder="e.g., Final Review Session" size="large" />
        </Form.Item>

        {/* Topic */}
        <Form.Item
          name="topic"
          label="Topic"
          rules={[{ required: true, message: "Please enter topic" }]}
        >
          <Input.TextArea placeholder="e.g., All Chapters" size="large" />
        </Form.Item>

        {/* Date & Time */}
        <div className="grid grid-cols-2 gap-4">
          <Form.Item
            name="session_date"
            label="Date"
            rules={[{ required: true, message: "Please select date" }]}
          >
            <DatePicker
              className="w-full"
              size="large"
              format="YYYY-MM-DD"
              disabledDate={(current) =>
                current && current < dayjs().startOf("day")
              }
            />
          </Form.Item>

          <Form.Item
            name="session_time"
            label="Time"
            rules={[{ required: true, message: "Please select time" }]}
          >
            <TimePicker
              className="w-full"
              size="large"
              format="hh:mm A"
              use12Hours
              minuteStep={15}
            />
          </Form.Item>
        </div>

        {/* Address */}
        <Form.Item
          name="address"
          label="Location / Address"
          rules={[{ required: true, message: "Please enter location" }]}
        >
          <Input placeholder="e.g., Cairo Hall 5" size="large" />
        </Form.Item>

        {/* Student Limit */}
        <Form.Item
          name="student_limit"
          label="Student Limit"
          rules={[{ required: true, message: "Please enter student limit" }]}
        >
          <InputNumber
            className="w-full"
            size="large"
            min={1}
            max={500}
            placeholder="e.g., 30"
          />
        </Form.Item>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-4 border-t mt-6">
          <Button onClick={onClose} size="large">
            Cancel
          </Button>
          <Button
            type="primary"
            onClick={handleSubmit}
            loading={loading}
            size="large"
          >
            {isEditing ? "Save Changes" : "Create Session"}
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

export default SessionModal;
