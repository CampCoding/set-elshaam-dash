
import { useMemo, useRef } from "react";
import JoditReact from "jodit-react";

/**
 * JoditEditor — Shared rich-text editor wrapper for Arabic / RTL forms.
 *
 * Props:
 *  value       – controlled HTML string
 *  onChange    – (htmlString) => void
 *  placeholder – optional placeholder text (default: "اكتب هنا...")
 *  height      – editor height in px (default: 300)
 *  readonly    – boolean
 */
const JoditEditor = ({
  value = "",
  onChange,
  placeholder = "اكتب هنا...",
  height = 300,
  readonly = false,
}) => {
  const editorRef = useRef(null);

  const config = useMemo(
    () => ({
      readonly,
      language: "ar",
      direction: "rtl",
      placeholder,
      height,
      toolbarAdaptive: false,
      showCharsCounter: false,
      showWordsCounter: false,
      showXPathInStatusbar: false,
      uploader: { insertImageAsBase64URI: false },
      buttons: [
        "bold",
        "italic",
        "underline",
        "strikethrough",
        "|",
        "ul",
        "ol",
        "|",
        "fontsize",
        "paragraph",
        "|",
        "align",
        "|",
        "link",
        "|",
        "undo",
        "redo",
        "|",
        "eraser",
        "fullsize",
      ],
      style: {
        fontFamily: "Cairo, Tajawal, sans-serif",
        fontSize: "14px",
        direction: "rtl",
        textAlign: "right",
      },
      editorStyle: {
        fontFamily: "Cairo, Tajawal, sans-serif",
        direction: "rtl",
      },
    }),
    [readonly, placeholder, height]
  );

  return (
    <div className="jodit-wrapper" dir="rtl">
      <JoditReact
        ref={editorRef}
        value={value}
        config={config}
        onBlur={(newContent) => {
          if (onChange) onChange(newContent);
        }}
        onChange={(newContent) => {
          if (onChange) onChange(newContent);
        }}
      />
    </div>
  );
};

export default JoditEditor;
