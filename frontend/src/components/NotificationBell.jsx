import NotificationPanel from "./NotificationPanel";
import { useState } from "react";

const NotificationBell = ({
  notifications,
}) => {
  const [open,setOpen] = useState(false);
  return (
    <div onClick={() =>
    setOpen(!open)
  }
      style={{
        position: "fixed",
        top: "20px",
        right: "20px",
        fontSize: "24px",
      }}
    >
      🔔
      
      {notifications.length > 0 && (
        <span
          style={{
            marginLeft: "5px",
            color: "red",
            fontWeight: "bold",
          }}
        >
          {notifications.length}
        </span>
      )}

      {
  open && (
    <NotificationPanel
      notifications={
        notifications
      }
    />
  )
}

    </div>
  );
};

export default NotificationBell;