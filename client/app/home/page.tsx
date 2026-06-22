"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { api, hasToken } from "@/lib/api";
import Navbar from "@/components/Navbar";
import ProfileCard from "@/components/ProfileCard";
import ReviewModal from "@/components/ReviewModal";
import Toast from "@/components/Toast";
import type { User, Review, ToastState } from "@/types";

export default function HomePage() {
  const router = useRouter();
  const [profiles, setProfiles] = useState<User[]>([]);
  const [myProfile, setMyProfile] = useState<User | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewTarget, setReviewTarget] = useState<User | null>(null);
  const [search, setSearch] = useState<string>("");
  const [skillFilter, setSkillFilter] = useState<string>("All");
  const [toast, setToast] = useState<ToastState | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const showToast = (message: string, type: ToastState["type"]): void => {
    setToast({ message, type });
  };

  const refreshReviews = useCallback(async (): Promise<void> => {
    try {
      const rRes = await api.myReviews();
      if (rRes.ok) {
        const data: Review[] = await rRes.json();
        setReviews(data);
      }
    } catch {
      console.error("Failed to refresh reviews");
    }
  }, []);

  useEffect(() => {
    if (!hasToken()) {
      router.replace("/login");
      return;
    }

    (async () => {
      try {
        setError(null);

        const [pRes, myRes, rRes] = await Promise.all([
          api.allProfiles(),
          api.myProfile(),
          api.myReviews(),
        ]);

        // Log raw responses for debugging
        console.log("allProfiles status:", pRes.status);
        console.log("myProfile status:", myRes.status);

        if (pRes.status === 401 || myRes.status === 401) {
          router.replace("/login");
          return;
        }

        if (pRes.ok) {
          const profileData: User[] = await pRes.json();
          console.log("Profiles received:", profileData);
          // Ensure it's actually an array before setting
          if (Array.isArray(profileData)) {
            setProfiles(profileData);
          } else {
            console.error("allProfiles did not return an array:", profileData);
            setError("Unexpected data format from server.");
          }
        } else {
          const errText = await pRes.text();
          console.error("allProfiles failed:", pRes.status, errText);
          setError(`Failed to load profiles (${pRes.status}).`);
        }

        if (myRes.ok) {
          const myData: User = await myRes.json();
          setMyProfile(myData);
        }

        if (rRes.ok) {
          const reviewData: Review[] = await rRes.json();
          setReviews(reviewData);
        }
      } catch (err) {
        console.error("Data fetch error:", err);
        showToast("Failed to load data. Check your connection.", "error");
        setError("Network error. Please try again.");
      } finally {
        setLoading(false);
      }
    })();
  }, [router]);

  const handleAddReview = async (taskworker: string, rating: number): Promise<void> => {
    try {
      const res = await api.addReview(taskworker, rating);
      if (res.ok) {
        showToast("Review submitted!", "success");
        await refreshReviews();
      } else {
        showToast(await res.text(), "error");
      }
    } catch {
      showToast("Failed to submit review.", "error");
    }
  };

  // Unique skills for filter dropdown — guard against null/undefined skill values
  const allSkills: string[] = [
    "All",
    ...Array.from(
      new Set(profiles.map((p) => p.skill).filter((s): s is string => Boolean(s)))
    ),
  ];

  // Filtered profiles — default skillFilter is "All", so no profiles are hidden on load
  const filtered: User[] = profiles.filter((p) => {
    const q = search.toLowerCase().trim();

    // If there's no search query, skip the text check
    const matchSearch =
      q === "" ||
      p.fullname?.toLowerCase().includes(q) ||
      p.skill?.toLowerCase().includes(q);

    // If "All" is selected, every profile passes the skill check
    const matchSkill = skillFilter === "All" || p.skill === skillFilter;

    return matchSearch && matchSkill;
  });

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar user={myProfile} />

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {reviewTarget && (
        <ReviewModal
          profile={reviewTarget}
          onClose={() => setReviewTarget(null)}
          onSubmit={handleAddReview}
        />
      )}

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
        {/* Page header */}
        <div className="mb-7">
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Developer Profiles
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            {loading
              ? "Loading…"
              : `${profiles.length} developer${profiles.length !== 1 ? "s" : ""} in the community`}
          </p>
        </div>

        {/* Search + filter bar — only shown when there are profiles */}
        {!loading && profiles.length > 0 && (
          <div className="flex flex-col sm:flex-row gap-3 mb-7">
            <div className="relative flex-1">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm pointer-events-none">
                🔍
              </span>
              <input
                type="text"
                placeholder="Search by name or skill…"
                value={search}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setSearch(e.target.value)
                }
                className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm
                  text-slate-900 placeholder:text-slate-400 outline-none
                  focus:border-violet-400 focus:ring-2 focus:ring-violet-100
                  transition-all duration-150"
              />
            </div>

            <select
              value={skillFilter}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                setSkillFilter(e.target.value)
              }
              className="px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-700
                outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100
                transition-all duration-150 cursor-pointer"
            >
              {allSkills.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
        )}

        {/* Content */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 text-slate-400 gap-3">
            <div className="w-8 h-8 border-2 border-violet-300 border-t-violet-600 rounded-full animate-spin" />
            <p className="text-sm">Loading profiles…</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-24 text-slate-400">
            <p className="text-4xl mb-3">⚠️</p>
            <p className="text-base font-medium text-slate-600">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 text-sm rounded-lg bg-violet-600 text-white hover:bg-violet-700 transition-colors"
            >
              Retry
            </button>
          </div>
        ) : profiles.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-slate-400">
            <p className="text-4xl mb-3">👥</p>
            <p className="text-base font-medium">No developers registered yet.</p>
            <p className="text-sm mt-1">Be the first to complete your profile!</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-slate-400">
            <p className="text-4xl mb-3">🔭</p>
            <p className="text-base font-medium">No developers match your search.</p>
            <p className="text-sm mt-1">Try a different name or skill.</p>
            <button
              onClick={() => { setSearch(""); setSkillFilter("All"); }}
              className="mt-4 px-4 py-2 text-sm rounded-lg border border-slate-200 hover:bg-slate-100 transition-colors text-slate-600"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((profile) => (
              <ProfileCard
                key={profile._id}
                profile={profile}
                isMe={myProfile?._id === profile._id}
                reviews={reviews}
                onReview={setReviewTarget}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}