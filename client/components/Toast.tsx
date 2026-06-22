"use client";

import { useEffect } from "react";

interface ToastProps {
  message: string;
  type?: "success" | "error";
  onClose: () => void;
}

export default function Toast({ message, type = "success", onClose }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const styles: Record<"success" | "error", string> = {
    success: "bg-emerald-50 border-emerald-300 text-emerald-800",
    error: "bg-red-50 border-red-300 text-red-800",
  };

  const iconStyles: Record<"success" | "error", string> = {
    success: "bg-emerald-200 text-emerald-800",
    error: "bg-red-200 text-red-800",
  };

  const icons: Record<"success" | "error", string> = {
    success: "✓",
    error: "✕",
  };

  return (
    <div
      className={`fixed top-5 right-5 z-50 flex items-center gap-3 px-4 py-3 rounded-xl border shadow-lg text-sm font-medium max-w-xs animate-fade-in ${styles[type]}`}
    >
      <span
        className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${iconStyles[type]}`}
      >
        {icons[type]}
      </span>
      <span>{message}</span>
      <button
        onClick={onClose}
        className="ml-auto text-current opacity-50 hover:opacity-100 transition-opacity"
      >
        ✕
      </button>
    </div>
  );
}
