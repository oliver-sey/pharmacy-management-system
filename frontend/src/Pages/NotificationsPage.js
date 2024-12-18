import React, { useContext, useEffect } from "react";
import { NotificationContext } from "../Components/NotificationProvider";
import "../Styles/Notification.css";

// Clear Notifications Button Component
const ClearNotificationsButton = () => {
  const { dispatch } = useContext(NotificationContext);

  const handleClearAll = () => {
    dispatch({ type: "CLEAR_NOTIFICATIONS" });
  };

  return (
    <button onClick={handleClearAll} className="clear-notifications-button">
      Clear All Notifications
    </button>
  );
};

// Notifications Page Component
const NotificationsPage = () => {
  const { state, dispatch } = useContext(NotificationContext);

  useEffect(() => {
    // Mark all notifications as read when this page is opened
    dispatch({ type: "MARK_ALL_AS_READ" });
  }, [dispatch]);

  return (
    <div className="notifications-container">
      <h2>Notifications</h2>
      <ClearNotificationsButton /> {/* Render the clear button here */}
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
