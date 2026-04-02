// src/pages/dashboard/Users/components/UserModal.jsx
import { Modal, Form, Input, Button, Upload, message } from "antd";
import { User, Mail, Phone, Lock, Camera } from "lucide-react";
import { useEffect, useState } from "react";

const UserModal = ({ visible, onCancel, onSave, initialData, loading = false }) => {
  const [form] = Form.useForm();
  const [imageUrl, setImageUrl] = useState(null);
  const [fileList, setFileList] = useState([]);

  useEffect(() => {
    if (visible) {
      if (initialData) {
        form.setFieldsValue({
          ...initialData,
          password: "",
        });
        setImageUrl(initialData.profile?.profile_picture || null);
      } else {
        form.resetFields();
        setImageUrl(null);
      }
      setFileList([]);
    }
  }, [visible, initialData, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      
      const formData = new FormData();
      
      // Explicitly append fields with correct names
      formData.append("full_name", values.full_name || "");
      formData.append("email", values.email || "");
      formData.append("phone_number", values.phone_number || "");
      formData.append("role", "user"); // Always user as requested

      if (values.secondary_phone) {
        formData.append("secondary_phone", values.secondary_phone);
      }

      // Password only if provided
      if (values.password) {
        formData.append("password", values.password);
      }
      
      // Binary file for profile picture
      if (fileList.length > 0 && fileList[0].originFileObj) {
        formData.append("profile_picture", fileList[0].originFileObj);
      }

      // Important: if we are editing, we need the ID
      if (initialData?.id) {
        // Some servers might need the ID in the body for PUT/PATCH FormData
        // But our service also sends it in the URL.
        formData.append("id", initialData.id);
      }
      
      onSave(formData);
    } catch (error) {
      console.error("Validation failed:", error);
    }
  };

  const handleUploadChange = ({ fileList: newFileList }) => {
    setFileList(newFileList);
    if (newFileList.length > 0 && newFileList[0].originFileObj) {
       const reader = new FileReader();
       reader.onload = (e) => setImageUrl(e.target.result);
       reader.readAsDataURL(newFileList[0].originFileObj);
    }
  };

  return (
    <Modal
      title={initialData ? "تعديل بيانات الحساب" : "إضافة حساب جديد"}
      open={visible}
      onCancel={onCancel}
      footer={null}
      width={500}
      centered
      className="user-account-modal"
    >
      <div className="flex flex-col items-center pt-8 pb-4">
        {/* Profile Picture Section */}
        <div className="relative mb-6">
          <div className="w-32 h-32 rounded-full border-4 border-white shadow-md overflow-hidden bg-gray-100 flex items-center justify-center">
            {imageUrl ? (
              <img src={imageUrl} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <User className="w-16 h-16 text-gray-300" />
            )}
          </div>
          <Upload
            accept="image/*"
            showUploadList={false}
            beforeUpload={() => false}
            onChange={handleUploadChange}
            className="absolute bottom-0 right-0"
          >
            <Button 
                type="primary" 
                shape="circle" 
                icon={<Camera className="w-4 h-4" />} 
                className="bg-[#d2a657] border-white shadow-sm flex items-center justify-center"
            />
          </Upload>
        </div>
        
        <Button 
            type="text" 
            className="text-[#d2a657] font-bold mb-8 hover:text-[#b08b45]"
            onClick={() => {
                const uploadBtn = document.querySelector('.ant-upload input');
                if (uploadBtn) uploadBtn.click();
            }}
        >
            اضف صورتك الشخصية
        </Button>

        <Form
          form={form}
          layout="vertical"
          className="w-full space-y-4 px-4"
          onFinish={handleSubmit}
          initialValues={{ role: "user" }}
        >
          {/* Label: Full Name */}
          <div className="space-y-1">
            <label className="text-sm font-bold text-gray-800 flex items-center gap-1">
                الاسم الكامل <span className="text-red-500">*</span>
            </label>
            <Form.Item
                name="full_name"
                rules={[{ required: true, message: "الرجاء إدخال الاسم الكامل" }]}
                className="mb-0"
            >
                <Input 
                    prefix={<User className="w-4 h-4 text-gray-400 ml-2" />} 
                    placeholder="الاسم الكامل و الكنية"
                    className="h-12 border-none bg-white shadow-sm rounded-md"
                />
            </Form.Item>
          </div>

          {/* Label: Email */}
          <div className="space-y-1">
            <label className="text-sm font-bold text-gray-800 flex items-center gap-1">
                البريد الإلكتروني <span className="text-red-500">*</span>
            </label>
            <Form.Item
                name="email"
                rules={[
                  { required: true, message: "الرجاء إدخال البريد الإلكتروني" },
                  { type: "email", message: "البريد الإلكتروني غير صالح" }
                ]}
                className="mb-0"
            >
                <Input 
                    disabled={!!initialData}
                    prefix={<Mail className="w-4 h-4 text-gray-400 ml-2" />} 
                    placeholder="البريد الإلكتروني"
                    className="h-12 border-none bg-white shadow-sm rounded-md disabled:bg-gray-50 opacity-70"
                />
            </Form.Item>
          </div>

          {/* Label: Primary Phone */}
          <div className="space-y-1">
            <label className="text-sm font-bold text-gray-800 flex items-center gap-1">
                رقم الاتصال <span className="text-red-500">*</span>
            </label>
            <Form.Item
                name="phone_number"
                rules={[{ required: true, message: "الرجاء إدخال رقم الهاتف" }]}
                className="mb-0"
            >
                <Input 
                    prefix={<Phone className="w-4 h-4 text-gray-400 ml-2" />} 
                    placeholder="رقم الهاتف"
                    className="h-12 border-none bg-white shadow-sm rounded-md"
                />
            </Form.Item>
          </div>

          {/* Label: Secondary Phone */}
          <div className="space-y-1">
            <label className="text-sm font-bold text-gray-800 flex items-center gap-1">
                رقم الاتصال الاخر
            </label>
            <Form.Item
                name="secondary_phone"
                className="mb-0"
            >
                <Input 
                    prefix={<Phone className="w-4 h-4 text-gray-400 ml-2" />} 
                    placeholder="رقم هاتف إضافي"
                    className="h-12 border-none bg-white shadow-sm rounded-md"
                />
            </Form.Item>
          </div>

          {/* Label: Password */}
          <div className="space-y-1">
            <label className="text-sm font-bold text-gray-800 flex items-center gap-1">
                كلمة المرور
            </label>
            <Form.Item
                name="password"
                className="mb-0"
            >
                <Input.Password 
                    prefix={<Lock className="w-4 h-4 text-gray-400 ml-2" />} 
                    placeholder="كلمة المرور مكونة من احرف"
                    className="h-12 border-none bg-white shadow-sm rounded-md transition-all focus:shadow-md"
                />
            </Form.Item>
          </div>

          <div className="pt-6 pb-2">
            <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                disabled={loading}
                className="w-full h-14 bg-[#d2a657] text-[#1c455c] text-lg font-bold rounded-md border-none shadow-md hover:bg-[#b08b45] active:scale-[0.98] transition-all"
            >
                {loading ? "جاري الحفظ..." : "حفظ التغيرات"}
            </Button>
          </div>
        </Form>
      </div>
    </Modal>
  );
};

export default UserModal;
