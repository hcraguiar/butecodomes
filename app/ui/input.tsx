import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode;
  error?: string;
}

export default function Input({ className, placeholder, value, type = 'text', onChange, icon, error, ...rest}: InputProps) {
  const baseStyle = "w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 mb-3 pl-10"
  return (
    <div className="relative">
      <input
        {...rest}
        className={`${baseStyle} ${className}`}
        placeholder={placeholder}
        type={type}
        value={value}
        onChange={onChange}
      />
      {icon && (
        <div className="pointer-events-none absolute left-3 top-[16px] h-[18px] w-[18px] text-gray-500 peer-focus:text-gray-500">
          {icon}  
        </div> 
      )}
      {error && (
        <span className="text-sm text-red-600">{error}</span>
      )}
    </div>
  );
}