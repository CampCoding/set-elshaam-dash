// src/pages/dashboard/Users/UserProfilePage.jsx

import React, { useRef, useState, useCallback } from "react";
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
  Modal,
  Tooltip,
  message,
} from "antd";
import {
  User,
  Heart,
  FileText,
  Edit,
  Trash2,
  Calendar,
  MapPin,
  Briefcase,
  GraduationCap,
  Scale,
  ArrowRight,
  Info,
  ExternalLink,
  Printer,
  FileDown,
  Copy,
  Check,
  DollarSign,
  Activity,
  Phone,
  Globe,
  Home,
  Image as ImageIcon,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useReactToPrint } from "react-to-print";
import html2pdf from "html2pdf.js";
import dayjs from "dayjs";
import { useUserProfile } from "./useUserProfile";
import UpdateProfileModal from "./components/UpdateProfileModal";
import PrintableProfile from "./components/PrintableProfile";
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
  HIJAB_STATUS,
  SECTS_BY_RELIGION,
  YES_NO_OPTIONS,
} from "../../../constants/userOptions";
import PaymentModal from "../profiles/components/PaymentModal";
import StatusTrackModal from "../profiles/components/StatusTrackModal";

// ==================== Constants ====================
const DOCUMENT_SECTIONS = [
  {
    key: "marital_status_docs",
    label: "وثائق الحالة الاجتماعية",
    color: "blue",
    questionKey: "marital_status",
  },
  {
    key: "education_docs",
    label: "وثائق التعليم",
    color: "green",
    questionKey: "education_level",
  },
  {
    key: "experience_docs",
    label: "وثائق الخبرة العملية",
    color: "purple",
    questionKey: "work_experience",
  },
  {
    key: "criminal_record_docs",
    label: "وثائق السجل الجنائي",
    color: "orange",
    questionKey: "has_criminal_record",
  },
  {
    key: "debt_docs",
    label: "وثائق الديون",
    color: "red",
    questionKey: "has_debts",
  },
];

const CLOTHING_STYLES = [
  { value: "not_important", label: "غير مهم" },
  { value: "conservative", label: "محتشم" },
  { value: "modern", label: "عصري" },
  { value: "mixed", label: "متنوع" },
];

const WORK_STATUS = [
  { value: "not_important", label: "غير مهم" },
  { value: "working", label: "يعمل" },
  { value: "not_working", label: "لا يعمل" },
  { value: "student", label: "طالب" },
];

const SOCIAL_ACTIVITY = [
  { value: "normal", label: "عادي" },
  { value: "active", label: "نشط" },
  { value: "introvert", label: "انطوائي" },
  { value: "not_important", label: "غير مهم" },
];

const SOCIAL_MEDIA = [
  { value: "normal", label: "عادي" },
  { value: "active", label: "نشط جداً" },
  { value: "minimal", label: "محدود" },
  { value: "not_important", label: "غير مهم" },
];

// ==================== Question Labels for Docs ====================
const getDocumentQuestion = (questionKey, profile) => {
  switch (questionKey) {
    case "marital_status":
      return `الحالة الاجتماعية: ${getLabelByValue(MARITAL_STATUS, profile?.marital_status) || "غير محدد"}`;
    case "education_level":
      return `المستوى التعليمي: ${getLabelByValue(EDUCATION_LEVELS, profile?.education_level) || "غير محدد"}`;
    case "work_experience":
      return `الخبرات العملية: ${profile?.work_experience || "غير محدد"}`;
    case "has_criminal_record":
      return `السجل الجنائي: ${profile?.has_criminal_record ? "يوجد" : "لا يوجد"}`;
    case "has_debts":
      return `الديون: ${profile?.has_debts ? "يوجد" : "لا يوجد"}`;
    default:
      return null;
  }
};

// ==================== Helpers ====================
const ensureArray = (data) => {
  if (!data) return [];
  if (Array.isArray(data)) return data;
  try {
    const parsed = JSON.parse(data);
    return Array.isArray(parsed) ? parsed : [data];
  } catch {
    if (typeof data === "string" && data.split(",").length > 1)
      return data.split(",").map((s) => s.trim());
    return [data];
  }
};

const formatYesNo = (value) => {
  if (value === 1 || value === true || value === "1") return "نعم";
  if (value === 0 || value === false || value === "0") return "لا";
  return "غير محدد";
};

const getFileName = (url) => url?.split("/").pop() || "ملف";
const getFileIcon = (url) => {
  const ext = url?.split(".").pop()?.toLowerCase();
  if (["jpg", "jpeg", "png", "gif", "webp"].includes(ext)) return "🖼️";
  if (ext === "pdf") return "📄";
  return "📎";
};

const getSectLabel = (religion, sect) => {
  if (!religion || !sect) return sect || "غير محدد";
  const sects = SECTS_BY_RELIGION[religion] || SECTS_BY_RELIGION.other;
  return getLabelByValue(sects, sect);
};

// ==================== UserProfilePage ====================
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
  const printRef = useRef(null);

  const [isPrintModalVisible, setIsPrintModalVisible] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isPaymentModalVisible, setIsPaymentModalVisible] = useState(false);
  const [isStatusModalVisible, setIsStatusModalVisible] = useState(false);

  // ==================== Print Handler (v3+ API) ====================
  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: `استمارة_${id}_ست_الشام`,
    onAfterPrint: () => {
      setIsPrintModalVisible(false);
      message.success("تمت الطباعة بنجاح");
    },
    pageStyle: `
      @page {
        size: A4 portrait;
        margin: 8mm;
      }
      @media print {
        html, body {
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
          color-adjust: exact !important;
        }
        .printable-profile {
          width: 100% !important;
          max-height: none !important;
          overflow: visible !important;
          page-break-inside: avoid;
        }
      }
    `,
  });

  // ==================== PDF Export Handler (Single Page) ====================
  const handleExportPDF = useCallback(async () => {
    if (!printRef.current) {
      message.error("لا يوجد محتوى للتصدير");
      return;
    }

    setIsExporting(true);

    try {
      const element = printRef.current;
      const contentWidth = element.scrollWidth;
      const contentHeight = element.scrollHeight;

      // A4 in pixels at 96 DPI
      const A4_WIDTH_PX = 794;
      const A4_HEIGHT_PX = 1122;
      const MARGIN_PX = 20;

      const availableWidth = A4_WIDTH_PX - MARGIN_PX * 2;
      const availableHeight = A4_HEIGHT_PX - MARGIN_PX * 2;

      // Calculate scale to fit everything in one page
      const scaleX = availableWidth / contentWidth;
      const scaleY = availableHeight / contentHeight;
      const scale = Math.min(scaleX, scaleY, 1); // Never upscale

      // Store original styles
      const originalStyles = {
        transform: element.style.transform,
        transformOrigin: element.style.transformOrigin,
        width: element.style.width,
        height: element.style.height,
        overflow: element.style.overflow,
        position: element.style.position,
      };

      // Apply scale if needed
      if (scale < 1) {
        element.style.transform = `scale(${scale})`;
        element.style.transformOrigin = "top left";
        element.style.width = `${contentWidth}px`;
        element.style.overflow = "visible";
      }

      // Wait for styles to apply
      await new Promise((resolve) => setTimeout(resolve, 300));

      const opt = {
        margin: [5, 5, 5, 5],
        filename: `استمارة_${mainProfile?.id}_ست_الشام.pdf`,
        image: { type: "jpeg", quality: 0.95 },
        html2canvas: {
          scale: 2,
          useCORS: true,
          allowTaint: true,
          letterRendering: true,
          scrollX: 0,
          scrollY: 0,
          width: contentWidth,
          height: contentHeight,
          backgroundColor: "#ffffff",
        },
        jsPDF: {
          unit: "mm",
          format: "a4",
          orientation: "portrait",
          compress: true,
        },
        pagebreak: {
          mode: "avoid-all",
          before: [],
          after: [],
          avoid: ["*"],
        },
      };

      await html2pdf().set(opt).from(element).save();

      // Restore original styles
      Object.keys(originalStyles).forEach((key) => {
        element.style[key] = originalStyles[key] || "";
      });

      message.success("تم تحميل ملف PDF بنجاح");
    } catch (error) {
      console.error("PDF Export Error:", error);
      message.error("حدث خطأ أثناء تصدير الملف");
    } finally {
      setIsExporting(false);
    }
  }, [id]);

  // ==================== Copy Profile ID ====================
  const handleCopyProfileId = useCallback(() => {
    const text = `رقم الاستمارة: #${id}\nللتواصل والاستفسار:\n📧 info@setalsham.com\n📞 +358 46 520 2214\n🌐 www.setalsham.com`;

    navigator.clipboard
      .writeText(text)
      .then(() => {
        setCopied(true);
        message.success("تم نسخ معلومات الاستمارة!");
        setTimeout(() => setCopied(false), 2000);
      })
      .catch(() => {
        message.error("فشل في نسخ النص");
      });
  }, [id]);

  // ==================== Open Print then Export PDF ====================
  const handleOpenAndExportPDF = useCallback(() => {
    setIsPrintModalVisible(true);
    // Wait for modal to render + PrintableProfile to mount
    setTimeout(() => {
      handleExportPDF();
    }, 800);
  }, [handleExportPDF]);

  // ==================== Loading State ====================
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Spin size="large" tip="جاري تحميل بيانات الملف الشخصي..." />
      </div>
    );
  }

  // ==================== Render Info Item ====================
  const renderInfoItem = (label, value, icon, options = null) => {
    let displayValue = value;

    if (options && value !== null && value !== undefined) {
      const arrayValue = ensureArray(value);
      if (
        arrayValue.length > 1 ||
        Array.isArray(value) ||
        (typeof value === "string" &&
          (value.startsWith("[") || value.includes(",")))
      ) {
        displayValue = (
          <div className="flex flex-wrap gap-1 mt-1">
            {arrayValue.map((v) => (
              <Tag key={v} className="m-0 text-[10px] px-2 py-0">
                {getLabelByValue(options, v)}
              </Tag>
            ))}
          </div>
        );
      } else {
        displayValue = getLabelByValue(options, arrayValue[0]);
      }
    }

    return (
      <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
        <div className="mt-1 p-1.5 bg-primary/5 rounded-md text-primary">
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-xs text-gray-400 font-medium">{label}</div>
          <div className="text-sm font-semibold text-gray-800 break-words">
            {displayValue || "غير محدد"}
          </div>
        </div>
      </div>
    );
  };

  // ==================== Render ====================
  return (
    <div className="space-y-6">
      {/* ==================== Header ==================== */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div className="flex items-center gap-4">
          <Button
            type="text"
            icon={<ArrowRight className="w-5 h-5" />}
            onClick={() => navigate(-1)}
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

        <Space wrap>
          <Tooltip title="عرض المدفوعات والمراحل">
            <Button
              type="default"
              icon={<DollarSign className="w-4 h-4" />}
              className="flex items-center gap-2 border-green-400 text-green-600 hover:bg-green-50"
              onClick={() => setIsPaymentModalVisible(true)}
            >
              المدفوعات
            </Button>
          </Tooltip>
          <Tooltip title="تتبع حالة الطلب">
            <Button
              type="default"
              icon={<Activity className="w-4 h-4" />}
              className="flex items-center gap-2 border-blue-400 text-blue-600 hover:bg-blue-50"
              onClick={() => setIsStatusModalVisible(true)}
            >
              تتبع الحالة
            </Button>
          </Tooltip>
          <Tooltip title="طباعة أو تصدير PDF">
            <Button
              type="default"
              icon={<Printer className="w-4 h-4" />}
              className="flex items-center gap-2"
              onClick={() => setIsPrintModalVisible(true)}
            >
              طباعة الاستمارة
            </Button>
          </Tooltip>
          <Tooltip title="نسخ رقم الاستمارة للمشاركة">
            <Button
              type="default"
              icon={
                copied ? (
                  <Check className="w-4 h-4 text-green-500" />
                ) : (
                  <Copy className="w-4 h-4" />
                )
              }
              className="flex items-center gap-2"
              onClick={handleCopyProfileId}
            >
              {copied ? "تم النسخ!" : "نسخ الرقم"}
            </Button>
          </Tooltip>
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

      {/* ==================== Main Grid ==================== */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        {/* ==================== Sidebar ==================== */}
        <div className="lg:col-span-1 flex flex-col gap-6 sticky top-20">
          {/* Profile Card */}
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
              <Tag color="purple" className="rounded-full px-3 py-0.5">
                {getLabelByValue(
                  EDUCATION_LEVELS,
                  mainProfile?.education_level
                )}
              </Tag>
            </div>
            <Divider className="my-4" />
            <div className="space-y-1 text-right">
              {renderInfoItem(
                "رقم الإستماره",
                mainProfile?.id,
                <Info className="w-4 h-4" />
              )}
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
                mainProfile?.nationality,
                <Info className="w-4 h-4" />,
                NATIONALITIES
              )}
              {renderInfoItem(
                "المدينة",
                mainProfile?.city,
                <MapPin className="w-4 h-4" />
              )}
              {renderInfoItem(
                "المنطقة",
                mainProfile?.region,
                <Globe className="w-4 h-4" />
              )}
              {renderInfoItem(
                "المذهب",
                getSectLabel(mainProfile?.religion, mainProfile?.sect),
                <Info className="w-4 h-4" />
              )}
            </div>
          </Card>

          {/* Admin Status */}
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

          {/* Quick Actions */}
          <Card
            title="إجراءات سريعة"
            className="rounded-2xl border border-gray-100 shadow-sm"
          >
            <div className="space-y-2">
              <Button
                type="default"
                icon={<DollarSign className="w-4 h-4" />}
                className="w-full flex items-center justify-center gap-2 border-green-400 text-green-600 hover:bg-green-50"
                onClick={() => setIsPaymentModalVisible(true)}
              >
                المدفوعات والمراحل
              </Button>
              <Button
                type="default"
                icon={<Activity className="w-4 h-4" />}
                className="w-full flex items-center justify-center gap-2 border-blue-400 text-blue-600 hover:bg-blue-50"
                onClick={() => setIsStatusModalVisible(true)}
              >
                تتبع الحالة
              </Button>
              <Button
                type="default"
                icon={<Printer className="w-4 h-4" />}
                className="w-full flex items-center justify-center gap-2"
                onClick={() => setIsPrintModalVisible(true)}
              >
                طباعة الاستمارة
              </Button>
              <Button
                type="default"
                icon={<FileDown className="w-4 h-4" />}
                className="w-full flex items-center justify-center gap-2"
                onClick={handleOpenAndExportPDF}
              >
                تحميل PDF
              </Button>
              <Button
                type="default"
                icon={<Copy className="w-4 h-4" />}
                className="w-full flex items-center justify-center gap-2"
                onClick={handleCopyProfileId}
              >
                نسخ رقم الاستمارة
              </Button>
            </div>
          </Card>
        </div>

        {/* ==================== Content ==================== */}
        <div className="lg:col-span-3">
          <Card className="rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <Tabs
              activeKey={activeTab}
              onChange={setActiveTab}
              className="px-6 pb-6"
              items={[
                // ==================== Tab 1: Personal ====================
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
                      {/* Contact Info */}
                      <div>
                        <h3 className="text-lg font-bold text-primary flex items-center gap-2 mb-4">
                          <Phone className="w-5 h-5" /> معلومات التواصل
                        </h3>
                        <Row gutter={[16, 16]}>
                          <Col xs={24} sm={8} dir="ltr">
                            {renderInfoItem(
                              "رقم هاتف ثانوي",
                              mainProfile?.secondary_phone
                                ? `+${mainProfile.secondary_phone}`
                                : null,
                              <Phone className="w-4 h-4" />
                            )}
                          </Col>
                          <Col xs={24} sm={8}>
                            {renderInfoItem(
                              "تاريخ الوصول لفنلندا",
                              mainProfile?.arrival_date_finland
                                ? dayjs(
                                    mainProfile.arrival_date_finland
                                  ).format("YYYY-MM-DD")
                                : null,
                              <Calendar className="w-4 h-4" />
                            )}
                          </Col>
                          <Col xs={24} sm={8}>
                            {renderInfoItem(
                              "الإقليم",
                              mainProfile?.region,
                              <Globe className="w-4 h-4" />
                            )}
                          </Col>
                        </Row>
                      </div>

                      {/* Physical */}
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
                              mainProfile?.skin_color,
                              <Info className="w-4 h-4" />,
                              SKIN_COLORS
                            )}
                          </Col>
                          <Col xs={24} sm={8}>
                            {renderInfoItem(
                              "لون العيون",
                              mainProfile?.eye_color,
                              <Info className="w-4 h-4" />,
                              EYE_COLORS
                            )}
                          </Col>
                          <Col xs={24} sm={8}>
                            {renderInfoItem(
                              "نوع الشعر",
                              mainProfile?.hair_type,
                              <Info className="w-4 h-4" />,
                              HAIR_TYPES
                            )}
                          </Col>
                          <Col xs={24} sm={8}>
                            {renderInfoItem(
                              "مدخن",
                              formatYesNo(mainProfile?.is_smoker),
                              <Info className="w-4 h-4" />
                            )}
                          </Col>
                          {mainProfile?.gender === "female" && (
                            <Col xs={24} sm={8}>
                              {renderInfoItem(
                                "حالة الحجاب",
                                mainProfile?.hijab_status,
                                <Info className="w-4 h-4" />,
                                HIJAB_STATUS
                              )}
                            </Col>
                          )}
                          <Col xs={24}>
                            {renderInfoItem(
                              "علامة مميزة",
                              mainProfile?.distinguishing_mark,
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
                              "الحالة الاجتماعية",
                              mainProfile?.marital_status,
                              <Info className="w-4 h-4" />,
                              MARITAL_STATUS
                            )}
                          </Col>
                          <Col xs={24} sm={8}>
                            {renderInfoItem(
                              "نوع الإقامة",
                              mainProfile?.residency_type,
                              <Info className="w-4 h-4" />,
                              RESIDENCY_TYPES
                            )}
                          </Col>
                          <Col xs={24} sm={8}>
                            {renderInfoItem(
                              "الديانة",
                              mainProfile?.religion,
                              <Info className="w-4 h-4" />,
                              RELIGIONS
                            )}
                          </Col>
                          <Col xs={24} sm={8}>
                            {renderInfoItem(
                              "المذهب",
                              getSectLabel(
                                mainProfile?.religion,
                                mainProfile?.sect
                              ),
                              <Info className="w-4 h-4" />
                            )}
                          </Col>
                          <Col xs={24} sm={8}>
                            {renderInfoItem(
                              "الجنسية",
                              mainProfile?.nationality,
                              <Info className="w-4 h-4" />,
                              NATIONALITIES
                            )}
                          </Col>
                          <Col xs={24} sm={8}>
                            {renderInfoItem(
                              "بلد الأم",
                              mainProfile?.mother_country,
                              <Info className="w-4 h-4" />,
                              COUNTRIES
                            )}
                          </Col>
                          <Col xs={24} sm={8}>
                            {renderInfoItem(
                              "المدينة",
                              mainProfile?.city,
                              <MapPin className="w-4 h-4" />
                            )}
                          </Col>
                          <Col xs={24} sm={8}>
                            {renderInfoItem(
                              "الالتزام الديني",
                              mainProfile?.religion_commitment,
                              <Info className="w-4 h-4" />,
                              RELIGION_COMMITMENT
                            )}
                          </Col>
                          <Col xs={24} sm={8}>
                            {renderInfoItem(
                              "لديه أولاد",
                              formatYesNo(mainProfile?.has_children),
                              <Info className="w-4 h-4" />
                            )}
                          </Col>
                          {mainProfile?.has_children === 1 && (
                            <>
                              <Col xs={24} sm={8}>
                                {renderInfoItem(
                                  "الأطفال معي",
                                  mainProfile?.children_with_me,
                                  <Info className="w-4 h-4" />
                                )}
                              </Col>
                              <Col xs={24} sm={8}>
                                {renderInfoItem(
                                  "أطفال بعد الزواج",
                                  mainProfile?.children_after_marriage,
                                  <Info className="w-4 h-4" />
                                )}
                              </Col>
                              <Col xs={24}>
                                {renderInfoItem(
                                  "معلومات الأطفال",
                                  mainProfile?.children_info,
                                  <Info className="w-4 h-4" />
                                )}
                              </Col>
                            </>
                          )}
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
                              mainProfile?.education_level,
                              <GraduationCap className="w-4 h-4" />,
                              EDUCATION_LEVELS
                            )}
                          </Col>
                          <Col xs={24} sm={12}>
                            {renderInfoItem(
                              "مصدر الدخل",
                              mainProfile?.income_source,
                              <Briefcase className="w-4 h-4" />,
                              INCOME_SOURCES
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
                          {mainProfile?.gender === "male" && (
                            <Col xs={24} sm={12}>
                              {renderInfoItem(
                                "الاستطاعة المالية (المهر)",
                                mainProfile?.dowry_capability,
                                <Info className="w-4 h-4" />
                              )}
                            </Col>
                          )}
                        </Row>
                      </div>

                      {/* Gallery */}
                      {ensureArray(mainProfile?.user_gallery_photos).length >
                        0 && (
                        <div>
                          <h3 className="text-lg font-bold text-primary flex items-center gap-2 mb-4">
                            <ImageIcon className="w-5 h-5" /> معرض الصور
                          </h3>
                          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                            {ensureArray(mainProfile.user_gallery_photos).map(
                              (photo, i) => (
                                <div
                                  key={i}
                                  className="rounded-xl overflow-hidden border border-gray-100 shadow-sm aspect-square"
                                >
                                  <Image
                                    src={photo}
                                    alt={`صورة ${i + 1}`}
                                    className="w-full h-full object-cover"
                                    width="100%"
                                  />
                                </div>
                              )
                            )}
                          </div>
                        </div>
                      )}

                      {/* About Me */}
                      {mainProfile?.about_me_more && (
                        <Card className="rounded-xl bg-gray-50">
                          <h3 className="text-primary font-bold mb-2">
                            معلومات إضافية مرسلة من العميل
                          </h3>
                          <p className="text-sm text-gray-700 leading-relaxed">
                            {mainProfile.about_me_more}
                          </p>
                        </Card>
                      )}

                      {/* Pledges & Signature */}
                      <div>
                        <h3 className="text-lg font-bold text-primary flex items-center gap-2 mb-4">
                          <FileText className="w-5 h-5" /> التعهدات والتوقيع
                        </h3>
                        <Row gutter={[16, 16]}>
                          <Col xs={24} md={16}>
                            <div className="space-y-3">
                              <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                                <Tag
                                  color={
                                    mainProfile?.info_correctness_pledge
                                      ? "success"
                                      : "error"
                                  }
                                >
                                  {mainProfile?.info_correctness_pledge
                                    ? "مكتمل"
                                    : "غير مكتمل"}
                                </Tag>
                                <span className="text-sm font-medium">
                                  أتعهد بأن جميع المعلومات الشخصية المقدمة صحيحة
                                  وأتحمل المسؤولية
                                </span>
                              </div>
                              <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                                <Tag
                                  color={
                                    mainProfile?.contract_terms_accepted
                                      ? "success"
                                      : "error"
                                  }
                                >
                                  {mainProfile?.contract_terms_accepted
                                    ? "مكتمل"
                                    : "غير مكتمل"}
                                </Tag>
                                <span className="text-sm font-medium">
                                  لقد قرأت بنود العقد وأوافق عليها
                                </span>
                              </div>
                              <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                                <Tag
                                  color={
                                    mainProfile?.gdpr_accepted
                                      ? "success"
                                      : "error"
                                  }
                                >
                                  {mainProfile?.gdpr_accepted
                                    ? "مكتمل"
                                    : "غير مكتمل"}
                                </Tag>
                                <span className="text-sm font-medium">
                                  سياسة الخصوصية وحماية البيانات (GDPR+)
                                </span>
                              </div>
                            </div>
                          </Col>
                          <Col xs={24} md={8}>
                            <Card
                              size="small"
                              title="التوقيع"
                              className="text-center rounded-xl overflow-hidden"
                            >
                              {mainProfile?.signature_path ? (
                                <Image
                                  src={mainProfile.signature_path}
                                  className="max-h-32 object-contain"
                                />
                              ) : (
                                <div className="py-8 text-gray-400">
                                  لا يوجد توقيع
                                </div>
                              )}
                            </Card>
                          </Col>
                        </Row>
                      </div>

                      {/* Documents */}
                      <div>
                        <h3 className="text-lg font-bold text-primary flex items-center gap-2 mb-4">
                          <FileText className="w-5 h-5" /> الوثائق والمستندات
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {DOCUMENT_SECTIONS.map((section) => {
                            const docs = ensureArray(
                              mainProfile?.[section.key]
                            );
                            const question = getDocumentQuestion(
                              section.questionKey,
                              mainProfile
                            );

                            return (
                              <Card
                                key={section.key}
                                size="small"
                                title={
                                  <div className="flex flex-col gap-1">
                                    <span className="flex items-center gap-2">
                                      <FileText className="w-4 h-4" />
                                      {section.label}
                                    </span>
                                    {question && (
                                      <span className="text-xs text-gray-400 font-normal max-w-[90%] bg-gradient-to-b from-[#FAF2EA] to-[#FAF2EA] p-[5px_10px] m-[3px_0] rounded-md border border-[#DCB56D]">
                                        {question}
                                      </span>
                                    )}
                                  </div>
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
                    </div>
                  ),
                },

                // ==================== Tab 2: Partner ====================
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
                          {/* Gender Badge */}
                          <div className="flex items-center gap-2 p-3 bg-blue-50 border border-blue-100 rounded-xl">
                            <Info className="w-4 h-4 text-blue-500" />
                            <span className="text-sm text-blue-700 font-medium">
                              {mainProfile?.gender === "male"
                                ? "🔵 هذا المستخدم ذكر - يبحث عن شريكة أنثى"
                                : "🔴 هذه المستخدمة أنثى - تبحث عن شريك ذكر"}
                            </span>
                          </div>

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
                                  targetProfile?.target_age_range,
                                  <Info className="w-4 h-4" />,
                                  AGE_RANGES
                                )}
                              </Col>
                              <Col xs={24} sm={8}>
                                {renderInfoItem(
                                  "الجنسية المطلوبة",
                                  targetProfile?.target_nationality,
                                  <Info className="w-4 h-4" />,
                                  NATIONALITIES
                                )}
                              </Col>
                              <Col xs={24} sm={8}>
                                {renderInfoItem(
                                  "الحالة الاجتماعية",
                                  targetProfile?.target_marital_status,
                                  <Info className="w-4 h-4" />,
                                  MARITAL_STATUS
                                )}
                              </Col>
                              <Col xs={24} sm={8}>
                                {renderInfoItem(
                                  "الديانة",
                                  targetProfile?.target_religion,
                                  <Info className="w-4 h-4" />,
                                  RELIGIONS
                                )}
                              </Col>
                              <Col xs={24} sm={8}>
                                {renderInfoItem(
                                  "الجنس المطلوب",
                                  targetProfile?.target_gender === "male"
                                    ? "ذكر"
                                    : targetProfile?.target_gender === "female"
                                      ? "أنثى"
                                      : "لا يهم",
                                  <Info className="w-4 h-4" />
                                )}
                              </Col>
                              <Col xs={24} sm={8}>
                                {renderInfoItem(
                                  "المدينة المطلوبة",
                                  targetProfile?.target_city,
                                  <MapPin className="w-4 h-4" />
                                )}
                              </Col>
                              <Col xs={24} sm={8}>
                                {renderInfoItem(
                                  "المذهب المطلوب",
                                  getSectLabel(
                                    targetProfile?.target_religion,
                                    targetProfile?.target_sect
                                  ),
                                  <Info className="w-4 h-4" />
                                )}
                              </Col>
                              {mainProfile?.gender === "male" && (
                                <Col xs={24} sm={8}>
                                  {renderInfoItem(
                                    "حالة الحجاب المطلوبة",
                                    targetProfile?.target_hijab_status,
                                    <Info className="w-4 h-4" />,
                                    HIJAB_STATUS
                                  )}
                                </Col>
                              )}
                            </Row>
                          </div>

                          {/* Requirements */}
                          <div>
                            <h3 className="text-lg font-bold text-primary flex items-center gap-2 mb-4">
                              <Scale className="w-5 h-5" /> المتطلبات والالتزام
                            </h3>
                            <Row gutter={[16, 16]}>
                              <Col xs={24} sm={8}>
                                {renderInfoItem(
                                  "نوع الإقامة المطلوب",
                                  targetProfile?.target_residency_type,
                                  <Info className="w-4 h-4" />,
                                  RESIDENCY_TYPES
                                )}
                              </Col>
                              <Col xs={24} sm={8}>
                                {renderInfoItem(
                                  "الالتزام الديني المطلوب",
                                  targetProfile?.target_religion_commitment,
                                  <Info className="w-4 h-4" />,
                                  RELIGION_COMMITMENT
                                )}
                              </Col>
                              <Col xs={24} sm={8}>
                                {renderInfoItem(
                                  "تقبل وجود أطفال لدى الشريك",
                                  targetProfile?.target_has_children,
                                  <Info className="w-4 h-4" />,
                                  YES_NO_OPTIONS
                                )}
                              </Col>
                              {mainProfile?.gender === "male" && (
                                <Col xs={24} sm={8}>
                                  {renderInfoItem(
                                    "الاستطاعة على المهر",
                                    formatYesNo(
                                      targetProfile?.target_dowry_capability
                                    ),
                                    <Info className="w-4 h-4" />
                                  )}
                                </Col>
                              )}
                              {mainProfile?.gender === "female" && (
                                <Col xs={24} sm={8}>
                                  {renderInfoItem(
                                    "قبول التعدد",
                                    formatYesNo(
                                      targetProfile?.target_accepts_polygamy
                                    ),
                                    <Info className="w-4 h-4" />
                                  )}
                                </Col>
                              )}
                              <Col xs={24} sm={8}>
                                {renderInfoItem(
                                  "أسلوب اللباس المطلوب",
                                  targetProfile?.target_clothing_style,
                                  <Info className="w-4 h-4" />,
                                  CLOTHING_STYLES
                                )}
                              </Col>
                              <Col xs={24} sm={8}>
                                {renderInfoItem(
                                  "حالة العمل المطلوبة",
                                  targetProfile?.target_work_status,
                                  <Briefcase className="w-4 h-4" />,
                                  WORK_STATUS
                                )}
                              </Col>
                              <Col xs={24} sm={8}>
                                {renderInfoItem(
                                  "المستوى التعليمي المطلوب",
                                  targetProfile?.target_education_level,
                                  <GraduationCap className="w-4 h-4" />,
                                  EDUCATION_LEVELS
                                )}
                              </Col>
                              <Col xs={24} sm={8}>
                                {renderInfoItem(
                                  "يقبل مدخن",
                                  formatYesNo(targetProfile?.target_is_smoker),
                                  <Info className="w-4 h-4" />
                                )}
                              </Col>
                              <Col xs={24} sm={8}>
                                {renderInfoItem(
                                  "النشاط الاجتماعي",
                                  targetProfile?.target_social_activity,
                                  <Info className="w-4 h-4" />,
                                  SOCIAL_ACTIVITY
                                )}
                              </Col>
                              <Col xs={24} sm={8}>
                                {renderInfoItem(
                                  "التواجد على السوشيال ميديا",
                                  targetProfile?.target_social_media_presence,
                                  <Info className="w-4 h-4" />,
                                  SOCIAL_MEDIA
                                )}
                              </Col>
                            </Row>
                          </div>

                          {/* Physical Target */}
                          <div>
                            <h3 className="text-lg font-bold text-primary flex items-center gap-2 mb-4">
                              <Scale className="w-5 h-5" /> المواصفات الجسدية
                              المطلوبة
                            </h3>
                            <Row gutter={[16, 16]}>
                              <Col xs={24} sm={8}>
                                {renderInfoItem(
                                  "الطول المطلوب",
                                  targetProfile?.target_height,
                                  <Info className="w-4 h-4" />
                                )}
                              </Col>
                              <Col xs={24} sm={8}>
                                {renderInfoItem(
                                  "الوزن المطلوب",
                                  targetProfile?.target_weight,
                                  <Info className="w-4 h-4" />
                                )}
                              </Col>
                              <Col xs={24} sm={8}>
                                {renderInfoItem(
                                  "لون البشرة المطلوب",
                                  targetProfile?.target_skin_color,
                                  <Info className="w-4 h-4" />,
                                  SKIN_COLORS
                                )}
                              </Col>
                              <Col xs={24} sm={8}>
                                {renderInfoItem(
                                  "لون العيون المطلوب",
                                  targetProfile?.target_eye_color,
                                  <Info className="w-4 h-4" />,
                                  EYE_COLORS
                                )}
                              </Col>
                              <Col xs={24} sm={8}>
                                {renderInfoItem(
                                  "نوع الشعر المطلوب",
                                  targetProfile?.target_hair_type,
                                  <Info className="w-4 h-4" />,
                                  HAIR_TYPES
                                )}
                              </Col>
                            </Row>
                          </div>

                          {/* Habits */}
                          <div>
                            <h3 className="text-lg font-bold text-primary flex items-center gap-2 mb-4">
                              <Info className="w-5 h-5" /> العادات والتفضيلات
                            </h3>
                            <Row gutter={[16, 16]}>
                              <Col xs={24} sm={12}>
                                {renderInfoItem(
                                  "عادات غير مرغوبة",
                                  targetProfile?.target_unwanted_habits,
                                  <Info className="w-4 h-4" />
                                )}
                              </Col>
                              <Col xs={24} sm={12}>
                                {renderInfoItem(
                                  "عادات مرغوبة",
                                  targetProfile?.target_desired_habits,
                                  <Info className="w-4 h-4" />
                                )}
                              </Col>
                            </Row>

                            {/* Household Chores */}
                            {ensureArray(
                              targetProfile?.["target_house-tasks_preference"]
                            ).length > 0 && (
                              <div className="mt-4 p-3 bg-gray-50 rounded-xl border border-gray-100">
                                <div className="text-xs text-gray-400 font-medium mb-2 flex items-center gap-1">
                                  <Home className="w-3 h-3" /> تفضيلات المهام
                                  المنزلية
                                </div>
                                <div className="flex flex-wrap gap-2">
                                  {ensureArray(
                                    targetProfile[
                                      "target_house-tasks_preference"
                                    ]
                                  ).map((item, i) => (
                                    <Tag key={i} className="rounded-full">
                                      {item}
                                    </Tag>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>

                          {/* Special Conditions */}
                          <Card size="small" className="bg-gray-50">
                            <h4 className="font-bold text-primary mb-2">
                              شروط خاصة إضافية
                            </h4>
                            <p className="text-sm">
                              {targetProfile?.target_special_conditions ||
                                "لا توجد شروط خاصة إضافية"}
                            </p>
                          </Card>
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

      {/* ==================== Print Modal ==================== */}
      <Modal
        title={
          <div className="flex items-center gap-3">
            <Printer className="w-5 h-5 text-primary" />
            <span>طباعة أو تصدير الاستمارة</span>
          </div>
        }
        open={isPrintModalVisible}
        onCancel={() => setIsPrintModalVisible(false)}
        width={900}
        centered
        destroyOnClose={false}
        footer={
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="text-sm text-gray-500 text-right flex items-center gap-2">
              <Info className="w-4 h-4" />
              <span>
                البيانات الشخصية (الاسم، الهاتف، الإيميل، العنوان، الصورة) مخفية
                للحفاظ على الخصوصية
              </span>
            </div>
            <Space>
              <Button onClick={() => setIsPrintModalVisible(false)}>
                إلغاء
              </Button>
              <Button
                type="default"
                icon={<FileDown className="w-4 h-4" />}
                onClick={handleExportPDF}
                loading={isExporting}
                className="flex items-center gap-2"
              >
                تحميل PDF
              </Button>
              <Button
                type="primary"
                icon={<Printer className="w-4 h-4" />}
                onClick={handlePrint}
                className="bg-primary flex items-center gap-2"
              >
                طباعة
              </Button>
            </Space>
          </div>
        }
      >
        <div
          className="max-h-[60vh] overflow-y-auto border rounded-lg"
          style={{ background: "#f5f5f5" }}
        >
          <PrintableProfile
            ref={printRef}
            mainProfile={mainProfile}
            targetProfile={targetProfile}
            profileId={mainProfile?.id}
          />
        </div>
      </Modal>

      {isEditModalVisible && (
        <UpdateProfileModal
          visible={isEditModalVisible}
          onCancel={handleCloseEdit}
          onSave={handleUpdateProfile}
          onDeleteFile={handleDeleteFile}
          initialData={activeTab === "main" ? mainProfile : targetProfile}
          type={activeTab}
          loading={isSaving}
        />
      )}

      {isPaymentModalVisible && (
        <PaymentModal
          visible={isPaymentModalVisible}
          onCancel={() => setIsPaymentModalVisible(false)}
          record={mainProfile}
          onSend={(stage) =>
            message.success(
              `تم إرسال المطالبة للمرحلة: ${stage.name} بمبلغ ${stage.price} €`
            )
          }
        />
      )}

      {isStatusModalVisible && (
        <StatusTrackModal
          visible={isStatusModalVisible}
          onCancel={() => setIsStatusModalVisible(false)}
          record={mainProfile}
        />
      )}
    </div>
  );
};

export default UserProfilePage;
