import React from "react";
import "../Styles/Notification.css";

const Notification = ({ message, type, id, removeNotification }) => {
    return (
        <div className={`notification-item ${type.toLowerCase()}`} onClick={() => removeNotification(id)}>
            <p className="notification-message">{message}</p>
        </div>
    );
};

export default Notification;