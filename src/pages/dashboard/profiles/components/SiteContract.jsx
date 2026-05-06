
import React, { useState, useRef, useEffect, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import SignatureCanvas from "react-signature-canvas";
import Swal from "sweetalert2";
import { Printer, ArrowRight } from "lucide-react";

import { profileService } from "../../../../api/services/profile.service";
import { contractService } from "../../../../api/services/contract.service";

export default function Contract() {
  const navigate = useNavigate();
  const { id } = useParams();


  const [user, setUser] = useState(null);
  const [contractData, setContractData] = useState(null);
  const [contractLoading, setContractLoading] = useState(true);
  const [profileLoading, setProfileLoading] = useState(true);
  const [saving, setSaving] = useState(false);


  const [userAlreadySigned, setUserAlreadySigned] = useState(false);


  const [isAdminAgreed, setIsAdminAgreed] = useState(false);
  const [adminAlreadySigned, setAdminAlreadySigned] = useState(false);
  const [isAdminSignatureEmpty, setIsAdminSignatureEmpty] = useState(true);
  const [checkedBoxes, setCheckedBoxes] = useState({});

  const adminSignatureRef = useRef(null);
  const contractContentRef = useRef(null);


  const contractText =
    contractData?.data?.contract_text ||
    contractData?.contract_text ||
    contractData?.data?.text ||
    contractData?.text ||
    "";

  const totalCheckboxes = (contractText.match(/\{checkbox\}/g) || []).length;





  const formatDateString = (dateInput) => {
    if (!dateInput) return null;
    const date = new Date(dateInput);
    if (isNaN(date.getTime())) return null;
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };





  const loadContract = useCallback(async () => {
    try {
      setContractLoading(true);
      const result = await contractService.getContract();
      setContractData(result);
    } catch (err) {
      console.error("Failed to load contract:", err);
      Swal.fire({
        title: "خطأ",
        text: "فشل في تحميل بيانات العقد.",
        icon: "error",
        confirmButtonColor: "#D4AF5B",
      });
    } finally {
      setContractLoading(false);
    }
  }, []);

  const loadUser = useCallback(async () => {
    try {
      setProfileLoading(true);

      if (!id) {
        Swal.fire({
          title: "خطأ",
          text: "معرّف المستخدم غير موجود.",
          icon: "error",
          confirmButtonColor: "#D4AF5B",
        }).then(() => navigate(-1));
        return;
      }

      const result = await profileService.getProfile(id);
      const userData = result?.data || result?.user || result;
      setUser(userData);


      if (userData?.signed === true || userData?.signature_path) {
        setUserAlreadySigned(true);
      }


      if (userData?.admin_signed === true || userData?.admin_signature_path) {
        setAdminAlreadySigned(true);
        setIsAdminAgreed(true);
        setIsAdminSignatureEmpty(false);
      }
    } catch (err) {
      console.error("Failed to fetch user:", err);
      Swal.fire({
        title: "خطأ",
        text: "فشل في تحميل بيانات المستخدم.",
        icon: "error",
        confirmButtonColor: "#D4AF5B",
      }).then(() => navigate(-1));
    } finally {
      setProfileLoading(false);
    }
  }, [id, navigate]);

  useEffect(() => {
    loadContract();
  }, [loadContract]);

  useEffect(() => {
    loadUser();
  }, [loadUser]);





  useEffect(() => {
    if (!totalCheckboxes) {
      setCheckedBoxes({});
      return;
    }


    const allSigned = userAlreadySigned;

    setCheckedBoxes((prev) => {
      const next = {};
      for (let i = 0; i < totalCheckboxes; i++) {
        next[i] = allSigned ? true : prev[i] || false;
      }
      return next;
    });
  }, [totalCheckboxes, userAlreadySigned]);


  useEffect(() => {
    const container = contractContentRef.current;
    if (!container) return;

    const checkboxes = container.querySelectorAll(
      '[data-contract-checkbox="true"]'
    );

    checkboxes.forEach((checkbox) => {
      const index = Number(checkbox.getAttribute("data-checkbox-index"));
      checkbox.checked = !!checkedBoxes[index];


      checkbox.disabled = true;
      checkbox.style.cursor = "default";
    });
  }, [checkedBoxes, contractText]);





  const getProcessedContractHtml = useCallback(() => {
    let html = contractText || "";
    if (!html) return html;

    console.log("CONTRACT RAW HTML:", html.substring(0, 500));
    console.log("EMAIL TO FILL:", user?.email);
    console.log("HAS {email}:", html.includes("{email}"));
    console.log("HAS &#123;email&#125;:", html.includes("&#123;email&#125;"));


    html = html
      .replace(/&#123;/g, "{")
      .replace(/&#125;/g, "}")
      .replace(/&lbrace;/g, "{")
      .replace(/&rbrace;/g, "}");

    const escapeHtml = (str = "") =>
      String(str)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

    const highlight = (val) =>
      `<span style="color:#023048;font-weight:bold;border-bottom:1px solid #D4AF5B;padding:0 4px;background-color:#FDF8EB;border-radius:2px;">${escapeHtml(val)}</span>`;

    const emptyField = (width = "140px") =>
      `<span style="display:inline-block;min-width:${width};border-bottom:1.5px solid #ccc;color:#999;padding:0 4px;">&nbsp;</span>`;


    let checkboxIndex = 0;
    html = html.replace(/\{checkbox\}/g, () => {
      const currentIndex = checkboxIndex++;
      const isChecked = !!checkedBoxes[currentIndex];
      return `
      <label style="display:inline-flex;align-items:center;gap:6px;cursor:default;vertical-align:middle;">
        <input
          type="checkbox"
          data-contract-checkbox="true"
          data-checkbox-index="${currentIndex}"
          ${isChecked ? "checked" : ""}
          disabled
          style="width:18px;height:18px;accent-color:#D4AF5B;cursor:default;vertical-align:middle;"
        />
        <span style="font-size:13px;color:#023048;font-weight:600;">أقر بأنني قرأت وفهمت جميع البنود</span>
      </label>
    `;
    });


    if (user) {
      const todayStr = formatDateString(new Date()) || "____/____/________";
      const nameStr = user?.full_name || user?.name || user?.user_name || "";
      const birthStr =
        formatDateString(user?.date_of_birth || user?.birthdate) || "";
      const emailStr = user?.email || "";
      const nationalityStr = user?.nationality || "";

      html = html.replace(
        /\{date\}/g,
        todayStr ? highlight(todayStr) : emptyField("120px")
      );
      html = html.replace(
        /\{name\}/g,
        nameStr ? highlight(nameStr) : emptyField("200px")
      );
      html = html.replace(
        /\{birthdate\}/g,
        birthStr ? highlight(birthStr) : emptyField("120px")
      );


      html = html.replace(
        /\{email\}/g,
        emailStr ? highlight(emailStr) : emptyField("180px")
      );

      html = html.replace(
        /\{nationality\}/g,
        nationalityStr ? highlight(nationalityStr) : emptyField("140px")
      );
    } else {
      html = html.replace(/\{date\}/g, emptyField("120px"));
      html = html.replace(/\{name\}/g, emptyField("200px"));
      html = html.replace(/\{birthdate\}/g, emptyField("120px"));
      html = html.replace(/\{email\}/g, emptyField("180px"));
      html = html.replace(/\{nationality\}/g, emptyField("140px"));
    }

    return html;
  }, [contractText, checkedBoxes, user]);





  const handlePrintContract = () => {

    let userSignatureUri = null;
    if (user?.signature_path) {
      userSignatureUri = user.signature_path;
    }


    let adminSignatureUri = null;
    if (adminAlreadySigned && user?.admin_signature_path) {
      adminSignatureUri = user.admin_signature_path;
    } else if (!isAdminSignatureEmpty && adminSignatureRef.current) {
      adminSignatureUri = adminSignatureRef.current
        .getCanvas()
        .toDataURL("image/png");
    }

    if (!userSignatureUri && !adminSignatureUri) {
      Swal.fire({
        title: "تنبيه",
        text: "لا يوجد أي توقيع بعد.",
        icon: "warning",
        confirmButtonColor: "#D4AF5B",
      });
      return;
    }

    const contractHtml = getProcessedContractHtml()
      .replace(
        /<input[^>]*data-contract-checkbox="true"[^>]*checked[^>]*>/g,
        `<span style="display:inline-flex;align-items:center;justify-content:center;width:16px;height:16px;border:2px solid #D4AF5B;border-radius:3px;background:#FDF8EB;margin-left:4px;">
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#D4AF5B" stroke-width="3">
            <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/>
          </svg>
        </span>`
      )
      .replace(
        /<input[^>]*data-contract-checkbox="true"[^>]*>/g,
        `<span style="display:inline-flex;align-items:center;justify-content:center;width:16px;height:16px;border:2px solid #ccc;border-radius:3px;background:#fff;margin-left:4px;"></span>`
      );

    const userName = user?.full_name || user?.name || user?.user_name || "---";
    const todayStr = formatDateString(new Date()) || "---";

    const printWindow = window.open("", "_blank", "width=900,height=700");

    if (!printWindow) {
      Swal.fire({
        title: "تعذر فتح نافذة الطباعة",
        text: "تأكد من السماح بفتح النوافذ المنبثقة.",
        icon: "warning",
        confirmButtonColor: "#D4AF5B",
      });
      return;
    }

    printWindow.document.write(`
      <!DOCTYPE html>
      <html dir="rtl" lang="ar">
      <head>
        <meta charset="UTF-8" />
        <title>عقد - ${userName}</title>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;900&display=swap');
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: 'Cairo', sans-serif; background: #f5f5f5; color: #1a1a1a; padding: 30px; direction: rtl; }
          .contract-wrapper { max-width: 800px; margin: 0 auto; background: #fff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 30px rgba(0,0,0,0.1); }
          .contract-header { background: linear-gradient(135deg, #023048 0%, #034a6d 100%); padding: 28px 40px; display: flex; align-items: center; justify-content: space-between; }
          .contract-header-title h1 { font-size: 26px; font-weight: 900; color: #D4AF5B; margin-bottom: 4px; }
          .contract-header-title p { font-size: 12px; color: rgba(255,255,255,0.6); }
          .contract-date-badge { font-size: 12px; font-weight: 600; color: #fff; background: rgba(212,175,91,0.2); border: 1px solid rgba(212,175,91,0.4); padding: 5px 14px; border-radius: 20px; }
          .gold-line { height: 4px; background: linear-gradient(90deg, #D4AF5B, #c9973f, #D4AF5B); }
          .user-info-bar { background: #FDF8EB; border-bottom: 1px solid rgba(212,175,91,0.2); padding: 14px 40px; display: flex; align-items: center; gap: 32px; flex-wrap: wrap; }
          .user-info-item { display: flex; flex-direction: column; gap: 2px; }
          .user-info-label { font-size: 10px; color: #999; font-weight: 600; }
          .user-info-value { font-size: 13px; font-weight: 700; color: #023048; }
          .contract-body { padding: 32px 40px; font-size: 13.5px; line-height: 2; color: #1a1a1a; font-weight: 500; }
          .contract-body p { margin-bottom: 12px; }
          .signatures-wrapper { margin: 32px 40px 0; display: flex; gap: 24px; flex-wrap: wrap; }
          .signature-section { flex: 1; min-width: 280px; padding: 24px; border: 1px solid rgba(212,175,91,0.3); border-radius: 12px; background: #FAFAFA; }
          .signature-section h3 { font-size: 14px; font-weight: 700; color: #023048; margin-bottom: 12px; text-align: center; }
          .signature-img-wrapper { width: 100%; height: 90px; border: 1.5px solid #D4AF5B; border-radius: 8px; background: #fff; display: flex; align-items: center; justify-content: center; overflow: hidden; margin-bottom: 12px; }
          .signature-img-wrapper img { max-height: 80px; max-width: 100%; object-fit: contain; }
          .signature-detail { display: flex; flex-direction: column; gap: 4px; margin-bottom: 8px; }
          .signature-detail-label { font-size: 10px; color: #999; font-weight: 600; }
          .signature-detail-value { font-size: 13px; font-weight: 700; color: #023048; border-bottom: 1px solid #D4AF5B; padding-bottom: 3px; }
          .no-signature { text-align: center; color: #ccc; padding: 30px 0; font-size: 13px; }
          .agreement-stamp { display: flex; align-items: center; justify-content: center; gap: 8px; margin: 20px 40px; padding: 12px 20px; background: #f0fdf4; border: 1.5px solid #10b981; border-radius: 10px; }
          .agreement-stamp-icon { width: 20px; height: 20px; background: #10b981; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: #fff; font-size: 12px; font-weight: 900; }
          .agreement-stamp p { font-size: 13px; font-weight: 700; color: #065f46; }
          .contract-footer { background: #023048; padding: 14px 40px; display: flex; align-items: center; justify-content: space-between; margin-top: 32px; }
          .contract-footer p { font-size: 10px; color: rgba(255,255,255,0.5); }
          .contract-footer span { font-size: 11px; color: #D4AF5B; font-weight: 600; }
          @media print { body { padding: 0; background: #fff; } .contract-wrapper { box-shadow: none; border-radius: 0; } @page { margin: 0; size: A4; } }
        </style>
      </head>
      <body>
        <div class="contract-wrapper">
          <div class="contract-header">
            <div class="contract-header-title">
              <h1>عقد الخدمة</h1>
              <p>مكتب ست الشام للزواج - فنلندا</p>
            </div>
            <div><div class="contract-date-badge">📅 ${todayStr}</div></div>
          </div>
          <div class="gold-line"></div>
          <div class="user-info-bar">
            <div class="user-info-item"><span class="user-info-label">الاسم الكامل</span><span class="user-info-value">${user?.full_name || user?.name || "---"}</span></div>
            <div class="user-info-item"><span class="user-info-label">البريد الإلكتروني</span><span class="user-info-value">${user?.email || "---"}</span></div>
            <div class="user-info-item"><span class="user-info-label">تاريخ الميلاد</span><span class="user-info-value">${formatDateString(user?.date_of_birth || user?.birthdate) || "---"}</span></div>
            <div class="user-info-item"><span class="user-info-label">الجنسية</span><span class="user-info-value">${user?.nationality || "---"}</span></div>
            <div class="user-info-item"><span class="user-info-label">تاريخ التوقيع</span><span class="user-info-value">${todayStr}</span></div>
          </div>
          <div class="contract-body">${contractHtml}</div>
          <div class="agreement-stamp">
            <div class="agreement-stamp-icon">✓</div>
            <p>تمت الموافقة على جميع بنود هذا العقد بتاريخ ${todayStr}</p>
          </div>

          <!-- ════ TWO SIGNATURES ════ -->
          <div class="signatures-wrapper">
            <!-- User Signature -->
            <div class="signature-section">
              <h3>🖊️ توقيع العميل</h3>
              ${userSignatureUri
        ? `<div class="signature-img-wrapper"><img src="${userSignatureUri}" alt="توقيع العميل" /></div>`
        : `<div class="no-signature">لم يتم التوقيع بعد</div>`
      }
              <div class="signature-detail"><span class="signature-detail-label">الاسم</span><span class="signature-detail-value">${user?.full_name || user?.name || "---"}</span></div>
              <div class="signature-detail"><span class="signature-detail-label">البريد</span><span class="signature-detail-value">${user?.email || "---"}</span></div>
            </div>

            <!-- Admin Signature -->
            <div class="signature-section">
              <h3>🏢 توقيع الإدارة</h3>
              ${adminSignatureUri
        ? `<div class="signature-img-wrapper"><img src="${adminSignatureUri}" alt="توقيع الإدارة" /></div>`
        : `<div class="no-signature">لم يتم التوقيع بعد</div>`
      }
              <div class="signature-detail"><span class="signature-detail-label">الجهة</span><span class="signature-detail-value">مكتب ست الشام للزواج</span></div>
              <div class="signature-detail"><span class="signature-detail-label">التاريخ</span><span class="signature-detail-value">${todayStr}</span></div>
            </div>
          </div>

          <div class="contract-footer">
            <p>هذا العقد موقّع إلكترونياً ويُعدّ ملزماً قانونياً</p>
            <span>مكتب ست الشام للزواج - فنلندا</span>
          </div>
        </div>
        <script>window.onload=function(){window.print();window.onafterprint=function(){window.close();};};<\/script>
      </body>
      </html>
    `);

    printWindow.document.close();
  };





  const handleAdminAgreeChange = () => {
    if (adminAlreadySigned) {
      Swal.fire({
        title: "تم التوقيع مسبقاً",
        text: "لقد تمت الموافقة والتوقيع على هذا العقد من قبل الإدارة مسبقاً.",
        icon: "info",
        confirmButtonColor: "#D4AF5B",
      });
      return;
    }

    setIsAdminAgreed((prev) => !prev);
  };





  const handleAdminSign = async () => {
    if (adminAlreadySigned) {
      navigate(-1);
      return;
    }

    if (!isAdminAgreed) {
      Swal.fire({
        title: "تنبيه",
        text: "يرجى الموافقة على العقد أولاً.",
        icon: "warning",
        confirmButtonColor: "#D4AF5B",
      });
      return;
    }

    if (isAdminSignatureEmpty || !adminSignatureRef.current) {
      Swal.fire({
        title: "تنبيه",
        text: "يرجى إضافة توقيع الإدارة.",
        icon: "warning",
        confirmButtonColor: "#D4AF5B",
      });
      return;
    }

    try {
      setSaving(true);

      const signatureDataUri = adminSignatureRef.current
        .getCanvas()
        .toDataURL("image/png");


      await contractService.signContractAsAdmin(id, {
        admin_signature: signatureDataUri,
        admin_agreed: true,
      });

      Swal.fire({
        title: "تم التوقيع بنجاح",
        text: "تم حفظ توقيع الإدارة على العقد.",
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
      }).then(() => {
        navigate(-1);
      });
    } catch (err) {
      console.error("Admin sign error:", err);


      const signatureDataUri = adminSignatureRef.current
        .getCanvas()
        .toDataURL("image/png");

      localStorage.setItem(
        `admin_contract_signature_${id}`,
        JSON.stringify({
          admin_signature: signatureDataUri,
          admin_agreed: true,
          signed_at: new Date().toISOString(),
        })
      );

      Swal.fire({
        title: "تم الحفظ مؤقتاً",
        text: "تم حفظ التوقيع محلياً. سيتم إرساله للسيرفر لاحقاً.",
        icon: "info",
        timer: 2000,
        showConfirmButton: false,
      }).then(() => {
        navigate(-1);
      });
    } finally {
      setSaving(false);
    }
  };

  const handleClearAdminSignature = () => {
    if (adminAlreadySigned) return;
    if (adminSignatureRef.current) {
      adminSignatureRef.current.clear();
      setIsAdminSignatureEmpty(true);
    }
  };





  if (profileLoading || contractLoading) {
    return (
      <div
        className="min-h-screen bg-white flex items-center justify-center"
        dir="rtl"
      >
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#D4AF5B] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-[#023048] font-bold text-lg">
            جاري تحميل بيانات العقد...
          </p>
          <p className="text-gray-500 text-sm mt-2">يرجى الانتظار</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div
        className="min-h-screen bg-white flex items-center justify-center"
        dir="rtl"
      >
        <div className="text-center">
          <p className="text-[#023048] font-bold text-lg mb-4">
            لم يتم العثور على بيانات المستخدم
          </p>
          <button
            onClick={() => navigate(-1)}
            className="bg-[#D4AF5B] hover:bg-[#c49f4b] text-[#023048] font-bold px-8 py-3 rounded-md transition-all"
          >
            رجوع
          </button>
        </div>
      </div>
    );
  }





  return (
    <div
      className="min-h-screen bg-white flex items-center justify-center p-3 md:p-8 font-sans"
      dir="rtl"
    >
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        @media (min-width: 768px) { .custom-scrollbar::-webkit-scrollbar { width: 8px; } }
        .custom-scrollbar::-webkit-scrollbar-track { background: #FDF8EB; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #D4AF5B; border-radius: 10px; }
        @keyframes pulse-highlight {
          0%, 100% { box-shadow: 0 0 0 0 rgba(212, 175, 91, 0); }
          25% { box-shadow: 0 0 0 6px rgba(212, 175, 91, 0.4); }
          50% { box-shadow: 0 0 0 3px rgba(212, 175, 91, 0.2); }
          75% { box-shadow: 0 0 0 6px rgba(212, 175, 91, 0.4); }
        }
      `}</style>

      <div className="bg-white w-full max-w-[1200px] h-[92vh] md:h-[90vh] flex flex-col py-6 px-4 md:py-8 md:px-14 rounded-xl shadow-sm border border-gray-100">
        {/* ── HEADER ── */}
        <div className="flex items-start justify-between mb-6 md:mb-8 shrink-0">
          <div className="flex items-start gap-4">
            <button
              onClick={() => navigate(-1)}
              className="mt-2 p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <ArrowRight className="w-5 h-5 text-[#023048]" />
            </button>

            <div className="text-right">
              <h1 className="text-[#D4AF5B] font-bold mb-1 text-2xl md:text-4xl lg:text-[42px] leading-tight">
                بنود العقد
              </h1>
              <p className="text-[#023048] font-bold text-sm md:text-xl lg:text-[24px] leading-snug">
                عقد المستخدم:{" "}
                <span className="text-[#D4AF5B]">
                  {user?.full_name || user?.name || `#${id}`}
                </span>
              </p>
            </div>
          </div>

          {/* Print Button */}
          <button
            onClick={handlePrintContract}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm transition-all duration-300 border-2 flex-shrink-0 mt-2
              ${user?.signature_path ||
                (!isAdminSignatureEmpty && isAdminAgreed) ||
                adminAlreadySigned
                ? "bg-[#023048] border-[#023048] text-white hover:bg-[#034a6d] hover:shadow-lg"
                : "bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed"
              }`}
          >
            <Printer className="w-4 h-4 md:w-5 md:h-5" />
            <span className="hidden sm:inline">طباعة العقد</span>
          </button>
        </div>

        {/* ── STATUS BADGES ── */}
        <div className="flex flex-wrap gap-3 mb-4 shrink-0">
          <div
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold ${userAlreadySigned
                ? "bg-green-50 border border-green-300 text-green-700"
                : "bg-red-50 border border-red-300 text-red-600"
              }`}
          >
            <span>{userAlreadySigned ? "✅" : "❌"}</span>
            <span>
              توقيع العميل:{" "}
              {userAlreadySigned ? "تم التوقيع" : "لم يتم التوقيع"}
            </span>
          </div>

          <div
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold ${adminAlreadySigned
                ? "bg-green-50 border border-green-300 text-green-700"
                : "bg-amber-50 border border-amber-300 text-amber-700"
              }`}
          >
            <span>{adminAlreadySigned ? "✅" : "🔶"}</span>
            <span>
              توقيع الإدارة:{" "}
              {adminAlreadySigned ? "تم التوقيع" : "في انتظار التوقيع"}
            </span>
          </div>
        </div>

        {/* ── CONTRACT CONTENT ── */}
        <div
          dir="ltr"
          ref={contractContentRef}
          className="flex-1 min-h-0 overflow-y-auto custom-scrollbar pr-3 md:pr-10 w-full"
          dangerouslySetInnerHTML={{ __html: getProcessedContractHtml() }}
        />

        {/* ── BOTTOM SECTION ── */}
        <div className="shrink-0 mt-4 md:mt-6 pt-4 border-t border-gray-100">
          {/* ── SIGNATURES AREA ── */}
          <div className="flex flex-col lg:flex-row gap-6 mb-6">
            {/* ── USER SIGNATURE (View Only) ── */}
            <div className="flex-1 min-w-[240px]">
              <div className="text-center mb-2">
                <span className="text-[#023048] font-bold text-sm">
                  توقيع العميل
                </span>
              </div>

              <div className="border border-gray-200 rounded-lg bg-[#FAFAFA] w-full h-[80px] md:h-[100px] overflow-hidden shadow-inner flex items-center justify-center">
                {user?.signature_path ? (
                  <img
                    src={user.signature_path}
                    alt="توقيع العميل"
                    className="max-h-full max-w-full object-contain p-2"
                  />
                ) : (
                  <span className="text-gray-300 text-sm">
                    لم يتم التوقيع بعد
                  </span>
                )}
              </div>

              <p className="text-center text-xs text-gray-400 mt-1">
                {user?.full_name || user?.name || "---"}
              </p>
            </div>

            {/* ── ADMIN SIGNATURE ── */}
            <div className="flex-1 min-w-[240px]">
              <div className="w-full flex justify-between items-center px-1 mb-2">
                {!adminAlreadySigned && (
                  <button
                    onClick={handleClearAdminSignature}
                    className="text-[11px] md:text-[12px] text-gray-400 hover:text-red-500 underline transition-colors"
                  >
                    إعادة تعيين
                  </button>
                )}
                <span className="text-[#023048] font-bold text-sm mx-auto">
                  توقيع الإدارة
                </span>
              </div>

              <div
                className="border border-gray-200 rounded-lg bg-[#FAFAFA] w-full h-[80px] md:h-[100px] overflow-hidden shadow-inner"
                style={{
                  cursor: adminAlreadySigned ? "default" : "crosshair",
                }}
              >
                {adminAlreadySigned && user?.admin_signature_path ? (
                  <div className="w-full h-full flex items-center justify-center p-2 bg-white">
                    <img
                      src={user.admin_signature_path}
                      alt="توقيع الإدارة"
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>
                ) : (
                  <SignatureCanvas
                    ref={adminSignatureRef}
                    onBegin={() => {
                      if (!adminAlreadySigned) setIsAdminSignatureEmpty(false);
                    }}
                    penColor="#023048"
                    canvasProps={{
                      className: "w-full h-full",
                    }}
                  />
                )}
              </div>

              <p className="text-center text-xs text-gray-400 mt-1">
                مكتب ست الشام للزواج
              </p>
            </div>
          </div>

          {/* ── ADMIN AGREE + BUTTONS ── */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* Admin Agree Checkbox */}
            <div
              className={`flex items-center gap-3 ${adminAlreadySigned ? "cursor-default" : "cursor-pointer"
                }`}
              onClick={handleAdminAgreeChange}
            >
              <div className="relative w-5 h-5 md:w-6 md:h-6 flex items-center justify-center shrink-0">
                <div
                  className={`w-full h-full rounded-full border border-gray-400 flex items-center justify-center transition-all ${isAdminAgreed ? "border-[#D4AF5B]" : ""
                    }`}
                >
                  {isAdminAgreed && (
                    <div className="w-2.5 h-2.5 md:w-3 md:h-3 bg-[#D4AF5B] rounded-full" />
                  )}
                </div>
              </div>

              <span
                className={`text-[#023048] text-[13px] md:text-[15px] font-bold select-none`}
              >
                {adminAlreadySigned
                  ? "تمت موافقة الإدارة على العقد"
                  : "أوافق باسم الإدارة على شروط العقد"}
              </span>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3">
              {/* Print Button (small) */}
              {(user?.signature_path ||
                (!isAdminSignatureEmpty && isAdminAgreed) ||
                adminAlreadySigned) && (
                  <button
                    onClick={handlePrintContract}
                    className="flex items-center gap-1.5 px-4 py-2.5 rounded-md text-sm font-bold border-2 border-[#023048] text-[#023048] hover:bg-[#023048] hover:text-white transition-all"
                  >
                    <Printer className="w-4 h-4" />
                    <span>طباعة</span>
                  </button>
                )}

              {/* Main Button */}
              {/* <button
                onClick={
                  adminAlreadySigned ? () => navigate(-1) : handleAdminSign
                }
                disabled={(!isAdminAgreed && !adminAlreadySigned) || saving}
                className={`transition-all duration-300 font-bold text-sm md:text-base px-6 md:px-8 py-2.5 md:py-3 rounded-md shadow-sm ${
                  isAdminAgreed || adminAlreadySigned
                    ? "bg-[#D4AF5B] hover:bg-[#c49f4b] text-[#023048] cursor-pointer"
                    : "bg-[#e5c98a] text-[#023048] cursor-not-allowed opacity-70"
                }`}
              >
                {saving
                  ? "جاري الحفظ..."
                  : adminAlreadySigned
                    ? "العودة لملف المستخدم"
                    : "تأكيد الموافقة وتوقيع الإدارة"}
              </button> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
