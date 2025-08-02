// Button.jsx content placeholder
import React from "react";

const Button = ({
  type = "submit",
  className = "",
  children,
  ...rest
}) => (
  <button
    type={type}
    className={`px-4 py-2 rounded-md bg-blue-600 text-white font-semibold hover:bg-blue-700 transition ${className}`}
    {...rest}
  >
    {children}
  </button>
);

export default Button;
