import { COLORS, TEXT_MUTED } from "../theme/theme";

const NotificationCard = ({ notification, onClick }) => {
  const isUnread = !notification.isRead;

  return (
    <button
      onClick={() => onClick(notification)}
      className="w-full text-left px-4 py-3 border-b border-white/[0.06] last:border-b-0 transition-colors hover:bg-white/[0.03]"
    >
      <div className="flex items-start gap-2">
        {isUnread && (
          <span
            className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0"
            style={{ background: notification.type === "accepted" ? COLORS.green : COLORS.blue }}
          />
        )}
        <div className="flex-1 min-w-0">
          <p
            className="text-sm"
            style={{ color: isUnread ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.45)", fontWeight: isUnread ? 500 : 400 }}
          >
            {notification.message}
          </p>
          <p className="text-xs mt-1" style={{ color: TEXT_MUTED }}>
            {new Date(notification.createdAt).toLocaleString()}
          </p>
        </div>
      </div>
    </button>
  );
};

export default NotificationCard;
