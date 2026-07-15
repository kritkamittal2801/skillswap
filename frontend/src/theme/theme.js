
/** Base surfaces */
export const BG = "#0C0808";        
export const SURFACE = "#221414";   
export const SURFACE_FLAT = "#1A1010"; 
export const TEXT = "#ECE8E1";      
export const TEXT_MUTED = "rgba(255,255,255,0.45)";
export const TEXT_MUTED_2 = "rgba(255,255,255,0.3)";
export const BORDER = "rgba(255,255,255,0.08)";


export const COLORS = {
  red: "#C2504E",   
  blue: "#7B8FC2", 
  green: "#6FA88A", 
  gold: "#D9A441",  
};


export const CARD_SHADOW =
  "0 2px 6px rgba(0,0,0,0.5), 0 16px 36px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.06)";


export const CARD_SHADOW_LG =
  "0 4px 12px rgba(0,0,0,0.5), 0 30px 70px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.08)";


export const CARD_CLASS = "relative rounded-xl bg-[#221414] shadow-[0_2px_6px_rgba(0,0,0,0.5),0_16px_36px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.06)]";


export const HERO_BACKDROP_STYLE = {
  background: "radial-gradient(120% 100% at 15% 0%, #241531 0%, #170F1F 45%, #0C0808 85%)",
};
export const HERO_GLOW_RED = { background: "radial-gradient(circle, rgba(194,80,78,0.28), transparent 70%)", filter: "blur(20px)" };
export const HERO_GLOW_GOLD = { background: "radial-gradient(circle, rgba(217,164,65,0.16), transparent 70%)", filter: "blur(20px)" };


export const FONT_DISPLAY = "'Fraunces', serif"; // headlines, always italic for emphasis words
export const FONT_BODY = "'Inter', sans-serif";  // body text (default; usually don't need to set explicitly)
export const FONT_MONO = "'JetBrains Mono', monospace"; // labels, stats, timestamps, session codes


export const STATUS_COLOR = {
  live: COLORS.red,
  matched: COLORS.blue,
  solved: COLORS.green,
};
