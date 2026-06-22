"use client";

import { InputHTMLAttributes } from "react";

interface InputFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  id?: string;
  className?: string;
}

export default function InputField({ label, id, className = "", ...props }: InputFieldProps) {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-slate-600">
          {label}
        </label>
      )}
      <input
        id={id}
        {...props}
        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 text-sm
          placeholder:text-slate-400 outline-none
          focus:border-violet-400 focus:ring-2 focus:ring-violet-100
          transition-all duration-150 disabled:opacity-50"
      />
    </div>
  );
}
