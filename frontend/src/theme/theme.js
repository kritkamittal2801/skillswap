/**
 * SkillSwap — Shared design tokens
 * -----------------------------------------------------------------------
 * Single source of truth for colors, elevation, and type so every page
 * (Home, Login, Signup, Dashboard, RequestFeed, etc.) stays visually
 * consistent instead of each page re-typing its own hex codes.
 *
 * Usage:
 *   import { COLORS, SURFACE, CARD_SHADOW } from "../theme/theme";
 *   <div style={{ background: COLORS.red }} />
 *   <div className={CARD_CLASS}>...</div>
 *
 * Fonts (add once, in index.html <head>, not per-page):
 *   <link rel="preconnect" href="https://fonts.googleapis.com">
 *   <link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,500;1,9..144,500&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
 * -----------------------------------------------------------------------
 */

/** Base surfaces */
export const BG = "#0C0808";        // page background — near-black, warm undertone
export const SURFACE = "#221414";   // elevated card/panel background — a real step up from BG
export const SURFACE_FLAT = "#1A1010"; // secondary/inactive surface (e.g. the "losing" side of a comparison)
export const TEXT = "#ECE8E1";      // primary text
export const TEXT_MUTED = "rgba(255,255,255,0.45)";
export const TEXT_MUTED_2 = "rgba(255,255,255,0.3)";
export const BORDER = "rgba(255,255,255,0.08)";

/**
 * Multi-color system — each color carries meaning, not just decoration.
 * Reuse these same assignments on every page so "red" always means the
 * same thing to a returning user.
 */
export const COLORS = {
  red: "#C2504E",   // urgent / live / primary action / errors
  blue: "#7B8FC2",  // matched / in-progress / informational / links
  green: "#6FA88A", // solved / success / confirmations
  gold: "#D9A441",  // points / rewards / ratings
};

/** Two-layer elevation shadow — contact shadow + ambient shadow + light-catching top edge. */
export const CARD_SHADOW =
  "0 2px 6px rgba(0,0,0,0.5), 0 16px 36px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.06)";

/** Same shadow, larger — for hero-level or modal-level surfaces. */
export const CARD_SHADOW_LG =
  "0 4px 12px rgba(0,0,0,0.5), 0 30px 70px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.08)";

/** Tailwind className for a standard elevated card. Use with style={{borderTop: `3px solid ${COLORS.x}`}} for a colored accent. */
export const CARD_CLASS = "relative rounded-xl bg-[#221414] shadow-[0_2px_6px_rgba(0,0,0,0.5),0_16px_36px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.06)]";

/** Reserved for hero-level sections only — do not use on inner pages/forms, it's meant to feel like a "stage." */
export const HERO_BACKDROP_STYLE = {
  background: "radial-gradient(120% 100% at 15% 0%, #241531 0%, #170F1F 45%, #0C0808 85%)",
};
export const HERO_GLOW_RED = { background: "radial-gradient(circle, rgba(194,80,78,0.28), transparent 70%)", filter: "blur(20px)" };
export const HERO_GLOW_GOLD = { background: "radial-gradient(circle, rgba(217,164,65,0.16), transparent 70%)", filter: "blur(20px)" };

/** Typography */
export const FONT_DISPLAY = "'Fraunces', serif"; // headlines, always italic for emphasis words
export const FONT_BODY = "'Inter', sans-serif";  // body text (default; usually don't need to set explicitly)
export const FONT_MONO = "'JetBrains Mono', monospace"; // labels, stats, timestamps, session codes

/** Status → color mapping, used by StatusDot and any status pill/badge. */
export const STATUS_COLOR = {
  live: COLORS.red,
  matched: COLORS.blue,
  solved: COLORS.green,
};
