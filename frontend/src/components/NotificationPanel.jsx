const NotificationPanel = ({
  notifications
}) => {

  return (

    <div>

      <h3>
        Notifications
      </h3>

      {notifications.map(
        (notification) => (

          <div
            key={
              notification._id
            }
          >

            <p>
              {
                notification.message
              }
            </p>

          </div>

        )
      )}

    </div>

  );
};

export default NotificationPanel;