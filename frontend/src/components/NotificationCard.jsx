const NotificationCard = ({
  notification
}) => {

  return (
    <div>

      <p>
        {notification.message}
      </p>

      <small>
        {
          new Date(
            notification.createdAt
          ).toLocaleString()
        }
      </small>

    </div>
  );
};