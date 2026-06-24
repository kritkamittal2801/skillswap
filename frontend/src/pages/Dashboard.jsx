import { useContext, useEffect, useState } from "react";

import api from "../services/api";
import { AuthContext } from "../contexts/AuthContext.jsx";

const Dashboard = () => {
  const { logout } = useContext(AuthContext);
  const [dashboard, setDashboard] = useState(null);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await api.get("/dashboard", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setDashboard(response.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchDashboard();
   
  }, []);

  if (!dashboard) {
    return <h2>Loading Dashboard...</h2>;
  }
  

  return (
    <div>
      <h1>Welcome {dashboard.username}</h1>

      <hr />

      <p>
        Coins Balance:
        {dashboard.stats.coins}
      </p>

      <p>
         Rating:
        {dashboard.stats.averageRating}({dashboard.stats.totalReviews}
        reviews)
      </p>

      <hr />

      <p>
        Skills Learned:
        {dashboard.stats.skillsLearned}
      </p>

      <p>
        Skills Taught:
        {dashboard.stats.skillsTaught}
      </p>

      <p>
        Sessions Completed:
        {dashboard.stats.sessionsCompleted}
      </p>

      <hr />

      <p>
        Coins Earned:
        {dashboard.stats.coinsEarned}
      </p>

      <p>
        Coins Spent:
        {dashboard.stats.coinsSpent}
      </p>

      <hr />

      <p>
        Paid Sessions:
        {dashboard.stats.paidSessions}
      </p>

      <p>
        Barter Sessions:
        {dashboard.stats.barterSessions}
      </p>

      <hr />

      <h3>What I Can Teach</h3>

      {dashboard.stats.skillsCanTeach.map((skill) => (
        <span key={skill}>{skill} </span>
      ))}

      <hr />

      <h3>Most Exchanged Skills</h3>

      {dashboard.stats.mostExchangedSkills.map((skill) => (
        <span key={skill}>{skill} </span>
      ))}

      <hr />

      <h3>Recent Sessions</h3>

      {dashboard.recentSessions.map((session) => (
        <div key={session._id}>{session.request?.subject}</div>
      ))}

      <button onClick={logout}>Logout</button>
    </div>
  );
};

export default Dashboard;
