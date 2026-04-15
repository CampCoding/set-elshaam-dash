// src/pages/dashboard/Users/components/PrintableProfile.jsx

import React, { forwardRef } from "react";
import dayjs from "dayjs";
import header from "../../../../assets/image.png"
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

    const getVal = (value, options = null) => {
      if (value === null || value === undefined || value === "") return "—";
      if (options) return getLabelByValue(options, value) || "—";
      return value;
    };

    /* ─── rows: [label, value] ─── */
    const personalRows = [
      ["الجنس", mainProfile?.gender === "male" ? "ذكر" : mainProfile?.gender === "female" ? "أنثى" : "—"],
      ["العمر", mainProfile?.date_of_birth ? dayjs().diff(dayjs(mainProfile.date_of_birth), "year") : "—"],
      ["بلد الأم", getVal(mainProfile?.country, COUNTRIES)],
      ["الجنسية", getVal(mainProfile?.nationality, NATIONALITIES)],
      ["الطول", mainProfile?.height ? `${mainProfile.height} سم` : "—"],
      ["الوزن", mainProfile?.weight ? `${mainProfile.weight} كجم` : "—"],
      ["لون البشرة", getVal(mainProfile?.skin_color, SKIN_COLORS)],
      ["لون العيون", getVal(mainProfile?.eye_color, EYE_COLORS)],
      ["لون الشعر", getVal(mainProfile?.hair_type, HAIR_TYPES)],
      ["المظهر الخارجي", getVal(mainProfile?.appearance)],
      ["نوع الإقامة", getVal(mainProfile?.residency_type, RESIDENCY_TYPES)],
      ["الجنسية (إضافية)", getVal(mainProfile?.second_nationality, NATIONALITIES)],
      ["الحالة الاجتماعية", getVal(mainProfile?.marital_status, MARITAL_STATUS)],
      ["العنوان", mainProfile?.city || "—"],
      [
        "أعزب",
        mainProfile?.marital_status === "single"
          ? "X أعزب"
          : mainProfile?.marital_status === "divorced"
            ? "X مطلق"
            : mainProfile?.marital_status === "widowed"
              ? "X أرمل"
              : "—",
      ],
      ["عدد الأولاد", mainProfile?.children_count ?? "—"],
      ["بدون أولاد", formatYesNo(!mainProfile?.has_children) === "نعم" ? "X بدون أولاد" : "—"],
      ["لديها أولاد", formatYesNo(mainProfile?.has_children)],
      ["الوصاية والإقامة", mainProfile?.custody_info || "—"],
      ["العمل", getVal(mainProfile?.income_source, INCOME_SOURCES)],
      ["التحصيل العلمي", getVal(mainProfile?.education_level, EDUCATION_LEVELS)],
      ["النشاط الاجتماعي", getVal(mainProfile?.social_activity)],
      ["النشاط على السوشيل ميديا", getVal(mainProfile?.social_media_activity)],
      ["الديانة", getVal(mainProfile?.religion, RELIGIONS)],
      ["التحصيل العلمي بلد الأم", mainProfile?.home_country_education || "—"],
      ["التحصيل العلمي في فنلندا", mainProfile?.finland_education || "—"],
      ["الديانة (تفصيل)", getSectLabel(mainProfile?.religion, mainProfile?.sect)],
      ["التدخين", getVal(mainProfile?.is_smoker === 1 ? "يدخن" : mainProfile?.is_smoker === 0 ? "لا يدخن" : null)],
      ["الصفات الأخلاقية المطلوبة", mainProfile?.moral_traits || "—"],
      ["أشياء غير مرغوبة", mainProfile?.unwanted_traits || "—"],
      ["الأعمال المنزلية", mainProfile?.housework || "—"],
      ["القدرة المالية", mainProfile?.financial_capability || "—"],
      ["شروط أخرى", mainProfile?.other_conditions || "—"],
    ];

    const partnerRows = targetProfile
      ? [
        ["العمر", getVal(targetProfile?.target_age_range, AGE_RANGES)],
        ["الجنسية", getVal(targetProfile?.target_nationality, NATIONALITIES)],
        ["اللباس", targetProfile?.target_dress || "—"],
        ["الطول", targetProfile?.target_height ? `${targetProfile.target_height} سم` : "—"],
        ["الوزن", targetProfile?.target_weight ? `${targetProfile.target_weight} كجم` : "—"],
        ["لون البشرة", getVal(targetProfile?.target_skin_color, SKIN_COLORS)],
        ["لون العيون", getVal(targetProfile?.target_eye_color, EYE_COLORS)],
        ["لون الشعر", getVal(targetProfile?.target_hair_type, HAIR_TYPES)],
        ["المظهر الخارجي", targetProfile?.target_appearance || "—"],
        ["نوع الإقامة", getVal(targetProfile?.target_residency_type, RESIDENCY_TYPES)],
        ["الجنسية", getVal(targetProfile?.target_nationality, NATIONALITIES)],
        ["الحالة الاجتماعية", getVal(targetProfile?.target_marital_status, MARITAL_STATUS)],
        ["الديانة", getVal(targetProfile?.target_religion, RELIGIONS)],
        ["الالتزام الديني", getVal(targetProfile?.target_religion_commitment, RELIGION_COMMITMENT)],
        ["تقبل وجود أطفال", getVal(targetProfile?.target_has_children, YES_NO_OPTIONS)],
        ["العمل", targetProfile?.target_work || "—"],
        ["التحصيل العلمي", getVal(targetProfile?.target_education_level, EDUCATION_LEVELS)],
        ["النشاط الاجتماعي", targetProfile?.target_social_activity || "—"],
        ["النشاط على السوشيل ميديا", targetProfile?.target_social_media || "—"],
        ["الأخلاق والعادات", targetProfile?.target_morals || "—"],
        ["شروط أخرى", targetProfile?.target_special_conditions || "—"],
      ]
      : [];

    return (
      <div ref={ref} className="pp-root" dir="rtl">
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;900&display=swap');

          .pp-root {
            font-family: 'Cairo', 'Segoe UI', Tahoma, sans-serif;
            background: #fff;
            color: #1a1a1a;
            width: 100%;
            margin: 0 auto;
            padding: 0;
            box-sizing: border-box;
          }

          /* ── HEADER ── */
          .pp-header {
            background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 40%, #1a1a1a 100%);
            text-align: center;
            position: relative;
            line-height: 0;
          }

          .pp-header img {
            width: 100%;
            display: block;
          }

          /* ── GOLD LINE ── */
          .pp-gold-line {
            height: 4px;
            background: linear-gradient(90deg, #dfb163, #c9973f, #dfb163);
          }

          /* ── TWO-COLUMN BODY ── */
          .pp-columns {
            display: grid;
            grid-template-columns: 1fr 1fr;
            border: 2px solid #333;
            align-items: stretch;
          }

          .pp-col {
            display: flex;
            flex-direction: column;
          }

          .pp-col:first-child {
            border-left: 2px solid #333;
          }

          /* ── COL HEADER ── */
          .pp-col-header {
            background: linear-gradient(135deg, #eacb42 0%, #d4a820 100%);
            padding: 9px 12px;
            text-align: center;
          }

          .pp-col-header-text {
            font-size: 13px;
            font-weight: 800;
            color: #2e2b29;
            margin: 0;
          }

          /* ── TABLE ROWS ── */
          .pp-table {
            width: 100%;
            border-collapse: collapse;
            flex: 1;
          }

          .pp-table tr {
            border-bottom: 1px solid #d4b88a;
          }

          .pp-table tr:last-child {
            border-bottom: none;
          }

          .pp-table tr:nth-child(even) {
            background: #fdf8f0;
          }

          .pp-table tr:nth-child(odd) {
            background: #fff;
          }

          .pp-td-label {
            padding: 5px 10px 5px 4px;
            font-size: 10.5px;
            font-weight: 700;
            color: #1a1a1a;
            white-space: nowrap;
            border-right: 1px solid #d4b88a;
            width: 42%;
            vertical-align: middle;
          }

          .pp-td-label::after {
            content: ' :';
          }

          .pp-td-value {
            padding: 5px 8px 5px 4px;
            font-size: 10.5px;
            color: #333;
            font-weight: 500;
            vertical-align: middle;
          }

          /* ── FOOTER ── */
          .pp-footer {
            background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
            padding: 10px 20px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 10px;
          }

          .pp-footer-text {
            font-size: 10px;
            color: #dfb163;
            text-align: center;
            flex: 1;
          }

          .pp-footer-id {
            font-size: 11px;
            font-weight: 700;
            color: #fff;
            background: rgba(223,177,99,0.25);
            border: 1px solid #dfb163;
            padding: 4px 12px;
            border-radius: 20px;
            white-space: nowrap;
          }

          .pp-footer-date {
            font-size: 9px;
            color: #aaa;
            text-align: left;
            white-space: nowrap;
          }

          .pp-no-target {
            padding: 20px;
            text-align: center;
            color: #999;
            font-size: 12px;
          }

          /* ── PRINT OVERRIDES ── */
          @media print {
            body * { visibility: hidden; }
            .pp-root, .pp-root * { visibility: visible; }
            .pp-root {
              position: absolute;
              left: 0; top: 0;
              width: 210mm;
              margin: 0;
            }
            .no-print { display: none !important; }
            @page { margin: 0; size: A4; }
          }
            * {
  scrollbar-width: thin;
  scrollbar-color: #dfb163 transparent;
}
*::-webkit-scrollbar { width: 4px; }
*::-webkit-scrollbar-track { background: transparent; }
*::-webkit-scrollbar-thumb { background: #dfb163; border-radius: 99px; }
*::-webkit-scrollbar-thumb:hover { background: #c9973f; }
        `}</style>

        {/* ── HEADER ── */}
        <div className="pp-header">
          <img src={header} alt="" />
        </div>

        <div className="pp-gold-line" />

        {/* ── TWO COLUMNS ── */}
        <div className="pp-columns">

          {/* RIGHT — Personal Info */}
          <div className="pp-col">
            <div className="pp-col-header">
              <p className="pp-col-header-text">المعلومات الشخصية لطالب الزواج</p>
            </div>
            <table className="pp-table">
              <tbody>
                {personalRows.map(([label, val], i) => (
                  <tr key={i}>
                    <td className="pp-td-label">{label}</td>
                    <td className="pp-td-value">{val}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* LEFT — Partner Requirements */}
          <div className="pp-col">
            <div className="pp-col-header">
              <p className="pp-col-header-text">المواصفات المطلوبة بشريك/ة الحياة</p>
            </div>
            {targetProfile ? (
              <table className="pp-table">
                <tbody>
                  {partnerRows.map(([label, val], i) => (
                    <tr key={i}>
                      <td className="pp-td-label">{label}</td>
                      <td className="pp-td-value">{val}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="pp-no-target">
                لا توجد مواصفات مطلوبة
              </div>
            )}
          </div>

        </div>


      </div>
    );
  }
);

PrintableProfile.displayName = "PrintableProfile";

export default PrintableProfile;