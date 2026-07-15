import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { User, Mail, Lock, Eye, EyeOff, GraduationCap, Calendar } from "lucide-react";
import api from "../services/api";
import { COLORS, TEXT_MUTED, CARD_SHADOW } from "../theme/theme";
import { Logo } from "../theme/Logo";
import { Card, Input, ButtonPrimary } from "../theme/ui";

// Kept in sync with backend-scripts/seed.js — same colleges/years, so real
// signups and seeded data stay consistent.
const COLLEGES = ["DU", "DTU", "NSUT", "VIPS", "IITD", "IIITD"];
const YEARS = ["1st Year", "2nd Year", "3rd Year", "4th Year"];

const STEPS = [
  { n: "01", title: "Post your doubt", color: COLORS.red },
  { n: "02", title: "Get matched instantly", color: COLORS.blue },
  { n: "03", title: "Solve it live", color: COLORS.green },
  { n: "04", title: "Rate & earn SkillPoints", color: COLORS.gold },
];

const Signup = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "", email: "", password: "", college: "", year: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const response = await api.post("/auth/signup", formData);
      setSuccess(response.data.message || "Account created.");
      setTimeout(() => navigate("/login"), 1200);
    } catch (err) {
      console.log(err);
      setError(err.response?.data?.message || "Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const selectClass =
    "w-full bg-[#1A1010] border border-white/10 focus:border-white/25 rounded-lg pl-10 pr-4 py-3 text-sm text-white outline-none transition-colors appearance-none";

  return (
    <div className="min-h-screen grid lg:grid-cols-2 relative overflow-hidden auth-backdrop" style={{ fontFamily: "Inter, sans-serif" }}>
      <style>{`
        .font-display { font-family: 'Fraunces', serif; }
        .auth-backdrop { background: radial-gradient(120% 100% at 15% 0%, #241531 0%, #170F1F 45%, #0C0808 85%); }
        .auth-glow-red { background: radial-gradient(circle, rgba(194,80,78,0.28), transparent 70%); filter: blur(20px); }
        .auth-glow-gold { background: radial-gradient(circle, rgba(217,164,65,0.16), transparent 70%); filter: blur(20px); }
      `}</style>

      <div className="absolute -top-24 left-[8%] w-96 h-96 rounded-full auth-glow-red pointer-events-none" />
      <div className="absolute bottom-0 right-[10%] w-[32rem] h-[32rem] rounded-full auth-glow-gold pointer-events-none" />

      {/* ---------------------------------------------------------- LEFT: brand content */}
      <div className="hidden lg:flex relative flex-col justify-center gap-16 p-16 xl:p-24">
        <Link to="/home" className="fixed top-12 left-12 xl:top-16 xl:left-16 z-10">
          <Logo size={34} textSize="text-2xl" />
        </Link>

        <div className="relative z-10">
          <h1 className="font-display font-medium text-5xl xl:text-6xl leading-[1.1] text-[#F2EDE9] max-w-lg">
            Stuck at 1AM?<br />
            <span className="italic" style={{ color: COLORS.red, textShadow: "0 0 30px rgba(194,80,78,0.45)" }}>
              Someone's awake.
            </span>
          </h1>
          <p className="mt-5 text-lg text-white/50 max-w-md leading-relaxed">
            Sign up and your first doubt can be posted in under a minute.
          </p>
        </div>

        <div className="relative z-10 space-y-6">
          {STEPS.map((s) => (
            <div key={s.n} className="flex items-center gap-5">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center font-display text-sm font-semibold shrink-0"
                style={{ background: s.color, color: "#150C0C" }}
              >
                {s.n}
              </div>
              <span className="text-white/70 text-lg">{s.title}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ---------------------------------------------------------- RIGHT: form */}
      <div className="relative z-10 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          <Link to="/home" className="flex lg:hidden justify-center mb-6">
            <Logo size={30} textSize="text-xl" />
          </Link>

          <Card className="p-10" style={{ boxShadow: CARD_SHADOW }}>
            <h2 className="font-display font-medium text-3xl mb-2" style={{ color: "#ECE8E1" }}>Create your account</h2>
            <p className="text-base mb-8" style={{ color: TEXT_MUTED }}>
              Free — no coins needed to join.
            </p>

            <form onSubmit={handleSubmit} className="space-y-5">
              <Input
                label="Username"
                icon={User}
                placeholder="ananya_rao"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                required
                className="text-base py-3.5"
              />

              <Input
                label="Email"
                type="email"
                icon={Mail}
                placeholder="you@college.edu"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                className="text-base py-3.5"
              />

              <div className="grid grid-cols-2 gap-4">
                <label className="block">
                  <span className="block text-sm mb-1.5" style={{ color: TEXT_MUTED }}>College</span>
                  <div className="relative">
                    <GraduationCap className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 pointer-events-none" />
                    <select
                      className={selectClass}
                      value={formData.college}
                      onChange={(e) => setFormData({ ...formData, college: e.target.value })}
                      required
                    >
                      <option value="" disabled>Select</option>
                      {COLLEGES.map((c) => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                </label>

                <label className="block">
                  <span className="block text-sm mb-1.5" style={{ color: TEXT_MUTED }}>Year</span>
                  <div className="relative">
                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 pointer-events-none" />
                    <select
                      className={selectClass}
                      value={formData.year}
                      onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                      required
                    >
                      <option value="" disabled>Select</option>
                      {YEARS.map((y) => <option key={y} value={y}>{y}</option>)}
                    </select>
                  </div>
                </label>
              </div>

              <div>
                <label className="block text-sm mb-1.5" style={{ color: TEXT_MUTED }}>Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 pointer-events-none" />
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    required
                    className="w-full bg-[#1A1010] border border-white/10 focus:border-white/25 rounded-lg pl-11 pr-12 py-3.5 text-base text-white placeholder:text-white/25 outline-none transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {error && <p className="text-sm" style={{ color: COLORS.red }}>{error}</p>}
              {success && <p className="text-sm" style={{ color: COLORS.green }}>{success}</p>}

              <ButtonPrimary type="submit" className="w-full justify-center py-4 text-base" disabled={loading}>
                {loading ? "Creating account..." : "Sign up "}
              </ButtonPrimary>
            </form>

            <p className="text-sm text-center mt-8" style={{ color: TEXT_MUTED }}>
              Already have an account?{" "}
              <Link to="/login" style={{ color: COLORS.blue }}>Log in</Link>
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Signup;
