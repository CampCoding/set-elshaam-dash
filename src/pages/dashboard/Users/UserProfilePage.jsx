// src/pages/dashboard/Users/UserProfilePage.jsx
import {
  Tabs,
  Card,
  Image,
  Tag,
  Button,
  Space,
  Row,
  Col,
  Empty,
  Spin,
  Divider,
  List,
} from "antd";
import {
  User,
  Heart,
  FileText,
  Image as ImageIcon,
  Edit,
  Trash2,
  Calendar,
  MapPin,
  Briefcase,
  GraduationCap,
  Scale,
  ArrowRight,
  Info,
  Download,
  ExternalLink,
  Eye,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import { useUserProfile } from "./useUserProfile";
import UpdateProfileModal from "./components/UpdateProfileModal";
import {
  getLabelByValue,
  NATIONALITIES,
  RELIGIONS,
  MARITAL_STATUS,
  RESIDENCY_TYPES,
  EDUCATION_LEVELS,
  INCOME_SOURCES,
  RELIGION_COMMITMENT,
  SKIN_COLORS,
  EYE_COLORS,
  HAIR_TYPES,
  AGE_RANGES,
  COUNTRIES,
} from "../../../constants/userOptions";

// Document Sections Config
const DOCUMENT_SECTIONS = [
  {
    key: "marital_status_docs",
    label: "وثائق الحالة الاجتماعية",
    color: "blue",
  },
  { key: "education_docs", label: "وثائق التعليم", color: "green" },
  { key: "experience_docs", label: "وثائق الخبرة العملية", color: "purple" },
  {
    key: "criminal_record_docs",
    label: "وثائق السجل الجنائي",
    color: "orange",
  },
  { key: "debt_docs", label: "وثائق الديون", color: "red" },
];

const UserProfilePage = () => {
  const {
    id,
    mainProfile,
    targetProfile,
    loading,
    activeTab,
    setActiveTab,
    isEditModalVisible,
    handleOpenEdit,
    handleCloseEdit,
    handleUpdateProfile,
    handleDeleteFile,
    handleDeleteUser,
    isSaving,
  } = useUserProfile();
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Spin size="large" tip="جاري تحميل بيانات الملف الشخصي..." />
      </div>
    );
  }

  // Helper Functions
  const renderInfoItem = (label, value, icon) => (
    <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
      <div className="mt-1 p-1.5 bg-primary/5 rounded-md text-primary">
        {icon}
      </div>
      <div>
        <div className="text-xs text-gray-400 font-medium">{label}</div>
        <div className="text-sm font-semibold text-gray-800">
          {value || "غير محدد"}
        </div>
      </div>
    </div>
  );

  const formatYesNo = (value) => {
    if (value === 1 || value === true || value === "1") return "نعم";
    if (value === 0 || value === false || value === "0") return "لا";
    return "غير محدد";
  };

  const ensureArray = (data) => {
    if (!data) return [];
    if (Array.isArray(data)) return data;
    try {
      const parsed = JSON.parse(data);
      return Array.isArray(parsed) ? parsed : [data];
    } catch {
      if (typeof data === "string" && data.includes(",")) {
        return data.split(",").map((s) => s.trim());
      }
      return [data];
    }
  };

  const getFileName = (url) => url?.split("/").pop() || "ملف";

  const getFileIcon = (url) => {
    const ext = url?.split(".").pop()?.toLowerCase();
    if (["jpg", "jpeg", "png", "gif", "webp"].includes(ext)) return "🖼️";
    if (ext === "pdf") return "📄";
    return "📎";
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div className="flex items-center gap-4">
          <Button
            type="text"
            icon={<ArrowRight className="w-5 h-5" />}
            onClick={() => navigate("/users")}
            className="flex items-center justify-center -mr-2"
          />
          <div>
            <h1 className="text-2xl font-bold text-primary flex items-center gap-3">
              الملف الشخصي: {mainProfile?.full_name || "اسم المستخدم"}
            </h1>
            <p className="text-gray-500 mt-1 text-sm">
              معرّف المستخدم: <span className="font-mono">{id}</span>
            </p>
          </div>
        </div>
        <Space>
          <Button
            type="primary"
            icon={<Edit className="w-4 h-4" />}
            className="bg-primary flex items-center gap-2"
            onClick={handleOpenEdit}
          >
            تعديل الملف
          </Button>
          <Button
            danger
            icon={<Trash2 className="w-4 h-4" />}
            className="flex items-center gap-2"
            onClick={handleDeleteUser}
          >
            حذف الحساب
          </Button>
        </Space>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Profile Sidebar */}
        <div className="lg:col-span-1 flex flex-col gap-6">
          <Card className="rounded-2xl border border-gray-100 shadow-sm overflow-hidden text-center">
            <div className="mb-4">
              <Image
                src={mainProfile?.profile_picture}
                alt={mainProfile?.full_name}
                fallback="https://via.placeholder.com/150?text=لا+توجد+صورة"
                className="rounded-2xl border-4 border-white shadow-md mx-auto aspect-square object-cover"
                width={150}
              />
            </div>
            <h2 className="text-xl font-bold text-gray-800 mb-1">
              {mainProfile?.full_name}
            </h2>
            <div className="mb-4 flex items-center gap-2 justify-center flex-wrap">
              <Tag color="blue" className="rounded-full px-3 py-0.5">
                {getLabelByValue(MARITAL_STATUS, mainProfile?.marital_status)}
              </Tag>
              <Tag color="cyan" className="rounded-full px-3 py-0.5">
                {mainProfile?.gender === "male" ? "ذكر" : "أنثى"}
              </Tag>
            </div>
            <Divider className="my-4" />
            <div className="space-y-1 text-right">
              {renderInfoItem(
                "تاريخ الميلاد",
                mainProfile?.date_of_birth
                  ? dayjs(mainProfile.date_of_birth).format("YYYY-MM-DD")
                  : null,
                <Calendar className="w-4 h-4" />
              )}
              {renderInfoItem(
                "العنوان الحالي",
                mainProfile?.current_address,
                <MapPin className="w-4 h-4" />
              )}
              {renderInfoItem(
                "الجنسية",
                getLabelByValue(NATIONALITIES, mainProfile?.nationality),
                <Info className="w-4 h-4" />
              )}
            </div>
          </Card>

          <Card
            title="الحالة الإدارية"
            className="rounded-2xl border border-gray-100 shadow-sm"
          >
            <div className="space-y-3">
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500">تم إنشاء الملف</span>
                <span className="font-semibold text-gray-700">
                  {mainProfile?.created_at
                    ? dayjs(mainProfile.created_at).format("YYYY-MM-DD")
                    : "-"}
                </span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500">آخر تحديث</span>
                <span className="font-semibold text-gray-700">
                  {mainProfile?.updated_at
                    ? dayjs(mainProfile.updated_at).format("YYYY-MM-DD")
                    : "-"}
                </span>
              </div>
            </div>
          </Card>
        </div>

        {/* Content Area */}
        <div className="lg:col-span-3">
          <Card className="rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <Tabs
              activeKey={activeTab}
              onChange={setActiveTab}
              className="px-6 pb-6"
              items={[
                {
                  key: "main",
                  label: (
                    <span className="flex items-center gap-2 px-2 py-1">
                      <User className="w-4 h-4" />
                      البيانات الشخصية
                    </span>
                  ),
                  children: (
                    <div className="space-y-8 mt-4">
                      {/* Physical Info */}
                      <div>
                        <h3 className="text-lg font-bold text-primary flex items-center gap-2 mb-4">
                          <Scale className="w-5 h-5" /> المواصفات الجسدية
                        </h3>
                        <Row gutter={[16, 16]}>
                          <Col xs={24} sm={8}>
                            {renderInfoItem(
                              "الطول",
                              mainProfile?.height
                                ? `${mainProfile.height} سم`
                                : null,
                              <Info className="w-4 h-4" />
                            )}
                          </Col>
                          <Col xs={24} sm={8}>
                            {renderInfoItem(
                              "الوزن",
                              mainProfile?.weight
                                ? `${mainProfile.weight} كجم`
                                : null,
                              <Info className="w-4 h-4" />
                            )}
                          </Col>
                          <Col xs={24} sm={8}>
                            {renderInfoItem(
                              "لون البشرة",
                              getLabelByValue(
                                SKIN_COLORS,
                                mainProfile?.skin_color
                              ),
                              <Info className="w-4 h-4" />
                            )}
                          </Col>
                          <Col xs={24} sm={8}>
                            {renderInfoItem(
                              "لون العيون",
                              getLabelByValue(
                                EYE_COLORS,
                                mainProfile?.eye_color
                              ),
                              <Info className="w-4 h-4" />
                            )}
                          </Col>
                          <Col xs={24} sm={8}>
                            {renderInfoItem(
                              "نوع الشعر",
                              getLabelByValue(
                                HAIR_TYPES,
                                mainProfile?.hair_type
                              ),
                              <Info className="w-4 h-4" />
                            )}
                          </Col>
                          <Col xs={24} sm={8}>
                            {renderInfoItem(
                              "مدخن",
                              formatYesNo(mainProfile?.is_smoker),
                              <Info className="w-4 h-4" />
                            )}
                          </Col>
                        </Row>
                      </div>

                      {/* Residency & Social */}
                      <div>
                        <h3 className="text-lg font-bold text-primary flex items-center gap-2 mb-4">
                          <MapPin className="w-5 h-5" /> الإقامة والحالة
                          الاجتماعية
                        </h3>
                        <Row gutter={[16, 16]}>
                          <Col xs={24} sm={8}>
                            {renderInfoItem(
                              "نوع الإقامة",
                              getLabelByValue(
                                RESIDENCY_TYPES,
                                mainProfile?.residency_type
                              ),
                              <Info className="w-4 h-4" />
                            )}
                          </Col>
                          <Col xs={24} sm={8}>
                            {renderInfoItem(
                              "الديانة",
                              getLabelByValue(RELIGIONS, mainProfile?.religion),
                              <Info className="w-4 h-4" />
                            )}
                          </Col>
                          <Col xs={24} sm={8}>
                            {renderInfoItem(
                              "بلد الأم",
                              getLabelByValue(
                                COUNTRIES,
                                mainProfile?.mother_country
                              ),
                              <Info className="w-4 h-4" />
                            )}
                          </Col>
                          <Col xs={24} sm={8}>
                            {renderInfoItem(
                              "لديه أولاد",
                              formatYesNo(mainProfile?.has_children),
                              <Info className="w-4 h-4" />
                            )}
                          </Col>
                          <Col xs={24} sm={8}>
                            {renderInfoItem(
                              "الالتزام الديني",
                              getLabelByValue(
                                RELIGION_COMMITMENT,
                                mainProfile?.religion_commitment
                              ),
                              <Info className="w-4 h-4" />
                            )}
                          </Col>
                        </Row>
                      </div>

                      {/* Education & Work */}
                      <div>
                        <h3 className="text-lg font-bold text-primary flex items-center gap-2 mb-4">
                          <Briefcase className="w-5 h-5" /> التعليم والعمل
                        </h3>
                        <Row gutter={[16, 16]}>
                          <Col xs={24} sm={12}>
                            {renderInfoItem(
                              "المستوى التعليمي",
                              getLabelByValue(
                                EDUCATION_LEVELS,
                                mainProfile?.education_level
                              ),
                              <GraduationCap className="w-4 h-4" />
                            )}
                          </Col>
                          <Col xs={24} sm={12}>
                            {renderInfoItem(
                              "مصدر الدخل",
                              getLabelByValue(
                                INCOME_SOURCES,
                                mainProfile?.income_source
                              ),
                              <Briefcase className="w-4 h-4" />
                            )}
                          </Col>
                          <Col xs={24}>
                            {renderInfoItem(
                              "الخبرات العملية",
                              mainProfile?.work_experience,
                              <Briefcase className="w-4 h-4" />
                            )}
                          </Col>
                        </Row>
                      </div>

                      {/* Financial */}
                      <div>
                        <h3 className="text-lg font-bold text-primary flex items-center gap-2 mb-4">
                          <Info className="w-5 h-5" /> الوضع المالي
                        </h3>
                        <Row gutter={[16, 16]}>
                          <Col xs={24} sm={8}>
                            {renderInfoItem(
                              "لديه سجل جنائي",
                              formatYesNo(mainProfile?.has_criminal_record),
                              <Info className="w-4 h-4" />
                            )}
                          </Col>
                          <Col xs={24} sm={8}>
                            {renderInfoItem(
                              "عليه ديون",
                              formatYesNo(mainProfile?.has_debts),
                              <Info className="w-4 h-4" />
                            )}
                          </Col>
                          <Col xs={24} sm={8}>
                            {renderInfoItem(
                              "قروض سابقة",
                              formatYesNo(mainProfile?.has_previous_loans),
                              <Info className="w-4 h-4" />
                            )}
                          </Col>
                          <Col xs={24} sm={12}>
                            {renderInfoItem(
                              "الاستطاعة المالية (المهر)",
                              mainProfile?.dowry_capability,
                              <Info className="w-4 h-4" />
                            )}
                          </Col>
                        </Row>
                      </div>

                      {/* About Me */}
                      {mainProfile?.about_me_more && (
                        <Card className="rounded-xl bg-gray-50">
                          <h3 className="text-primary font-bold mb-2">
                            معلومات إضافية
                          </h3>
                          <p className="text-sm text-gray-700 leading-relaxed">
                            {mainProfile.about_me_more}
                          </p>
                        </Card>
                      )}

                      {/* Documents Section - Opens in New Tab */}
                      <div>
                        <h3 className="text-lg font-bold text-primary flex items-center gap-2 mb-4">
                          <FileText className="w-5 h-5" /> الوثائق والمستندات
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {DOCUMENT_SECTIONS.map((section) => {
                            const docs = ensureArray(
                              mainProfile?.[section.key]
                            );
                            return (
                              <Card
                                key={section.key}
                                size="small"
                                title={
                                  <span className="flex items-center gap-2">
                                    <FileText className="w-4 h-4" />
                                    {section.label}
                                  </span>
                                }
                                className="rounded-xl border-gray-100"
                                extra={
                                  <Tag color={section.color}>{docs.length}</Tag>
                                }
                              >
                                {docs.length === 0 ? (
                                  <Empty
                                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                                    description="لا توجد وثائق"
                                    className="py-4"
                                  />
                                ) : (
                                  <List
                                    size="small"
                                    dataSource={docs}
                                    renderItem={(docUrl) => (
                                      <List.Item className="px-0 py-2 border-b last:border-b-0">
                                        <div className="flex items-center justify-between w-full">
                                          <span className="flex items-center gap-2 text-sm text-gray-600">
                                            <span>{getFileIcon(docUrl)}</span>
                                            <span className="truncate max-w-[120px]">
                                              {getFileName(docUrl)}
                                            </span>
                                          </span>
                                          <Space size="small">
                                            {/* Open in New Tab */}
                                            <Button
                                              type="text"
                                              size="small"
                                              icon={
                                                <ExternalLink className="w-4 h-4 text-blue-500" />
                                              }
                                              onClick={() =>
                                                window.open(docUrl, "_blank")
                                              }
                                              title="فتح في نافذة جديدة"
                                            />
                                            {/* Delete */}
                                            <Button
                                              type="text"
                                              size="small"
                                              danger
                                              icon={
                                                <Trash2 className="w-4 h-4" />
                                              }
                                              onClick={() =>
                                                handleDeleteFile({
                                                  fieldName: section.key,
                                                  filePath: docUrl,
                                                  type: "main",
                                                })
                                              }
                                              title="حذف"
                                            />
                                          </Space>
                                        </div>
                                      </List.Item>
                                    )}
                                  />
                                )}
                              </Card>
                            );
                          })}
                        </div>
                      </div>

                      {/* Gallery - Inline */}
                      <div>
                        <h3 className="text-lg font-bold text-primary flex items-center gap-2 mb-4">
                          <ImageIcon className="w-5 h-5" /> معرض الصور
                        </h3>
                        {ensureArray(mainProfile?.user_gallery_photos).length >
                        0 ? (
                          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                            <Image.PreviewGroup>
                              {ensureArray(mainProfile.user_gallery_photos).map(
                                (photo, index) => (
                                  <div
                                    key={index}
                                    className="relative group rounded-xl overflow-hidden shadow-sm border-2 border-white aspect-square"
                                  >
                                    <Image
                                      src={photo}
                                      className="w-full h-full object-cover"
                                      alt={`صورة ${index + 1}`}
                                    />
                                    <button
                                      className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleDeleteFile({
                                          fieldName: "user_gallery_photos",
                                          filePath: photo,
                                          type: "main",
                                        });
                                      }}
                                    >
                                      <Trash2 className="w-3 h-3" />
                                    </button>
                                  </div>
                                )
                              )}
                            </Image.PreviewGroup>
                          </div>
                        ) : (
                          <Empty
                            image={Empty.PRESENTED_IMAGE_SIMPLE}
                            description="لا توجد صور في المعرض"
                          />
                        )}
                      </div>
                    </div>
                  ),
                },
                {
                  key: "target",
                  label: (
                    <span className="flex items-center gap-2 px-2 py-1">
                      <Heart className="w-4 h-4" />
                      مواصفات الشريك
                    </span>
                  ),
                  children: (
                    <div className="space-y-8 mt-4">
                      {!targetProfile ? (
                        <Empty
                          image={Empty.PRESENTED_IMAGE_SIMPLE}
                          description="لم يتم تحديد مواصفات الشريك بعد"
                        />
                      ) : (
                        <>
                          {/* Basic Target Specs */}
                          <div>
                            <h3 className="text-lg font-bold text-primary flex items-center gap-2 mb-4">
                              <Heart className="w-5 h-5 text-accent" />{" "}
                              المواصفات الأساسية
                            </h3>
                            <Row gutter={[16, 16]}>
                              <Col xs={24} sm={8}>
                                {renderInfoItem(
                                  "الفئة العمرية",
                                  getLabelByValue(
                                    AGE_RANGES,
                                    targetProfile?.target_age_range
                                  ),
                                  <Info className="w-4 h-4" />
                                )}
                              </Col>
                              <Col xs={24} sm={8}>
                                {renderInfoItem(
                                  "الجنسية المطلوبة",
                                  getLabelByValue(
                                    NATIONALITIES,
                                    targetProfile?.target_nationality
                                  ),
                                  <Info className="w-4 h-4" />
                                )}
                              </Col>
                              <Col xs={24} sm={8}>
                                {renderInfoItem(
                                  "الحالة الاجتماعية",
                                  getLabelByValue(
                                    [
                                      ...MARITAL_STATUS,
                                      { value: "any", label: "لا يهم" },
                                    ],
                                    targetProfile?.target_marital_status
                                  ),
                                  <Info className="w-4 h-4" />
                                )}
                              </Col>
                              <Col xs={24} sm={8}>
                                {renderInfoItem(
                                  "الديانة",
                                  getLabelByValue(
                                    RELIGIONS,
                                    targetProfile?.target_religion
                                  ),
                                  <Info className="w-4 h-4" />
                                )}
                              </Col>
                            </Row>
                          </div>

                          {/* Physical Target Specs */}
                          <div>
                            <h3 className="text-lg font-bold text-primary flex items-center gap-2 mb-4">
                              <Scale className="w-5 h-5" /> المواصفات الجسدية
                            </h3>
                            <Row gutter={[16, 16]}>
                              <Col xs={24} sm={8}>
                                {renderInfoItem(
                                  "الطول",
                                  targetProfile?.target_height,
                                  <Info className="w-4 h-4" />
                                )}
                              </Col>
                              <Col xs={24} sm={8}>
                                {renderInfoItem(
                                  "الوزن",
                                  targetProfile?.target_weight,
                                  <Info className="w-4 h-4" />
                                )}
                              </Col>
                              <Col xs={24} sm={8}>
                                {renderInfoItem(
                                  "لون البشرة",
                                  getLabelByValue(
                                    [
                                      ...SKIN_COLORS,
                                      { value: "any", label: "لا يهم" },
                                    ],
                                    targetProfile?.target_skin_color
                                  ),
                                  <Info className="w-4 h-4" />
                                )}
                              </Col>
                            </Row>
                          </div>

                          {/* Education & Work Preferences */}
                          <div>
                            <h3 className="text-lg font-bold text-primary flex items-center gap-2 mb-4">
                              <Briefcase className="w-5 h-5" /> التعليم والعمل
                            </h3>
                            <Row gutter={[16, 16]}>
                              <Col xs={24} sm={12}>
                                {renderInfoItem(
                                  "المستوى التعليمي",
                                  getLabelByValue(
                                    [
                                      ...EDUCATION_LEVELS,
                                      { value: "any", label: "لا يهم" },
                                    ],
                                    targetProfile?.target_education_level
                                  ),
                                  <GraduationCap className="w-4 h-4" />
                                )}
                              </Col>
                              <Col xs={24} sm={12}>
                                {renderInfoItem(
                                  "الحالة العملية",
                                  targetProfile?.target_work_status ===
                                    "working"
                                    ? "يعمل/تعمل"
                                    : targetProfile?.target_work_status ===
                                        "not_working"
                                      ? "لا يعمل/لا تعمل"
                                      : "لا يهم",
                                  <Briefcase className="w-4 h-4" />
                                )}
                              </Col>
                            </Row>
                          </div>

                          {/* Habits */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Card
                              title="عادات مرغوبة"
                              size="small"
                              className="rounded-xl border-green-100 bg-green-50/20"
                            >
                              <p className="text-sm text-gray-700 leading-relaxed">
                                {targetProfile?.target_desired_habits ||
                                  "لم يتم تحديد"}
                              </p>
                            </Card>
                            <Card
                              title="عادات غير مرغوبة"
                              size="small"
                              className="rounded-xl border-red-100 bg-red-50/20"
                            >
                              <p className="text-sm text-gray-700 leading-relaxed">
                                {targetProfile?.target_unwanted_habits ||
                                  "لم يتم تحديد"}
                              </p>
                            </Card>
                          </div>

                          {/* Special Conditions */}
                          {targetProfile?.target_special_conditions && (
                            <Card className="rounded-xl border-yellow-100 bg-yellow-50/20">
                              <h3 className="text-primary font-bold flex items-center gap-2 mb-2">
                                <Info className="w-4 h-4" /> شروط خاصة
                              </h3>
                              <p className="text-sm text-gray-700 leading-relaxed">
                                {targetProfile.target_special_conditions}
                              </p>
                            </Card>
                          )}
                        </>
                      )}
                    </div>
                  ),
                },
              ]}
            />
          </Card>
        </div>
      </div>

      <UpdateProfileModal
        visible={isEditModalVisible}
        onCancel={handleCloseEdit}
        onSave={handleUpdateProfile}
        onDeleteFile={handleDeleteFile}
        initialData={activeTab === "main" ? mainProfile : targetProfile}
        type={activeTab}
        loading={isSaving}
      />
    </div>
  );
};

export default UserProfilePage;
