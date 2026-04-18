import React, { useState, useRef, useEffect, useMemo } from "react";
import { Button, Card, Tag, Tooltip, Space, Divider, message } from "antd";
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
} from "lucide-react";
import JoditEditor from "jodit-react";
import { contractService } from "../../../api/services/contract.service";

const VARIABLES = [
  {
    key: "{date}",
    label: "تاريخ السريان",
    icon: <Calendar className="w-3.5 h-3.5" />,
    color: "#3b82f6",
    description: "تاريخ اليوم عند موافقة العميل",
  },
  {
    key: "{name}",
    label: "اسم العميل",
    icon: <User className="w-3.5 h-3.5" />,
    color: "#22c55e",
    description: "الاسم الكامل للعميل من بيانات الحساب",
  },
  {
    key: "{birthdate}",
    label: "تاريخ الميلاد",
    icon: <CakeSlice className="w-3.5 h-3.5" />,
    color: "#f97316",
    description: "تاريخ ميلاد العميل من بيانات الحساب",
  },
  {
    key: "{email}",
    label: "البريد الإلكتروني",
    icon: <Mail className="w-3.5 h-3.5" />,
    color: "#8b5cf6",
    description: "البريد الإلكتروني للعميل من بيانات الحساب",
  },
  {
    key: "{nationality}",
    label: "الجنسية",
    icon: <Globe className="w-3.5 h-3.5" />,
    color: "#ec4899",
    description: "جنسية العميل من بيانات الحساب",
  },
  {
    key: "{checkbox}",
    label: "خانة الموافقة",
    icon: <CheckSquare className="w-3.5 h-3.5" />,
    color: "#14b8a6",
    description: "خانة اختيار لموافقة العميل على الشروط",
  },
];

const Contract = () => {
  const editor = useRef(null);
  const contentRef = useRef("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [copiedVar, setCopiedVar] = useState(null);

  const fetchContract = async () => {
    try {
      const data = await contractService.getContract();
      const text = data?.data?.contract_text || "";
      setContent(text);
      contentRef.current = text;
    } catch (error) {
      console.error("Error fetching contract:", error);
    }
  };

  useEffect(() => {
    fetchContract();
  }, []);

  const config = useMemo(
    () => ({
      readonly: false,
      height: 500,
      language: "ar",
      direction: "rtl",
      toolbarButtonSize: "middle",
      // ✅ منع الـ editor من فقدان التعديلات
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
      uploader: {
        insertImageAsBase64URI: true,
      },
      style: {
        fontFamily: "Almarai, sans-serif",
        color: "rgb(2, 48, 72)",
        fontSize: "15px",
        direction: "rtl",
        textAlign: "right",
      },
      // ✅ مهم: منع إعادة تحميل المحتوى عند كل تغيير
      saveModeInCookie: false,
      useSearch: false,
    }),
    []
  );

  // ✅ نسخ المتغير بدون سكرول
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

  const countVariableUsage = (variableKey) => {
    const text = contentRef.current || content;
    const regex = new RegExp(variableKey.replace(/[{}]/g, "\\$&"), "g");
    return (text.match(regex) || []).length;
  };

  // ✅ تحديث المحتوى بدون re-render للـ editor
  const handleContentChange = (newContent) => {
    contentRef.current = newContent;
  };

  // ✅ تحديث الـ state فقط عند الـ blur (للحفظ)
  const handleBlur = (newContent) => {
    contentRef.current = newContent;
    setContent(newContent);
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const textToSave = contentRef.current || content;
      await contractService.updateContract({ contract_text: textToSave });
      message.success("تم حفظ العقد بنجاح");
    } catch (error) {
      console.error("Save Error:", error);
      message.error("فشل في حفظ العقد");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-primary flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-xl">
            <FileText className="w-6 h-6 text-primary" />
          </div>
          الشروط والأحكام
        </h1>
        <Button
          type="primary"
          onClick={handleSave}
          loading={loading}
          icon={<Save className="w-4 h-4" />}
          className="flex items-center gap-2 bg-primary"
          size="large"
        >
          حفظ التغييرات
        </Button>
      </div>

      {/* Variables Toolbar */}
      <Card className="rounded-2xl shadow-sm border border-gray-100">
        <div className="flex items-center gap-2 mb-3">
          <Info className="w-4 h-4 text-primary" />
          <span className="font-semibold text-gray-700 text-sm">
            المتغيرات المتاحة
          </span>
          <span className="text-xs text-gray-400 mr-2">
            (اضغط "نسخ" لنسخ المتغير ثم الصقه في المكان المطلوب داخل المحرر)
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
                      {variable.label}
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
                  <Tooltip title={isCopied ? "تم النسخ!" : "نسخ المتغير"}>
                    <button
                      type="button"
                      onMouseDown={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                      }}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        copyVariable(variable.key);
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
              <strong>مهم:</strong> المتغيرات{" "}
              <code className="bg-amber-100 px-1 rounded">{"{date}"}</code> و{" "}
              <code className="bg-amber-100 px-1 rounded">{"{name}"}</code> و{" "}
              <code className="bg-amber-100 px-1 rounded">{"{birthdate}"}</code>{" "}
              و <code className="bg-amber-100 px-1 rounded">{"{email}"}</code> و{" "}
              <code className="bg-amber-100 px-1 rounded">
                {"{nationality}"}
              </code>{" "}
              و{" "}
              <code className="bg-amber-100 px-1 rounded">{"{checkbox}"}</code>{" "}
              سيتم استبدالها تلقائياً ببيانات العميل عند عرض العقد في التطبيق.
              لا تغير النص داخل الأقواس.
            </span>
          </p>
        </div>
      </Card>

      {/* ✅ Editor - بدون re-render عند التعديل */}
      <Card className="rounded-2xl shadow-sm border border-gray-100">
        <JoditEditor
          ref={editor}
          value={content}
          config={config}
          onChange={handleContentChange}
          onBlur={handleBlur}
        />
      </Card>
    </div>
  );
};

export default Contract;
