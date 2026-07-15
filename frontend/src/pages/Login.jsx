import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, Star } from "lucide-react";
import { AuthContext } from "../contexts/AuthContext.jsx";
import api from "../services/api";
import { COLORS, TEXT_MUTED, CARD_SHADOW, CARD_SHADOW_LG } from "../theme/theme";
import { Logo } from "../theme/Logo";
import { Card, Input, ButtonPrimary } from "../theme/ui";
import { useLocation} from "react-router-dom";

const Login = () => {
  const location = useLocation();
const navigate = useNavigate();
const from = location.state?.from || "/dashboard";
  
  const { login } = useContext(AuthContext);

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await api.post("/auth/login", formData);
      login(response.data.accessToken, response.data.user);
      navigate(from);
    } catch (err) {
      console.log(err);
      setError(err.response?.data?.message || "Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2 relative overflow-hidden auth-backdrop" style={{ fontFamily: "Inter, sans-serif" }}>
      <style>{`
        .font-display { font-family: 'Fraunces', serif; }
        .font-mono { font-family: 'JetBrains Mono', monospace; }
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
            Someone's <span className="italic" style={{ color: COLORS.red, textShadow: "0 0 30px rgba(194,80,78,0.45)" }}>awake.</span>
          </h1>
          <p className="mt-5 text-lg text-white/50 max-w-md leading-relaxed">
            Log back in and see who's online right now. Your next doubt — or your next student to help — is probably a few minutes away.
          </p>

        </div>

        <div
          className="relative z-10 rounded-xl p-6 max-w-md"
          style={{ background: "#221414", boxShadow: CARD_SHADOW_LG }}
        >
          <div className="flex gap-1 mb-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} className="w-4 h-4" style={{ fill: COLORS.gold, color: COLORS.gold }} />
            ))}
          </div>
          <p className="text-base text-white/70 leading-relaxed">
            "It was 2AM before my exam and someone picked up my doubt in four minutes. Didn't expect it to actually work that fast."
          </p>
          <div className="text-sm text-white/35 mt-4">Kritika Sharma · DU</div>
        </div>
      </div>

      {/* ---------------------------------------------------------- RIGHT: form */}
      <div className="relative z-10 flex items-center justify-center px-6 py-16">
        <div className="w-full max-w-md">
          <Link to="/home" className="flex lg:hidden justify-center mb-8">
            <Logo size={30} textSize="text-xl" />
          </Link>

          <Card className="p-10" style={{ boxShadow: CARD_SHADOW }}>
            <h2 className="font-display font-medium text-3xl mb-2" style={{ color: "#ECE8E1" }}>Welcome back</h2>
            <p className="text-base mb-8" style={{ color: TEXT_MUTED }}>
              Log in to pick up where you left off.
            </p>

            <form onSubmit={handleSubmit} className="space-y-5">
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

              {error && (
                <p className="text-sm" style={{ color: COLORS.red }}>{error}</p>
              )}

              <ButtonPrimary type="submit" className="w-full justify-center py-4 text-base" disabled={loading}>
                {loading ? "Logging in..." : "Log in"}
              </ButtonPrimary>
            </form>

            <p className="text-sm text-center mt-8" style={{ color: TEXT_MUTED }}>
              New here?{" "}
              <Link to="/signup" style={{ color: COLORS.blue }}>Create an account</Link>
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Login;
