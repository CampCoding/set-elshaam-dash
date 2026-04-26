// src/components/common/RichTextEditor.jsx
import React, { useMemo } from 'react';
import JoditEditor from 'jodit-react';

const RichTextEditor = ({ value, onChange, placeholder }) => {
  const config = useMemo(
    () => ({
      readonly: false,
      placeholder: placeholder || 'ابدأ الكتابة هنا...',
      toolbarAdaptive: false,
      buttons: [
        'source',
        '|',
        'bold',
        'italic',
        'underline',
        'strikethrough',
        '|',
        'superscript',
        'subscript',
        '|',
        'ul',
        'ol',
        '|',
        'outdent',
        'indent',
        '|',
        'font',
        'fontsize',
        'brush',
        'paragraph',
        '|',
        'image',
        'video',
        'table',
        'link',
        '|',
        'align',
        'undo',
        'redo',
        '|',
        'hr',
        'eraser',
        'copyformat',
        '|',
        'fullsize',
        'print',
        'about',
      ],
      uploader: {
        insertImageAsBase64URI: true,
      },
      language: 'ar',
      direction: 'rtl',
      height: 400,
    }),
    [placeholder]
  );

  return (
    <div className="rich-text-editor" dir="rtl">
      <JoditEditor
        value={value}
        config={config}
        tabIndex={1}
        onBlur={(newContent) => onChange(newContent)}
        onChange={() => {}}
      />
    </div>
  );
};

export default RichTextEditor;
