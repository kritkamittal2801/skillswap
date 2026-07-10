import { BrowserRouter, Routes, Route } from "react-router-dom";

import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import CreateRequest from "./pages/CreateRequest";
import RequestFeed from "./pages/RequestFeed";
import RequestDetail from "./pages/RequestDetail";
import ProtectedRoute from "./routes/ProtectedRoute";
import { useEffect, useState } from "react";
import socket from "./socket";
import NotificationBell from "./components/NotificationBell.jsx";
import api from "./services/api.js";
import SessionPage from "./pages/SessionPage.jsx";
import HomePage from "./pages/Home.jsx";

function App() {
  const [notifications, setNotifications] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));

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

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const token = localStorage.getItem("token");

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

    fetchNotifications();
  }, []);

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

      const user = JSON.parse(localStorage.getItem("user"));

      if (user) {
        console.log("Registering user:", user._id);

        socket.emit("registerUser", user._id);
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
      <NotificationBell notifications={notifications} />

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

        <Route path="/sessions/:id" element={<SessionPage />} />

        <Route path ="/home" element ={<HomePage />}></Route>
      </Routes>
    </>
  );
}

export default App;
