// src/Components/Notification.js
import React from "react";
import "../Styles/Notification.css";

const Notification = ({ message, type, id, removeNotification }) => {
    const handleCloseNotification = () => {
        removeNotification(id); 
    };

    return (
        <div
            onClick={handleCloseNotification}
            className={`notification-item ${type.toLowerCase()}`}
        >
            <p>{message}</p>
        </div>
    );
};

export default Notification;
