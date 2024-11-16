import React, { useContext } from "react";
import { NotificationContext } from "./NotificationProvider";

const Notification = ({ id, message, type }) => {
    const { dispatch } = useContext(NotificationContext);

    const handleRemove = () => {
        dispatch({ type: "REMOVE_NOTIFICATION", id });
    };

    return (
        <div className={`notification-item ${type.toLowerCase()}`}>
            <p className="notification-message">{message}</p>
            <button onClick={handleRemove}>Dismiss</button>
        </div>
    );
};

export default Notification;
