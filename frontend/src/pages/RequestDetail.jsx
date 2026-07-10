import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Coins, Users, Mail, Star, ArrowLeft, CheckCircle2 } from "lucide-react";
import api from "../services/api.js";
import { COLORS, TEXT_MUTED, CARD_SHADOW } from "../theme/theme";
import { Logo } from "../theme/Logo";
import { Card, ButtonPrimary } from "../theme/ui";

const formatLastSeen = (lastSeen) => {
  if (!lastSeen) return "Offline";

  const diff = Date.now() - new Date(lastSeen);
  const mins = Math.floor(diff / 60000);

  if (mins < 1) return "last seen just now";
  if (mins < 60) return `Active ${mins} min ago`;

  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `Active ${hrs} hr ago`;

  const days = Math.floor(hrs / 24);
  if (days < 7) return `Active ${days} day ago`;

  const weeks = Math.floor(days / 7);
  if (weeks < 4) return `Active ${weeks} week ago`;

  const months = Math.floor(days / 30);
  return `Active ${months} month ago`;
};

const RequestDetail = ({ onlineUsers }) => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [accepting, setAccepting] = useState(false);

  const handleAccept = async () => {
    try {
      setAccepting(true);
      const token = localStorage.getItem("token");

      const response = await api.post(
        `/sessions/accept/${id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } },
      );

      navigate(`/sessions/${response.data.session._id}`);
    } catch (error) {
      console.log(error);
      setAccepting(false);
    }
  };

  useEffect(() => {
    const fetchRequest = async () => {
      try {
        const response = await api.get(`/requests/${id}`);
        setRequest(response.data.request);
      } catch (error) {
        setError("Request not found");
      } finally {
        setLoading(false);
      }
    };

    fetchRequest();
  }, [id, onlineUsers]);

  if (loading) {
    return (
      <div className="min-h-screen page-backdrop flex items-center justify-center" style={{ color: "#ECE8E1", fontFamily: "Inter, sans-serif" }}>
        <style>{`.page-backdrop { background: radial-gradient(120% 90% at 50% 0%, #241531 0%, #170F1F 40%, #0C0808 80%); }`}</style>
        <p className="font-display text-xl">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen page-backdrop flex items-center justify-center" style={{ color: "#ECE8E1", fontFamily: "Inter, sans-serif" }}>
        <style>{`.page-backdrop { background: radial-gradient(120% 90% at 50% 0%, #241531 0%, #170F1F 40%, #0C0808 80%); }`}</style>
        <p className="font-display text-xl" style={{ color: COLORS.red }}>{error}</p>
      </div>
    );
  }

  const isOnline = onlineUsers.includes(request.requester?._id);
  const isPaid = request.mode === "paid";
  const modeColor = isPaid ? COLORS.gold : COLORS.blue;
  const alreadyAccepted = request.status === "accepted";

  return (
    <div className="min-h-screen relative overflow-hidden page-backdrop" style={{ color: "#ECE8E1", fontFamily: "Inter, sans-serif" }}>
      <style>{`
        .font-display { font-family: 'Fraunces', serif; }
        .font-mono { font-family: 'JetBrains Mono', monospace; }
        .page-backdrop { background: radial-gradient(120% 90% at 50% 0%, #241531 0%, #170F1F 40%, #0C0808 80%); }
        .page-glow-red { background: radial-gradient(circle, rgba(194,80,78,0.22), transparent 70%); filter: blur(24px); }
        .page-glow-gold { background: radial-gradient(circle, rgba(217,164,65,0.16), transparent 70%); filter: blur(24px); }
      `}</style>

      <div className="absolute -top-24 left-[10%] w-96 h-96 rounded-full page-glow-red pointer-events-none" />
      <div className="absolute bottom-0 right-[5%] w-[28rem] h-[28rem] rounded-full page-glow-gold pointer-events-none" />

      <Link to="/home" className="fixed top-8 left-8 z-20"><Logo size={28} textSize="text-lg" /></Link>

      <div className="relative z-10 max-w-2xl mx-auto px-6 pt-24 pb-12">
        <Link to="/requests" className="inline-flex items-center gap-1.5 text-sm mb-8" style={{ color: TEXT_MUTED }}>
          <ArrowLeft className="w-4 h-4" /> Back to requests
        </Link>

        {/* -------------------------------------------------------- HEADER */}
        <div className="flex items-start justify-between gap-4 mb-6">
          <h1 className="font-display font-medium text-3xl">{request.subject}</h1>
          <span
            className="text-xs font-mono uppercase tracking-wider px-3 py-1.5 rounded-full shrink-0"
            style={{ color: modeColor, background: `${modeColor}22` }}
          >
            {request.mode}
          </span>
        </div>

        {/* -------------------------------------------------------- REQUESTER PROFILE */}
        <Card className="p-6 mb-5" style={{ boxShadow: CARD_SHADOW }}>
          <div className="flex items-center gap-4">
            <div className="relative shrink-0">
              <div
                className="w-12 h-12 rounded-full border-2 flex items-center justify-center font-display italic text-lg"
                style={{ borderColor: `${COLORS.red}66`, color: COLORS.red }}
              >
                {request.requester?.username?.[0]?.toUpperCase() || "?"}
              </div>
              <span
                className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2"
                style={{ background: isOnline ? COLORS.green : "rgba(255,255,255,0.2)", borderColor: "#221414" }}
              />
            </div>

            <div className="flex-1 min-w-0">
              <div className="font-medium">{request.requester?.username}</div>
              <div className="text-xs mt-0.5" style={{ color: isOnline ? COLORS.green : TEXT_MUTED }}>
                {isOnline ? "Active now" : formatLastSeen(request.requester?.lastSeen)}
              </div>
            </div>

            {request.requester?.rating > 0 && (
              <div className="flex items-center gap-1.5 text-sm shrink-0">
                <Star className="w-3.5 h-3.5" style={{ fill: COLORS.gold, color: COLORS.gold }} />
                <span style={{ color: COLORS.gold }}>{request.requester.rating.toFixed(1)}</span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 mt-4 pt-4 border-t border-white/[0.06] text-xs" style={{ color: TEXT_MUTED }}>
            <Mail className="w-3.5 h-3.5" />
            {request.requester?.email}
          </div>

          {request.requester?.skillsOffered?.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-4">
              {request.requester.skillsOffered.map((skill) => (
                <span key={skill} className="text-xs border border-white/10 bg-white/[0.03] rounded-full px-2.5 py-1">
                  {skill}
                </span>
              ))}
            </div>
          )}
        </Card>

        {/* -------------------------------------------------------- DESCRIPTION */}
        <Card className="p-6 mb-5" style={{ boxShadow: CARD_SHADOW }}>
          <div className="text-xs font-mono uppercase tracking-wider mb-3" style={{ color: TEXT_MUTED }}>
            The doubt
          </div>
          <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.75)" }}>
            {request.description}
          </p>
        </Card>

        {/* -------------------------------------------------------- PAYMENT / BARTER */}
        {isPaid ? (
          <Card className="p-6 mb-5" style={{ boxShadow: CARD_SHADOW }}>
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider mb-3" style={{ color: COLORS.gold }}>
              <Coins className="w-3.5 h-3.5" /> Payment
            </div>
            <div className="font-display font-medium text-2xl" style={{ color: COLORS.gold }}>
              {request.coinAmount} coins
            </div>
          </Card>
        ) : (
          <Card className="p-6 mb-5" style={{ boxShadow: CARD_SHADOW }}>
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider mb-3" style={{ color: COLORS.blue }}>
              <Users className="w-3.5 h-3.5" /> Barter offer
            </div>
            <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.75)" }}>
              {request.barterOffer}
            </p>
          </Card>
        )}

        {/* -------------------------------------------------------- ACTION */}
        {alreadyAccepted ? (
          <div
            className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl text-sm font-medium"
            style={{ background: "#1A1010", color: "rgba(255,255,255,0.4)" }}
          >
            <CheckCircle2 className="w-4 h-4" /> Already accepted
          </div>
        ) : (
          <ButtonPrimary onClick={handleAccept} disabled={accepting} className="w-full justify-center py-3.5">
            {accepting ? "Accepting..." : "Accept request"}
          </ButtonPrimary>
        )}
      </div>
    </div>
  );
};

export default RequestDetail;
