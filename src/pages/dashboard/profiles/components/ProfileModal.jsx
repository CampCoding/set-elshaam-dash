
import React, { useEffect, useState } from "react";
import {
  Modal,
  Form,
  Input,
  Select,
  DatePicker,
  Upload,
  Button,
  Row,
  Col,
  Divider,
  message,
} from "antd";
import { Upload as UploadIcon, X, User } from "lucide-react";
import dayjs from "dayjs";

const { TextArea } = Input;

const ProfileModal = ({ visible, onCancel, onSave, initialData, loading }) => {
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);
  const [previewImage, setPreviewImage] = useState(null);

  useEffect(() => {
    if (visible) {
      if (initialData) {
        form.setFieldsValue({
          ...initialData,
          birthdate: initialData.birthdate
            ? dayjs(initialData.birthdate)
            : null,
        });
        if (initialData.profile_picture) {
          setPreviewImage(initialData.profile_picture);
        }
      } else {
        form.resetFields();
        setPreviewImage(null);
        setFileList([]);
      }
    }
  }, [visible, initialData, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();

      const formData = new FormData();

      Object.keys(values).forEach((key) => {
        if (key === "birthdate" && values[key]) {
          formData.append(key, values[key].format("YYYY-MM-DD"));
        } else if (key === "interests" && values[key]) {
          formData.append(key, JSON.stringify(values[key]));
        } else if (values[key] !== undefined && values[key] !== null) {
          formData.append(key, values[key]);
        }
      });

      if (fileList.length > 0 && fileList[0].originFileObj) {
        formData.append("profile_picture", fileList[0].originFileObj);
      }

      onSave(formData);
    } catch (error) {
      console.error("Validation error:", error);
    }
  };

  const handleUploadChange = ({ fileList: newFileList }) => {
    setFileList(newFileList);
    if (newFileList.length > 0 && newFileList[0].originFileObj) {
      const reader = new FileReader();
      reader.onload = (e) => setPreviewImage(e.target.result);
      reader.readAsDataURL(newFileList[0].originFileObj);
    }
  };

  const handleRemoveImage = () => {
    setFileList([]);
    setPreviewImage(null);
  };

  return (
    <Modal
      title={
        <div className="flex items-center gap-2">
          <User className="w-5 h-5 text-primary" />
          <span>{initialData ? "تعديل البروفايل" : "إضافة بروفايل جديد"}</span>
        </div>
      }
      open={visible}
      onCancel={onCancel}
      footer={[
        <Button key="cancel" onClick={onCancel} disabled={loading}>
          إلغاء
        </Button>,
        <Button
          key="submit"
          type="primary"
          onClick={handleSubmit}
          loading={loading}
        >
          {initialData ? "حفظ التعديلات" : "إضافة"}
        </Button>,
      ]}
      width={700}
      centered
      destroyOnClose
    >
      <Form form={form} layout="vertical" className="mt-4">
        {/* Profile Picture */}
        <div className="flex justify-center mb-6">
          <div className="relative">
            {previewImage ? (
              <div className="relative">
                <img
                  src={previewImage}
                  alt="Profile"
                  className="w-24 h-24 rounded-full object-cover border-4 border-primary/20"
                />
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ) : (
              <Upload
                accept="image/*"
                showUploadList={false}
                beforeUpload={() => false}
                onChange={handleUploadChange}
                fileList={fileList}
              >
                <div className="w-24 h-24 rounded-full bg-gray-100 border-2 border-dashed border-gray-300 flex flex-col items-center justify-center cursor-pointer hover:border-primary transition-colors">
                  <UploadIcon className="w-6 h-6 text-gray-400" />
                  <span className="text-xs text-gray-400 mt-1">رفع صورة</span>
                </div>
              </Upload>
            )}
          </div>
        </div>

        <Divider />

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="الاسم المعروض"
              name="display_name"
              rules={[
                { required: true, message: "الرجاء إدخال الاسم المعروض" },
              ]}
            >
              <Input placeholder="أدخل الاسم المعروض" />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              label="الجنس"
              name="gender"
              rules={[{ required: true, message: "الرجاء اختيار الجنس" }]}
            >
              <Select
                placeholder="اختر الجنس"
                options={[
                  { value: "male", label: "ذكر" },
                  { value: "female", label: "أنثى" },
                ]}
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="تاريخ الميلاد"
              name="birthdate"
              rules={[
                { required: true, message: "الرجاء إدخال تاريخ الميلاد" },
              ]}
            >
              <DatePicker
                placeholder="اختر التاريخ"
                className="w-full"
                format="YYYY-MM-DD"
              />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item label="المدينة" name="city">
              <Input placeholder="أدخل المدينة" />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item label="نبذة شخصية" name="bio">
          <TextArea
            rows={3}
            placeholder="اكتب نبذة مختصرة..."
            maxLength={500}
            showCount
          />
        </Form.Item>

        <Form.Item label="الاهتمامات" name="interests">
          <Select
            mode="tags"
            placeholder="أضف اهتماماتك"
            tokenSeparators={[","]}
            options={[
              { value: "رياضة", label: "رياضة" },
              { value: "قراءة", label: "قراءة" },
              { value: "سفر", label: "سفر" },
              { value: "موسيقى", label: "موسيقى" },
              { value: "طبخ", label: "طبخ" },
              { value: "تصوير", label: "تصوير" },
            ]}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ProfileModal;
