import { useState, useRef, useEffect } from "react";
import { Bell } from "lucide-react";
import { COLORS } from "../theme/theme";
import NotificationPanel from "./NotificationPanel";

const NotificationBell = ({ notifications }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={ref} className="fixed top-5 right-5 z-50">
      <button
        onClick={() => setOpen(!open)}
        className="relative w-11 h-11 rounded-full flex items-center justify-center transition-colors"
        style={{ background: "#221414", boxShadow: "0 2px 6px rgba(0,0,0,0.5), 0 12px 28px rgba(0,0,0,0.5)" }}
      >
        <Bell className="w-5 h-5" style={{ color: "#ECE8E1" }} />
        {notifications.length > 0 && (
          <span
            className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full flex items-center justify-center text-[10px] font-bold"
            style={{ background: COLORS.red, color: "#fff" }}
          >
            {notifications.length}
          </span>
        )}
      </button>

      {open && <NotificationPanel notifications={notifications} />}
    </div>
  );
};

export default NotificationBell;
