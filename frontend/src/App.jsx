import { BrowserRouter, Routes, Route , useLocation } from "react-router-dom";

import Signup from "./pages/Signup.jsx";
import Login from "./pages/Login.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Profile from "./pages/Profile.jsx";
import CreateRequest from "./pages/CreateRequest.jsx";
import RequestFeed from "./pages/RequestFeed.jsx";
import RequestDetail from "./pages/RequestDetail.jsx";
import ProtectedRoute from "./routes/ProtectedRoute.jsx";
import { useEffect, useState,useContext } from "react";
import socket from "./socket.js";
import NotificationBell from "./components/NotificationBell.jsx";
import api from "./services/api.js";
import SessionPage from "./pages/SessionPage.jsx";
import MySessions from "./pages/Mysessions.jsx";
import HomePage from "./pages/Home.jsx";
import { AuthContext } from "./contexts/AuthContext.jsx";

function App() {
  const {user}=useContext(AuthContext);
  const [notifications, setNotifications] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const location = useLocation();
const hideNotificationBellOn = ["/", "/home", "/login", "/signup"];
const showNotificationBell = !hideNotificationBellOn.includes(location.pathname);

  useEffect(() => {

    if (user) {
      socket.emit("registerUser", user._id);
    }
  }, []);

  useEffect(() => {
    socket.on("onlineUsers", (users) => {
      setOnlineUsers(users);
    });

    return () => {
      socket.off("onlineUsers");
    };
  }, []);

  const fetchNotifications = async () => {
  try {
    const token = localStorage.getItem("token");
    if (!token) return;

    const response = await api.get("/notifications", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    setNotifications(response.data.notifications);
  } catch (error) {
    console.log(error);
  }
};

useEffect(() => {
  if (user) {
    fetchNotifications();
  }
}, [user]);

useEffect(() => {
  const handleVisibilityChange = () => {
    if (document.visibilityState === "visible") {
      fetchNotifications();
    }
  };

  document.addEventListener("visibilitychange", handleVisibilityChange);
  return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
}, [user]);

  useEffect(() => {
    socket.on("newNotification", (notification) => {
      console.log("New notification:", notification);

      setNotifications((prev) => [notification, ...prev]);
    });

    return () => {
      socket.off("newNotification");
    };
  }, []);

  useEffect(() => {
  socket.on("connect", () => {
    console.log("Frontend connected:", socket.id);

    const storedUser = JSON.parse(localStorage.getItem("user"));

    if (storedUser) {
      console.log("Registering user:", storedUser._id);
      socket.emit("registerUser", storedUser._id);
      fetchNotifications();
    }
  });

  socket.on("connect_error", (error) => {
    console.log("Connection error:", error.message);
  });

  return () => {
    socket.off("connect");
    socket.off("connect_error");
  };
}, []);

  return (
    <>
      {showNotificationBell && (
  <NotificationBell notifications={notifications} setNotifications={setNotifications} />
)}

      <Routes>
        <Route path="/signup" element={<Signup />} />

        <Route path="/login" element={<Login />} />

        <Route
  path="/dashboard"
  element={
    <ProtectedRoute>
      <Dashboard onlineUsers={onlineUsers} />
    </ProtectedRoute>
  }
/>

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        <Route path="/requests/create" element={<CreateRequest />} />

        <Route path="/requests" element={<RequestFeed />} />

        <Route
          path="/requests/:id"
          element={<RequestDetail onlineUsers={onlineUsers} />}
        />

        <Route
          path="/sessions"
          element={
            <ProtectedRoute>
              <MySessions />
            </ProtectedRoute>
          }
        />

        <Route path="/sessions/:id" element={<SessionPage />} />

          <Route path="/" element={<HomePage />} />
        <Route path ="/home" element ={<HomePage />}/>
      </Routes>
    </>
  );
}

export default App;
