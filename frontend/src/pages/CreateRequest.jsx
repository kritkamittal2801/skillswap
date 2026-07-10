import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Coins, Users, MessageSquare } from "lucide-react";
import api from "../services/api";
import { COLORS, TEXT_MUTED, CARD_SHADOW, CARD_SHADOW_LG } from "../theme/theme";
import { Logo } from "../theme/Logo";
import { Card, ButtonPrimary } from "../theme/ui";

// Kept in sync with RequestFeed.jsx, the homepage, and backend-scripts/seed.js —
// same 12 subjects everywhere, so filters and requests actually match.
const SUBJECTS = [
  "DBMS", "Operating Systems", "Computer Networks", "OOP Concepts",
  "Data Structures", "Circuit Theory", "Digital Logic", "Thermodynamics",
  "Python", "React.js", "Machine Learning", "Linear Algebra",
];

const STEPS = [
  { n: "01", title: "Post your doubt", color: COLORS.red },
  { n: "02", title: "Get matched instantly", color: COLORS.blue },
  { n: "03", title: "Solve it live", color: COLORS.green },
  { n: "04", title: "Rate & earn SkillPoints", color: COLORS.gold },
];

const selectClass =
  "w-full bg-[#1A1010] border border-white/10 focus:border-white/25 rounded-lg px-4 py-3 text-sm text-white outline-none transition-colors";

const CreateRequest = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    description: "",
    subject: "",
    mode: "paid",
    coinAmount: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [barterOffer, setBarterOffer] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!formData.description || !formData.subject || !formData.mode) {
      setError("Please fill all required fields");
      return;
    }

    if (formData.mode === "barter" && !barterOffer.trim()) {
      setError("Please describe what you can teach");
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const response = await api.post(
        "/requests",
        { ...formData, barterOffer },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      setSuccess("Request created successfully!");
      setFormData({ description: "", subject: "", mode: "paid", coinAmount: "" });
      setBarterOffer("");
      console.log(response.data);

      setTimeout(() => navigate("/requests"), 1500);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create request");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden auth-backdrop flex items-center justify-center px-6 py-16" style={{ fontFamily: "Inter, sans-serif" }}>
      <style>{`
        .font-display { font-family: 'Fraunces', serif; }
        .font-mono { font-family: 'JetBrains Mono', monospace; }
        .auth-backdrop { background: radial-gradient(120% 90% at 50% 0%, #241531 0%, #170F1F 40%, #0C0808 80%); }
        .auth-glow-red { background: radial-gradient(circle, rgba(194,80,78,0.24), transparent 70%); filter: blur(24px); }
        .auth-glow-gold { background: radial-gradient(circle, rgba(217,164,65,0.16), transparent 70%); filter: blur(24px); }
        .auth-glow-blue { background: radial-gradient(circle, rgba(123,143,194,0.16), transparent 70%); filter: blur(24px); }
      `}</style>

      <div className="absolute -top-24 left-[15%] w-96 h-96 rounded-full auth-glow-red pointer-events-none" />
      <div className="absolute top-1/3 right-[10%] w-80 h-80 rounded-full auth-glow-blue pointer-events-none" />
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[36rem] h-96 rounded-full auth-glow-gold pointer-events-none" />

      <Link to="/home" className="fixed top-8 left-8 z-20">
        <Logo size={28} textSize="text-lg" />
      </Link>

      <div className="relative z-10 w-full max-w-xl">
        <Card className="p-10" style={{ boxShadow: CARD_SHADOW_LG, borderTop: `3px solid ${formData.mode === "paid" ? COLORS.gold : COLORS.blue}` }}>
          <div className="flex flex-col items-center text-center mb-8">
            <div className="flex items-center gap-2.5 mb-3">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                style={{ background: COLORS.red }}
              >
                <MessageSquare className="w-4 h-4" style={{ color: "#150C0C" }} />
              </div>
              <h1 className="font-display font-medium text-3xl" style={{ color: "#ECE8E1" }}>
                Post your doubt
              </h1>
            </div>
            <p className="text-base max-w-sm" style={{ color: TEXT_MUTED }}>
              Say what's confusing you. Someone online right now probably already knows it.
            </p>

            <div className="grid grid-cols-4 w-full gap-1 mt-7 relative">
              <div className="absolute top-3 left-[12.5%] right-[12.5%] h-px" style={{ background: "rgba(255,255,255,0.1)" }} />
              {STEPS.map((s, i) => (
                <div key={s.n} className="relative flex flex-col items-center gap-2">
                  <span
                    className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0"
                    style={{ background: s.color, color: "#150C0C" }}
                  >
                    {i + 1}
                  </span>
                  <span className="text-[10px] leading-tight text-center" style={{ color: "rgba(255,255,255,0.4)" }}>
                    {s.title}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {error && (
            <div className="text-sm p-3 rounded-lg mb-4" style={{ background: `${COLORS.red}1A`, color: COLORS.red }}>
              {error}
            </div>
          )}

          {success && (
            <div className="text-sm p-3 rounded-lg mb-4" style={{ background: `${COLORS.green}1A`, color: COLORS.green }}>
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm mb-1.5" style={{ color: TEXT_MUTED }}>Description</label>
              <textarea
                name="description"
                rows="4"
                placeholder="Describe what help you need..."
                value={formData.description}
                onChange={handleChange}
                className="w-full bg-[#1A1010] border border-white/10 focus:border-white/25 rounded-lg p-3 text-sm text-white placeholder:text-white/25 outline-none transition-colors resize-none"
              />
            </div>

            <div>
              <label className="block text-sm mb-1.5" style={{ color: TEXT_MUTED }}>Subject</label>
              <select
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                className={selectClass}
              >
                <option value="">Select subject</option>
                {SUBJECTS.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            {/* -------------------------------------------------------- MODE TOGGLE */}
            <div>
              <label className="block text-sm mb-1.5" style={{ color: TEXT_MUTED }}>Learning mode</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, mode: "paid" })}
                  className="flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-medium border transition-colors"
                  style={formData.mode === "paid"
                    ? { background: `${COLORS.gold}22`, color: COLORS.gold, borderColor: `${COLORS.gold}66` }
                    : { color: "rgba(255,255,255,0.5)", borderColor: "rgba(255,255,255,0.1)" }}
                >
                  <Coins className="w-4 h-4" /> Paid
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, mode: "barter" })}
                  className="flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-medium border transition-colors"
                  style={formData.mode === "barter"
                    ? { background: `${COLORS.blue}22`, color: COLORS.blue, borderColor: `${COLORS.blue}66` }
                    : { color: "rgba(255,255,255,0.5)", borderColor: "rgba(255,255,255,0.1)" }}
                >
                  <Users className="w-4 h-4" /> Barter
                </button>
              </div>
            </div>

            {formData.mode === "paid" && (
              <div>
                <label className="block text-sm mb-1.5" style={{ color: TEXT_MUTED }}>Coin amount</label>
                <div className="relative">
                  <Coins className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: COLORS.gold }} />
                  <input
                    type="number"
                    name="coinAmount"
                    placeholder="Enter coins"
                    value={formData.coinAmount}
                    onChange={handleChange}
                    className="w-full bg-[#1A1010] border border-white/10 focus:border-white/25 rounded-lg pl-11 pr-4 py-3 text-sm text-white placeholder:text-white/25 outline-none transition-colors"
                  />
                </div>
              </div>
            )}

            {formData.mode === "barter" && (
              <div>
                <label className="block text-sm mb-1.5" style={{ color: TEXT_MUTED }}>
                  What can you teach in return?
                </label>
                <textarea
                  rows="4"
                  placeholder="Example: I can teach React, build frontend applications, work with hooks, state management and JavaScript."
                  value={barterOffer}
                  onChange={(e) => setBarterOffer(e.target.value)}
                  className="w-full bg-[#1A1010] border border-white/10 focus:border-white/25 rounded-lg p-3 text-sm text-white placeholder:text-white/25 outline-none transition-colors resize-none"
                />
              </div>
            )}

            <ButtonPrimary type="submit" disabled={loading} className="w-full justify-center py-3.5">
              {loading ? "Creating request..." : "Post your doubt"}
            </ButtonPrimary>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default CreateRequest;
