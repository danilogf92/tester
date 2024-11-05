import React from "react";

export const NoContent = ({ text, icon }) => {
  return (
    <div className="flex items-center justify-center p-4 text-yellow-800">
      <span className="mr-2 text-5xl">{text}</span>
      <span className="text-5xl" role="img" aria-label="barrel">
        {icon}
      </span>
    </div>
  );
};
