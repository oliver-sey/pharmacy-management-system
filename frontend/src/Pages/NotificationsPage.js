import React, { useContext, useEffect } from "react";
import { NotificationContext } from "../Components/NotificationProvider";
import "../Styles/Notification.css";

const NotificationsPage = () => {
  const { state, dispatch } = useContext(NotificationContext);

  useEffect(() => {
    // Mark all notifications as read when this page is opened
    dispatch({ type: "MARK_ALL_AS_READ" });
  }, [dispatch]);

  return (
    <div className="notifications-container">
      <h2>Notifications</h2>
      {state.length === 0 ? (
        <p>No notifications available.</p>
      ) : (
        <ul>
          {state.map((notification) => (
            <li key={notification.id}>
              <span>{notification.type}: </span>{notification.message}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default NotificationsPage;
