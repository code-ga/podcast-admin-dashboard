import React from "react";

export const GlobalWrapper: React.FC<React.PropsWithChildren> = ({
  children,
}) => (
  <>
    <div
      className="h-screen bg-gray-900 text-white
    "
    >
      {children}
    </div>
  </>
);
