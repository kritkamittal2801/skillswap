import { useEffect, useState } from "react";
import {
  ArrowRight, Star, Users, Clock, BookOpen,
  Video, MessageSquare, Zap, ShieldCheck, Radio, ChevronRight,
  CheckCircle2, XCircle, Send
} from "lucide-react";

import api from "../services/api";

/**
 * SkillSwap — Homepage (v2)
 * -----------------------------------------------------------------------
 * Design concept: "The last lamp still on."
 * A peer-to-peer doubt-clearing app lives in one specific moment: 1AM,
 * exam tomorrow, one lamp still glowing in an otherwise dark room.
 *
 * v2 changes from the first pass, on request — the first version read as
 * generic "AI SaaS": a violet↔amber gradient smeared across text and
 * buttons, and a rounded-gradient-square logo with a letter in it. Both
 * are default moves, not choices. Fixed here:
 *   - ONE accent color (a muted brass/gold), used sparingly — never as a
 *     gradient, never on body text, only on the one or two things per
 *     section that are actually "live" or actionable.
 *   - Display type swapped from Space Grotesk (very common AI pick) to
 *     Fraunces, a soft high-contrast serif — reads editorial/premium
 *     rather than "generic dev tool."
 *   - Logo is a custom engraved medallion mark (nods to the SkillPoints
 *     coin economy) with a hand-set monogram, not an icon-in-a-gradient-box.
 *
 * Fonts (add to index.html <head>):
 *   <link rel="preconnect" href="https://fonts.googleapis.com">
 *   <link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,500;0,9..144,600;1,9..144,500&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
 *
 * Dependency: npm i lucide-react
 * -----------------------------------------------------------------------
 */

const liveFeed = [
  { name: "Rhea", subject: "DBMS — Normalization", time: "just now", status: "matched" },
  { name: "Aman", subject: "Thermodynamics — 2nd Law", time: "1 min ago", status: "live" },
  { name: "Kavya", subject: "OOP — Polymorphism", time: "3 min ago", status: "solved" },
  { name: "Dev", subject: "Networks — TCP handshake", time: "6 min ago", status: "matched" },
  { name: "Ishaan", subject: "Circuits — Thevenin's theorem", time: "8 min ago", status: "solved" },
  { name: "Priya", subject: "Calculus — Laplace transforms", time: "11 min ago", status: "live" },
];

const steps = [
  { n: "01", title: "Post your doubt", body: "Say what's stuck and tag the topic. Takes ten seconds — no forms, no waiting for office hours." },
  { n: "02", title: "Get matched", body: "Anyone online who's marked that skill sees your request and can pick it up in seconds." },
  { n: "03", title: "Talk it through", body: "A live session opens between the two of you. Explain, share your screen, work the problem together." },
  { n: "04", title: "Rate & earn", body: "Both of you rate the session. Good explainers earn SkillPoints and a trust score that reflects real help given." },
];

const subjectCategories = [
  { label: "Computer Science", color: "#C2504E", items: ["Data Structures", "DBMS", "Operating Systems", "Computer Networks", "OOP Concepts"] },
  { label: "Electronics & Circuits", color: "#7B8FC2", items: ["Circuit Theory", "Digital Logic", "Signals & Systems"] },
  { label: "Core Engineering", color: "#6FA88A", items: ["Thermodynamics", "Fluid Mechanics", "Strength of Materials"] },
  { label: "Programming & Web", color: "#D9A441", items: ["Python", "React.js", "Machine Learning", "Linear Algebra"] },
];



const leaderboard = [
  { name: "Ananya Rao", subject: "Data Structures & Algorithms", sessions: 34, points: 890 },
  { name: "Rohan Sharma", subject: "Database Systems", sessions: 29, points: 760 },
  { name: "Ishaan Verma", subject: "Circuit Theory", sessions: 27, points: 705 },
  { name: "Meera Iyer", subject: "Operating Systems", sessions: 22, points: 610 },
  { name: "Karan Mehta", subject: "React & Frontend", sessions: 19, points: 540 },
];

const faqs = [
  { q: "Is SkillSwap actually free?", a: "Yes. It's a barter, not a marketplace — you help with what you know, and get help back on what you don't. No payments, no subscriptions." },
  { q: "How do you know people are real students?", a: "Sign-up requires a verified college email address, and every profile shows a real name, college, and year — no anonymous accounts." },
  { q: "What if nobody's online for my subject?", a: "Post it anyway. You'll be notified the moment someone free comes online, and in the meantime you can browse similar doubts that have already been solved." },
  { q: "Can I choose who helps me, or is it random?", a: "You can browse open helpers and their subject specialties before requesting — it's not a blind random match." },
  { q: "What stops someone from giving bad help?", a: "Ratings are mandatory on both sides after every session. Consistently low-rated accounts lose matching priority automatically." },
];

/** Multi-color system: each color carries meaning, not just decoration. */
const COLORS = {
  red: "#C2504E",   // urgent / live / primary action
  blue: "#7B8FC2",  // matched / in-progress / informational
  green: "#6FA88A", // solved / success
  gold: "#D9A441",  // points / rewards / ratings
};

function StatusDot({ status }) {
  const map = {
    live: "bg-[#C2504E] shadow-[0_0_0_4px_rgba(194,80,78,0.25)]",
    matched: "bg-[#7B8FC2] shadow-[0_0_0_4px_rgba(123,143,194,0.22)]",
    solved: "bg-[#6FA88A] shadow-[0_0_0_4px_rgba(111,168,138,0.22)]",
  };
  return <span className={`inline-block w-2 h-2 rounded-full ${map[status]}`} />;
}

/**
 * Logo mark — the shared flame: one candle lighting another,
 * split into two interlocked halves. This is the final logo.
 */
function Mark({ size = 32 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
      <path d="M20 3 C13 12 9 18 9 25 C9 32.5 14 37 20 37 C26 37 31 32.5 31 25 C31 18 27 12 20 3 Z" stroke="#C2504E" strokeWidth="1.5" fill="none" />
      <path d="M20 3 C24 10 17 16 20 20 C23 24 15 28 20 37" stroke="#C2504E" strokeWidth="1.2" fill="none" />
    </svg>
  );
}

export default function SkillSwapHome() {
  const [tick, setTick] = useState(0);
  const [openFaq, setOpenFaq] = useState(0);

   const [highlights, setHighlights] = useState([]);

  useEffect(() => {
    const fetchHighlights = async () => {
      try {
        const res = await api.get("/ratings/highlights");
        setHighlights(res.data.highlights || []);
      } catch (error) {
        console.log("Failed to load feedback highlights:", error);
      }
    };
    fetchHighlights();
  }, []);

  useEffect(() => {
    const id = setInterval(() => setTick((t) => (t + 1) % liveFeed.length), 3200);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const id = setInterval(() => setTick((t) => (t + 1) % liveFeed.length), 3200);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="min-h-screen bg-[#0C0808] text-[#ECE8E1] antialiased" style={{ fontFamily: "Inter, sans-serif" }}>
      <style>{`
        .font-display { font-family: 'Fraunces', serif; }
        .font-mono { font-family: 'JetBrains Mono', monospace; }
        .lamp-glow {
          background: radial-gradient(circle at 50% 35%, rgba(194,80,78,0.10), rgba(194,80,78,0) 62%);
        }
        .ambient-glow {
          background: radial-gradient(45% 40% at 85% 8%, rgba(194,80,78,0.06), transparent 60%);
        }
        .hero-backdrop {
          background: radial-gradient(120% 100% at 15% 0%, #241531 0%, #170F1F 45%, #0C0808 85%);
        }
        .hero-glow-red {
          background: radial-gradient(circle, rgba(194,80,78,0.28), transparent 70%);
          filter: blur(20px);
        }
        .hero-glow-gold {
          background: radial-gradient(circle, rgba(217,164,65,0.16), transparent 70%);
          filter: blur(20px);
        }
        @keyframes marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        .marquee-track { animation: marquee 34s linear infinite; }
        @media (prefers-reduced-motion: reduce) {
          .marquee-track { animation: none; }
        }
      `}</style>

      {/* ---------------------------------------------------------------- NAV */}
      <header className="sticky top-0 z-40 border-b border-white/[0.06] bg-[#0C0808]/85 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 h-16 flex items-center justify-between">
          <a href="#" className="flex items-center gap-2.5">
            <Mark size={30} />
            <span className="font-display italic font-medium text-lg tracking-tight">Skill<span style={{ color: "#C2504E" }}>Swap</span></span>
          </a>
          <nav className="hidden md:flex items-center gap-8 text-sm text-white/50">
            <a href="#how" className="hover:text-white transition-colors">How it works</a>
            <a href="#subjects" className="hover:text-white transition-colors">Subjects</a>
            <a href="#stories" className="hover:text-white transition-colors">Stories</a>
            <a href="#" className="hover:text-white transition-colors">About</a>
          </nav>
          <div className="flex items-center gap-3">
            <button className="hidden sm:inline-block text-sm text-white/60 hover:text-white transition-colors px-3 py-2">Log in</button>
            <button className="text-sm font-medium bg-[#C2504E] text-[#0C0808] px-4 py-2 rounded-lg hover:bg-[#D4726F] transition-colors">
              Sign up free
            </button>
          </div>
        </div>
      </header>

      {/* ---------------------------------------------------------------- HERO */}
      <section className="relative overflow-hidden hero-backdrop">
        <div className="absolute -top-24 left-[8%] w-72 h-72 rounded-full hero-glow-red" />
        <div className="absolute bottom-0 right-[3%] w-96 h-96 rounded-full hero-glow-gold" />
        <div className="max-w-7xl mx-auto px-6 lg:px-10 pt-16 pb-24 lg:pt-24 lg:pb-32 relative grid lg:grid-cols-[1.05fr_0.95fr] gap-16 items-center">
          {/* left */}
          <div>
            <div className="text-xs font-mono uppercase tracking-[0.15em] text-white/35 mb-4">
              Peer-to-peer doubt clearing · for college students
            </div>
            <div className="inline-flex items-center gap-2 text-xs font-mono text-[#C2504E]/90 border border-[#C2504E]/20 bg-[#C2504E]/[0.05] rounded-full px-3 py-1.5 mb-7">
              <StatusDot status="live" />
              156 students online right now
            </div>
            <h1 className="font-display font-medium text-[2.75rem] leading-[1.08] sm:text-6xl sm:leading-[1.06] tracking-tight">
              Stuck at 1AM,
              <br />
              <span className="text-white/35">exam tomorrow?</span>
              <br />
              <span className="italic text-[#E0716E]" style={{ textShadow: "0 0 30px rgba(194,80,78,0.45)" }}>Someone's awake.</span>
            </h1>
            <p className="mt-6 text-lg text-white/50 max-w-md leading-relaxed">
              Post the exact thing you're stuck on. Get matched with a student who
              already knows it, live, in minutes — not office hours away.
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-2 text-sm">
              {["Post a doubt", "Get matched", "Solve it live"].map((step, i) => (
                <span key={step} className="flex items-center gap-2">
                  <span className="flex items-center gap-1.5 bg-white/[0.04] border border-white/10 rounded-full pl-2.5 pr-3 py-1.5">
                    <span className="w-4 h-4 rounded-full bg-[#C2504E] text-[#0C0808] text-[10px] font-bold flex items-center justify-center">{i + 1}</span>
                    <span className="text-white/70">{step}</span>
                  </span>
                  {i < 2 && <ArrowRight className="w-3.5 h-3.5 text-white/20" />}
                </span>
              ))}
            </div>
            <div className="mt-9 flex flex-wrap items-center gap-4">
              <button className="group inline-flex items-center gap-2 bg-[#C2504E] text-white font-medium px-6 py-3.5 rounded-xl shadow-[0_8px_24px_rgba(194,80,78,0.35)] hover:bg-[#D4726F] transition-colors">
                Post your first doubt
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </button>
              <button className="inline-flex items-center gap-2 text-[#AAB8E0] hover:text-white border border-[#7B8FC2]/40 hover:border-[#7B8FC2]/70 px-6 py-3.5 rounded-xl transition-colors">
                See how it works
              </button>
            </div>
            <div className="mt-10 flex items-center gap-4">
              <div className="flex -space-x-2.5">
                {["#C2504E", "#A88A8A", "#8AA487", "#4A2F2E"].map((c, i) => (
                  <div key={i} className="w-8 h-8 rounded-full border-2 border-[#0C0808]" style={{ background: c }} />
                ))}
              </div>
              <div className="text-sm text-white/45">
                <span className="text-white font-medium">4.9/5</span> from 2,000+ session ratings
              </div>
            </div>
          </div>

          {/* right — the lamp / session ticket mockup */}
          <div className="relative">
            <div className="absolute -inset-16 lamp-glow rounded-full" />
            <div className="hidden sm:flex absolute -top-5 -right-4 z-10 items-center gap-2 rounded-xl border border-[#C2504E]/25 bg-[#1A0E0D] px-3.5 py-2.5 shadow-xl">
              <span className="w-7 h-7 rounded-full border border-[#C2504E]/40 flex items-center justify-center"><Mark size={14} /></span>
              <div className="leading-tight">
                <div className="text-sm font-medium">+40 SkillPoints</div>
                <div className="text-[11px] text-white/35">for a great session</div>
              </div>
            </div>
            <div className="relative rounded-2xl bg-[#221414] p-5 shadow-[0_2px_8px_rgba(0,0,0,0.5),0_24px_60px_rgba(0,0,0,0.55),inset_0_1px_0_rgba(255,255,255,0.06)]">
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-white/[0.06]">
                <div className="flex items-center gap-2 text-xs font-mono text-white/35">
                  <Radio className="w-3.5 h-3.5 text-[#C2504E]" />
                  SESSION #2481
                </div>
                <span className="text-xs font-mono text-[#C2504E]/85">02:41 elapsed</span>
              </div>

              <div className="text-xs uppercase tracking-wide text-white/30 mb-2 font-mono">Doubt posted</div>
              <div className="text-base font-medium leading-snug mb-4">
                "Can someone explain why we normalize to 3NF here? Getting confused with transitive deps."
              </div>
              <div className="inline-flex items-center gap-1.5 text-xs font-mono bg-white/[0.04] border border-white/10 rounded-full px-2.5 py-1 mb-5">
                DBMS · Normalization
              </div>

              <div className="flex items-center gap-3 rounded-xl bg-white/[0.025] border border-white/[0.06] p-3.5">
                <div className="relative">
                  <div className="w-10 h-10 rounded-full border border-[#C2504E]/40 flex items-center justify-center font-display italic text-sm font-medium text-[#C2504E]">
                    R
                  </div>
                  <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-[#C2504E] border-2 border-[#0C0808]" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium">Rohan S. is helping now</div>
                  <div className="text-xs text-white/35">4.9★ · 61 doubts cleared</div>
                </div>
                <Video className="w-4 h-4 text-white/35" />
              </div>

              <div className="grid grid-cols-4 gap-3 mt-5 pt-5 border-t border-white/[0.06]">
                {[["12", "requests today"], ["2m", "avg. match"], ["4.9", "your rating"], ["240", "SkillPoints"]].map(([n, l]) => (
                  <div key={l}>
                    <div className="font-display font-medium text-lg">{n}</div>
                    <div className="text-[11px] text-white/35 leading-tight mt-0.5">{l}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------------- STATS STRIP */}
      <section className="border-y border-white/[0.06] bg-white/[0.012]">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 py-8 grid grid-cols-2 sm:grid-cols-4 gap-8">
          {[
            [Users, "10,000+", "active students", COLORS.red],
            [Clock, "2 min", "average match time", COLORS.blue],
            [BookOpen, "300+", "topics covered", COLORS.green],
            [Star, "4.9/5", "average rating", COLORS.gold],
          ].map(([Icon, n, l, color], i) => (
            <div key={i} className="flex items-center gap-3">
              <Icon className="w-5 h-5 shrink-0" style={{ color }} />
              <div>
                <div className="font-display font-medium text-xl leading-none" style={{ color }}>{n}</div>
                <div className="text-xs text-white/35 mt-1">{l}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ---------------------------------------------------------------- FEATURES */}
      <section className="max-w-7xl mx-auto px-6 lg:px-10 py-24 lg:py-28">
        <div className="max-w-xl mb-14">
          <div className="text-xs font-mono text-[#C2504E]/70 uppercase tracking-wider mb-3">What it does</div>
          <h2 className="font-display font-medium text-3xl sm:text-4xl tracking-tight">
            Everything happens in one live loop
          </h2>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {[
            [MessageSquare, "Post a doubt", "Describe what's confusing you and tag the topic. No formatting required — write it like you'd text a friend.", COLORS.red],
            [Radio, "Instant matching", "Your request reaches every student online who's marked that skill. Whoever's free picks it up.", COLORS.blue],
            [Video, "Live session", "A private room opens between you two. Talk it through, share your screen, work the problem live.", COLORS.green],
            [Zap, "Skill barter & SkillPoints", "No money changes hands. Help with what you know, get help back on what you don't — and earn SkillPoints for every session.", COLORS.gold],
            [Star, "Ratings that mean something", "Every session ends with honest feedback both ways — so good explainers are easy to find next time.", COLORS.gold],
            [ShieldCheck, "Built on trust", "Verified college accounts only. Your rating and history follow you across every session.", COLORS.blue],
          ].map(([Icon, title, body, color], i) => (
            <div key={i} className="group relative rounded-xl bg-[#221414] p-6 shadow-[0_2px_6px_rgba(0,0,0,0.5),0_16px_36px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.06)] hover:-translate-y-1 transition-transform">
              <span className="absolute top-0 left-4 right-4 h-[2px] rounded-b" style={{ background: color }} />
              <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-4" style={{ background: color }}>
                <Icon className="w-5 h-5 text-[#150C0C]" />
              </div>
              <h3 className="font-display font-medium text-base mb-2">{title}</h3>
              <p className="text-sm text-white/45 leading-relaxed">{body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ---------------------------------------------------------------- LIVE TICKER */}
      <section className="border-y border-white/[0.06] bg-white/[0.012] py-10 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 mb-6 flex items-center gap-2 text-xs font-mono text-white/35 uppercase tracking-wider">
          <StatusDot status="live" />
          Happening right now
        </div>
        <div className="flex overflow-hidden">
          <div className="flex gap-4 marquee-track shrink-0 pl-6">
            {[...liveFeed, ...liveFeed].map((item, i) => (
              <div key={i} className="flex items-center gap-3 shrink-0 rounded-full border border-white/10 bg-white/[0.025] pl-2 pr-4 py-2">
                <div className="w-7 h-7 rounded-full border border-[#C2504E]/35 flex items-center justify-center font-display italic text-xs font-medium text-[#C2504E]">
                  {item.name[0]}
                </div>
                <span className="text-sm whitespace-nowrap">
                  <span className="font-medium">{item.name}</span>
                  <span className="text-white/35"> · {item.subject}</span>
                </span>
                <StatusDot status={item.status} />
                <span className="text-xs font-mono text-white/30 whitespace-nowrap">{item.time}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------------- LEADERBOARD */}
      <section className="max-w-7xl mx-auto px-6 lg:px-10 py-24 lg:py-28">
        <div className="flex items-end justify-between mb-10 flex-wrap gap-4">
          <div>
            <div className="text-xs font-mono text-[#C2504E]/70 uppercase tracking-wider mb-3">This week</div>
            <h2 className="font-display font-medium text-3xl sm:text-4xl tracking-tight">Top helpers right now</h2>
          </div>
          <p className="text-sm text-white/40 max-w-xs">Ranked by SkillPoints earned from sessions rated 4★ and above this week.</p>
        </div>
        <div className="rounded-xl bg-[#221414] shadow-[0_2px_6px_rgba(0,0,0,0.5),0_16px_36px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.06)] divide-y divide-white/[0.06]">
          {leaderboard.map((p, i) => {
            const medal = [COLORS.gold, "#B8B8B8", "#C97B4A", "transparent", "transparent"][i];
            return (
              <div key={p.name} className="flex items-center gap-4 px-6 py-4">
                <div className="w-8 h-8 rounded-full flex items-center justify-center font-display font-semibold text-sm shrink-0"
                  style={{ background: i < 3 ? medal : "transparent", color: i < 3 ? "#150C0C" : "rgba(255,255,255,0.3)" }}>
                  {i + 1}
                </div>
                <div className="w-9 h-9 rounded-full border border-[#C2504E]/35 flex items-center justify-center font-display italic text-sm text-[#C2504E] shrink-0">
                  {p.name[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate">{p.name}</div>
                  <div className="text-xs text-white/35 truncate">{p.subject}</div>
                </div>
                <div className="hidden sm:block text-xs text-white/35 font-mono">{p.sessions} sessions</div>
                <div className="text-sm font-display font-medium w-16 text-right" style={{ color: COLORS.gold }}>{p.points} pts</div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ---------------------------------------------------------------- HOW IT WORKS */}
      <section id="how" className="max-w-7xl mx-auto px-6 lg:px-10 py-24 lg:py-28">
        <div className="max-w-xl mb-16">
          <div className="text-xs font-mono text-[#C2504E]/70 uppercase tracking-wider mb-3">The flow</div>
          <h2 className="font-display font-medium text-3xl sm:text-4xl tracking-tight">
            From stuck to solved, in order
          </h2>
        </div>
        <div className="grid md:grid-cols-4 gap-4">
          {steps.map((s, i) => {
            const color = [COLORS.red, COLORS.blue, COLORS.green, COLORS.gold][i];
            return (
              <div key={s.n} className="rounded-xl bg-[#221414] p-5 shadow-[0_2px_6px_rgba(0,0,0,0.5),0_16px_36px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.06)]" style={{ borderTop: `3px solid ${color}` }}>
                <div className="font-mono text-xs mb-3" style={{ color }}>{s.n}</div>
                <h3 className="font-display font-medium text-base mb-2">{s.title}</h3>
                <p className="text-sm text-white/40 leading-relaxed">{s.body}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* ---------------------------------------------------------------- COMPARISON */}
      <section className="max-w-7xl mx-auto px-6 lg:px-10 pb-24 lg:pb-28">
        <div className="grid md:grid-cols-2 gap-5">
          <div className="rounded-xl bg-[#221414] p-8 shadow-[0_2px_6px_rgba(0,0,0,0.5),0_16px_36px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.06)]">
            <div className="text-xs font-mono text-white/30 uppercase tracking-wider mb-6">Office hours / forums</div>
            <ul className="space-y-4">
              {["Answers arrive hours or days later", "One-way — you just receive, never teach back", "No sense of who actually knows the topic", "Nothing to show that you helped someone"].map((t) => (
                <li key={t} className="flex items-start gap-3 text-sm text-white/40">
                  <XCircle className="w-4 h-4 text-white/20 shrink-0 mt-0.5" /> {t}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-xl border-2 border-[#C2504E]/50 bg-[#C2504E]/[0.07] p-8 shadow-[0_8px_28px_rgba(194,80,78,0.15)]">
            <div className="text-xs font-mono text-[#C2504E]/80 uppercase tracking-wider mb-6">SkillSwap</div>
            <ul className="space-y-4">
              {["Matched with someone live in minutes", "Two-way — teach what you know, learn what you don't", "Ratings surface who's actually reliable", "Every session builds a record you can point to"].map((t) => (
                <li key={t} className="flex items-start gap-3 text-sm text-white/75">
                  <CheckCircle2 className="w-4 h-4 text-[#C2504E] shrink-0 mt-0.5" /> {t}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------------- SUBJECTS */}
      <section id="subjects" className="max-w-7xl mx-auto px-6 lg:px-10 pb-24 lg:pb-28">
        <div className="flex items-end justify-between mb-8 flex-wrap gap-4">
          <div>
            <div className="text-xs font-mono text-[#C2504E]/70 uppercase tracking-wider mb-3">Popular right now</div>
            <h2 className="font-display font-medium text-3xl tracking-tight">What people are stuck on</h2>
          </div>
          <a href="#" className="text-sm text-white/45 hover:text-white flex items-center gap-1 transition-colors">
            Browse all subjects <ChevronRight className="w-4 h-4" />
          </a>
        </div>
        <div className="grid sm:grid-cols-2 gap-5">
          {subjectCategories.map((cat) => (
            <div key={cat.label} className="rounded-xl bg-[#221414] p-5 shadow-[0_2px_6px_rgba(0,0,0,0.5),0_16px_36px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.06)]">
              <div className="flex items-center gap-2 mb-3">
                <span className="w-2 h-2 rounded-full" style={{ background: cat.color }} />
                <span className="text-xs font-mono uppercase tracking-wider" style={{ color: cat.color }}>{cat.label}</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {cat.items.map((s) => (
                  <span key={s} className="text-sm border border-white/10 bg-white/[0.03] hover:bg-white/[0.06] transition-colors rounded-full px-3.5 py-1.5 cursor-default">
                    {s}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ---------------------------------------------------------------- FEEDBACK HIGHLIGHTS */}
      <section id="stories" className="max-w-7xl mx-auto px-6 lg:px-10 pb-24 lg:pb-28">
        <div className="max-w-xl mb-14">
          <div className="text-xs font-mono text-[#C2504E]/70 uppercase tracking-wider mb-3">From real sessions</div>
          <h2 className="font-display font-medium text-3xl sm:text-4xl tracking-tight">Real feedback from real sessions</h2>
        </div>

        {highlights.length === 0 ? (
          <div className="rounded-xl bg-[#221414] p-10 text-center shadow-[0_2px_6px_rgba(0,0,0,0.5),0_16px_36px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.06)]">
            <p className="text-white/50 text-sm">
              No feedback yet — be the first to complete a session and leave one.
            </p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {highlights.map((item, i) => (
              <div key={i} className="rounded-xl bg-[#221414] p-7 shadow-[0_2px_6px_rgba(0,0,0,0.5),0_16px_36px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.06)] flex flex-col">
                <div className="text-xs mb-4" style={{ color: COLORS.gold }}>
                  {"★".repeat(item.stars)}
                </div>
                <p className="text-sm text-white/65 leading-relaxed flex-1">"{item.quote}"</p>
                <div className="mt-6 pt-5 border-t border-white/[0.06]">
                  <div className="text-sm font-medium">Feedback for {item.helperName}</div>
                  <div className="text-xs text-white/35 mt-0.5">{item.subject}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ---------------------------------------------------------------- FAQ */}
      <section className="max-w-4xl mx-auto px-6 lg:px-10 pb-24 lg:pb-28">
        <div className="max-w-xl mb-10">
          <div className="text-xs font-mono text-[#C2504E]/70 uppercase tracking-wider mb-3">Before you sign up</div>
          <h2 className="font-display font-medium text-3xl sm:text-4xl tracking-tight">Questions people actually ask</h2>
        </div>
        <div className="rounded-xl bg-[#221414] shadow-[0_2px_6px_rgba(0,0,0,0.5),0_16px_36px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.06)] divide-y divide-white/[0.06]">
          {faqs.map((item, i) => (
            <div key={item.q}>
              <button
                onClick={() => setOpenFaq(openFaq === i ? -1 : i)}
                className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left"
              >
                <span className="font-display text-base">{item.q}</span>
                <ChevronRight className={`w-4 h-4 text-white/30 shrink-0 transition-transform ${openFaq === i ? "rotate-90" : ""}`} />
              </button>
              {openFaq === i && (
                <div className="px-6 pb-5 -mt-2 text-sm text-white/50 leading-relaxed max-w-2xl">
                  {item.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ---------------------------------------------------------------- CTA */}
      <section className="max-w-7xl mx-auto px-6 lg:px-10 pb-24">
        <div className="relative overflow-hidden rounded-2xl border border-white/10 px-8 py-16 sm:px-16 text-center">
          <div className="absolute inset-0 lamp-glow" />
          <div className="relative">
            <h2 className="font-display font-medium text-3xl sm:text-4xl tracking-tight max-w-lg mx-auto">
              Someone's probably online right now.
            </h2>
            <p className="text-white/45 mt-4 max-w-md mx-auto">
              Post your doubt and find out. It takes less time than scrolling for an answer that isn't quite right.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <button className="inline-flex items-center gap-2 bg-[#C2504E] text-[#0C0808] font-medium px-6 py-3.5 rounded-xl hover:bg-[#D4726F] transition-colors">
                Post your first doubt <ArrowRight className="w-4 h-4" />
              </button>
              <button className="inline-flex items-center gap-2 text-[#AAB8E0] hover:text-white border border-[#7B8FC2]/40 hover:border-[#7B8FC2]/70 px-6 py-3.5 rounded-xl transition-colors">
                Browse open requests
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------------- FOOTER */}
      <footer className="border-t border-white/[0.06]">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 py-16 grid sm:grid-cols-2 lg:grid-cols-5 gap-10">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2.5 mb-4">
              <Mark size={26} />
              <span className="font-display italic font-medium">Skill<span style={{ color: "#C2504E" }}>Swap</span></span>
            </div>
            <p className="text-sm text-white/35 max-w-xs leading-relaxed">
              Peer-to-peer doubt clearing for college students. Learn from someone who gets it, teach someone who needs it.
            </p>
            <div className="flex gap-4 mt-6 text-white/30">
              {/* <Twitter className="w-4 h-4 hover:text-white/60 transition-colors cursor-pointer" />
              <Instagram className="w-4 h-4 hover:text-white/60 transition-colors cursor-pointer" />
              <Linkedin className="w-4 h-4 hover:text-white/60 transition-colors cursor-pointer" />
              <Github className="w-4 h-4 hover:text-white/60 transition-colors cursor-pointer" /> */}
              
            </div>
          </div>
          {[
            ["Product", ["Browse requests", "How it works", "Subjects", "Dashboard"]],
            ["Resources", ["Help center", "Community guidelines", "Blog"]],
            ["Company", ["About", "Contact", "Privacy policy"]],
          ].map(([title, links]) => (
            <div key={title}>
              <div className="text-sm font-medium mb-4">{title}</div>
              <ul className="space-y-3">
                {links.map((l) => (
                  <li key={l}><a href="#" className="text-sm text-white/35 hover:text-white/65 transition-colors">{l}</a></li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="max-w-7xl mx-auto px-6 lg:px-10 py-6 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/25">
          <span>© 2026 SkillSwap. Built by students, for students.</span>
          <div className="flex items-center gap-2">
            <input type="email" placeholder="you@college.edu" className="bg-white/[0.025] border border-white/10 rounded-lg px-3 py-2 text-xs text-white/60 placeholder:text-white/20 focus:outline-none focus:border-white/25 w-44" />
            <button className="bg-white/[0.06] hover:bg-white/10 transition-colors rounded-lg p-2"><Send className="w-3.5 h-3.5" /></button>
          </div>
        </div>
      </footer>
    </div>
  );
}
