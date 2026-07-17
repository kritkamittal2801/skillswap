import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import api from "../services/api.js";
import { AuthContext } from "../contexts/AuthContext.jsx";
import { COLORS, TEXT_MUTED, CARD_SHADOW } from "../theme/theme.js";
import { Logo } from "../theme/Logo.jsx";
import { Card } from "../theme/ui.jsx";

const STATUS_STYLE = {
  scheduled: { label: "Scheduled", color: COLORS.blue },
  active: { label: "Live", color: COLORS.red },
  completed: { label: "Completed", color: COLORS.green },
  cancelled: { label: "Cancelled", color: "rgba(255,255,255,0.35)" },
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

const MySessions = () => {
  const { user } = useContext(AuthContext);
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await api.get("/sessions", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSessions(response.data.sessions);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchSessions();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen page-backdrop flex items-center justify-center" style={{ color: "#ECE8E1", fontFamily: "Inter, sans-serif" }}>
        <style>{`.page-backdrop { background: radial-gradient(120% 90% at 50% 0%, #241531 0%, #170F1F 40%, #0C0808 80%); } .font-display { font-family: 'Fraunces', serif; }`}</style>
        <p className="font-display text-xl">Loading sessions...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden page-backdrop" style={{ color: "#ECE8E1", fontFamily: "Inter, sans-serif" }}>
      <style>{`
        .font-display { font-family: 'Fraunces', serif; }
        .font-mono { font-family: 'JetBrains Mono', monospace; }
        .page-backdrop { background: radial-gradient(120% 90% at 50% 0%, #241531 0%, #170F1F 40%, #0C0808 80%); }
        .page-glow-red { background: radial-gradient(circle, rgba(194,80,78,0.2), transparent 70%); filter: blur(24px); }
        .page-glow-gold { background: radial-gradient(circle, rgba(217,164,65,0.18), transparent 70%); filter: blur(24px); }
      `}</style>

      <div className="absolute -top-24 left-[10%] w-96 h-96 rounded-full page-glow-red pointer-events-none" />
      <div className="absolute bottom-0 right-[10%] w-[28rem] h-[28rem] rounded-full page-glow-gold pointer-events-none" />

      <Link to="/home" className="fixed top-8 left-8 z-20"><Logo size={28} textSize="text-lg" /></Link>

      <div className="relative z-10 max-w-2xl mx-auto px-6 pt-24 pb-16">
        <Link to="/dashboard" className="inline-flex items-center gap-1.5 text-sm mb-8" style={{ color: TEXT_MUTED }}>
          <ArrowLeft className="w-4 h-4" /> Back to dashboard
        </Link>

        <h1 className="font-display font-medium text-3xl mb-1">All sessions</h1>
        <p className="text-sm mb-8" style={{ color: TEXT_MUTED }}>
          {sessions.length} {sessions.length === 1 ? "session" : "sessions"} total.
        </p>

        {sessions.length === 0 ? (
          <Card className="p-10 text-center" style={{ boxShadow: CARD_SHADOW }}>
            <p className="text-sm" style={{ color: TEXT_MUTED }}>No sessions yet.</p>
          </Card>
        ) : (
          <Card className="p-0 overflow-hidden" style={{ boxShadow: CARD_SHADOW }}>
            <div className="divide-y divide-white/[0.06]">
              {sessions.map((session) => {
                const status = STATUS_STYLE[session.status] || STATUS_STYLE.scheduled;
                const wasHelper = session.helper?._id === user?._id;
                const role = wasHelper ? "Taught" : "Learned";
                const roleColor = wasHelper ? COLORS.green : COLORS.blue;
                const otherPerson = wasHelper ? session.learner : session.helper;

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
                      <span>with {otherPerson?.username || "someone"}</span>
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
          </Card>
        )}
      </div>
    </div>
  );
};

export default MySessions;
