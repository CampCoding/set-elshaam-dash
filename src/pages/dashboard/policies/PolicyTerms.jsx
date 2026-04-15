import React, { useState, useRef } from "react";
import { Button, Card, Spin } from "antd";
import { Save, FileText } from "lucide-react";
import JoditEditor from "jodit-react";

const PolicyTerms = () => {
  const editor = useRef(null);
  const [content, setContent] = useState("<p>الشروط والأحكام</p>");
  const [loading, setLoading] = useState(false);

  const config = {
    readonly: false,
    height: 500,
    language: "ar",
    direction: "rtl",
  };

  const handleSave = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 800);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="bg-white p-6 rounded-2xl shadow-sm border flex items-center justify-between">
        <h1 className="text-2xl font-bold flex items-center gap-3">
          <FileText className="w-6 h-6" />
          الشروط والأحكام
        </h1>
        <Button type="primary" onClick={handleSave} loading={loading}>
          حفظ
        </Button>
      </div>

      <Card>
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

export default PolicyTerms;
