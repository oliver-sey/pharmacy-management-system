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
    <div className="notifications-list">
        {state.length === 0 ? (
            <p>No notifications available.</p>
        ) : (
            state.map((note) => (
                <div key={note.id} className="notification-item">
                    <p>{note.message}</p>
                </div>
            ))
        )}
    </div>
</div>
  );
};

export default NotificationsPage;
