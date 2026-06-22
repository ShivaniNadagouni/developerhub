"use client";

import { useState } from "react";

// ── Display-only stars ───────────────────────────────────────────────────────
interface StarsProps {
  rating: number;
  max?: number;
}

export function Stars({ rating, max = 5 }: StarsProps) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: max }).map((_, i) => (
        <span
          key={i}
          className={`text-base ${i < rating ? "text-amber-400" : "text-slate-200"}`}
        >
          ★
        </span>
      ))}
    </div>
  );
}

// ── Interactive star picker ──────────────────────────────────────────────────
interface StarPickerProps {
  value: number;
  onChange: (rating: number) => void;
}

const LABELS = ["", "Poor", "Fair", "Good", "Very good", "Excellent"] as const;

export function StarPicker({ value, onChange }: StarPickerProps) {
  const [hovered, setHovered] = useState<number>(0);
  const active = hovered || value;

  return (
    <div>
      <div className="flex gap-1 mb-2">
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            type="button"
            onClick={() => onChange(n)}
            onMouseEnter={() => setHovered(n)}
            onMouseLeave={() => setHovered(0)}
            className={`text-3xl transition-all duration-100 hover:scale-110 ${
              n <= active ? "text-amber-400" : "text-slate-200"
            }`}
          >
            ★
          </button>
        ))}
      </div>
      {active > 0 && (
        <p className="text-sm text-slate-500">
          {LABELS[active]} — {active}/5 stars
        </p>
      )}
    </div>
  );
}
