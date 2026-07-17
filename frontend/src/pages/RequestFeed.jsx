import { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import { PlusCircle, ListFilter, Search,ArrowLeft } from "lucide-react";
import api from "../services/api.js";
import RequestCard from "../components/RequestCard";
import { AuthContext } from "../contexts/AuthContext.jsx";
import { COLORS, TEXT_MUTED, CARD_SHADOW } from "../theme/theme.js";
import { Logo } from "../theme/Logo.jsx";
import { ButtonPrimary } from "../theme/ui.jsx";

const SUBJECTS = [
  "DBMS", "Operating Systems", "Computer Networks", "OOP Concepts",
  "Data Structures", "Circuit Theory", "Digital Logic", "Thermodynamics",
  "Python", "React.js", "Machine Learning", "Linear Algebra",
];

const selectClass =
  "bg-[#1A1010] border border-white/10 focus:border-white/25 rounded-lg pl-4 pr-8 py-2.5 text-sm text-white outline-none transition-colors appearance-none";

const RequestFeed = () => {
  const { user } = useContext(AuthContext);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [subjectFilter, setSubjectFilter] = useState("");
  const [modeFilter, setModeFilter] = useState("");

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await api.get("/requests");
        setRequests(response.data.requests);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  const filteredRequests = requests.filter((request) => {
    const subjectMatch = !subjectFilter || request.subject === subjectFilter;
    const modeMatch = !modeFilter || request.mode === modeFilter;
    const notOwnRequest = request.requester?._id !== user?._id;
    return subjectMatch && modeMatch && notOwnRequest;
  });

  const hasActiveFilters = subjectFilter || modeFilter;

  if (loading) {
    return (
      <div
        className="min-h-screen page-backdrop flex items-center justify-center"
        style={{ color: "#ECE8E1", fontFamily: "Inter, sans-serif" }}
      >
        <style>{`.page-backdrop { background: radial-gradient(120% 90% at 50% 0%, #241531 0%, #170F1F 40%, #0C0808 80%); }`}</style>
        <p className="font-display text-xl">Loading requests...</p>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen relative overflow-hidden page-backdrop"
      style={{ color: "#ECE8E1", fontFamily: "Inter, sans-serif" }}
    >
      <style>{`
        .font-display { font-family: 'Fraunces', serif; }
        .font-mono { font-family: 'JetBrains Mono', monospace; }
        .page-backdrop { background: radial-gradient(120% 90% at 50% 0%, #241531 0%, #170F1F 40%, #0C0808 80%); }
        .page-glow-red { background: radial-gradient(circle, rgba(194,80,78,0.22), transparent 70%); filter: blur(24px); }
        .page-glow-gold { background: radial-gradient(circle, rgba(217,164,65,0.16), transparent 70%); filter: blur(24px); }
      `}</style>

      <div className="absolute -top-24 left-[10%] w-96 h-96 rounded-full page-glow-red pointer-events-none" />
      <div className="absolute top-1/2 right-[5%] w-[28rem] h-[28rem] rounded-full page-glow-gold pointer-events-none" />

      <Link to="/home" className="fixed top-8 left-8 z-20"><Logo size={28} textSize="text-lg" /></Link>

      <div className="relative z-10 max-w-6xl mx-auto px-6 pt-24 pb-12">

        <Link to="/dashboard" className="inline-flex items-center gap-1.5 text-sm mb-6" style={{ color: TEXT_MUTED }}>
    <ArrowLeft className="w-4 h-4" /> Back to dashboard
  </Link>

        <div className="flex items-center justify-between flex-wrap gap-4 mb-8">
          <div>
            <h1 className="font-display font-medium text-3xl">Learning Requests</h1>
            <p className="text-sm mt-1" style={{ color: TEXT_MUTED }}>
              {filteredRequests.length} open {filteredRequests.length === 1 ? "request" : "requests"} right now.
            </p>
          </div>
          <Link to="/requests/create">
            <ButtonPrimary className="py-3">
              <PlusCircle className="w-4 h-4" /> Post a doubt
            </ButtonPrimary>
          </Link>
        </div>

        {/* -------------------------------------------------------- FILTERS */}
        <div className="flex flex-wrap items-center gap-3 mb-8">
          <div className="flex items-center gap-2 text-sm" style={{ color: TEXT_MUTED }}>
            <ListFilter className="w-4 h-4" /> Filter
          </div>

          <div className="relative">
            <select
              value={subjectFilter}
              onChange={(e) => setSubjectFilter(e.target.value)}
              className={selectClass}
            >
              <option value="">All subjects</option>
              {SUBJECTS.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          <div className="relative">
            <select
              value={modeFilter}
              onChange={(e) => setModeFilter(e.target.value)}
              className={selectClass}
            >
              <option value="">All modes</option>
              <option value="paid">Paid</option>
              <option value="barter">Barter</option>
            </select>
          </div>

          {hasActiveFilters && (
            <button
              onClick={() => { setSubjectFilter(""); setModeFilter(""); }}
              className="text-sm"
              style={{ color: COLORS.red }}
            >
              Clear filters
            </button>
          )}
        </div>

        {/* -------------------------------------------------------- GRID */}
        {filteredRequests.length === 0 ? (
          <div className="rounded-xl p-12 text-center" style={{ background: "#221414", boxShadow: CARD_SHADOW }}>
            <Search className="w-6 h-6 mx-auto mb-3" style={{ color: TEXT_MUTED }} />
            <p className="font-display text-lg mb-1">No requests found</p>
            <p className="text-sm" style={{ color: TEXT_MUTED }}>
              Try adjusting your filters, or{" "}
              <Link to="/requests/create" style={{ color: COLORS.blue }}>post your own doubt</Link>.
            </p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5">
            {filteredRequests.map((request) => (
              <RequestCard key={request._id} request={request} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RequestFeed;
