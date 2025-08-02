// Card.jsx content placeholder
import React from "react";

const Card = ({
  children,
  className = "",
  ...rest
}) => (
  <div
    className={`bg-white shadow p-4 rounded-lg border border-gray-100 ${className}`}
    {...rest}
  >
    {children}
  </div>
);

export default Card;
