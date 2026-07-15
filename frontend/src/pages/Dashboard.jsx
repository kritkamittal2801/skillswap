import { useContext, useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard, ListChecks, PlusCircle, User, LogOut,
  DollarSign, Star, BookOpen, Award, CheckCircle2, ArrowRight,
} from "lucide-react";
import api from "../services/api";
import { AuthContext } from "../contexts/AuthContext.jsx";
import { COLORS, BG, TEXT_MUTED, CARD_SHADOW } from "../theme/theme";
import { Logo } from "../theme/Logo";
import { Card, ButtonPrimary } from "../theme/ui";

const NAV_ITEMS = [
  { label: "Dashboard", to: "/dashboard", icon: LayoutDashboard },
  { label: "Browse requests", to: "/requests", icon: ListChecks },
  { label: "Post a doubt", to: "/requests/create", icon: PlusCircle },
  { label: "Profile", to: "/profile", icon: User },
];

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
};

const timeAgo = (dateString) => {
  const diffMs = Date.now() - new Date(dateString).getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
};

const STATUS_STYLE = {
  scheduled: { label: "Scheduled", color: COLORS.blue },
  active: { label: "Live", color: COLORS.red },
  completed: { label: "Completed", color: COLORS.green },
  cancelled: { label: "Cancelled", color: "rgba(255,255,255,0.35)" },
};

/** Rank tier, computed from real sessionsCompleted — a label over real data, not a fabricated stat. */
const getRank = (sessionsCompleted) => {
  if (sessionsCompleted >= 25) return { label: "Top Helper", color: COLORS.gold };
  if (sessionsCompleted >= 10) return { label: "Trusted Helper", color: COLORS.green };
  if (sessionsCompleted >= 3) return { label: "Rising Helper", color: COLORS.blue };
  return { label: "Newcomer", color: "rgba(255,255,255,0.5)" };
};

/** Simple, honest donut: earned vs spent, no fabricated trend data. */
function CoinsDonut({ earned, spent }) {
  const total = earned + spent;
  const earnedPct = total > 0 ? earned / total : 0.5;
  const circumference = 2 * Math.PI * 40;
  const earnedLength = circumference * earnedPct;

  return (
    <div className="flex items-center gap-6">
      <svg width="100" height="100" viewBox="0 0 100 100" className="-rotate-90 shrink-0">
        <circle cx="50" cy="50" r="40" fill="none" stroke="#1A1010" strokeWidth="12" />
        <circle
          cx="50" cy="50" r="40" fill="none"
          stroke={COLORS.green} strokeWidth="12"
          strokeDasharray={`${earnedLength} ${circumference}`}
          strokeLinecap="round"
        />
      </svg>
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full" style={{ background: COLORS.green }} />
          <span className="text-sm text-white/60">Earned</span>
          <span className="font-display font-medium ml-1" style={{ color: COLORS.green }}>{earned}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full" style={{ background: COLORS.red }} />
          <span className="text-sm text-white/60">Spent</span>
          <span className="font-display font-medium ml-1" style={{ color: COLORS.red }}>{spent}</span>
        </div>
      </div>
    </div>
  );
}

const Dashboard = () => {
  const { logout, user } = useContext(AuthContext);
  const location = useLocation();
  const [dashboard, setDashboard] = useState(null);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await api.get("/dashboard", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setDashboard(response.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchDashboard();
  }, []);

  if (!dashboard) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: BG, color: "#ECE8E1", fontFamily: "Inter, sans-serif" }}
      >
        <p className="font-display text-xl">Loading dashboard...</p>
      </div>
    );
  }

  const s = dashboard.stats;
  const rank = getRank(s.sessionsCompleted);

  return (
    <div className="min-h-screen flex" style={{ background: BG, color: "#ECE8E1", fontFamily: "Inter, sans-serif" }}>
      <style>{`
        .font-display { font-family: 'Fraunces', serif; }
        .font-mono { font-family: 'JetBrains Mono', monospace; }
        .dash-hero { background: radial-gradient(120% 100% at 15% 0%, #241531 0%, #170F1F 45%, #0C0808 85%); }
        .dash-glow-red { background: radial-gradient(circle, rgba(194,80,78,0.28), transparent 70%); filter: blur(20px); }
        .dash-glow-gold { background: radial-gradient(circle, rgba(217,164,65,0.16), transparent 70%); filter: blur(20px); }
      `}</style>

      {/* ---------------------------------------------------------- SIDEBAR */}
      <aside className="hidden lg:flex w-64 shrink-0 flex-col justify-between border-r border-white/[0.06] p-6">
        <div>
          <Link to="/home"><Logo size={28} textSize="text-lg" /></Link>

          <div className="mt-10 text-xs font-mono uppercase tracking-wider text-white/30 mb-3">Main menu</div>
          <nav className="space-y-1">
            {NAV_ITEMS.map((item) => {
              const active = location.pathname === item.to;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors"
                  style={active
                    ? { background: "rgba(194,80,78,0.1)", color: COLORS.red, borderLeft: `2px solid ${COLORS.red}` }
                    : { color: "rgba(255,255,255,0.55)" }}
                >
                  <item.icon className="w-4 h-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="flex items-center gap-3 pt-6 border-t border-white/[0.06]">
          <div className="w-9 h-9 rounded-full border flex items-center justify-center font-display italic text-sm shrink-0"
            style={{ borderColor: `${COLORS.red}66`, color: COLORS.red }}>
            {dashboard.username?.[0]?.toUpperCase() || "?"}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium truncate">{dashboard.username}</div>
          </div>
          <button onClick={logout} className="text-white/30 hover:text-white/70 transition-colors" title="Log out">
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </aside>

      {/* ---------------------------------------------------------- MAIN */}
      <main className="flex-1 max-w-6xl">
        {/* -------------------------------------------------------- HERO BANNER */}
        <div className="relative overflow-hidden dash-hero px-6 lg:px-10 py-10">
          <div className="absolute -top-20 left-[10%] w-72 h-72 rounded-full dash-glow-red pointer-events-none" />
          <div className="absolute bottom-0 right-[5%] w-80 h-80 rounded-full dash-glow-gold pointer-events-none" />

          <div className="relative flex items-center justify-between flex-wrap gap-6">
            <div className="flex items-center gap-5">
              <div
                className="w-16 h-16 rounded-full border-2 flex items-center justify-center font-display italic text-2xl shrink-0"
                style={{ borderColor: rank.color, color: rank.color, boxShadow: `0 0 24px ${rank.color}40` }}
              >
                {dashboard.username?.[0]?.toUpperCase() || "?"}
              </div>
              <div>
                <div className="flex items-center gap-3 flex-wrap">
                  <h1 className="font-display font-medium text-3xl text-[#F2EDE9]">
                    {getGreeting()}, <span style={{ color: COLORS.red }}>{dashboard.username}</span>
                  </h1>
                  <span
                    className="text-xs font-mono uppercase tracking-wider px-2.5 py-1 rounded-full"
                    style={{ color: rank.color, background: `${rank.color}22` }}
                  >
                    {rank.label}
                  </span>
                </div>
                <p className="text-sm mt-1.5" style={{ color: "rgba(255,255,255,0.5)" }}>
                  Here's what's happening with your SkillSwap activity.
                </p>
              </div>
            </div>
            <Link to="/requests/create">
              <ButtonPrimary className="py-3.5 px-6">
                <PlusCircle className="w-4 h-4" /> Post a doubt
              </ButtonPrimary>
            </Link>
          </div>
        </div>

        <div className="px-6 lg:px-10 py-8">
        <div className="grid lg:grid-cols-3 gap-5 mb-5">
          {/* -------------------------------------------------------- COINS OVERVIEW */}
          <Card className="lg:col-span-2 p-7" style={{ boxShadow: CARD_SHADOW }}>
            <div className="flex items-start justify-between mb-6 flex-wrap gap-3">
              <div>
                <div className="text-xs font-mono uppercase tracking-wider mb-2" style={{ color: TEXT_MUTED }}>
                  SkillPoints balance
                </div>
                <div className="font-display font-medium text-4xl" style={{ color: COLORS.gold }}>
                  {s.coins}
                </div>
              </div>
              <div className="flex items-center gap-2 rounded-full border border-white/10 px-3 py-1.5">
                <Star className="w-3.5 h-3.5" style={{ fill: COLORS.gold, color: COLORS.gold }} />
                <span className="text-sm font-medium">{s.averageRating}</span>
                <span className="text-xs" style={{ color: TEXT_MUTED }}>({s.totalReviews} reviews)</span>
              </div>
            </div>

            <div className="pt-6 border-t border-white/[0.06]">
              <div className="text-xs font-mono uppercase tracking-wider mb-4" style={{ color: TEXT_MUTED }}>
                Earned vs. spent
              </div>
              <CoinsDonut earned={s.coinsEarned} spent={s.coinsSpent} />
            </div>
          </Card>

          {/* -------------------------------------------------------- ACTIVITY SNAPSHOT */}
          <Card className="p-0 overflow-hidden" style={{ boxShadow: CARD_SHADOW }}>
            <div className="px-6 py-4 border-b border-white/[0.06] text-xs font-mono uppercase tracking-wider" style={{ color: TEXT_MUTED }}>
              Activity snapshot
            </div>
            <div className="divide-y divide-white/[0.06]">
              {[
                [BookOpen, "Skills learned", s.skillsLearned, COLORS.blue],
                [Award, "Skills taught", s.skillsTaught, COLORS.green],
                [CheckCircle2, "Sessions completed", s.sessionsCompleted, COLORS.gold],
              ].map(([Icon, label, value, color], i) => (
                <div key={i} className="flex items-center gap-3 px-6 py-4">
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0" style={{ background: color }}>
                    <Icon className="w-4 h-4" style={{ color: "#150C0C" }} />
                  </div>
                  <span className="text-sm flex-1" style={{ color: "rgba(255,255,255,0.7)" }}>{label}</span>
                  <span className="font-display font-medium text-lg">{value}</span>
                </div>
              ))}
              <div className="flex items-center gap-3 px-6 py-4">
                <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0" style={{ background: COLORS.blue }}>
                  <DollarSign className="w-4 h-4" style={{ color: "#150C0C" }} />
                </div>
                <span className="text-sm flex-1" style={{ color: "rgba(255,255,255,0.7)" }}>Paid / barter</span>
                <span className="font-display font-medium text-sm">{s.paidSessions} / {s.barterSessions}</span>
              </div>
            </div>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-5">
          {/* -------------------------------------------------------- RECENT SESSIONS */}
          <Card className="lg:col-span-2 p-0 overflow-hidden" style={{ boxShadow: CARD_SHADOW }}>
            <div className="px-6 py-4 border-b border-white/[0.06] flex items-center justify-between">
              <span className="text-xs font-mono uppercase tracking-wider" style={{ color: TEXT_MUTED }}>Recent sessions</span>
              <Link to="/sessions" className="text-xs flex items-center gap-1" style={{ color: COLORS.blue }}>
                View all <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
            {dashboard.recentSessions.length === 0 ? (
              <div className="px-6 py-8 text-sm text-center" style={{ color: TEXT_MUTED }}>
                No sessions yet — browse requests to get started.
              </div>
            ) : (
              <div className="divide-y divide-white/[0.06]">
                {dashboard.recentSessions.map((session) => {
                  const status = STATUS_STYLE[session.status] || STATUS_STYLE.scheduled;
                  const wasHelper = session.helper === user?._id;
                  const role = wasHelper ? "Taught" : "Learned";
                  const roleColor = wasHelper ? COLORS.green : COLORS.blue;

                  return (
                    <Link key={session._id} to={`/sessions/${session._id}`} className="block px-6 py-4 hover:bg-white/[0.02] transition-colors">
                      <div className="flex items-center justify-between gap-3 mb-1.5">
                        <span className="text-sm font-medium">{session.request?.subject || "Untitled session"}</span>
                        <span className="text-xs font-mono px-2 py-0.5 rounded-full shrink-0" style={{ color: status.color, background: `${status.color}1A` }}>
                          {status.label}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-xs flex-wrap" style={{ color: TEXT_MUTED }}>
                        <span style={{ color: roleColor }}>{role}</span>
                        <span>·</span>
                        <span className="capitalize">{session.request?.mode || "—"}</span>
                        {session.coinAmount > 0 && (
                          <>
                            <span>·</span>
                            <span style={{ color: COLORS.gold }}>{session.coinAmount} coins</span>
                          </>
                        )}
                        <span>·</span>
                        <span>{timeAgo(session.createdAt)}</span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </Card>

          {/* -------------------------------------------------------- SKILL TAGS */}
          <Card className="p-6" style={{ boxShadow: CARD_SHADOW }}>
            <div className="text-xs font-mono uppercase tracking-wider mb-3" style={{ color: COLORS.green }}>
              What I can teach
            </div>
            <div className="flex flex-wrap gap-2 mb-5">
              {s.skillsCanTeach.length === 0 ? (
                <span className="text-sm" style={{ color: TEXT_MUTED }}>None added yet.</span>
              ) : (
                s.skillsCanTeach.map((skill) => (
                  <span key={skill} className="text-xs border border-white/10 bg-white/[0.03] rounded-full px-3 py-1">
                    {skill}
                  </span>
                ))
              )}
            </div>

            <div className="text-xs font-mono uppercase tracking-wider mb-3" style={{ color: COLORS.blue }}>
              Most exchanged
            </div>
            <div className="flex flex-wrap gap-2">
              {s.mostExchangedSkills.length === 0 ? (
                <span className="text-sm" style={{ color: TEXT_MUTED }}>No sessions yet.</span>
              ) : (
                s.mostExchangedSkills.map((skill) => (
                  <span key={skill} className="text-xs border border-white/10 bg-white/[0.03] rounded-full px-3 py-1">
                    {skill}
                  </span>
                ))
              )}
            </div>
          </Card>
        </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
