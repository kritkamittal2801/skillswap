import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Bell } from "lucide-react";
import { COLORS } from "../theme/theme";
import api from "../services/api";
import NotificationPanel from "./NotificationPanel";

const NotificationBell = ({ notifications, setNotifications }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const navigate = useNavigate();

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleNotificationClick = async (notification) => {
    // Mark as read (not deleted) so it stays visible, just dimmed, and
    // the unread badge count drops by one.
    if (!notification.isRead) {
      try {
        const token = localStorage.getItem("token");
        await api.put(`/notifications/${notification._id}/read`, {}, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setNotifications((prev) =>
          prev.map((n) => (n._id === notification._id ? { ...n, isRead: true } : n))
        );
      } catch (error) {
        console.log(error);
      }
    }

    setOpen(false);

    if (notification.type === "accepted" && notification.relatedSession) {
      navigate(`/sessions/${notification.relatedSession}`);
    } else if (notification.type === "match" && notification.relatedRequest) {
      navigate(`/requests/${notification.relatedRequest}`);
    }
  };

  return (
    <div ref={ref} className="fixed top-5 right-5 z-50">
      <button
        onClick={() => setOpen(!open)}
        className="relative w-11 h-11 rounded-full flex items-center justify-center transition-colors"
        style={{ background: "#221414", boxShadow: "0 2px 6px rgba(0,0,0,0.5), 0 12px 28px rgba(0,0,0,0.5)" }}
      >
        <Bell className="w-5 h-5" style={{ color: "#ECE8E1" }} />
        {unreadCount > 0 && (
          <span
            className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full flex items-center justify-center text-[10px] font-bold"
            style={{ background: COLORS.red, color: "#fff" }}
          >
            {unreadCount}
          </span>
        )}
      </button>

      {open && (
        <NotificationPanel
          notifications={notifications}
          onNotificationClick={handleNotificationClick}
        />
      )}
    </div>
  );
};

export default NotificationBell;
