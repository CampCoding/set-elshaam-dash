// src/pages/dashboard/Users/components/UpdateProfileModal.jsx
import { Modal, Form, Input, Select, Row, Col, Radio, Divider, Checkbox, Upload, Button } from "antd";
import { Upload as UploadIcon, Camera, FileText } from "lucide-react";
import { useEffect, useState } from "react";

const { Option } = Select;
const { TextArea } = Input;

const UpdateProfileModal = ({ visible, onCancel, onSave, onDeleteFile, initialData, type = "main", loading = false }) => {
  const [form] = Form.useForm();
  
  // File states for Main Profile
  const [fileLists, setFileLists] = useState({
    profile_picture: [],
    signature_path: [],
    user_gallery_photos: [],
    marital_status_docs: [],
    education_docs: [],
    experience_docs: [],
    criminal_record_docs: [],
    debt_docs: []
  });

  // Helper to format existing files for Ant Design Upload
  const formatExistingFiles = (data) => {
    if (!data) return [];
    if (typeof data === 'string') {
      try {
        const parsed = JSON.parse(data);
        return Array.isArray(parsed) ? parsed : [parsed];
      } catch (e) {
        return [data];
      }
    }
    return Array.isArray(data) ? data : [data];
  };

  const createFileList = (paths) => {
    return formatExistingFiles(paths).map((path, index) => ({
      uid: `-${index}`,
      name: path.split('/').pop(),
      status: 'done',
      url: path, // Assuming the path is a full URL or relative to base
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

      // Initialize file lists with existing data
      setFileLists({
        profile_picture: createFileList(initialData.profile_picture),
        signature_path: createFileList(initialData.signature_path),
        user_gallery_photos: createFileList(initialData.user_gallery_photos),
        marital_status_docs: createFileList(initialData.marital_status_docs),
        education_docs: createFileList(initialData.education_docs) ,
        experience_docs: createFileList(initialData.experience_docs),
        criminal_record_docs: createFileList(initialData.criminal_record_docs),
        debt_docs: createFileList(initialData.debt_docs)
      });
    }
  }, [visible, initialData, form]);

  const handleFileChange = (key, info) => {
    setFileLists(prev => ({ ...prev, [key]: info.fileList }));
  };

  const handleRemove = async (key, file) => {
    // Only delete from server if it has a URL (meaning it's already uploaded)
    if (file.url && onDeleteFile) {
        return new Promise((resolve) => {
            Modal.confirm({
                title: "هل أنت متأكد من حذف هذا الملف؟",
                content: "سيتم حذف الملف نهائياً من السيرفر.",
                okText: "نعم، احذف",
                cancelText: "إلغاء",
                onOk: async () => {
                   const hide = message.loading("جاري حذف الملف...", 0);
                   try {
                       await onDeleteFile({
                           fieldName: key,
                           filePath: file.url
                       });
                       hide();
                       resolve(true);
                   } catch (error) {
                       hide();
                       console.error("Delete file error:", error);
                       resolve(false);
                   }
                },
                onCancel: () => resolve(false)
            });
        });
    }
    return true; 
  };

  const handleSubmit = () => {
    form.validateFields().then((values) => {
      const formData = new FormData();
      
      // Append regular fields
      Object.keys(values).forEach(key => {
        if (values[key] !== undefined && values[key] !== null) {
          if (typeof values[key] === 'boolean') {
            formData.append(key, values[key] ? 1 : 0);
          } else {
            formData.append(key, values[key]);
          }
        }
      });

      // Append ONLY new files (those with originFileObj)
      Object.keys(fileLists).forEach(key => {
        fileLists[key].forEach(file => {
          if (file.originFileObj) {
            formData.append(key, file.originFileObj);
          }
        });
      });

      onSave(formData, type);
    });
  };

  const countries = [
    "Egyptian", "Saudi", "Emirati", "Kuwaiti", "Qatari", "Omani", "Bahraini", 
    "Jordanian", "Syrian", "Lebanese", "Palestinian", "Iraqi", "Yemeni", 
    "Libyan", "Tunisian", "Algerian", "Moroccan", "Sudanese", "Somali", 
    "Djiboutian", "Mauritanian", "Comoran", "Finnish", "Swedish", "Norwegian"
  ];

  const renderUpload = (key, label, maxCount = 10, isImage = false) => (
    <div className="space-y-2 mb-4">
      <label className="text-sm font-bold text-gray-700">{label}</label>
      <Upload
        listType={isImage ? "picture-card" : "text"}
        fileList={fileLists[key]}
        onChange={(info) => handleFileChange(key, info)}
        onRemove={(file) => handleRemove(key, file)}
        onPreview={async (file) => {
            if (file.url) {
                window.open(file.url, '_blank');
            }
        }}
        beforeUpload={() => false}
        maxCount={maxCount}
        multiple={maxCount > 1}
      >
        {fileLists[key].length < maxCount && (
          <div className="flex flex-col items-center justify-center">
            {isImage ? <Camera className="w-5 h-5 mb-1" /> : <UploadIcon className="w-5 h-5 mb-1" />}
            <span className="text-xs">رفع جديد</span>
          </div>
        )}
      </Upload>
    </div>
  );

  return (
    <Modal
      title={type === "main" ? "تعديل البيانات الشخصية" : "تعديل مواصفات الشريك"}
      open={visible}
      onCancel={onCancel}
      footer={[
        <Button key="cancel" onClick={onCancel} disabled={loading}>
          إلغاء
        </Button>,
        <Button key="submit" type="primary" onClick={handleSubmit} loading={loading}>
          تحديث الكل
        </Button>
      ]}
      width={1000}
      centered
      className="update-profile-modal"
    >
      <Form form={form} layout="vertical" className="mt-4 max-h-[70vh] overflow-y-auto px-2">
        {type === "main" ? (
          <>
            <Row gutter={24}>
              <Col span={8}>{renderUpload("profile_picture", "الصورة الشخصية", 1, true)}</Col>
              <Col span={8}>{renderUpload("signature_path", "التوقيع", 1, true)}</Col>
            </Row>

            <Row gutter={24}>
              <Col span={12}>
                <Form.Item name="full_name" label="اسم مقدم الطلب"><Input /></Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="secondary_phone" label="رقم هاتف بديل"><Input /></Form.Item>
              </Col>
            </Row>

            <Row gutter={24}>
              <Col span={12}>
                <Form.Item name="gender" label="الجنس">
                  <Radio.Group><Radio value="male">ذكر</Radio><Radio value="female">أنثى</Radio></Radio.Group>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="nationality" label="الجنسية">
                  <Select showSearch>{countries.map(c => <Option key={c} value={c}>{c}</Option>)}</Select>
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={24}>
              <Col span={12}>
                <Form.Item name="mother_country" label="بلد الأم">
                  <Select showSearch>{countries.map(c => <Option key={c} value={c}>{c}</Option>)}</Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="religion" label="الديانة">
                  <Select>
                    <Option value="Muslim">Muslim</Option>
                    <Option value="Christian">Christian</Option>
                    <Option value="Other">Other</Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={24}>
              <Col span={12}>
                <Form.Item name="date_of_birth" label="تاريخ الميلاد"><Input type="date" /></Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="arrival_date_finland" label="منذ متى أتيت إلى فنلندا؟"><Input type="date" /></Form.Item>
              </Col>
            </Row>

            <Divider orientation="right">المواصفات الجسدية</Divider>
            <Row gutter={16}>
              <Col span={8}><Form.Item name="height" label="الطول"><Input /></Form.Item></Col>
              <Col span={8}><Form.Item name="weight" label="الوزن"><Input /></Form.Item></Col>
              <Col span={8}><Form.Item name="skin_color" label="لون البشرة"><Input /></Form.Item></Col>
              <Col span={12}><Form.Item name="eye_color" label="لون العيون"><Input /></Form.Item></Col>
              <Col span={12}><Form.Item name="hair_type" label="نوع الشعر"><Input /></Form.Item></Col>
            </Row>

            <Divider orientation="right">الإقامة والحالة الاجتماعية</Divider>
            <Form.Item name="residency_type" label="مانوع اقامتك؟">
              <Radio.Group>
                <Radio value="temporary">مؤقتة</Radio>
                <Radio value="permanent">دائمة</Radio>
                <Radio value="citizen">الفنلندية الجنسية</Radio>
                <Radio value="none">بدون إقامة</Radio>
              </Radio.Group>
            </Form.Item>
            <Form.Item name="marital_status" label="الحالة الاجتماعية">
                <Radio.Group>
                    <Radio value="single">اعزب</Radio>
                    <Radio value="widowed">أرمل</Radio>
                    <Radio value="divorced">مطلق</Radio>
                    <Radio value="separated">منفصل</Radio>
                </Radio.Group>
            </Form.Item>

            <Form.Item name="current_address" label="ماهو عنوانك الحالي؟"><Input /></Form.Item>
            <Form.Item name="has_children" label="هل لديك اولاد">
              <Radio.Group><Radio value={1}>نعم</Radio><Radio value={0}>لا</Radio></Radio.Group>
            </Form.Item>

            <Divider orientation="right">التعليم والوضع المالي</Divider>
            <Row gutter={24}>
              <Col span={12}>
                <Form.Item name="education_level" label="المؤهلات العلمية">
                  <Select>
                    <Option value="High School">High School</Option>
                    <Option value="Diploma">Diploma</Option>
                    <Option value="Bachelor's Degree">Bachelor's Degree</Option>
                    <Option value="Master's Degree">Master's Degree</Option>
                    <Option value="Doctorate">Doctorate</Option>
                    <Option value="Other">Other</Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>
            <Form.Item name="work_experience" label="ماهي خبراتك العملية؟"><TextArea rows={2} /></Form.Item>
            <Form.Item name="income_source" label="من أين تحصل على دخلك في فنلندا؟">
                <Radio.Group>
                    <Radio value="government">من الحكومة</Radio>
                    <Radio value="private_work">من عملي الخاص</Radio>
                </Radio.Group>
            </Form.Item>

            <Row gutter={24}>
              <Col span={12}>
                <Form.Item name="has_criminal_record" label="هل لديك سجل إجرامي ؟">
                  <Radio.Group><Radio value={1}>نعم</Radio><Radio value={0}>لا</Radio></Radio.Group>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="has_debts" label="هل عليك ديون؟">
                  <Radio.Group><Radio value={1}>نعم</Radio><Radio value={0}>لا</Radio></Radio.Group>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="has_previous_loans" label="هل حصلت على قروض سابقا؟">
                  <Radio.Group><Radio value={1}>نعم</Radio><Radio value={0}>لا</Radio></Radio.Group>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="is_smoker" label="هل انت مدخن؟">
                  <Radio.Group><Radio value={1}>نعم</Radio><Radio value={0}>لا</Radio></Radio.Group>
                </Form.Item>
              </Col>
            </Row>

            <Form.Item name="religion_commitment" label="درجة الالتزام الديني">
                <Radio.Group>
                    <Radio value="committed">ملتزم بالصلاة</Radio>
                    <Radio value="sometimes">بعض الاحيان</Radio>
                    <Radio value="never">ابداً</Radio>
                </Radio.Group>
            </Form.Item>

            <Form.Item name="dowry_capability" label="الاستطاعة المالية (المهر)"><Input /></Form.Item>
            <Form.Item name="about_me_more" label="معلومات إضافية"><TextArea rows={3} /></Form.Item>

            <Divider orientation="right">الوثائق والصور</Divider>
            <div className="grid grid-cols-2 gap-4">
              {renderUpload("user_gallery_photos", "معرض الصور", 10, true)}
              {renderUpload("marital_status_docs", "وثائق الحالة الاجتماعية", 10)}
              {renderUpload("education_docs", "وثائق التعليم", 10)}
              {renderUpload("experience_docs", "وثائق الخبرة", 10)}
              {renderUpload("criminal_record_docs", "وثائق السجل الجنائي", 10)}
              {renderUpload("debt_docs", "وثائق الديون", 10)}
            </div>

            <Divider orientation="right">التعهدات والأحكام</Divider>
            <div className="space-y-4 mb-4">
               <Form.Item name="info_correctness_pledge" valuePropName="checked" noStyle>
                  <Checkbox>أتعهد بأن جميع المعلومات الشخصية المقدمة صحيحة وأتحمل المسؤولية</Checkbox>
               </Form.Item>
               <br />
               <Form.Item name="contract_terms_accepted" valuePropName="checked" noStyle>
                  <Checkbox>لقد قرأت بنود العقد وأوافق عليها</Checkbox>
               </Form.Item>
               <br />
               <Form.Item name="gdpr_accepted" valuePropName="checked" noStyle>
                  <Checkbox>سياسة الخصوصية وحماية البيانات (GDPR+)</Checkbox>
               </Form.Item>
            </div>
          </>
        ) : (
          <>
            {/* Target Profile fields */}
             <Row gutter={24}>
              <Col span={12}>
                <Form.Item name="target_age_range" label="العمر المطلوب">
                  <Select>
                    {["18-25", "25-30", "26-30", "31-35", "36-40", "41-45", "46-50", "51-60", "60+"].map(a => <Option key={a} value={a}>{a}</Option>)}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="target_nationality" label="الجنسية المطلوبة">
                   <Select showSearch>
                    {countries.map(c => <Option key={c} value={c}>{c}</Option>)}
                  </Select>
                </Form.Item>
              </Col>
            </Row>
            <Form.Item name="target_marital_status" label="الحالة الاجتماعية المطلوبة">
              <Radio.Group>
                <Radio value="اعزب">اعزب</Radio><Radio value="أرمل">أرمل</Radio><Radio value="مطلق">مطلق</Radio><Radio value="منفصل">منفصل</Radio><Radio value="لا يهم">لا يهم</Radio>
              </Radio.Group>
            </Form.Item>
            <Form.Item name="target_special_conditions" label="شروط خاصة"><TextArea rows={3} /></Form.Item>
          </>
        )}
      </Form>
    </Modal>
  );
};

export default UpdateProfileModal;
