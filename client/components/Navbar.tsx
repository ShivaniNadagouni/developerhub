"use client";

import { useRouter } from "next/navigation";
import { clearToken } from "@/lib/api";
import Avatar from "./Avatar";
import type { User } from "@/types";

interface NavbarProps {
  user: User | null;
}

export default function Navbar({ user }: NavbarProps) {
  const router = useRouter();

  const handleLogout = (): void => {
    clearToken();
    router.push("/login");
  };

  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur border-b border-slate-100">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 flex items-center justify-between py-3">
        {/* Logo */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-violet-600 flex items-center justify-center">
            <span className="text-white text-sm font-bold">⚡</span>
          </div>
          <span className="font-bold text-lg text-violet-900 tracking-tight">
            DevConnect
          </span>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-3">
          {user && (
            <div className="flex items-center gap-2.5">
              <Avatar name={user.fullname} size="sm" />
              <span className="hidden sm:block text-sm font-medium text-slate-700 max-w-[120px] truncate">
                {user.fullname}
              </span>
            </div>
          )}
          <button
            onClick={handleLogout}
            className="px-3.5 py-1.5 rounded-lg border border-slate-200 text-sm font-medium text-slate-600
              hover:bg-slate-50 hover:border-slate-300 transition-all duration-150"
          >
            Log out
          </button>
        </div>
      </div>
    </header>
  );
}
