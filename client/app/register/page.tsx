"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import InputField from "@/components/InputField";
import Toast from "@/components/Toast";
import type { RegisterForm, ToastState } from "@/types";

const SKILLS: string[] = [
  "React", "Next.js", "Node.js", "Python", "Java",
  "Flutter", "DevOps", "UI/UX Design", "Data Science",
  "Machine Learning", "PHP", "Go", "Rust", "TypeScript",
];

const INITIAL_FORM: RegisterForm = {
  fullname: "",
  email: "",
  mobile: "",
  skill: "",
  password: "",
  confirmpassword: "",
};

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState<RegisterForm>(INITIAL_FORM);
  const [toast, setToast] = useState<ToastState | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const set =
    (key: keyof RegisterForm) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setForm((f) => ({ ...f, [key]: e.target.value }));

  const showToast = (message: string, type: ToastState["type"]): void => {
    setToast({ message, type });
  };

  const handleRegister = async (): Promise<void> => {
    if (!form.fullname || !form.email || !form.password || !form.skill) {
      showToast("Please fill in all required fields.", "error");
      return;
    }
    if (form.password !== form.confirmpassword) {
      showToast("Passwords do not match.", "error");
      return;
    }
    setLoading(true);
    try {
      const res = await api.register(form);
      if (res.ok) {
        showToast("Account created! Redirecting to login…", "success");
        setTimeout(() => router.push("/login"), 1500);
      } else {
        showToast(await res.text(), "error");
      }
    } catch {
      showToast("Cannot connect to the server.", "error");
    }
    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-12">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-10 h-10 bg-violet-600 rounded-xl flex items-center justify-center mb-3 shadow-sm">
            <span className="text-white text-lg font-bold">⚡</span>
          </div>
          <h1 className="text-2xl font-bold text-violet-900 tracking-tight">DevConnect</h1>
          <p className="text-slate-500 text-sm mt-1">Create your developer profile</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm px-8 py-8">
          <h2 className="text-xl font-semibold text-slate-900 mb-6">Sign up</h2>

          <div className="flex flex-col gap-4">
            <InputField
              label="Full name"
              id="fullname"
              type="text"
              placeholder="Jane Doe"
              value={form.fullname}
              onChange={set("fullname")}
            />

            <InputField
              label="Email"
              id="email"
              type="email"
              placeholder="jane@example.com"
              value={form.email}
              onChange={set("email")}
            />

            <InputField
              label="Mobile number"
              id="mobile"
              type="tel"
              placeholder="+91 98765 43210"
              value={form.mobile}
              onChange={set("mobile")}
            />

            {/* Skill dropdown */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="skill" className="text-sm font-medium text-slate-600">
                Primary skill
              </label>
              <select
                id="skill"
                value={form.skill}
                onChange={set("skill")}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-sm
                  text-slate-900 outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100
                  transition-all duration-150 cursor-pointer"
              >
                <option value="" disabled>Select a skill…</option>
                {SKILLS.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            <InputField
              label="Password"
              id="password"
              type="password"
              placeholder="••••••••"
              value={form.password}
              onChange={set("password")}
            />

            <InputField
              label="Confirm password"
              id="confirmpassword"
              type="password"
              placeholder="••••••••"
              value={form.confirmpassword}
              onChange={set("confirmpassword")}
            />
          </div>

          <button
            onClick={handleRegister}
            disabled={loading}
            className={`w-full mt-6 py-3 rounded-xl font-semibold text-white text-sm transition-all duration-150
              ${loading
                ? "bg-violet-300 cursor-not-allowed"
                : "bg-violet-600 hover:bg-violet-700 active:scale-[0.98]"
              }`}
          >
            {loading ? "Creating account…" : "Create account"}
          </button>
        </div>

        <p className="text-center text-sm text-slate-500 mt-5">
          Already have an account?{" "}
          <Link href="/login" className="text-violet-600 font-semibold hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </main>
  );
}
