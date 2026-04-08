// src/pages/dashboard/Users/components/PrintableProfile.jsx

import React, { forwardRef } from "react";
import { Tag, Divider, Row, Col } from "antd";
import dayjs from "dayjs";
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
} from "../../../../constants/userOptions";

const PrintableProfile = forwardRef(
  ({ mainProfile, targetProfile, profileId }, ref) => {
    // Helper Functions
    const getSectLabel = (religion, sect) => {
      if (!religion || !sect) return sect || "غير محدد";
      const sects = SECTS_BY_RELIGION[religion] || SECTS_BY_RELIGION.other;
      return getLabelByValue(sects, sect);
    };

    const formatYesNo = (value) => {
      if (value === 1 || value === true || value === "1") return "نعم";
      if (value === 0 || value === false || value === "0") return "لا";
      return "غير محدد";
    };

    const renderField = (label, value, options = null) => {
      let displayValue = value;

      if (options && value !== null && value !== undefined) {
        displayValue = getLabelByValue(options, value);
      }

      return (
        <div className="print-field">
          <span className="print-field-label">{label}:</span>
          <span className="print-field-value">
            {displayValue || "غير محدد"}
          </span>
        </div>
      );
    };

    return (
      <div ref={ref} className="printable-profile" dir="rtl">
        {/* Print Styles */}
        <style>
          {`
            @media print {
              body * {
                visibility: hidden;
              }
              .printable-profile,
              .printable-profile * {
                visibility: visible;
              }
              .printable-profile {
                position: absolute;
                left: 0;
                top: 0;
                width: 100%;
              }
              .no-print {
                display: none !important;
              }
            }

            .printable-profile {
              font-family: 'Cairo', 'Segoe UI', Tahoma, sans-serif;
              padding: 40px;
              background: white;
              color: #1a202c;
              max-width: 800px;
              margin: 0 auto;
            }

            .print-header {
              text-align: center;
              margin-bottom: 30px;
              padding-bottom: 20px;
              border-bottom: 3px solid #023048;
            }

            .print-logo {
              width: 120px;
              height: auto;
              margin-bottom: 15px;
            }

            .print-title {
              font-size: 28px;
              font-weight: bold;
              color: #023048;
              margin: 0 0 10px 0;
            }

            .print-subtitle {
              font-size: 16px;
              color: #666;
              margin: 0;
            }

            .profile-id-badge {
              display: inline-block;
              background: linear-gradient(135deg, #023048 0%, #034a6e 100%);
              color: white;
              padding: 12px 30px;
              border-radius: 50px;
              font-size: 20px;
              font-weight: bold;
              margin-top: 20px;
              box-shadow: 0 4px 15px rgba(2, 48, 72, 0.3);
            }

            .print-section {
              margin-bottom: 25px;
              page-break-inside: avoid;
            }

            .print-section-title {
              font-size: 18px;
              font-weight: bold;
              color: #023048;
              padding: 10px 15px;
              background: #f0f7ff;
              border-right: 4px solid #dfb163;
              margin-bottom: 15px;
              border-radius: 0 8px 8px 0;
            }

            .print-grid {
              display: grid;
              grid-template-columns: repeat(3, 1fr);
              gap: 12px;
            }

            .print-grid-2 {
              grid-template-columns: repeat(2, 1fr);
            }

            .print-field {
              padding: 10px;
              background: #fafafa;
              border-radius: 6px;
              border: 1px solid #eee;
            }

            .print-field-label {
              display: block;
              font-size: 11px;
              color: #888;
              margin-bottom: 4px;
            }

            .print-field-value {
              display: block;
              font-size: 14px;
              font-weight: 600;
              color: #1a202c;
            }

            .print-field-full {
              grid-column: span 3;
            }

            .print-footer {
              margin-top: 40px;
              padding-top: 20px;
              border-top: 2px dashed #ddd;
              text-align: center;
            }

            .print-footer-text {
              font-size: 12px;
              color: #888;
            }

            .print-date {
              font-size: 11px;
              color: #666;
              margin-top: 10px;
            }

            .privacy-notice {
              background: #fff8e6;
              border: 1px solid #dfb163;
              border-radius: 8px;
              padding: 15px;
              margin-bottom: 25px;
              text-align: center;
            }

            .privacy-notice-text {
              font-size: 12px;
              color: #856404;
              margin: 0;
            }

            .qr-placeholder {
              width: 100px;
              height: 100px;
              border: 2px dashed #ddd;
              display: flex;
              align-items: center;
              justify-content: center;
              margin: 20px auto;
              border-radius: 8px;
              font-size: 11px;
              color: #999;
            }

            .partner-section {
              background: #f8f9fa;
              padding: 20px;
              border-radius: 12px;
              margin-top: 30px;
            }

            .partner-section .print-section-title {
              background: #e8f4f8;
              border-right-color: #17a2b8;
            }

            @media print {
              .printable-profile {
                padding: 20px;
              }
              .print-section {
                page-break-inside: avoid;
              }
            }
          `}
        </style>

        {/* Header */}
        <div className="print-header">
          <img
            src="https://res.cloudinary.com/dp7jfs375/image/upload/v1772974555/animated-logo_lfa7sj.svg"
            alt="ست الشام"
            className="print-logo"
          />
          <h1 className="print-title">استمارة البحث عن شريك</h1>
          <p className="print-subtitle">Set Al Sham - Marriage Matchmaking</p>
          <div className="profile-id-badge">
            رقم الاستمارة: #{profileId || mainProfile?.id || "000000"}
          </div>
        </div>

        {/* Basic Info Section */}
        <div className="print-section">
          <h2 className="print-section-title"> المعلومات الأساسية</h2>
          <div className="print-grid">
            {renderField(
              "الجنس",
              mainProfile?.gender === "male" ? "ذكر" : "أنثى"
            )}
            {renderField(
              "تاريخ الميلاد",
              mainProfile?.date_of_birth
                ? dayjs(mainProfile.date_of_birth).format("YYYY")
                : null
            )}
            {renderField("الجنسية", mainProfile?.nationality, NATIONALITIES)}
            {renderField(
              "الحالة الاجتماعية",
              mainProfile?.marital_status,
              MARITAL_STATUS
            )}
            {renderField("الديانة", mainProfile?.religion, RELIGIONS)}
            {renderField(
              "المذهب",
              getSectLabel(mainProfile?.religion, mainProfile?.sect)
            )}
            {renderField("البلد", mainProfile?.country, COUNTRIES)}
            {renderField("المدينة", mainProfile?.city)}
            {renderField(
              "نوع الإقامة",
              mainProfile?.residency_type,
              RESIDENCY_TYPES
            )}
          </div>
        </div>

        {/* Physical Info Section */}
        <div className="print-section">
          <h2 className="print-section-title"> المواصفات الجسدية</h2>
          <div className="print-grid">
            {renderField(
              "الطول",
              mainProfile?.height ? `${mainProfile.height} سم` : null
            )}
            {renderField(
              "الوزن",
              mainProfile?.weight ? `${mainProfile.weight} كجم` : null
            )}
            {renderField("لون البشرة", mainProfile?.skin_color, SKIN_COLORS)}
            {renderField("لون العيون", mainProfile?.eye_color, EYE_COLORS)}
            {renderField("نوع الشعر", mainProfile?.hair_type, HAIR_TYPES)}
            {renderField("التدخين", formatYesNo(mainProfile?.is_smoker))}
            {mainProfile?.gender === "female" &&
              renderField(
                "حالة الحجاب",
                mainProfile?.hijab_status,
                HIJAB_STATUS
              )}
          </div>
        </div>

        {/* Education & Work Section */}
        <div className="print-section">
          <h2 className="print-section-title"> التعليم والعمل</h2>
          <div className="print-grid print-grid-2">
            {renderField(
              "المستوى التعليمي",
              mainProfile?.education_level,
              EDUCATION_LEVELS
            )}
            {renderField(
              "مصدر الدخل",
              mainProfile?.income_source,
              INCOME_SOURCES
            )}
            <div className="print-field print-field-full">
              <span className="print-field-label">الخبرات العملية:</span>
              <span className="print-field-value">
                {mainProfile?.work_experience || "غير محدد"}
              </span>
            </div>
          </div>
        </div>

        {/* Social & Religious Section */}
        <div className="print-section">
          <h2 className="print-section-title"> الالتزام الديني والاجتماعي</h2>
          <div className="print-grid">
            {renderField(
              "الالتزام الديني",
              mainProfile?.religion_commitment,
              RELIGION_COMMITMENT
            )}
            {renderField("لديه أطفال", formatYesNo(mainProfile?.has_children))}
            {renderField("عدد الأطفال معي", mainProfile?.children_with_me)}
            {renderField(
              "الرغبة بأطفال بعد الزواج",
              mainProfile?.children_after_marriage
            )}
          </div>
        </div>

        {/* Financial Section */}
        <div className="print-section">
          <h2 className="print-section-title"> الوضع المالي</h2>
          <div className="print-grid">
            {renderField(
              "سجل جنائي",
              formatYesNo(mainProfile?.has_criminal_record)
            )}
            {renderField("ديون", formatYesNo(mainProfile?.has_debts))}
            {renderField(
              "قروض سابقة",
              formatYesNo(mainProfile?.has_previous_loans)
            )}
            {renderField(
              "الاستطاعة المالية (المهر)",
              mainProfile?.dowry_capability
            )}
          </div>
        </div>

        {/* Target Partner Specs */}
        {targetProfile && (
          <div className="partner-section">
            <div className="print-section">
              <h2 className="print-section-title"> مواصفات الشريك المطلوب</h2>
              <div className="print-grid">
                {renderField(
                  "الفئة العمرية",
                  targetProfile?.target_age_range,
                  AGE_RANGES
                )}
                {renderField(
                  "الجنسية",
                  targetProfile?.target_nationality,
                  NATIONALITIES
                )}
                {renderField(
                  "الحالة الاجتماعية",
                  targetProfile?.target_marital_status,
                  MARITAL_STATUS
                )}
                {renderField(
                  "الديانة",
                  targetProfile?.target_religion,
                  RELIGIONS
                )}
                {renderField(
                  "المذهب",
                  getSectLabel(
                    targetProfile?.target_religion,
                    targetProfile?.target_sect
                  )
                )}
                {renderField(
                  "نوع الإقامة",
                  targetProfile?.target_residency_type,
                  RESIDENCY_TYPES
                )}
                {renderField(
                  "الالتزام الديني",
                  targetProfile?.target_religion_commitment,
                  RELIGION_COMMITMENT
                )}
                {renderField(
                  "تقبل وجود أطفال",
                  targetProfile?.target_has_children,
                  YES_NO_OPTIONS
                )}
                {renderField("المدينة", targetProfile?.target_city)}
              </div>

              {/* Physical Requirements */}
              <h3
                style={{
                  fontSize: "14px",
                  fontWeight: "bold",
                  color: "#023048",
                  marginTop: "20px",
                  marginBottom: "10px",
                }}
              >
                المواصفات الجسدية المطلوبة:
              </h3>
              <div className="print-grid">
                {renderField("الطول", targetProfile?.target_height)}
                {renderField("الوزن", targetProfile?.target_weight)}
                {renderField(
                  "لون البشرة",
                  targetProfile?.target_skin_color,
                  SKIN_COLORS
                )}
              </div>

              {/* Special Conditions */}
              {targetProfile?.target_special_conditions && (
                <div
                  className="print-field"
                  style={{ marginTop: "15px", gridColumn: "span 3" }}
                >
                  <span className="print-field-label">شروط خاصة إضافية:</span>
                  <span className="print-field-value">
                    {targetProfile.target_special_conditions}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="print-footer">
          <div className="qr-placeholder">QR Code</div>
          <p className="print-footer-text">
            للتواصل والاستفسار: info@setalsham.com | +358 46 520 2214
          </p>
          <p className="print-footer-text">www.setalsham.com</p>
          <p className="print-date">
            تاريخ الطباعة: {dayjs().format("YYYY-MM-DD HH:mm")}
          </p>
        </div>
      </div>
    );
  }
);

PrintableProfile.displayName = "PrintableProfile";

export default PrintableProfile;
