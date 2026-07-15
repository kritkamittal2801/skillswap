import { COLORS, CARD_CLASS, STATUS_COLOR } from "./theme";

export function ButtonPrimary({ children, className = "", ...props }) {
  return (
    <button
      className={`inline-flex items-center gap-2 text-white font-medium px-6 py-3.5 rounded-xl shadow-[0_8px_24px_rgba(194,80,78,0.35)] hover:brightness-110 transition-all disabled:opacity-60 disabled:cursor-not-allowed ${className}`}
      style={{ background: COLORS.red }}
      {...props}
    >
      {children}
    </button>
  );
}


export function ButtonGhost({ children, className = "", ...props }) {
  return (
    <button
      className={`inline-flex items-center gap-2 text-[#AAB8E0] hover:text-white border border-[#7B8FC2]/40 hover:border-[#7B8FC2]/70 px-6 py-3.5 rounded-xl transition-colors ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}


export function Card({ children, accent, className = "", style = {}, ...props }) {
  return (
    <div
      className={`${CARD_CLASS} p-6 ${className}`}
      style={accent ? { borderTop: `3px solid ${accent}`, ...style } : style}
      {...props}
    >
      {children}
    </div>
  );
}


export function StatusDot({ status }) {
  const color = STATUS_COLOR[status] || COLORS.blue;
  return (
    <span
      className="inline-block w-2 h-2 rounded-full shrink-0"
      style={{ background: color, boxShadow: `0 0 0 4px ${color}33` }}
    />
  );
}

export function Pill({ children, color = COLORS.red, textColor = "#fff", className = "" }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full ${className}`}
      style={{ background: color, color: textColor }}
    >
      {children}
    </span>
  );
}

export function Input({ label, icon: Icon, className = "", ...props }) {
  return (
    <label className="block">
      {label && <span className="block text-sm text-white/60 mb-1.5">{label}</span>}
      <div className="relative">
        {Icon && (
          <Icon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 pointer-events-none" />
        )}
        <input
          className={`w-full bg-[#1A1010] border border-white/10 focus:border-white/25 rounded-lg py-3 text-sm text-white placeholder:text-white/25 outline-none transition-colors ${Icon ? "pl-10 pr-4" : "px-4"} ${className}`}
          {...props}
        />
      </div>
    </label>
  );
}
