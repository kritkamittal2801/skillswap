import { Bell } from "lucide-react";
import { TEXT_MUTED, CARD_SHADOW } from "../theme/theme";
import NotificationCard from "./NotificationCard";

const NotificationPanel = ({ notifications }) => {
  return (
    <div
      className="absolute top-12 right-0 w-80 rounded-xl overflow-hidden"
      style={{ background: "#221414", boxShadow: CARD_SHADOW, fontFamily: "Inter, sans-serif" }}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="px-4 py-3 border-b border-white/[0.06]">
        <span className="text-xs font-mono uppercase tracking-wider" style={{ color: TEXT_MUTED }}>
          Notifications
        </span>
      </div>

      {notifications.length === 0 ? (
        <div className="px-4 py-8 text-center">
          <Bell className="w-5 h-5 mx-auto mb-2" style={{ color: TEXT_MUTED }} />
          <p className="text-sm" style={{ color: TEXT_MUTED }}>No notifications yet.</p>
        </div>
      ) : (
        <div className="max-h-80 overflow-y-auto">
          {notifications.map((notification) => (
            <NotificationCard key={notification._id} notification={notification} />
          ))}
        </div>
      )}
    </div>
  );
};

export default NotificationPanel;
