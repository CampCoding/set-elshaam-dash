import React, { useState, useRef, useEffect } from "react";
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
} from "lucide-react";
import JoditEditor from "jodit-react";
import { contractService } from "../../../api/services/contract.service";

// ==================== المتغيرات المتاحة ====================
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
];

// ==================== محتوى العقد الافتراضي ====================
// const defaultContractHTML = `
// <div style="font-family: Almarai, sans-serif; color: rgb(2, 48, 72); font-size: 15px; font-weight: 600; text-align: right; direction: rtl; padding: 24px; background: #fff;">

//   <div style="display: flex; flex-direction: column; gap: 4px; margin-bottom: 16px;">
//     <p style="margin: 0; font-size: 18px; font-weight: 700;">اتفاقية خدمة البحث عن شريك الزواج</p>
//     <p style="margin: 0; font-size: 16px;">مكتب ست الشام للزواج (فنلندا)</p>
//   </div>

//   <p style="margin: 0 0 16px; line-height: 2; font-weight: 600;">
//     تُبرم اتفاقية خدمة البحث عن شريك الزواج هذه ("الاتفاقية") بين الأطراف المحددة أدناه. تحدد الاتفاقية الشروط التي يقدم بموجبها مكتب ست الشام للزواج خدمة البحث عن شريك الزواج والتعارف. يُقر الطرفان بأن هذه الاتفاقية يُقصد تفسيرها وتنفيذها بموجب القانون الفنلندي وقانون الاتحاد الأوروبي المعمول به.
//   </p>

//   <div style="margin-top: 16px; display: flex; flex-direction: column; gap: 12px;">
//     <p style="margin: 0; color: rgb(212, 175, 91); font-weight: 700; font-size: 16px;">بيانات الاتفاقية</p>
//     <p style="margin: 0;">تاريخ السريان: {date}</p>
//     <p style="margin: 0;">الاسم الكامل للعميل: {name}</p>
//     <p style="margin: 0;">تاريخ ميلاد العميل: {birthdate}</p>
//   </div>

//   <div style="margin-top: 16px;">
//     <p style="margin: 0 0 4px; font-weight: 700;">1. التعريفات</p>
//     <p style="margin: 0; font-weight: 400; line-height: 1.8;">
//       "الخدمة" تعني خدمة البحث عن شريك الزواج والتعارف المقدمة من مكتب ست الشام للزواج.
//     </p>
//   </div>

//   <div style="margin-top: 12px;">
//     <p style="margin: 0 0 4px; font-weight: 700;">2. وصف الخدمة</p>
//     <p style="margin: 0; font-weight: 400; line-height: 1.8;">
//       تشمل الخدمة إنشاء الملف الشخصي، ومطابقة الشركاء، وتسهيل التعارف، وخدمات تنظيم اللقاءات.
//     </p>
//   </div>

//   <div style="margin-top: 12px;">
//     <p style="margin: 0 0 4px; font-weight: 700;">3. الرسوم والدفع</p>
//     <p style="margin: 0; font-weight: 400; line-height: 1.8;">
//       المرحلة الأولى: 100 يورو + ضريبة القيمة المضافة<br/>
//       المرحلة الثانية: 200 يورو + ضريبة القيمة المضافة
//     </p>
//   </div>

// </div>
// `;

const Contract = () => {
  const editor = useRef(null);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [copiedVar, setCopiedVar] = useState(null);

  const fetchContract = async () => {
    try {
      const data = await contractService.getContract();
      // console.log(data?.data?.contract_text, "data?.contract_text");
      setContent(data?.data?.contract_text);
    } catch (error) {
      console.error("Error fetching contract:", error);
    }
  };

  useEffect(() => {
    fetchContract();
  }, []);

  const config = {
    readonly: false,
    height: 500,
    language: "ar",
    direction: "rtl",
    toolbarButtonSize: "middle",
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
  };

  // ✅ إدراج متغير في الإديتور عند موضع الكيرسر
  const insertVariable = (variableKey) => {
    const editorInstance = editor.current?.editor || editor.current;

    if (editorInstance && editorInstance.selection) {
      editorInstance.selection.insertHTML(
        `<span style="color: #D4AF5B; font-weight: bold; background-color: #FDF8EB; padding: 0 4px; border-bottom: 1px solid #D4AF5B; border-radius: 2px;">${variableKey}</span>&nbsp;`
      );
    } else {
      // fallback: append to content
      setContent(
        (prev) =>
          prev +
          `<span style="color: #D4AF5B; font-weight: bold; background-color: #FDF8EB; padding: 0 4px; border-bottom: 1px solid #D4AF5B; border-radius: 2px;">${variableKey}</span>&nbsp;`
      );
    }
  };

  // ✅ نسخ المتغير للـ clipboard
  const copyVariable = (variableKey) => {
    navigator.clipboard.writeText(variableKey);
    setCopiedVar(variableKey);
    setTimeout(() => setCopiedVar(null), 2000);
  };

  // ✅ عد المتغيرات المستخدمة في المحتوى
  const countVariableUsage = (variableKey) => {
    const regex = new RegExp(variableKey.replace(/[{}]/g, "\\$&"), "g");
    return (content.match(regex) || []).length;
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      await contractService.updateContract({ contract_text: content });
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

      {/* ✅ Variables Toolbar */}
      <Card className="rounded-2xl shadow-sm border border-gray-100">
        <div className="flex items-center gap-2 mb-3">
          <Info className="w-4 h-4 text-primary" />
          <span className="font-semibold text-gray-700 text-sm">
            المتغيرات المتاحة
          </span>
          <span className="text-xs text-gray-400 mr-2">
            (اضغط "إدراج" لإضافة المتغير عند موضع الكيرسر، أو "نسخ" لنسخه
            يدوياً)
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
                {/* Icon & Info */}
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

                {/* Action Buttons */}
                <Space size={4}>
                  <Tooltip title={isCopied ? "تم النسخ!" : "نسخ المتغير"}>
                    <Button
                      size="small"
                      type="default"
                      onClick={() => copyVariable(variable.key)}
                      icon={
                        isCopied ? (
                          <Check className="w-3 h-3 text-green-500" />
                        ) : (
                          <Copy className="w-3 h-3" />
                        )
                      }
                      className="flex items-center justify-center rounded-lg"
                    />
                  </Tooltip>
                </Space>
              </div>
            );
          })}
        </div>

        {/* Helper Note */}
        <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-lg">
          <p className="text-xs text-amber-700 flex items-start gap-2">
            <span className="text-base mt-[-2px]">⚠️</span>
            <span>
              <strong>مهم:</strong> المتغيرات{" "}
              <code className="bg-amber-100 px-1 rounded">{"{date}"}</code> و{" "}
              <code className="bg-amber-100 px-1 rounded">{"{name}"}</code> و{" "}
              <code className="bg-amber-100 px-1 rounded">{"{birthdate}"}</code>{" "}
              سيتم استبدالها تلقائياً ببيانات العميل عند عرض العقد في التطبيق.
              لا تغير النص داخل الأقواس.
            </span>
          </p>
        </div>
      </Card>

      {/* Editor */}
      <Card className="rounded-2xl shadow-sm border border-gray-100">
        <JoditEditor
          ref={editor}
          value={content}
          config={config}
          onBlur={(newContent) => setContent(newContent)}
        />
      </Card>
    </div>
  );
};

export default Contract;
