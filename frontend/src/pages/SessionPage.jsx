import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../services/api";
import socket from "../socket";

const SessionPage = () => {

  const { id } = useParams();

  const [session, setSession] =
    useState(null);

    const [seconds,setSeconds] = useState(0);

    const [completed, setCompleted] =
  useState(false);

const [error, setError] =
  useState("");

    const handleStart = async () => {

  try {

    const token =
      localStorage.getItem("token");

    const response =
      await api.put(
        `/sessions/start/${id}`,
        {},
        {
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );
      console.log(response.data.session);
    setSession(
      response.data.session
    );

  } catch (error) {

  console.log(error.message);

  }

};

useEffect(() => {

  socket.on(
    "sessionStarted",
    (data) => {

      if (
        data.sessionId === id
      ) {

        setSession(
          prev => ({
            ...prev,
            status:
              "active"
          })
        );

      }

    }
  );

  return () => {

    socket.off(
      "sessionStarted"
    );

  };

}, [id]);

    useEffect(() => {

  let interval;

  if (
    session?.status ===
    "active"
  ) {

    interval =
      setInterval(() => {

        setSeconds(
          prev => prev + 1
        );

      }, 1000);

  }

  return () => {

    clearInterval(
      interval
    );

  };

}, [session]);

const formatTime =
(seconds) => {

  const hrs =
    Math.floor(
      seconds / 3600
    );

  const mins =
    Math.floor(
      (seconds % 3600) / 60
    );

  const secs =
    seconds % 60;

  return `${hrs
    .toString()
    .padStart(2, "0")}
    :
    ${mins
      .toString()
      .padStart(2, "0")}
    :
    ${secs
      .toString()
      .padStart(2, "0")}`;

};

  useEffect(() => {

    const fetchSession =
      async () => {

        try {

          const token =
            localStorage.getItem(
              "token"
            );

          const response =
            await api.get(
              `/sessions/${id}`,
              {
                headers: {
                  Authorization:
                    `Bearer ${token}`,
                },
              }
            );

          setSession(
            response.data.session
          );

        } catch (error) {

          console.log(error);

        }

      };

    fetchSession();

  }, [id]);

  if (!session) {
    return <h2>Loading...</h2>;
  }

  const handleComplete =
async () => {

  try {

    const token =
      localStorage.getItem(
        "token"
      );

    await api.put(
      `/sessions/complete/${id}`,
      {},
      {
        headers: {
          Authorization:
          `Bearer ${token}`
        }
      }
    );

    setCompleted(true);
  } catch (error) {

    setError(
      error.response?.data?.message ||
      "Something went wrong"
    );


  }

};

if (completed) {

  return (

    <div>

      <h2>
         Session Completed
      </h2>

      <p>
        Coins transferred successfully.
      </p>

    </div>

  );

}

  return (

    <div>

      <h2>
        Session Started
      </h2>

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
        Timer:
        {formatTime(seconds)}
        </p>


      <a
        href={session.meetLink}
        target="_blank"
        rel="noreferrer"
      >
        Join Meeting
      </a>
        <br />
        <br />
        {
  session.status === "scheduled" && (
    <button
      onClick={handleStart}
    >
      Start Session
    </button>
  )
}

{error && (
  <p style={{ color: "red" }}>
    {error}
  </p>
)}

{
  session.status ===
  "active" && (

    <button
      onClick={
        handleComplete
      }
    >
      Complete Session
    </button>

  )
}
    </div>

  );

};

export default SessionPage;