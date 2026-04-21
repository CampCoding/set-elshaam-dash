import React, { useState, useRef, useEffect, useMemo } from "react";
import {
  Button,
  Card,
  Tag,
  Tooltip,
  Space,
  Divider,
  message,
  Tabs,
} from "antd";
import {
  Save,
  FileText,
  Calendar,
  User,
  CakeSlice,
  Copy,
  Check,
  Info,
  Mail,
  Globe,
  CheckSquare,
  Languages,
} from "lucide-react";
import JoditEditor from "jodit-react";
import { contractService } from "../../../api/services/contract.service";

const VARIABLES = [
  {
    key: "{date}",
    label: "تاريخ السريان",
    labelEn: "Effective Date",
    icon: <Calendar className="w-3.5 h-3.5" />,
    color: "#3b82f6",
    description: "تاريخ اليوم عند موافقة العميل",
    descriptionEn: "Today's date when the client agrees",
  },
  {
    key: "{name}",
    label: "اسم العميل",
    labelEn: "Client Name",
    icon: <User className="w-3.5 h-3.5" />,
    color: "#22c55e",
    description: "الاسم الكامل للعميل من بيانات الحساب",
    descriptionEn: "Client's full name from account data",
  },
  {
    key: "{birthdate}",
    label: "تاريخ الميلاد",
    labelEn: "Birthdate",
    icon: <CakeSlice className="w-3.5 h-3.5" />,
    color: "#f97316",
    description: "تاريخ ميلاد العميل من بيانات الحساب",
    descriptionEn: "Client's birthdate from account data",
  },
  {
    key: "{email}",
    label: "البريد الإلكتروني",
    labelEn: "Email",
    icon: <Mail className="w-3.5 h-3.5" />,
    color: "#8b5cf6",
    description: "البريد الإلكتروني للعميل من بيانات الحساب",
    descriptionEn: "Client's email from account data",
  },
  {
    key: "{nationality}",
    label: "الجنسية",
    labelEn: "Nationality",
    icon: <Globe className="w-3.5 h-3.5" />,
    color: "#ec4899",
    description: "جنسية العميل من بيانات الحساب",
    descriptionEn: "Client's nationality from account data",
  },
  {
    key: "{checkbox}",
    label: "خانة الموافقة",
    labelEn: "Consent Checkbox",
    icon: <CheckSquare className="w-3.5 h-3.5" />,
    color: "#14b8a6",
    description: "خانة اختيار لموافقة العميل على الشروط",
    descriptionEn: "A checkbox for the client to agree to the terms",
  },
];

const VariablesToolbar = ({
  isEnglish,
  contentRef,
  content,
  copiedVar,
  onCopy,
}) => {
  const countVariableUsage = (variableKey) => {
    const text = contentRef.current || content;
    const regex = new RegExp(variableKey.replace(/[{}]/g, "\\$&"), "g");
    return (text.match(regex) || []).length;
  };

  return (
    <Card className="rounded-2xl shadow-sm border border-gray-100">
      <div className="flex items-center gap-2 mb-3">
        <Info className="w-4 h-4 text-primary" />
        <span className="font-semibold text-gray-700 text-sm">
          {isEnglish ? "Available Variables" : "المتغيرات المتاحة"}
        </span>
        <span className="text-xs text-gray-400 mr-2">
          {isEnglish
            ? '(Click "Copy" to copy the variable then paste it in the editor)'
            : '(اضغط "نسخ" لنسخ المتغير ثم الصقه في المكان المطلوب داخل المحرر)'}
        </span>
      </div>

      <div className="flex flex-wrap gap-3">
        {VARIABLES.map((variable) => {
          const usageCount = countVariableUsage(variable.key);
          const isCopied = copiedVar === variable.key;

          return (
            <div
              key={variable.key}
              className="flex items-center gap-2 border rounded-xl px-3 py-2.5 bg-gray-50/50 hover:bg-white transition-all"
              style={{ borderColor: `${variable.color}40` }}
            >
              <div
                className="p-1.5 rounded-lg shrink-0"
                style={{
                  background: `${variable.color}15`,
                  color: variable.color,
                }}
              >
                {variable.icon}
              </div>

              <div className="flex flex-col min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-gray-800">
                    {isEnglish ? variable.labelEn : variable.label}
                  </span>
                  {usageCount > 0 && (
                    <Tag
                      color="blue"
                      className="rounded-full text-xs m-0 px-1.5"
                    >
                      ×{usageCount}
                    </Tag>
                  )}
                </div>
                <code
                  className="text-xs font-mono mt-0.5"
                  style={{ color: variable.color }}
                >
                  {variable.key}
                </code>
              </div>

              <Divider type="vertical" className="h-8 mx-1" />

              <Space size={4}>
                <Tooltip
                  title={
                    isCopied
                      ? isEnglish
                        ? "Copied!"
                        : "تم النسخ!"
                      : isEnglish
                        ? "Copy Variable"
                        : "نسخ المتغير"
                  }
                >
                  <button
                    type="button"
                    onMouseDown={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                    }}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      onCopy(variable.key);
                    }}
                    className="flex items-center justify-center w-7 h-7 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 cursor-pointer transition-colors"
                  >
                    {isCopied ? (
                      <Check className="w-3 h-3 text-green-500" />
                    ) : (
                      <Copy className="w-3 h-3 text-gray-500" />
                    )}
                  </button>
                </Tooltip>
              </Space>
            </div>
          );
        })}
      </div>

      <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-lg">
        <p className="text-xs text-amber-700 flex items-start gap-2">
          <span className="text-base mt-[-2px]">⚠️</span>
          <span>
            {isEnglish ? (
              <>
                <strong>Important:</strong> Variables{" "}
                {VARIABLES.map((v, i) => (
                  <span key={v.key}>
                    <code className="bg-amber-100 px-1 rounded">{v.key}</code>
                    {i < VARIABLES.length - 1 ? ", " : ""}
                  </span>
                ))}{" "}
                will be automatically replaced with client data when the
                contract is displayed. Do not change the text inside the
                brackets.
              </>
            ) : (
              <>
                <strong>مهم:</strong> المتغيرات{" "}
                {VARIABLES.map((v, i) => (
                  <span key={v.key}>
                    <code className="bg-amber-100 px-1 rounded">{v.key}</code>
                    {i < VARIABLES.length - 1 ? " و" : ""}
                  </span>
                ))}{" "}
                سيتم استبدالها تلقائياً ببيانات العميل عند عرض العقد. لا تغير
                النص داخل الأقواس.
              </>
            )}
          </span>
        </p>
      </div>
    </Card>
  );
};

// ─── Editor Section ────────────────────────────────────────────────────────
const EditorSection = ({
  isEnglish,
  editorRef,
  content,
  onContentChange,
  onBlur,
}) => {
  const config = useMemo(
    () => ({
      readonly: false,
      height: 500,
      language: isEnglish ? "en" : "ar",
      direction: isEnglish ? "ltr" : "rtl",
      toolbarButtonSize: "middle",
      askBeforePasteHTML: false,
      askBeforePasteFromWord: false,
      defaultActionOnPaste: "insert_only_text",
      buttons: [
        "bold",
        "italic",
        "underline",
        "strikethrough",
        "|",
        "ul",
        "ol",
        "|",
        "font",
        "fontsize",
        "brush",
        "paragraph",
        "|",
        "image",
        "table",
        "link",
        "|",
        "align",
        "|",
        "undo",
        "redo",
        "|",
        "hr",
        "eraser",
        "copyformat",
        "|",
        "fullsize",
        "source",
      ],
      uploader: { insertImageAsBase64URI: true },
      style: {
        fontFamily: isEnglish ? "Inter, sans-serif" : "Almarai, sans-serif",
        color: "rgb(2, 48, 72)",
        fontSize: "15px",
        direction: isEnglish ? "ltr" : "rtl",
        textAlign: isEnglish ? "left" : "right",
      },
      saveModeInCookie: false,
      useSearch: false,
    }),
    [isEnglish]
  );

  return (
    <Card className="rounded-2xl shadow-sm border border-gray-100">
      <JoditEditor
        ref={editorRef}
        value={content}
        config={config}
        onChange={onContentChange}
        onBlur={onBlur}
      />
    </Card>
  );
};

// ─── Main Component ────────────────────────────────────────────────────────
const Contract = () => {
  // ── Arabic refs & state ──
  const editorAr = useRef(null);
  const contentArRef = useRef("");
  const [contentAr, setContentAr] = useState("");

  // ── English refs & state ──
  const editorEn = useRef(null);
  const contentEnRef = useRef("");
  const [contentEn, setContentEn] = useState("");

  // ── Shared state ──
  const [loading, setLoading] = useState(false);
  const [copiedVar, setCopiedVar] = useState(null);
  const [activeTab, setActiveTab] = useState("ar");

  const isEnglish = activeTab === "en";

  // ── Fetch contracts ──
  const fetchContracts = async () => {
    try {
      // Fetch Arabic contract
      const dataAr = await contractService.getContract("ar");
      const textAr = dataAr?.data?.contract_text || "";
      setContentAr(textAr);
      contentArRef.current = textAr;

      // const dataEn = await contractService.getContract("en");
      const textEn = dataAr?.data?.contract_text_en || "";
      setContentEn(textEn);
      contentEnRef.current = textEn;
    } catch (error) {
      console.error("Error fetching contracts:", error);
      message.error(
        isEnglish ? "Failed to load contracts" : "فشل في تحميل العقود"
      );
    }
  };

  useEffect(() => {
    fetchContracts();
  }, []);

  // ── Copy variable ──
  const copyVariable = (variableKey) => {
    const scrollY = window.scrollY;
    const scrollX = window.scrollX;

    const textArea = document.createElement("textarea");
    textArea.value = variableKey;
    textArea.style.position = "fixed";
    textArea.style.top = `${scrollY}px`;
    textArea.style.left = "0";
    textArea.style.width = "1px";
    textArea.style.height = "1px";
    textArea.style.opacity = "0";
    textArea.style.pointerEvents = "none";

    document.body.appendChild(textArea);
    textArea.select();

    try {
      document.execCommand("copy");
    } catch {
      navigator.clipboard.writeText(variableKey);
    }

    document.body.removeChild(textArea);
    window.scrollTo(scrollX, scrollY);

    setCopiedVar(variableKey);
    setTimeout(() => setCopiedVar(null), 2000);

    requestAnimationFrame(() => {
      window.scrollTo(scrollX, scrollY);
    });
  };

  // ── Save handler ──
  const handleSave = async () => {
    setLoading(true);
    try {
      if (activeTab === "ar") {
        const textToSave = contentArRef.current || contentAr;
        await contractService.updateContract({
          contract_text: textToSave,
          lang: "ar",
        });
        message.success("تم حفظ العقد العربي بنجاح ✓");
      } else {
        const textToSave = contentEnRef.current || contentEn;
        await contractService.updateContract({
          contract_text_en: textToSave,
          lang: "en",
        });
        message.success("English contract saved successfully ✓");
      }
    } catch (error) {
      console.error("Save Error:", error);
      message.error(isEnglish ? "Failed to save contract" : "فشل في حفظ العقد");
    } finally {
      setLoading(false);
    }
  };

  // ── Save both ──
  const handleSaveBoth = async () => {
    setLoading(true);
    try {
      await Promise.all([
        contractService.updateContract({
          contract_text: contentArRef.current || contentAr,
          lang: "ar",
        }),
        contractService.updateContract({
          contract_text: contentEnRef.current || contentEn,
          lang: "en",
        }),
      ]);
      message.success("تم حفظ كلا العقدين بنجاح ✓");
    } catch (error) {
      console.error("Save Both Error:", error);
      message.error("فشل في حفظ العقود");
    } finally {
      setLoading(false);
    }
  };

  // ── Tab items ──
  const tabItems = [
    {
      key: "ar",
      label: (
        <span className="flex items-center gap-2 px-1 font-semibold">
          <span className="text-base">🇸🇦</span>
          <span>العربية</span>
        </span>
      ),
      children: (
        <div className="space-y-4 pt-4">
          <VariablesToolbar
            isEnglish={false}
            contentRef={contentArRef}
            content={contentAr}
            copiedVar={copiedVar}
            onCopy={copyVariable}
          />
          <EditorSection
            isEnglish={false}
            editorRef={editorAr}
            content={contentAr}
            onContentChange={(val) => {
              contentArRef.current = val;
            }}
            onBlur={(val) => {
              contentArRef.current = val;
              setContentAr(val);
            }}
          />
        </div>
      ),
    },
    {
      key: "en",
      label: (
        <span className="flex items-center gap-2 px-1 font-semibold">
          <span className="text-base">🇬🇧</span>
          <span>English</span>
        </span>
      ),
      children: (
        <div className="space-y-4 pt-4" dir="ltr">
          <VariablesToolbar
            isEnglish={true}
            contentRef={contentEnRef}
            content={contentEn}
            copiedVar={copiedVar}
            onCopy={copyVariable}
          />
          <EditorSection
            isEnglish={true}
            editorRef={editorEn}
            content={contentEn}
            onContentChange={(val) => {
              contentEnRef.current = val;
            }}
            onBlur={(val) => {
              contentEnRef.current = val;
              setContentEn(val);
            }}
          />
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* ── Header ── */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-xl">
            <FileText className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-primary">
              {isEnglish ? "Terms & Conditions" : "الشروط والأحكام"}
            </h1>
            <p className="text-xs text-gray-400 mt-0.5 flex items-center gap-1">
              <Languages className="w-3 h-3" />
              {isEnglish
                ? "Manage Arabic & English versions of the contract"
                : "إدارة النسخة العربية والإنجليزية من العقد"}
            </p>
          </div>
        </div>

        {/* ── Action Buttons ── */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Save current tab */}
          <Button
            type="primary"
            onClick={handleSave}
            loading={loading}
            icon={<Save className="w-4 h-4" />}
            className="flex items-center gap-2 bg-primary"
            size="large"
          >
            {isEnglish ? "Save English" : "حفظ العربية"}
          </Button>

          {/* Save both tabs */}
          <Tooltip
            title={
              isEnglish
                ? "Save both Arabic & English versions"
                : "حفظ كلا النسختين العربية والإنجليزية"
            }
          >
            <Button
              onClick={handleSaveBoth}
              loading={loading}
              icon={<Save className="w-4 h-4" />}
              className="flex items-center gap-2 border-primary text-primary"
              size="large"
            >
              {isEnglish ? "Save Both" : "حفظ الكل"}
            </Button>
          </Tooltip>
        </div>
      </div>

      {/* ── Status Bar ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Arabic status */}
        <div
          className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${activeTab === "ar" ? "bg-primary/5 border-primary/20" : "bg-gray-50 border-gray-100"}`}
        >
          <span className="text-xl">🇸🇦</span>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-gray-700">النسخة العربية</p>
            <p className="text-xs text-gray-400">
              {contentArRef.current?.length || contentAr.length || 0} حرف
            </p>
          </div>
          <div
            className={`w-2 h-2 rounded-full flex-shrink-0 ${contentAr ? "bg-green-400" : "bg-gray-300"}`}
          />
        </div>

        {/* English status */}
        <div
          className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${activeTab === "en" ? "bg-primary/5 border-primary/20" : "bg-gray-50 border-gray-100"}`}
        >
          <span className="text-xl">🇬🇧</span>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-gray-700">English Version</p>
            <p className="text-xs text-gray-400">
              {contentEnRef.current?.length || contentEn.length || 0} characters
            </p>
          </div>
          <div
            className={`w-2 h-2 rounded-full flex-shrink-0 ${contentEn ? "bg-green-400" : "bg-gray-300"}`}
          />
        </div>
      </div>

      {/* ── Tabs ── */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          items={tabItems}
          size="large"
          className="contract-tabs"
          tabBarStyle={{
            padding: "0 24px",
            margin: 0,
            borderBottom: "1px solid #f0f0f0",
          }}
          tabBarExtraContent={
            <div className="flex items-center gap-2 py-3">
              <div
                className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1 rounded-full transition-all ${
                  activeTab === "ar"
                    ? "bg-primary text-white"
                    : "bg-gray-100 text-gray-500"
                }`}
              >
                <span>AR</span>
              </div>
              <div
                className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1 rounded-full transition-all ${
                  activeTab === "en"
                    ? "bg-primary text-white"
                    : "bg-gray-100 text-gray-500"
                }`}
              >
                <span>EN</span>
              </div>
            </div>
          }
        ></Tabs>

        <style jsx global>{`
          .contract-tabs .ant-tabs-tab {
            font-size: 15px !important;
            padding: 16px 8px !important;
          }
          .contract-tabs .ant-tabs-tab-active .ant-tabs-tab-btn {
            color: var(--primary) !important;
          }
          .contract-tabs .ant-tabs-ink-bar {
            background: var(--primary) !important;
          }
          .contract-tabs .ant-tabs-content-holder {
            padding: 0 24px 24px;
          }
        `}</style>
      </div>
    </div>
  );
};

export default Contract;
