"use client";

import { useState } from "react";
import Avatar from "./Avatar";
import { StarPicker } from "./StarRating";
import type { User } from "@/types";

interface ReviewModalProps {
  profile: User;
  onClose: () => void;
  onSubmit: (taskworker: string, rating: number) => Promise<void>;
}

export default function ReviewModal({ profile, onClose, onSubmit }: ReviewModalProps) {
  const [rating, setRating] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async (): Promise<void> => {
    if (!rating) return;
    setLoading(true);
    await onSubmit(profile._id, rating);
    setLoading(false);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 flex flex-col gap-5"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center gap-3">
          <Avatar name={profile.fullname} size="lg" />
          <div>
            <h2 className="font-bold text-slate-900 text-lg leading-tight">
              {profile.fullname}
            </h2>
            <p className="text-sm text-slate-500">{profile.skill}</p>
          </div>
          <button
            onClick={onClose}
            className="ml-auto text-slate-400 hover:text-slate-700 text-xl leading-none transition-colors"
          >
            ✕
          </button>
        </div>

        <div className="border-t border-slate-100" />

        {/* Rating picker */}
        <div>
          <p className="text-sm font-semibold text-slate-700 mb-3">
            Rate this developer
          </p>
          <StarPicker value={rating} onChange={setRating} />
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-1">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-sm font-medium
              hover:bg-slate-50 transition-all duration-150"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!rating || loading}
            className={`flex-1 py-2.5 rounded-xl text-white text-sm font-semibold transition-all duration-150
              ${rating && !loading
                ? "bg-violet-600 hover:bg-violet-700"
                : "bg-slate-200 text-slate-400 cursor-not-allowed"
              }`}
          >
            {loading ? "Submitting…" : "Submit review"}
          </button>
        </div>
      </div>
    </div>
  );
}
