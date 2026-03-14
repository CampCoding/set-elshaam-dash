// src/components/common/Button.jsx
import { Loader2 } from "lucide-react";

const Button = ({
  children,
  variant = "primary",
  type = "button",
  loading = false,
  fullWidth = false,
  className = "",
  ...props
}) => {
  const variants = {
    primary: "bg-primary hover:bg-primary-dark text-white",
    secondary: "bg-primary-light hover:bg-primary text-white",
    accent: "bg-accent hover:bg-red-600 text-white",
    outline:
      "border-2 border-primary text-primary hover:bg-primary hover:text-white bg-transparent",
    ghost: "text-primary hover:bg-primary/10 bg-transparent",
  };

  return (
    <button
      type={type}
      disabled={loading || props.disabled}
      className={`
        ${variants[variant]}
        font-semibold py-3 px-6 rounded-lg
        transition-all duration-300
        disabled:opacity-50 disabled:cursor-not-allowed
        inline-flex items-center justify-center gap-2
        cursor-pointer
        ${fullWidth ? "w-full" : ""}
        ${className}
      `}
      {...props}
    >
      {loading && <Loader2 className="w-5 h-5 animate-spin" />}
      {children}
    </button>
  );
};

export default Button;
