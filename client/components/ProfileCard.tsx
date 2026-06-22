"use client";

import Avatar from "./Avatar";
import { Stars } from "./StarRating";
import type { User, Review } from "@/types";

interface ProfileCardProps {
  profile: User;
  isMe: boolean;
  reviews: Review[];
  onReview: (profile: User) => void;
}

export default function ProfileCard({
  profile,
  isMe,
  reviews,
  onReview,
}: ProfileCardProps) {
  const profileReviews = reviews.filter(
    (r) => r.taskworker?.toString() === profile._id?.toString()
  );

  const avgRating =
    profileReviews.length > 0
      ? profileReviews.reduce((a, r) => a + r.rating, 0) / profileReviews.length
      : null;

  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-5 flex flex-col gap-4 hover:border-violet-200 hover:shadow-sm transition-all duration-200">
      {/* Top row */}
      <div className="flex items-start gap-3">
        <Avatar name={profile.fullname} size="md" />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-semibold text-slate-900 text-base truncate">
              {profile.fullname}
            </h3>
            {isMe && (
              <span className="text-xs bg-violet-100 text-violet-700 border border-violet-200 rounded-full px-2 py-0.5 font-semibold">
                You
              </span>
            )}
          </div>
          <p className="text-xs text-slate-400 mt-0.5 truncate">{profile.email}</p>
          <p className="text-xs text-slate-400 truncate">📱 {profile.mobile}</p>
        </div>
      </div>

      {/* Skill badge */}
      <div>
        <span className="inline-block text-xs font-medium bg-violet-50 text-violet-700 border border-violet-100 rounded-full px-3 py-1">
          {profile.skill}
        </span>
      </div>

      {/* Rating */}
      {avgRating !== null ? (
        <div className="flex items-center gap-2">
          <Stars rating={Math.round(avgRating)} />
          <span className="text-sm font-semibold text-slate-700">
            {avgRating.toFixed(1)}
          </span>
          <span className="text-xs text-slate-400">
            ({profileReviews.length} review{profileReviews.length !== 1 ? "s" : ""})
          </span>
        </div>
      ) : (
        <p className="text-xs text-slate-400 italic">No reviews yet</p>
      )}

      {/* Review button */}
      {!isMe && (
        <button
          onClick={() => onReview(profile)}
          className="self-start mt-auto px-4 py-2 rounded-xl border border-violet-300 text-violet-700 text-sm font-semibold
            hover:bg-violet-600 hover:text-white hover:border-violet-600
            transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-violet-300"
        >
          ★ Add review
        </button>
      )}
    </div>
  );
}
