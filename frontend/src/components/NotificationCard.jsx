import { COLORS, TEXT_MUTED } from "../theme/theme";

const NotificationCard = ({ notification }) => {
  return (
    <div className="px-4 py-3 border-b border-white/[0.06] last:border-b-0">
      <p className="text-sm" style={{ color: "rgba(255,255,255,0.8)" }}>
        {notification.message}
      </p>
      <p className="text-xs mt-1" style={{ color: TEXT_MUTED }}>
        {new Date(notification.createdAt).toLocaleString()}
      </p>
    </div>
  );
};

export default NotificationCard;
