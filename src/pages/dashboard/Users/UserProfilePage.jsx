// src/pages/dashboard/Users/UserProfilePage.jsx
import {
  Tabs,
  Card,
  Descriptions,
  Image,
  Tag,
  Button,
  Space,
  Row,
  Col,
  Empty,
  Spin,
  Alert,
  Divider,
  List,
  Modal,
  Form,
  Input,
  Select,
  InputNumber,
  Radio,
  Checkbox,
  DatePicker,
  Upload,
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
  CloudUpload,
  ArrowRight,
  Download,
  Info,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import { useUserProfile } from "./useUserProfile";
import UpdateProfileModal from "./components/UpdateProfileModal";

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
  } = useUserProfile();
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Spin size="large" tip="جاري تحميل بيانات الملف الشخصي..." />
      </div>
    );
  }

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

  const documentSections = [
    { label: "وثائق الحالة الاجتماعية", key: "marital_status_docs", data: mainProfile?.marital_status_docs },
    { label: "وثائق التعليم", key: "education_docs", data: mainProfile?.education_docs },
    { label: "وثائق الخبرة", key: "experience_docs", data: mainProfile?.experience_docs },
    { label: "وثائق السجل الجنائي", key: "criminal_record_docs", data: mainProfile?.criminal_record_docs },
    { label: "وثائق الديون", key: "debt_docs", data: mainProfile?.debt_docs },
  ];

  // Helper to ensure data is an array
  const ensureArray = (data) => {
    if (!data) return [];
    if (Array.isArray(data)) return data;
    try {
      const parsed = JSON.parse(data);
      return Array.isArray(parsed) ? parsed : [data];
    } catch {
      if (typeof data === "string" && data.includes(",")) {
        return data.split(",").map(s => s.trim());
      }
      return [data];
    }
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
              معرّف المستخدم (ID): <span className="font-mono">{id}</span>
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
        <div className="lg:col-span-1 space-y-6">
          <Card className="rounded-2xl border border-gray-100 shadow-sm overflow-hidden text-center">
            <div className="mb-4">
              <Image
                src={mainProfile?.profile_picture}
                alt={mainProfile?.full_name}
                fallback="https://via.placeholder.com/150?text=No+Image"
                className="rounded-2xl border-4 border-white shadow-md mx-auto aspect-square object-cover"
                width={150}
              />
            </div>
            <h2 className="text-xl font-bold text-gray-800 mb-1">
              {mainProfile?.full_name}
            </h2>
            <div className="mb-4">
              <Tag color="blue" className="rounded-full px-3 py-0.5">
                {mainProfile?.marital_status === "single" ? "أعزب" : mainProfile?.marital_status}
              </Tag>
              <Tag color="cyan" className="rounded-full px-3 py-0.5">
                {mainProfile?.gender === "male" ? "ذكر" : "أنثى"}
              </Tag>
            </div>
            <Divider className="my-4" />
            <div className="space-y-1 text-right">
              {renderInfoItem("تاريخ الميلاد", mainProfile?.date_of_birth ? dayjs(mainProfile.date_of_birth).format("YYYY-MM-DD") : "غير محدد", <Calendar className="w-4 h-4" />)}
              {renderInfoItem("العنوان الحالي", mainProfile?.current_address, <MapPin className="w-4 h-4" />)}
              {renderInfoItem("رقم الهاتف الثاني", mainProfile?.secondary_phone, <Info className="w-4 h-4" />)}
            </div>
          </Card>

          <Card
            title="الحالة الإدارية"
            className="rounded-2xl border border-gray-100 shadow-sm"
          >
            <div className="space-y-3">
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500">تم إنشاء الملف</span>
                <span className="font-semibold text-gray-700">{mainProfile?.created_at ? dayjs(mainProfile.created_at).format("YYYY-MM-DD") : "-"}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500">آخر تحديث</span>
                <span className="font-semibold text-gray-700">{mainProfile?.updated_at ? dayjs(mainProfile.updated_at).format("YYYY-MM-DD") : "-"}</span>
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
                    <div className="space-y-8 mt-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                      {/* Physical Info */}
                      <div>
                        <h3 className="text-lg font-bold text-primary flex items-center gap-2 mb-4">
                          <Scale className="w-5 h-5" /> المواصفات الجسدية
                        </h3>
                        <Row gutter={[16, 16]}>
                          <Col xs={24} sm={8}>{renderInfoItem("الطول", `${mainProfile?.height || "-"} سم`, <Info className="w-4 h-4" />)}</Col>
                          <Col xs={24} sm={8}>{renderInfoItem("الوزن", `${mainProfile?.weight || "-"} كجم`, <Info className="w-4 h-4" />)}</Col>
                          <Col xs={24} sm={8}>{renderInfoItem("لون البشرة", mainProfile?.skin_color, <Info className="w-4 h-4" />)}</Col>
                          <Col xs={24} sm={8}>{renderInfoItem("لون العيون", mainProfile?.eye_color, <Info className="w-4 h-4" />)}</Col>
                          <Col xs={24} sm={8}>{renderInfoItem("نوع الشعر", mainProfile?.hair_type, <Info className="w-4 h-4" />)}</Col>
                          <Col xs={24} sm={8}>{renderInfoItem("مدخن", mainProfile?.is_smoker ? "نعم" : "لا", <Info className="w-4 h-4" />)}</Col>
                        </Row>
                      </div>

                      {/* Education & Work */}
                      <div>
                        <h3 className="text-lg font-bold text-primary flex items-center gap-2 mb-4">
                          <Briefcase className="w-5 h-5" /> التعليم والعمل
                        </h3>
                        <Row gutter={[16, 16]}>
                          <Col xs={24} sm={12}>{renderInfoItem("المستوى التعليمي", mainProfile?.education_level, <GraduationCap className="w-4 h-4" />)}</Col>
                          <Col xs={24} sm={12}>{renderInfoItem("خبرة العمل", mainProfile?.work_experience, <Briefcase className="w-4 h-4" />)}</Col>
                          <Col xs={24} sm={12}>{renderInfoItem("مصدر الدخل", mainProfile?.income_source, <Info className="w-4 h-4" />)}</Col>
                          <Col xs={24} sm={12}>{renderInfoItem("نوع الإقامة", mainProfile?.residency_type, <Info className="w-4 h-4" />)}</Col>
                        </Row>
                      </div>

                      {/* Documents Section */}
                      <div>
                        <h3 className="text-lg font-bold text-primary flex items-center gap-2 mb-4">
                          <FileText className="w-5 h-5" /> الوثائق والمرفقات
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {documentSections.map((section) => {
                            const docs = ensureArray(section.data);
                            return (
                              <Card
                                key={section.key}
                                size="small"
                                title={section.label}
                                className="rounded-xl border-gray-100 bg-gray-50/30"
                                extra={<span className="text-xs text-primary font-bold">{docs.length}</span>}
                              >
                                <List
                                  size="small"
                                  dataSource={docs}
                                  renderItem={(docUrl) => (
                                    <List.Item
                                      className="px-0 py-2 border-none flex justify-between items-center"
                                    >
                                      <span className="text-xs text-gray-500 truncate max-w-[150px]">
                                        {typeof docUrl === "string" ? docUrl.split("/").pop() : "document"}
                                      </span>
                                      <Space>
                                        <Button
                                          size="small"
                                          icon={<Download className="w-3 h-3" />}
                                          onClick={() => window.open(docUrl)}
                                        />
                                        <Button
                                          size="small"
                                          danger
                                          icon={<Trash2 className="w-3 h-3" />}
                                          onClick={() => handleDeleteFile({ fieldName: section.key, filePath: docUrl, type: "main" })}
                                        />
                                      </Space>
                                    </List.Item>
                                  )}
                                />
                              </Card>
                            );
                          })}
                        </div>
                      </div>

                      {/* Gallery */}
                      <div>
                        <h3 className="text-lg font-bold text-primary flex items-center gap-2 mb-4">
                          <ImageIcon className="w-5 h-5" /> معرض الصور
                        </h3>
                        {ensureArray(mainProfile?.user_gallery_photos).length > 0 ? (
                          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                            {ensureArray(mainProfile.user_gallery_photos).map((photo, index) => (
                              <div key={index} className="relative group rounded-xl overflow-hidden shadow-sm border-2 border-white">
                                <Image
                                  src={photo}
                                  className="w-full aspect-square object-cover"
                                />
                                <button
                                  className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                  onClick={() => handleDeleteFile({ fieldName: "user_gallery_photos", filePath: photo, type: "main" })}
                                >
                                  <Trash2 className="w-3 h-3" />
                                </button>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="لا توجد صور في المعرض" />
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
                    <div className="space-y-8 mt-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                      <div>
                        <h3 className="text-lg font-bold text-primary flex items-center gap-2 mb-4">
                          <Heart className="w-5 h-5 text-accent" /> تفضيلات الشريك المستقبلية
                        </h3>
                        <Row gutter={[16, 16]}>
                          <Col xs={24} sm={8}>{renderInfoItem("العمر المفضل", targetProfile?.target_age_range, <Info className="w-4 h-4" />)}</Col>
                          <Col xs={24} sm={8}>{renderInfoItem("الجنسية المفضلة", targetProfile?.target_nationality, <Info className="w-4 h-4" />)}</Col>
                          <Col xs={24} sm={8}>{renderInfoItem("الجنسية المحددة", targetProfile?.target_specific_nationality, <Info className="w-4 h-4" />)}</Col>
                          <Col xs={24} sm={8}>{renderInfoItem("الديانة", targetProfile?.target_religion, <Info className="w-4 h-4" />)}</Col>
                          <Col xs={24} sm={8}>{renderInfoItem("الحالة الاجتماعية", targetProfile?.target_marital_status, <Info className="w-4 h-4" />)}</Col>
                          <Col xs={24} sm={8}>{renderInfoItem("الطول المفضل", targetProfile?.target_height, <Info className="w-4 h-4" />)}</Col>
                          <Col xs={24} sm={8}>{renderInfoItem("الوزن المفضل", targetProfile?.target_weight, <Info className="w-4 h-4" />)}</Col>
                          <Col xs={24} sm={8}>{renderInfoItem("لون البشرة", targetProfile?.target_skin_color, <Info className="w-4 h-4" />)}</Col>
                        </Row>
                      </div>

                      <div>
                        <h3 className="text-lg font-bold text-primary flex items-center gap-2 mb-4">
                           <Briefcase className="w-5 h-5" /> تفضيلات العمل والاجتماع
                        </h3>
                         <Row gutter={[16, 16]}>
                            <Col xs={24} sm={12}>{renderInfoItem("المستوى التعليمي", targetProfile?.target_education_level, <GraduationCap className="w-4 h-4" />)}</Col>
                            <Col xs={24} sm={12}>{renderInfoItem("الحالة العملية", targetProfile?.target_work_status, <Briefcase className="w-4 h-4" />)}</Col>
                            <Col xs={24} sm={12}>{renderInfoItem("النشاط الاجتماعي", targetProfile?.target_social_activity, <Info className="w-4 h-4" />)}</Col>
                            <Col xs={24} sm={12}>{renderInfoItem("التواجد على وسائل التواصل", targetProfile?.target_social_media_presence, <Info className="w-4 h-4" />)}</Col>
                         </Row>
                      </div>

                      {/* Multi-Select items */}
                      <div className="bg-gray-50 rounded-2xl p-6">
                        <h3 className="text-lg font-bold text-primary mb-4">مشاريع ومهام منزلية (تفضيلات)</h3>
                        <div className="flex flex-wrap gap-2">
                           {targetProfile?.["target_house-tasks_preference"]?.map((task, i) => (
                             <Tag key={i} color="success" className="rounded-full px-4 py-1 text-sm">{task}</Tag>
                           ))}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card title="عادات مرغوبة" size="small" className="rounded-xl border-green-100 bg-green-50/20">
                            <p className="text-sm text-gray-700 leading-relaxed">{targetProfile?.target_desired_habits || "لا توجد تفاصيل"}</p>
                        </Card>
                        <Card title="عادات غير مرغوبة" size="small" className="rounded-xl border-red-100 bg-red-50/20">
                            <p className="text-sm text-gray-700 leading-relaxed">{targetProfile?.target_unwanted_habits || "لا توجد تفاصيل"}</p>
                        </Card>
                      </div>

                      <Card className="rounded-xl border-yellow-100 bg-yellow-50/20">
                        <h3 className="text-primary font-bold flex items-center gap-2 mb-2">
                            <Info className="w-4 h-4" /> شروط خاصة
                        </h3>
                        <p className="text-sm text-gray-700 leading-relaxed">{targetProfile?.target_special_conditions || "لا توجد شروط خاصة"}</p>
                      </Card>
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
