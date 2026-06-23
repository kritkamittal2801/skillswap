import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../services/api";
import socket from "../socket";

const SessionPage = () => {
  const { id } = useParams();
  const currentUser = JSON.parse(localStorage.getItem("user"));

  const [session, setSession] = useState(null);

  const [seconds, setSeconds] = useState(0);

  const [completed, setCompleted] = useState(false);

  const [error, setError] = useState("");

  const [stars, setStars] = useState(0);

  const [review, setReview] = useState("");

  const [ratingSubmitted, setRatingSubmitted] = useState(false);

  const [alreadyRated, setAlreadyRated] = useState(false);

  const handleStart = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await api.put(
        `/sessions/start/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      console.log(response.data.session);
      setSession(response.data.session);
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    socket.on("sessionUpdated", (updatedSession) => {
      if (updatedSession._id === id) {
        setSession(updatedSession);
      }
    });

    return () => {
      socket.off("sessionUpdated");
    };
  }, [id]);

  useEffect(() => {
    socket.on("sessionStarted", (data) => {
      if (data.sessionId === id) {
        setSession((prev) => ({
          ...prev,
          status: "active",
        }));
      }
    });

    return () => {
      socket.off("sessionStarted");
    };
  }, [id]);

  useEffect(() => {
    let interval;

    if (session?.status === "active") {
      interval = setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);
    }

    return () => {
      clearInterval(interval);
    };
  }, [session]);

  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600);

    const mins = Math.floor((seconds % 3600) / 60);

    const secs = seconds % 60;

    return `${hrs.toString().padStart(2, "0")}
    :
    ${mins.toString().padStart(2, "0")}
    :
    ${secs.toString().padStart(2, "0")}`;
  };

  const confirmSession = async () => {
    try {
      const token = localStorage.getItem("token");

      await api.put(
        `/sessions/${id}/confirm`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      fetchSession();
      console.log(session);
    } catch (error) {
      console.log("CONFIRM SESSION ERROR:");
      console.log(error);

      setError(error.response?.data?.message || "Something went wrong");
    }
  };

  const fetchSession = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await api.get(`/sessions/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setSession(response.data.session);
    } catch (error) {
      console.log(error);
    }
  };
  const checkRating = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await api.get(`/ratings/check/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setAlreadyRated(response.data.alreadyRated);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchSession();

    checkRating();
  }, [id]);

  if (!session) {
    return <h2>Loading...</h2>;
  }

  const handleComplete = async () => {
    try {
      const token = localStorage.getItem("token");

      await api.put(
        `/sessions/complete/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setCompleted(true);
    } catch (error) {
      setError(error.response?.data?.message || "Something went wrong");
    }
  };

  const submitRating = async () => {
    try {
      const token = localStorage.getItem("token");

      await api.post(
        `/ratings/${id}`,
        {
          stars,
          review,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setRatingSubmitted(true);
      setAlreadyRated(true);
    } catch (error) {
      console.log(error);
    }
  };

  if (session?.status === "completed") {
    const canRate =
      session.request?.mode === "barter" ||
      (session.request?.mode === "paid" &&
        session.learner?._id === currentUser._id);
    return (
      <div>
        <h2>Session Completed</h2>
        {session.request.mode === "paid" ? (
          <p>Coins transferred successfully.</p>
        ) : (
          <p>Barter session completed successfully.</p>
        )}

        {canRate && !ratingSubmitted && !alreadyRated && (
          <>
            <h3>Rate Your Experience</h3>

            <div>
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setStars(star)}
                  style={{
                    fontSize: "20px",
                    border: "none",
                    background: "transparent",
                    cursor: "pointer",
                    color: star <= stars ? "#FFD700" : "#ccc",
                  }}
                >
                  {star <= stars ? "★" : "☆"}
                </button>
              ))}
            </div>

            <textarea
              placeholder="Write a review..."
              value={review}
              onChange={(e) => setReview(e.target.value)}
            />

            <br />

            <button onClick={submitRating}>Submit Rating</button>
          </>
        )}
        {ratingSubmitted && <h3>Thank you for your review!</h3>}

        {alreadyRated && !ratingSubmitted && (
          <p>You have already submitted a rating.</p>
        )}
      </div>
    );
  }
  return (
    <div>
      <h2>Session Started</h2>

      <p>
        Learner:
        {session.learner.username}
      </p>

      <p>
        Helper:
        {session.helper.username}
      </p>

      <p>
        Status:
        {session.status}
      </p>

      <p>
        Learner Confirmed:
        {session.learnerConfirmed ? "YES" : "NO"}
      </p>

      <p>
        Helper Confirmed:
        {session.helperConfirmed ? "YES" : "NO"}
      </p>

      {session.learner?._id === currentUser._id && !session.helperConfirmed && (
        <p>Waiting for helper confirmation...</p>
      )}

      {session.helper?._id === currentUser._id && !session.learnerConfirmed && (
        <p>Waiting for learner confirmation...</p>
      )}

      <p>
        Timer:
        {formatTime(seconds)}
      </p>

      <a href={session.meetLink} target="_blank" rel="noreferrer">
        Join Meeting
      </a>
      <br />
      <br />
      {session.status === "scheduled" && (
        <button onClick={handleStart}>Start Session</button>
      )}

      {error && <p style={{ color: "red" }}>{error}</p>}

      {session.status === "active" &&
        !(session.learner?._id === currentUser._id
          ? session.learnerConfirmed
          : session.helperConfirmed) && (
          <button onClick={confirmSession}>Mark Session Done</button>
        )}
    </div>
  );
};

export default SessionPage;
