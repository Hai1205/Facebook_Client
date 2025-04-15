import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

const Input: React.FC<InputProps> = ({
  label,
  error,
  className = "",
  ...props
}) => {
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-white mb-1">
        {label}
      </label>
      <input
        className={`w-full px-4 py-2 bg-[#282828] rounded-md text-white border ${
          error ? "border-red-500" : "border-[#3E3E3E]"
        } focus:outline-none focus:ring-1 focus:ring-facebook focus:border-facebook ${className}`}
        {...props}
      />
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
};

export default Input;
