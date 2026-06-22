const BG_COLORS: string[] = [
  "bg-violet-100 text-violet-700",
  "bg-teal-100 text-teal-700",
  "bg-orange-100 text-orange-700",
  "bg-pink-100 text-pink-700",
  "bg-blue-100 text-blue-700",
  "bg-green-100 text-green-700",
  "bg-amber-100 text-amber-700",
];

type AvatarSize = "sm" | "md" | "lg";

interface AvatarProps {
  name?: string;
  size?: AvatarSize;
}

const SIZE_CLASSES: Record<AvatarSize, string> = {
  sm: "w-8 h-8 text-xs",
  md: "w-11 h-11 text-sm",
  lg: "w-14 h-14 text-base",
};

export default function Avatar({ name = "", size = "md" }: AvatarProps) {
  const initials = name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const colorClass =
    BG_COLORS[name.charCodeAt(0) % BG_COLORS.length] ?? BG_COLORS[0];

  return (
    <div
      className={`${SIZE_CLASSES[size]} ${colorClass} rounded-full flex items-center justify-center font-semibold flex-shrink-0`}
    >
      {initials || "?"}
    </div>
  );
}
