// src/components/common/Loading.jsx
import { Loader2 } from "lucide-react";

const Loading = ({ fullScreen = true, text = "Loading..." }) => {
  const content = (
    <div className="flex flex-col items-center gap-4">
      <Loader2 className="w-12 h-12 text-primary animate-spin" />
      <p className="text-gray-600 font-medium">{text}</p>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        {content}
      </div>
    );
  }

  return content;
};

export default Loading;
