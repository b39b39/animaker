// src/Layout.jsx
import React from "react";

export default function Layout({ children }) {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-gray-950 text-gray-100">
      {children}
    </div>
  );
}
