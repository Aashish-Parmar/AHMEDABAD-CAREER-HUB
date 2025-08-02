// Input.jsx content placeholder
import React from "react";

const Input = ({
  label,
  name,
  value,
  onChange,
  type = "text",
  error = "",
  className = "",
  ...rest
}) => (
  <div className="mb-4">
    {label && (
      <label
        htmlFor={name}
        className="block mb-1 font-medium text-gray-700"
      >
        {label}
      </label>
    )}
    <input
      id={name}
      name={name}
      value={value}
      onChange={onChange}
      type={type}
      className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
      {...rest}
    />
    {error && (
      <span className="text-sm text-red-600">{error}</span>
    )}
  </div>
);

export default Input;
