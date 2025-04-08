import type React from "react"

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
}

const Input: React.FC<InputProps> = ({ label, error, className = "", ...props }) => {
  return (
    <div className="mb-4">
      <label className="block text-white text-sm font-medium mb-2">{label}</label>
      <input
        className={`w-full bg-[#282828] text-white border ${
          error ? "border-red-500" : "border-[#3E3E3E]"
        } rounded-md py-3 px-4 focus:outline-none focus:ring-1 focus:ring-[#1DB954] focus:border-[#1DB954] ${className}`}
        {...props}
      />
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  )
}

export default Input

