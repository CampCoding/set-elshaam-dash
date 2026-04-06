// src/pages/dashboard/Users/components/UpdateProfileModal.jsx
import {
  Modal,
  Form,
  Input,
  Select,
  Row,
  Col,
  Radio,
  Divider,
  Checkbox,
  Upload,
  Button,
  message,
} from "antd";
import { Upload as UploadIcon, Camera } from "lucide-react";
import { useEffect, useState } from "react";
import {
  NATIONALITIES,
  COUNTRIES,
  RELIGIONS,
  GENDERS,
  MARITAL_STATUS,
  RESIDENCY_TYPES,
  EDUCATION_LEVELS,
  INCOME_SOURCES,
  RELIGION_COMMITMENT,
  YES_NO_OPTIONS,
  AGE_RANGES,
  SKIN_COLORS,
  EYE_COLORS,
  HAIR_TYPES,
} from "../../../../constants/userOptions";

const { TextArea } = Input;

const UpdateProfileModal = ({
  visible,
  onCancel,
  onSave,
  onDeleteFile,
  initialData,
  type = "main",
  loading = false,
}) => {
  const [form] = Form.useForm();

  // File states
  const [fileLists, setFileLists] = useState({
    profile_picture: [],
    signature_path: [],
    user_gallery_photos: [],
  });

  // Helper to format existing files
  const formatExistingFiles = (data) => {
    if (!data) return [];
    if (typeof data === "string") {
      try {
        const parsed = JSON.parse(data);
        return Array.isArray(parsed) ? parsed : [parsed];
      } catch {
        return [data];
      }
    }
    return Array.isArray(data) ? data : [data];
  };

  const createFileList = (paths) => {
    return formatExistingFiles(paths).map((path, index) => ({
      uid: `-${index}`,
      name: path.split("/").pop(),
      status: "done",
      url: path,
    }));
  };

  useEffect(() => {
    if (visible && initialData) {
      form.setFieldsValue({
        ...initialData,
        info_correctness_pledge: !!initialData.info_correctness_pledge,
        contract_terms_accepted: !!initialData.contract_terms_accepted,
        gdpr_accepted: !!initialData.gdpr_accepted,
      });

      setFileLists({
        profile_picture: createFileList(initialData.profile_picture),
        signature_path: createFileList(initialData.signature_path),
        user_gallery_photos: createFileList(initialData.user_gallery_photos),
      });
    }
  }, [visible, initialData, form]);

  useEffect(() => {
    if (!visible) {
      form.resetFields();
      setFileLists({
        profile_picture: [],
        signature_path: [],
        user_gallery_photos: [],
      });
    }
  }, [visible, form]);

  const handleFileChange = (key, info) => {
    setFileLists((prev) => ({ ...prev, [key]: info.fileList }));
  };

  const handleRemove = async (key, file) => {
    if (file.url && onDeleteFile) {
      return new Promise((resolve) => {
        Modal.confirm({
          title: "هل أنت متأكد من حذف هذا الملف؟",
          content: "سيتم حذف الملف نهائياً من السيرفر.",
          okText: "نعم، احذف",
          cancelText: "إلغاء",
          centered: true,
          onOk: async () => {
            const hide = message.loading("جاري حذف الملف...", 0);
            try {
              await onDeleteFile({ fieldName: key, filePath: file.url });
              hide();
              resolve(true);
            } catch (error) {
              hide();
              console.error("Delete file error:", error);
              resolve(false);
            }
          },
          onCancel: () => resolve(false),
        });
      });
    }
    return true;
  };

  const handleSubmit = () => {
    form.validateFields().then((values) => {
      const formData = new FormData();

      // Append regular fields
      Object.keys(values).forEach((key) => {
        if (values[key] !== undefined && values[key] !== null) {
          if (typeof values[key] === "boolean") {
            formData.append(key, values[key] ? 1 : 0);
          } else {
            formData.append(key, values[key]);
          }
        }
      });

      // Append ONLY new files
      Object.keys(fileLists).forEach((key) => {
        fileLists[key].forEach((file) => {
          if (file.originFileObj) {
            formData.append(key, file.originFileObj);
          }
        });
      });

      onSave(formData, type);
    });
  };

  const renderUpload = (key, label, maxCount = 10, isImage = false) => (
    <div className="space-y-2 mb-4">
      <label className="text-sm font-bold text-gray-700">{label}</label>
      <Upload
        listType={isImage ? "picture-card" : "text"}
        fileList={fileLists[key]}
        onChange={(info) => handleFileChange(key, info)}
        onRemove={(file) => handleRemove(key, file)}
        onPreview={async (file) => {
          if (file.url) window.open(file.url, "_blank");
        }}
        beforeUpload={() => false}
        maxCount={maxCount}
        multiple={maxCount > 1}
      >
        {fileLists[key].length < maxCount && (
          <div className="flex flex-col items-center justify-center">
            {isImage ? (
              <Camera className="w-5 h-5 mb-1" />
            ) : (
              <UploadIcon className="w-5 h-5 mb-1" />
            )}
            <span className="text-xs">رفع جديد</span>
          </div>
        )}
      </Upload>
    </div>
  );

  // Render Select with options
  const renderSelect = (name, label, options, props = {}) => (
    <Form.Item name={name} label={label}>
      <Select
        showSearch
        filterOption={(input, option) =>
          option?.children?.toLowerCase().includes(input.toLowerCase())
        }
        placeholder={`اختر ${label}`}
        {...props}
      >
        {options.map((opt) => (
          <Select.Option key={opt.value} value={opt.value}>
            {opt.label}
          </Select.Option>
        ))}
      </Select>
    </Form.Item>
  );

  // Render Radio Group
  const renderRadioGroup = (name, label, options) => (
    <Form.Item name={name} label={label}>
      <Radio.Group>
        {options.map((opt) => (
          <Radio key={opt.value} value={opt.value}>
            {opt.label}
          </Radio>
        ))}
      </Radio.Group>
    </Form.Item>
  );

  return (
    <Modal
      title={
        type === "main" ? "تعديل البيانات الشخصية" : "تعديل مواصفات الشريك"
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
          حفظ التغييرات
        </Button>,
      ]}
      width={1000}
      centered
      destroyOnClose
      className="update-profile-modal"
    >
      <Form
        form={form}
        layout="vertical"
        className="mt-4 max-h-[70vh] overflow-y-auto px-2"
      >
        {type === "main" ? (
          <>
            {/* الصور */}
            <Row gutter={24}>
              <Col span={8}>
                {renderUpload("profile_picture", "الصورة الشخصية", 1, true)}
              </Col>
              <Col span={8}>
                {renderUpload("signature_path", "التوقيع", 1, true)}
              </Col>
            </Row>

            {/* البيانات الأساسية */}
            <Divider orientation="right">البيانات الأساسية</Divider>
            <Row gutter={24}>
              <Col span={12}>
                <Form.Item
                  name="full_name"
                  label="الاسم الكامل"
                  rules={[{ required: true, message: "الرجاء إدخال الاسم" }]}
                >
                  <Input placeholder="أدخل الاسم الكامل" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="secondary_phone" label="رقم هاتف بديل">
                  <Input placeholder="رقم الهاتف البديل" />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={24}>
              <Col span={12}>
                {renderRadioGroup("gender", "الجنس", GENDERS)}
              </Col>
              <Col span={12}>
                {renderSelect("nationality", "الجنسية", NATIONALITIES)}
              </Col>
            </Row>

            <Row gutter={24}>
              <Col span={12}>
                {renderSelect("mother_country", "بلد الأم", COUNTRIES)}
              </Col>
              <Col span={12}>
                {renderSelect("religion", "الديانة", RELIGIONS)}
              </Col>
            </Row>

            <Row gutter={24}>
              <Col span={12}>
                <Form.Item name="date_of_birth" label="تاريخ الميلاد">
                  <Input type="date" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="arrival_date_finland"
                  label="تاريخ الوصول لفنلندا"
                >
                  <Input type="date" />
                </Form.Item>
              </Col>
            </Row>

            {/* المواصفات الجسدية */}
            <Divider orientation="right">المواصفات الجسدية</Divider>
            <Row gutter={16}>
              <Col span={8}>
                <Form.Item name="height" label="الطول (سم)">
                  <Input type="number" placeholder="170" />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item name="weight" label="الوزن (كجم)">
                  <Input type="number" placeholder="70" />
                </Form.Item>
              </Col>
              <Col span={8}>
                {renderSelect("skin_color", "لون البشرة", SKIN_COLORS)}
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                {renderSelect("eye_color", "لون العيون", EYE_COLORS)}
              </Col>
              <Col span={12}>
                {renderSelect("hair_type", "نوع الشعر", HAIR_TYPES)}
              </Col>
            </Row>

            {/* الإقامة والحالة الاجتماعية */}
            <Divider orientation="right">الإقامة والحالة الاجتماعية</Divider>
            <Row gutter={24}>
              <Col span={12}>
                {renderSelect("residency_type", "نوع الإقامة", RESIDENCY_TYPES)}
              </Col>
              <Col span={12}>
                {renderSelect(
                  "marital_status",
                  "الحالة الاجتماعية",
                  MARITAL_STATUS
                )}
              </Col>
            </Row>

            <Row gutter={24}>
              <Col span={24}>
                <Form.Item name="current_address" label="العنوان الحالي">
                  <Input placeholder="أدخل العنوان" />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={24}>
              <Col span={12}>
                {renderRadioGroup(
                  "has_children",
                  "هل لديك أولاد؟",
                  YES_NO_OPTIONS
                )}
              </Col>
              <Col span={12}>
                {renderRadioGroup("is_smoker", "هل أنت مدخن؟", YES_NO_OPTIONS)}
              </Col>
            </Row>

            {/* التعليم والوضع المالي */}
            <Divider orientation="right">التعليم والوضع المالي</Divider>
            <Row gutter={24}>
              <Col span={12}>
                {renderSelect(
                  "education_level",
                  "المستوى التعليمي",
                  EDUCATION_LEVELS
                )}
              </Col>
              <Col span={12}>
                {renderSelect("income_source", "مصدر الدخل", INCOME_SOURCES)}
              </Col>
            </Row>

            <Form.Item name="work_experience" label="الخبرات العملية">
              <TextArea rows={2} placeholder="اكتب خبراتك العملية" />
            </Form.Item>

            <Row gutter={24}>
              <Col span={12}>
                {renderRadioGroup(
                  "has_criminal_record",
                  "هل لديك سجل جنائي؟",
                  YES_NO_OPTIONS
                )}
              </Col>
              <Col span={12}>
                {renderRadioGroup("has_debts", "هل عليك ديون؟", YES_NO_OPTIONS)}
              </Col>
            </Row>

            <Row gutter={24}>
              <Col span={12}>
                {renderRadioGroup(
                  "has_previous_loans",
                  "هل حصلت على قروض سابقاً؟",
                  YES_NO_OPTIONS
                )}
              </Col>
              <Col span={12}>
                {renderSelect(
                  "religion_commitment",
                  "درجة الالتزام الديني",
                  RELIGION_COMMITMENT
                )}
              </Col>
            </Row>

            <Form.Item
              name="dowry_capability"
              label="الاستطاعة المالية (المهر)"
            >
              <Input placeholder="حدد المهر المتوقع" />
            </Form.Item>

            <Form.Item name="about_me_more" label="معلومات إضافية عنك">
              <TextArea rows={3} placeholder="اكتب معلومات إضافية" />
            </Form.Item>

            {/* معرض الصور */}
            <Divider orientation="right">معرض الصور</Divider>
            {renderUpload("user_gallery_photos", "صور إضافية", 10, true)}

            {/* التعهدات */}
            <Divider orientation="right">التعهدات والأحكام</Divider>
            <div className="space-y-3">
              <Form.Item
                name="info_correctness_pledge"
                valuePropName="checked"
                noStyle
              >
                <Checkbox>
                  أتعهد بأن جميع المعلومات المقدمة صحيحة وأتحمل المسؤولية
                </Checkbox>
              </Form.Item>
              <br />
              <Form.Item
                name="contract_terms_accepted"
                valuePropName="checked"
                noStyle
              >
                <Checkbox>لقد قرأت بنود العقد وأوافق عليها</Checkbox>
              </Form.Item>
              <br />
              <Form.Item name="gdpr_accepted" valuePropName="checked" noStyle>
                <Checkbox>أوافق على سياسة الخصوصية وحماية البيانات</Checkbox>
              </Form.Item>
            </div>
          </>
        ) : (
          /* مواصفات الشريك */
          <>
            <Divider orientation="right">المواصفات الأساسية للشريك</Divider>
            <Row gutter={24}>
              <Col span={12}>
                {renderSelect(
                  "target_age_range",
                  "الفئة العمرية المطلوبة",
                  AGE_RANGES
                )}
              </Col>
              <Col span={12}>
                {renderSelect(
                  "target_nationality",
                  "الجنسية المطلوبة",
                  NATIONALITIES
                )}
              </Col>
            </Row>

            <Row gutter={24}>
              <Col span={12}>
                {renderSelect(
                  "target_marital_status",
                  "الحالة الاجتماعية المطلوبة",
                  [...MARITAL_STATUS, { value: "any", label: "لا يهم" }]
                )}
              </Col>
              <Col span={12}>
                {renderSelect("target_religion", "الديانة المطلوبة", RELIGIONS)}
              </Col>
            </Row>

            <Divider orientation="right">المواصفات الجسدية للشريك</Divider>
            <Row gutter={24}>
              <Col span={8}>
                <Form.Item name="target_height" label="الطول المطلوب">
                  <Input placeholder="مثال: 160-175" />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item name="target_weight" label="الوزن المطلوب">
                  <Input placeholder="مثال: 55-70" />
                </Form.Item>
              </Col>
              <Col span={8}>
                {renderSelect("target_skin_color", "لون البشرة المطلوب", [
                  ...SKIN_COLORS,
                  { value: "any", label: "لا يهم" },
                ])}
              </Col>
            </Row>

            <Divider orientation="right">تفضيلات أخرى</Divider>
            <Row gutter={24}>
              <Col span={12}>
                {renderSelect(
                  "target_education_level",
                  "المستوى التعليمي المطلوب",
                  [...EDUCATION_LEVELS, { value: "any", label: "لا يهم" }]
                )}
              </Col>
              <Col span={12}>
                <Form.Item name="target_work_status" label="الحالة العملية">
                  <Select placeholder="اختر">
                    <Select.Option value="working">يعمل/تعمل</Select.Option>
                    <Select.Option value="not_working">
                      لا يعمل/لا تعمل
                    </Select.Option>
                    <Select.Option value="any">لا يهم</Select.Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>

            <Form.Item
              name="target_desired_habits"
              label="عادات مرغوبة في الشريك"
            >
              <TextArea rows={2} placeholder="اكتب العادات المرغوبة" />
            </Form.Item>

            <Form.Item
              name="target_unwanted_habits"
              label="عادات غير مرغوبة في الشريك"
            >
              <TextArea rows={2} placeholder="اكتب العادات غير المرغوبة" />
            </Form.Item>

            <Form.Item name="target_special_conditions" label="شروط خاصة">
              <TextArea rows={3} placeholder="اكتب أي شروط إضافية" />
            </Form.Item>
          </>
        )}
      </Form>
    </Modal>
  );
};

export default UpdateProfileModal;
