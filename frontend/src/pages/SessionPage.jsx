import { useEffect, useState, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { Video, Radio, Star, CheckCircle2, Circle, PartyPopper, Clock } from "lucide-react";
import api from "../services/api";
import socket from "../socket";
import { COLORS, CARD_SHADOW, CARD_SHADOW_LG } from "../theme/theme";
import { Logo } from "../theme/Logo";
import { Card, ButtonPrimary } from "../theme/ui";

const MIN_SESSION_SECONDS = 5 * 60;

const SessionPage = () => {
  const { id } = useParams();
  const currentUser = JSON.parse(localStorage.getItem("user"));

  const [session, setSession] = useState(null);
  const [seconds, setSeconds] = useState(0);
  const [error, setError] = useState("");
  const [stars, setStars] = useState(0);
  const [hoverStars, setHoverStars] = useState(0);
  const [review, setReview] = useState("");
  const [ratingSubmitted, setRatingSubmitted] = useState(false);
  const [alreadyRated, setAlreadyRated] = useState(false);
  const [joining, setJoining] = useState(false);

  const recheckTimeout = useRef(null);

  const fetchSession = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await api.get(`/sessions/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      setSession(response.data.session);
    } catch (error) {
      console.log(error);
    }
  };

  const checkRating = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await api.get(`/ratings/check/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      setAlreadyRated(response.data.alreadyRated);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchSession();
    checkRating();
  }, [id]);

  useEffect(() => {
    socket.on("sessionUpdated", (updatedSession) => {
      if (updatedSession._id === id) setSession(updatedSession);
    });
    return () => socket.off("sessionUpdated");
  }, [id]);

  useEffect(() => {
    socket.on("sessionStarted", (data) => {
      if (data.sessionId === id) {
        setSession((prev) => ({ ...prev, status: "active", startedAt: data.startedAt }));
      }
    });
    return () => socket.off("sessionStarted");
  }, [id]);

  const handleStart = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await api.put(
        `/sessions/start/${id}`, {}, { headers: { Authorization: `Bearer ${token}` } },
      );
      setSession(response.data.session);
    } catch (error) {
      console.log(error.message);
    }
  };

  /**
   * Join meeting: marks the caller as joined server-side (the new
   * "confirm" action), opens the real meeting link, then re-checks.
   * If both have joined but the 5-minute floor hasn't passed yet, a
   * timeout is scheduled to silently re-call join once it has, so the
   * session still completes automatically without another click.
   */
  const handleJoin = async () => {
    try {
      setJoining(true);
      const token = localStorage.getItem("token");
      const response = await api.put(
        `/sessions/join/${id}`, {}, { headers: { Authorization: `Bearer ${token}` } },
      );

      window.open(session.meetLink, "_blank", "noopener,noreferrer");
      setSession(response.data.session);

      if (response.data.bothJoined && !response.data.minimumElapsed) {
        clearTimeout(recheckTimeout.current);
        recheckTimeout.current = setTimeout(async () => {
          try {
            const retryToken = localStorage.getItem("token");
            const retry = await api.put(
              `/sessions/join/${id}`, {}, { headers: { Authorization: `Bearer ${retryToken}` } },
            );
            setSession(retry.data.session);
          } catch (err) {
            console.log(err);
          }
        }, response.data.secondsRemaining * 1000 + 500);
      }
    } catch (error) {
      console.log(error);
      setError(error.response?.data?.message || "Something went wrong");
    } finally {
      setJoining(false);
    }
  };

  useEffect(() => {
    return () => clearTimeout(recheckTimeout.current);
  }, []);

  // Timer derived from the server's real startedAt, not a local counter --
  // both users always see the same elapsed time, even if one joins late.
  useEffect(() => {
    if (session?.status === "active" && session.startedAt) {
      const update = () => {
        const elapsed = Math.floor((Date.now() - new Date(session.startedAt).getTime()) / 1000);
        setSeconds(Math.max(0, elapsed));
      };
      update();
      const interval = setInterval(update, 1000);
      return () => clearInterval(interval);
    }
  }, [session?.status, session?.startedAt]);

  const formatTime = (totalSeconds) => {
    const hrs = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    return `${hrs.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const submitRating = async () => {
    try {
      const token = localStorage.getItem("token");
      await api.post(`/ratings/${id}`, { stars, review }, { headers: { Authorization: `Bearer ${token}` } });
      setRatingSubmitted(true);
      setAlreadyRated(true);
    } catch (error) {
      console.log(error);
    }
  };

  const sharedStyle = { fontFamily: "Inter, sans-serif" };
  const sharedCSS = `
    .font-display { font-family: 'Fraunces', serif; }
    .font-mono { font-family: 'JetBrains Mono', monospace; }
    .session-backdrop { background: radial-gradient(120% 90% at 50% 0%, #241531 0%, #170F1F 40%, #0C0808 80%); }
    .session-glow-red { background: radial-gradient(circle, rgba(194,80,78,0.28), transparent 70%); filter: blur(24px); }
    .session-glow-gold { background: radial-gradient(circle, rgba(217,164,65,0.2), transparent 70%); filter: blur(24px); }
    .session-glow-green { background: radial-gradient(circle, rgba(111,168,138,0.22), transparent 70%); filter: blur(24px); }
    @keyframes pulseDot { 0%,100% { opacity: 1; } 50% { opacity: 0.4; } }
    .pulse-dot { animation: pulseDot 1.6s ease-in-out infinite; }
  `;

  if (!session) {
    return (
      <div className="min-h-screen relative overflow-hidden session-backdrop flex items-center justify-center" style={{ ...sharedStyle, color: "#ECE8E1" }}>
        <style>{sharedCSS}</style>
        <p className="font-display text-xl">Loading...</p>
      </div>
    );
  }

  const isPaid = session.request?.mode === "paid";
  const modeColor = isPaid ? COLORS.gold : COLORS.blue;
  const myJoined = session.learner?._id === currentUser._id ? session.learnerJoined : session.helperJoined;
  const bothJoined = session.learnerJoined && session.helperJoined;
  const secondsUntilEligible = session.startedAt
    ? Math.max(0, MIN_SESSION_SECONDS - Math.floor((Date.now() - new Date(session.startedAt).getTime()) / 1000))
    : MIN_SESSION_SECONDS;

  /* ---------------------------------------------------------------- COMPLETED VIEW */
  if (session?.status === "completed") {
    const canRate =
      session.request?.mode === "barter" ||
      (session.request?.mode === "paid" && session.learner?._id === currentUser._id);

    return (
      <div className="min-h-screen relative overflow-hidden session-backdrop" style={{ ...sharedStyle, color: "#ECE8E1" }}>
        <style>{sharedCSS}</style>
        <div className="absolute -top-24 left-[15%] w-96 h-96 rounded-full session-glow-green pointer-events-none" />
        <div className="absolute bottom-0 right-[10%] w-[28rem] h-[28rem] rounded-full session-glow-gold pointer-events-none" />

        <Link to="/home" className="fixed top-8 left-8 z-20"><Logo size={28} textSize="text-lg" /></Link>

        <div className="relative z-10 max-w-lg mx-auto px-6 py-24">
          <Card className="p-9 text-center mb-5 relative overflow-hidden" style={{ boxShadow: CARD_SHADOW_LG, borderTop: `4px solid ${COLORS.green}` }}>
            {[COLORS.green, COLORS.gold, COLORS.blue, COLORS.red].map((c, i) => (
              <span
                key={i}
                className="absolute w-2 h-2 rounded-full"
                style={{
                  background: c,
                  top: `${10 + i * 8}%`,
                  left: i % 2 === 0 ? `${8 + i * 3}%` : "auto",
                  right: i % 2 !== 0 ? `${8 + i * 3}%` : "auto",
                  opacity: 0.6,
                }}
              />
            ))}
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5"
              style={{ background: COLORS.green, boxShadow: `0 0 32px ${COLORS.green}66` }}
            >
              <PartyPopper className="w-7 h-7" style={{ color: "#150C0C" }} />
            </div>
            <h2 className="font-display font-medium text-3xl mb-2">Session completed!</h2>
            <p className="text-sm" style={{ color: "rgba(255,255,255,0.5)" }}>
              {session.request?.mode === "paid" ? "Coins transferred successfully." : "Barter session completed successfully."}
            </p>
          </Card>

          {canRate && !ratingSubmitted && !alreadyRated && (
            <Card className="p-8" style={{ boxShadow: CARD_SHADOW }}>
              <h3 className="font-display font-medium text-xl mb-1 text-center">How was it?</h3>
              <p className="text-xs text-center mb-5" style={{ color: "rgba(255,255,255,0.4)" }}>
                Your rating helps others find good help faster.
              </p>

              <div className="flex justify-center gap-2 mb-6">
                {[1, 2, 3, 4, 5].map((star) => {
                  const active = star <= (hoverStars || stars);
                  return (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setStars(star)}
                      onMouseEnter={() => setHoverStars(star)}
                      onMouseLeave={() => setHoverStars(0)}
                      className="transition-transform hover:scale-125"
                    >
                      <Star
                        className="w-10 h-10"
                        style={{
                          fill: active ? COLORS.gold : "transparent",
                          color: active ? COLORS.gold : "rgba(255,255,255,0.25)",
                          filter: active ? `drop-shadow(0 0 8px ${COLORS.gold}88)` : "none",
                        }}
                      />
                    </button>
                  );
                })}
              </div>

              <textarea
                placeholder="Write a review..."
                value={review}
                onChange={(e) => setReview(e.target.value)}
                rows="3"
                className="w-full bg-[#1A1010] border border-white/10 focus:border-white/25 rounded-lg p-3 text-sm text-white placeholder:text-white/25 outline-none transition-colors resize-none mb-5"
              />

              <ButtonPrimary onClick={submitRating} disabled={stars === 0} className="w-full justify-center py-3.5">
                Submit rating
              </ButtonPrimary>
            </Card>
          )}

          {ratingSubmitted && (
            <Card className="p-7 text-center" style={{ boxShadow: CARD_SHADOW }}>
              <div className="flex justify-center gap-1 mb-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="w-5 h-5" style={{ fill: COLORS.gold, color: COLORS.gold }} />
                ))}
              </div>
              <p className="font-display text-lg" style={{ color: COLORS.gold }}>Thank you for your review!</p>
            </Card>
          )}

          {alreadyRated && !ratingSubmitted && (
            <Card className="p-6 text-center" style={{ boxShadow: CARD_SHADOW }}>
              <p className="text-sm" style={{ color: "rgba(255,255,255,0.45)" }}>You have already submitted a rating.</p>
            </Card>
          )}
        </div>
      </div>
    );
  }

  /* ---------------------------------------------------------------- ACTIVE / SCHEDULED VIEW */
  return (
    <div className="min-h-screen relative overflow-hidden session-backdrop" style={{ ...sharedStyle, color: "#ECE8E1" }}>
      <style>{sharedCSS}</style>
      <div className="absolute -top-24 left-[15%] w-96 h-96 rounded-full session-glow-red pointer-events-none" />
      <div className="absolute bottom-0 right-[10%] w-[28rem] h-[28rem] rounded-full session-glow-gold pointer-events-none" />

      <Link to="/home" className="fixed top-8 left-8 z-20"><Logo size={28} textSize="text-lg" /></Link>

      <div className="relative z-10 max-w-2xl mx-auto px-6 py-24">
        {/* -------------------------------------------------------- SESSION TICKET */}
        <Card
          className="p-8 mb-5 relative"
          style={{ boxShadow: CARD_SHADOW_LG, borderTop: `4px solid ${session.status === "active" ? COLORS.red : "rgba(255,255,255,0.15)"}` }}
        >
          <div className="flex items-center justify-between gap-3 mb-6 flex-wrap">
            <span className="text-xs font-mono" style={{ color: "rgba(255,255,255,0.35)" }}>
              SESSION #{session._id?.slice(-6).toUpperCase()}
            </span>
            <div className="flex items-center gap-2">
              <span
                className="text-xs font-mono uppercase tracking-wider px-2.5 py-1 rounded-full"
                style={{ color: modeColor, background: `${modeColor}22` }}
              >
                {session.request?.mode}
              </span>
              <span
                className="flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider px-2.5 py-1 rounded-full"
                style={session.status === "active"
                  ? { color: COLORS.red, background: `${COLORS.red}22` }
                  : { color: COLORS.blue, background: `${COLORS.blue}22` }}
              >
                {session.status === "active" && <Radio className="w-3 h-3 pulse-dot" />}
                {session.status === "active" ? "Live" : "Scheduled"}
              </span>
            </div>
          </div>

          <h1 className="font-display font-medium text-2xl text-center mb-8">
            {session.request?.subject || "Session"}
          </h1>

          {/* -------------------------------------------------------- GLOWING TIMER */}
          <div className="text-center mb-8">
            <div
              className="font-mono text-6xl font-medium tracking-wider inline-block"
              style={{
                color: session.status === "active" ? COLORS.red : "rgba(255,255,255,0.3)",
                textShadow: session.status === "active" ? `0 0 30px ${COLORS.red}66` : "none",
              }}
            >
              {formatTime(seconds)}
            </div>
          </div>

          {/* -------------------------------------------------------- PARTICIPANTS */}
          <div className="grid grid-cols-2 gap-4">
            {[
              { role: "Learner", person: session.learner, joined: session.learnerJoined, color: COLORS.blue },
              { role: "Helper", person: session.helper, joined: session.helperJoined, color: COLORS.green },
            ].map((p) => (
              <div key={p.role} className="rounded-lg p-4" style={{ background: "#1A1010" }}>
                <div className="text-[10px] font-mono uppercase tracking-wider mb-2.5" style={{ color: p.color }}>
                  {p.role}
                </div>
                <div className="flex items-center gap-2.5">
                  <div
                    className="w-9 h-9 rounded-full border flex items-center justify-center font-display italic text-sm shrink-0"
                    style={{ borderColor: `${p.color}66`, color: p.color }}
                  >
                    {p.person?.username?.[0]?.toUpperCase() || "?"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium truncate">{p.person?.username}</div>
                    <div className="flex items-center gap-1.5 text-xs mt-0.5" style={{ color: p.joined ? COLORS.green : "rgba(255,255,255,0.4)" }}>
                      {p.joined ? <CheckCircle2 className="w-3 h-3" /> : <Circle className="w-3 h-3" />}
                      {p.joined ? "Joined" : "Not joined yet"}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {bothJoined && session.status === "active" && secondsUntilEligible > 0 && (
          <div className="flex items-center justify-center gap-2 text-sm text-center mb-5 py-3 rounded-lg" style={{ background: `${COLORS.gold}15`, color: COLORS.gold }}>
            <Clock className="w-4 h-4" />
            Both joined — wrapping up automatically in about {Math.ceil(secondsUntilEligible / 60)} min
          </div>
        )}

        {!myJoined && session.status === "active" && (
          <div className="text-sm text-center mb-5 py-3 rounded-lg" style={{ background: `${COLORS.blue}15`, color: COLORS.blue }}>
            Join the meeting when you're ready to start.
          </div>
        )}

        {error && (
          <div className="text-sm p-3 rounded-lg mb-5" style={{ background: `${COLORS.red}1A`, color: COLORS.red }}>
            {error}
          </div>
        )}

        {/* -------------------------------------------------------- ACTIONS */}
        <div className="space-y-3">
          {session.status === "scheduled" ? (
            <button
              onClick={handleStart}
              className="w-full py-4 rounded-xl text-sm font-medium border transition-colors hover:bg-white/[0.03]"
              style={{ color: COLORS.blue, borderColor: `${COLORS.blue}66` }}
            >
              Start session
            </button>
          ) : (
            <ButtonPrimary onClick={handleJoin} disabled={joining} className="w-full justify-center py-4 text-base">
              <Video className="w-4 h-4" /> {joining ? "Joining..." : myJoined ? "Rejoin meeting" : "Join meeting"}
            </ButtonPrimary>
          )}
        </div>
      </div>
    </div>
  );
};

export default SessionPage;
