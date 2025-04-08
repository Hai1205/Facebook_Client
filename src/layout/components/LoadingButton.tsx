import type React from "react";
import { Loader2 } from "lucide-react";

interface LoadingButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline";
  fullWidth?: boolean;
  children: React.ReactNode;
  isLoading?: boolean;
}

const LoadingButton: React.FC<LoadingButtonProps> = ({
  variant = "primary",
  fullWidth = false,
  children,
  className = "",
  isLoading = false,
  disabled,
  ...props
}) => {
  const baseClasses =
    "py-3 px-4 rounded-full font-bold transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 relative";

  const variantClasses = {
    primary: "bg-[#1DB954] hover:bg-[#1ed760] text-black focus:ring-[#1DB954]",
    secondary: "bg-white hover:bg-gray-100 text-black focus:ring-white",
    outline:
      "bg-transparent border border-gray-400 text-white hover:border-white focus:ring-white",
  };

  const widthClass = fullWidth ? "w-full" : "";
  const isDisabled = disabled || isLoading;

  return (
    <button
      className={`${baseClasses} ${
        variantClasses[variant]
      } ${widthClass} ${className} ${
        isDisabled ? "opacity-70 cursor-not-allowed" : ""
      }`}
      disabled={isDisabled}
      {...props}
    >
      {isLoading ? (
        <div className="flex items-center justify-center">
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          <span>{children}</span>
        </div>
      ) : (
        children
      )}
    </button>
  );
};

export default LoadingButton;
