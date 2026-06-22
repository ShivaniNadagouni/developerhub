"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { api, saveToken } from "@/lib/api";
import InputField from "@/components/InputField";
import Toast from "@/components/Toast";
import type { LoginForm, ToastState } from "@/types";

const INITIAL_FORM: LoginForm = { email: "", password: "" };

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState<LoginForm>(INITIAL_FORM);
  const [toast, setToast] = useState<ToastState | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const set =
    (key: keyof LoginForm) =>
    (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm((f) => ({ ...f, [key]: e.target.value }));

  const showToast = (message: string, type: ToastState["type"]): void => {
    setToast({ message, type });
  };

  const handleLogin = async (): Promise<void> => {
    if (!form.email || !form.password) {
      showToast("Please enter your email and password.", "error");
      return;
    }
    setLoading(true);
    try {
      const res = await api.login(form);
      if (res.ok) {
        const { token }: { token: string } = await res.json();
        saveToken(token);
        showToast("Welcome back!", "success");
        setTimeout(() => router.push("/home"), 800);
      } else {
        showToast(await res.text(), "error");
      }
    } catch {
      showToast("Cannot connect to the server.", "error");
    }
    setLoading(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === "Enter") handleLogin();
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
          <p className="text-slate-500 text-sm mt-1">Welcome back, developer</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm px-8 py-8">
          <h2 className="text-xl font-semibold text-slate-900 mb-6">Log in</h2>

          <div className="flex flex-col gap-4">
            <InputField
              label="Email"
              id="email"
              type="email"
              placeholder="jane@example.com"
              value={form.email}
              onChange={set("email")}
              onKeyDown={handleKeyDown}
            />

            <InputField
              label="Password"
              id="password"
              type="password"
              placeholder="••••••••"
              value={form.password}
              onChange={set("password")}
              onKeyDown={handleKeyDown}
            />
          </div>

          <button
            onClick={handleLogin}
            disabled={loading}
            className={`w-full mt-6 py-3 rounded-xl font-semibold text-white text-sm transition-all duration-150
              ${loading
                ? "bg-violet-300 cursor-not-allowed"
                : "bg-violet-600 hover:bg-violet-700 active:scale-[0.98]"
              }`}
          >
            {loading ? "Logging in…" : "Log in"}
          </button>
        </div>

        <p className="text-center text-sm text-slate-500 mt-5">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="text-violet-600 font-semibold hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </main>
  );
}
