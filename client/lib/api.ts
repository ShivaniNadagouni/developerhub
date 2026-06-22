import type { RegisterForm, LoginForm } from "@/types";

const API_BASE = "http://localhost:5000";

function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token");
}

function authHeaders(): HeadersInit {
  return {
    "Content-Type": "application/json",
    "x-token": getToken() ?? "",
  };
}

export const api = {
  register: (data: RegisterForm): Promise<Response> =>
    fetch(`${API_BASE}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }),

  login: (data: LoginForm): Promise<Response> =>
    fetch(`${API_BASE}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }),

  allProfiles: (): Promise<Response> =>
    fetch(`${API_BASE}/allprofiles`, { headers: authHeaders() }),

  myProfile: (): Promise<Response> =>
    fetch(`${API_BASE}/myprofile`, { headers: authHeaders() }),

  myReviews: (): Promise<Response> =>
    fetch(`${API_BASE}/myreview`, { headers: authHeaders() }),

  addReview: (taskworker: string, rating: number): Promise<Response> =>
    fetch(`${API_BASE}/addreview`, {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify({ taskworker, rating }),
    }),
};

export function saveToken(token: string): void {
  localStorage.setItem("token", token);
}

export function clearToken(): void {
  localStorage.removeItem("token");
}

export function hasToken(): boolean {
  return !!getToken();
}
