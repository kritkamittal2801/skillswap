import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Coins, Star, Plus, Tag, GraduationCap, Calendar } from "lucide-react";
import api from "../services/api";
import { COLORS, TEXT_MUTED, CARD_SHADOW } from "../theme/theme";
import { Logo } from "../theme/Logo";
import { Card, ButtonPrimary } from "../theme/ui";

const COLLEGES = ["DU", "DTU", "NSUT", "VIPS", "IITD", "IIITD"];
const YEARS = ["1st Year", "2nd Year", "3rd Year", "4th Year"];

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

const formatMemberSince = (dateString) => {
  if (!dateString) return null;
  return new Date(dateString).toLocaleDateString("en-US", { month: "long", year: "numeric" });
};

const selectClass =
  "w-full bg-[#1A1010] border border-white/10 focus:border-white/25 rounded-lg pl-10 pr-4 py-2.5 text-sm text-white outline-none transition-colors appearance-none";

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [skills, setSkills] = useState("");
  const [college, setCollege] = useState("");
  const [year, setYear] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ text: "", color: "" });

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await api.get("/users/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProfile(response.data);
      setCollege(response.data.college && response.data.college !== "Not specified" ? response.data.college : "");
      setYear(response.data.year && response.data.year !== "Not specified" ? response.data.year : "");
    } catch (error) {
      console.log(error);
    }
  };

  const saveProfile = async () => {
    try {
      setSaving(true);
      setMessage({ text: "", color: "" });
      const token = localStorage.getItem("token");

      const newSkills = skills
        .split(",")
        .map((skill) => skill.trim())
        .filter((skill) => skill !== "");

      const payload = { college, year };
      if (newSkills.length > 0) {
        payload.skillsOffered = [
          ...new Set([...(profile?.skillsOffered || []), ...newSkills]),
        ];
      }

      await api.put("/users/profile", payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setMessage({ text: "Profile updated successfully", color: COLORS.green });
      fetchProfile();
      setSkills("");
    } catch (error) {
      console.log(error);
      setMessage({ text: "Something went wrong", color: COLORS.red });
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  if (!profile) {
    return (
      <div className="min-h-screen page-backdrop flex items-center justify-center" style={{ color: "#ECE8E1", fontFamily: "Inter, sans-serif" }}>
        <style>{`.page-backdrop { background: radial-gradient(120% 90% at 50% 0%, #241531 0%, #170F1F 40%, #0C0808 80%); } .font-display { font-family: 'Fraunces', serif; }`}</style>
        <p className="font-display text-xl">Loading profile...</p>
      </div>
    );
  }

  const memberSince = formatMemberSince(profile.createdAt);

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

        {/* -------------------------------------------------------- PROFILE HERO */}
        <Card className="p-8 mb-5" style={{ boxShadow: CARD_SHADOW, borderTop: `3px solid ${COLORS.red}` }}>
          <div className="flex items-center gap-5 flex-wrap">
            <div className="relative shrink-0">
              <div
                className="w-16 h-16 rounded-full border-2 flex items-center justify-center font-display italic text-2xl"
                style={{ borderColor: `${COLORS.red}66`, color: COLORS.red }}
              >
                {profile.username?.[0]?.toUpperCase() || "?"}
              </div>
              <span
                className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full border-2"
                style={{ background: profile.isOnline ? COLORS.green : "rgba(255,255,255,0.2)", borderColor: "#221414" }}
              />
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="font-display font-medium text-2xl truncate">{profile.username}</h1>
              <p className="text-sm truncate" style={{ color: TEXT_MUTED }}>{profile.email}</p>
              <div className="flex items-center gap-3 mt-1.5 text-xs flex-wrap">
                <span style={{ color: profile.isOnline ? COLORS.green : TEXT_MUTED }}>
                  {profile.isOnline ? "Active now" : formatLastSeen(profile.lastSeen)}
                </span>
                {memberSince && (
                  <>
                    <span style={{ color: "rgba(255,255,255,0.2)" }}>·</span>
                    <span style={{ color: TEXT_MUTED }}>Member since {memberSince}</span>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-6 mt-6 pt-6 border-t border-white/[0.06]">
            <div className="flex items-center gap-2">
              <Coins className="w-4 h-4" style={{ color: COLORS.gold }} />
              <span className="font-display font-medium text-lg" style={{ color: COLORS.gold }}>{profile.coins}</span>
              <span className="text-xs" style={{ color: TEXT_MUTED }}>coins</span>
            </div>
            {profile.rating > 0 && (
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4" style={{ fill: COLORS.gold, color: COLORS.gold }} />
                <span className="font-display font-medium text-lg">{profile.rating.toFixed(1)}</span>
                {profile.ratingCount > 0 && (
                  <span className="text-xs" style={{ color: TEXT_MUTED }}>({profile.ratingCount} reviews)</span>
                )}
              </div>
            )}
          </div>
        </Card>

        {/* -------------------------------------------------------- ACCOUNT DETAILS */}
        <Card className="p-8 mb-5" style={{ boxShadow: CARD_SHADOW }}>
          <div className="text-xs font-mono uppercase tracking-wider mb-4" style={{ color: COLORS.blue }}>
            Account details
          </div>
          <div className="grid grid-cols-2 gap-4">
            <label className="block">
              <span className="block text-sm mb-1.5" style={{ color: TEXT_MUTED }}>College</span>
              <div className="relative">
                <GraduationCap className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 pointer-events-none" />
                <select value={college} onChange={(e) => setCollege(e.target.value)} className={selectClass}>
                  <option value="" disabled>Select</option>
                  {COLLEGES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </label>
            <label className="block">
              <span className="block text-sm mb-1.5" style={{ color: TEXT_MUTED }}>Year</span>
              <div className="relative">
                <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 pointer-events-none" />
                <select value={year} onChange={(e) => setYear(e.target.value)} className={selectClass}>
                  <option value="" disabled>Select</option>
                  {YEARS.map((y) => <option key={y} value={y}>{y}</option>)}
                </select>
              </div>
            </label>
          </div>
        </Card>

        {/* -------------------------------------------------------- SKILLS */}
        <Card className="p-8 mb-5" style={{ boxShadow: CARD_SHADOW }}>
          <div className="text-xs font-mono uppercase tracking-wider mb-4" style={{ color: COLORS.green }}>
            Skills I can teach
          </div>

          {profile.skillsOffered?.length > 0 ? (
            <div className="flex flex-wrap gap-2 mb-6">
              {profile.skillsOffered.map((skill) => (
                <span key={skill} className="text-sm border border-white/10 bg-white/[0.03] rounded-full px-3.5 py-1.5">
                  {skill}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-sm mb-6" style={{ color: TEXT_MUTED }}>No skills added yet.</p>
          )}

          <div className="pt-6 border-t border-white/[0.06]">
            <label className="block text-sm mb-1.5" style={{ color: TEXT_MUTED }}>Add new skills</label>
            <div className="relative mb-4">
              <Tag className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 pointer-events-none" />
              <input
                type="text"
                placeholder="React, Node.js, MongoDB"
                value={skills}
                onChange={(e) => setSkills(e.target.value)}
                className="w-full bg-[#1A1010] border border-white/10 focus:border-white/25 rounded-lg pl-11 pr-4 py-3 text-sm text-white placeholder:text-white/25 outline-none transition-colors"
              />
            </div>

            {message.text && (
              <p className="text-sm mb-4" style={{ color: message.color }}>{message.text}</p>
            )}

            <ButtonPrimary onClick={saveProfile} disabled={saving} className="py-3">
              <Plus className="w-4 h-4" /> {saving ? "Saving..." : "Save profile"}
            </ButtonPrimary>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Profile;
