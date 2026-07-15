import { COLORS } from "./theme";

export function Mark({ size = 32 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
      <path d="M20 3 C13 12 9 18 9 25 C9 32.5 14 37 20 37 C26 37 31 32.5 31 25 C31 18 27 12 20 3 Z" stroke={COLORS.red} strokeWidth="1.5" fill="none" />
      <path d="M20 3 C24 10 17 16 20 20 C23 24 15 28 20 37" stroke={COLORS.red} strokeWidth="1.2" fill="none" />
    </svg>
  );
}

export function Wordmark({ size = "text-lg" }) {
  return (
    <span className={`font-display italic font-medium tracking-tight ${size}`} style={{ color: "#ECE8E1" }}>
      Skill<span style={{ color: COLORS.red }}>Swap</span>
    </span>
  );
}

export function Logo({ size = 24, textSize = "text-lg" }) {
  return (
    <span className="flex items-center gap-2.5">
      <Mark size={size} />
      <Wordmark size={textSize} />
    </span>
  );
}
