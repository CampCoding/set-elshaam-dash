import React, { useState, useRef } from "react";
import { Button, Card, Typography, Spin } from "antd";
import { Save, ShieldCheck } from "lucide-react";
import JoditEditor from "jodit-react";

const { Text } = Typography;

const PolicyPrivacy = () => {
  const editor = useRef(null);
  const [content, setContent] = useState(
    "<p>مرحباً بك في صفحة سياسة الخصوصية.</p>"
  );
  const [loading, setLoading] = useState(false);

  const config = {
    readonly: false,
    height: 500,
    language: "ar",
    direction: "rtl",
    placeholder: "اكتب سياسة الخصوصية هنا...",
  };

  const handleSave = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      console.log("Saved:", content);
    }, 800);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-primary flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-xl">
              <ShieldCheck className="w-6 h-6 text-primary" />
            </div>
            سياسة الخصوصية
          </h1>
        </div>
        <Button
          type="primary"
          icon={<Save className="w-4 h-4 ml-2" />}
          size="large"
          onClick={handleSave}
          loading={loading}
        >
          حفظ
        </Button>
      </div>

      <Card>
        <div className="border rounded-lg overflow-hidden relative">
          {loading && (
            <div className="absolute inset-0 bg-white/50 z-10 flex items-center justify-center">
              <Spin size="large" />
            </div>
          )}
          <JoditEditor
            ref={editor}
            value={content}
            config={config}
            onBlur={(newContent) => setContent(newContent)}
          />
        </div>
      </Card>
    </div>
  );
};

export default PolicyPrivacy;
