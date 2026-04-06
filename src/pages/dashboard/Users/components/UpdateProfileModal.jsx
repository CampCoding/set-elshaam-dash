// src/pages/dashboard/Users/components/UpdateProfileModal.jsx
import { Modal, Form, Input, Select, Row, Col, Radio, Divider, Checkbox, Upload, Button } from "antd";
import { Upload as UploadIcon, Camera } from "lucide-react";
import { useEffect, useState } from "react";
import * as UserOptions from "../../../../constants/userOptions";

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
          // Handle numeric/string conversion if needed for radios
          has_children: initialData.has_children !== undefined ? Number(initialData.has_children) : undefined,
          has_criminal_record: initialData.has_criminal_record !== undefined ? Number(initialData.has_criminal_record) : undefined,
          has_debts: initialData.has_debts !== undefined ? Number(initialData.has_debts) : undefined,
          has_previous_loans: initialData.has_previous_loans !== undefined ? Number(initialData.has_previous_loans) : undefined,
          is_smoker: initialData.is_smoker !== undefined ? Number(initialData.is_smoker) : undefined,
          target_is_smoker: initialData.target_is_smoker !== undefined ? Number(initialData.target_is_smoker) : 0,
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
    if (file.url && onDeleteFile) {
        return new Promise((resolve) => {
            Modal.confirm({
                title: "هل أنت متأكد من حذف هذا الملف؟",
                content: "سيتم حذف الملف نهائياً من السيرفر.",
                okText: "نعم، احذف",
                cancelText: "إلغاء",
                onOk: async () => {
                   try {
                       await onDeleteFile({
                           fieldName: key,
                           filePath: file.url
                       });
                       resolve(true);
                   } catch (error) {
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

      // Append files
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

  const selectedReligion = Form.useWatch("religion", form);
  const selectedTargetReligion = Form.useWatch("target_religion", form);

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
        <Button key="cancel" onClick={onCancel} disabled={loading}>إلغاء</Button>,
        <Button key="submit" type="primary" onClick={handleSubmit} loading={loading}>تحديث الكل</Button>
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
              <Col span={12}><Form.Item name="full_name" label="اسم مقدم الطلب"><Input /></Form.Item></Col>
              <Col span={12}><Form.Item name="secondary_phone" label="رقم هاتف بديل"><Input /></Form.Item></Col>
            </Row>

            <Row gutter={24}>
              <Col span={8}>
                <Form.Item name="gender" label="الجنس">
                  <Radio.Group><Radio value="male">ذكر</Radio><Radio value="female">أنثى</Radio></Radio.Group>
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item name="nationality" label="الجنسية">
                  <Select showSearch optionFilterProp="label" options={UserOptions.NATIONALITIES} />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item name="mother_country" label="بلد الأم">
                  <Select showSearch optionFilterProp="label" options={UserOptions.COUNTRIES} />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={24}>
              <Col span={12}>
                <Form.Item name="city" label="المدينة"><Input /></Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="religion" label="الديانة">
                  <Select options={UserOptions.RELIGIONS} />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={24}>
              <Col span={12}>
                <Form.Item name="sect" label="المذهب">
                  <Select 
                    options={UserOptions.SECTS_BY_RELIGION[selectedReligion] || UserOptions.SECTS_BY_RELIGION.other} 
                    disabled={!selectedReligion}
                  />
                </Form.Item>
              </Col>
              <Col span={12}><Form.Item name="date_of_birth" label="تاريخ الميلاد"><Input type="date" /></Form.Item></Col>
            </Row>

            <Form.Item name="arrival_date_finland" label="منذ متى أتيت إلى فنلندا؟"><Input type="date" /></Form.Item>

            <Divider orientation="right">المواصفات الجسدية</Divider>
            <Row gutter={16}>
              <Col span={8}><Form.Item name="height" label="الطول (سم)"><Input type="number" /></Form.Item></Col>
              <Col span={8}><Form.Item name="weight" label="الوزن (كغ)"><Input type="number" /></Form.Item></Col>
              <Col span={8}><Form.Item name="skin_color" label="لون البشرة"><Select options={UserOptions.SKIN_COLORS} /></Form.Item></Col>
              <Col span={8}><Form.Item name="eye_color" label="لون العيون"><Select options={UserOptions.EYE_COLORS} /></Form.Item></Col>
              <Col span={8}><Form.Item name="hair_type" label="نوع الشعر"><Select options={UserOptions.HAIR_TYPES} /></Form.Item></Col>
              <Col span={8}><Form.Item name="hijab_status" label="حالة الحجاب"><Select options={UserOptions.HIJAB_STATUS} /></Form.Item></Col>
            </Row>
            <Form.Item name="distinguishing_mark" label="علامة مميزة (ندوب، وشوم...)"><TextArea rows={2} /></Form.Item>

            <Divider orientation="right">الإقامة والحالة الاجتماعية</Divider>
            <Form.Item name="residency_type" label="مانوع اقامتك؟">
              <Select options={UserOptions.RESIDENCY_TYPES} />
            </Form.Item>
            <Form.Item name="marital_status" label="الحالة الاجتماعية">
                <Select options={UserOptions.MARITAL_STATUS} />
            </Form.Item>
            <Form.Item name="current_address" label="ماهو عنوانك الحالي؟"><Input /></Form.Item>
            
            <Row gutter={24}>
              <Col span={12}>
                <Form.Item name="has_children" label="هل لديك اولاد">
                  <Radio.Group><Radio value={1}>نعم</Radio><Radio value={0}>لا</Radio></Radio.Group>
                </Form.Item>
              </Col>
              <Col span={12}>
                 <Form.Item name="children_with_me" label="هل الأطفال يقيمون معك؟"><Input /></Form.Item>
              </Col>
            </Row>
            <Form.Item name="children_after_marriage" label="هل ترغب في أطفال بعد الزواج؟"><Input /></Form.Item>
            <Form.Item name="children_info" label="معلومات إضافية عن الأطفال"><TextArea rows={2} /></Form.Item>

            <Divider orientation="right">التعليم والوضع المالي</Divider>
            <Form.Item name="education_level" label="المؤهلات العلمية"><Select options={UserOptions.EDUCATION_LEVELS} /></Form.Item>
            <Form.Item name="work_experience" label="ماهي خبراتك العملية؟"><TextArea rows={2} /></Form.Item>
            <Form.Item name="income_source" label="من أين تحصل على دخلك في فنلندا؟">
                <Select options={UserOptions.INCOME_SOURCES} />
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
                <Select options={UserOptions.RELIGION_COMMITMENT} />
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

            <Divider orientation="right">التعهدات</Divider>
            <Form.Item name="info_correctness_pledge" valuePropName="checked"><Checkbox>أتعهد بصحة المعلومات</Checkbox></Form.Item>
            <Form.Item name="contract_terms_accepted" valuePropName="checked"><Checkbox>أوافق على بنود العقد</Checkbox></Form.Item>
            <Form.Item name="gdpr_accepted" valuePropName="checked"><Checkbox>أوافق على سياسة البيانات (GDPR)</Checkbox></Form.Item>
          </>
        ) : (
          <>
            {/* Target Profile fields */}
            <Row gutter={24}>
              <Col span={12}>
                <Form.Item name="target_gender" label="الجنس المطلوب للشريك">
                   <Radio.Group><Radio value="male">ذكر</Radio><Radio value="female">أنثى</Radio><Radio value="any">لا يهم</Radio></Radio.Group>
                </Form.Item>
              </Col>
              <Col span={12}>
                 <Form.Item name="target_age_range" label="العمر المطلوب">
                    <Select mode="multiple" options={UserOptions.AGE_RANGES} />
                 </Form.Item>
              </Col>
            </Row>

            <Row gutter={24}>
              <Col span={12}>
                 <Form.Item name="target_nationality" label="الجنسية المطلوبة">
                    <Select showSearch mode="multiple" optionFilterProp="label" options={UserOptions.NATIONALITIES} />
                 </Form.Item>
              </Col>
              <Col span={12}>
                 <Form.Item name="target_city" label="المدينة المطلوبة للشريك"><Input /></Form.Item>
              </Col>
            </Row>

            <Row gutter={24}>
              <Col span={12}>
                <Form.Item name="target_religion" label="ديانة الشريك">
                  <Select options={UserOptions.RELIGIONS} allowClear />
                </Form.Item>
              </Col>
              <Col span={12}>
                 <Form.Item name="target_sect" label="المذهب المطلوب للشريك">
                    <Select 
                      options={UserOptions.SECTS_BY_RELIGION[selectedTargetReligion] || UserOptions.SECTS_BY_RELIGION.other} 
                      disabled={!selectedTargetReligion}
                    />
                 </Form.Item>
              </Col>
            </Row>

            <Row gutter={24}>
              <Col span={24}>
                 <Form.Item name="target_marital_status" label="الحالة الاجتماعية المطلوبة">
                    <Select mode="multiple" options={UserOptions.MARITAL_STATUS} />
                 </Form.Item>
              </Col>
            </Row>

            <Row gutter={24}>
              <Col span={12}>
                <Form.Item name="target_is_smoker" label="هل يهم أن يكون الشريك مدخن؟">
                   <Radio.Group><Radio value={1}>نعم</Radio><Radio value={0}>لا</Radio></Radio.Group>
                </Form.Item>
              </Col>
              <Col span={12}>
                 <Form.Item name="target_has_children" label="هل تتقبل وجود أطفال لدى الشريك؟">
                    <Select options={UserOptions.YES_NO_OPTIONS} />
                 </Form.Item>
              </Col>
            </Row>

            <Form.Item name="target_residency_type" label="نوع الإقامة المطلوب للشريك">
                <Select mode="multiple" options={UserOptions.RESIDENCY_TYPES} />
            </Form.Item>
            <Form.Item name="target_religion_commitment" label="درجة الالتزام الديني المطلوبة">
                <Select mode="multiple" options={UserOptions.RELIGION_COMMITMENT} />
            </Form.Item>
            <Form.Item name="target_special_conditions" label="شروط خاصة إضافية للشريك"><TextArea rows={3} /></Form.Item>
          </>
        )}
      </Form>
    </Modal>
  );
};

export default UpdateProfileModal;
