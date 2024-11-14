import { useEffect, useContext } from "react";
import { NotificationContext } from "./NotificationProvider";
import { v4 as uuidv4 } from "uuid";
import { useLocation } from "react-router-dom";

const NotificationManager = () => {
  const { state: notifications, dispatch } = useContext(NotificationContext);
  const isLoggedIn = !!localStorage.getItem("token");
  const location = useLocation();

  useEffect(() => {
    let intervalId;

    const checkLowStock = async () => {
      try {
        const response = await fetch("http://localhost:8000/medicationlist", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        if (!response.ok) throw new Error("Failed to fetch medication list");

        const medications = await response.json();
        const lowStockThreshold = 10;
        const lowStockItems = medications.filter((med) => med.quantity < lowStockThreshold);

        lowStockItems.forEach((item) => {
          // Check if a notification for this item already exists
          const notificationExists = notifications.some(
            (notification) =>
              notification.message.includes(`Low stock alert for ${item.name}`) && !notification.read
          );

          if (!notificationExists) {
            dispatch({
              type: "ADD_NOTIFICATION",
              payload: {
                id: uuidv4(),
                type: "Warning",
                message: `Low stock alert for ${item.name}! Only ${item.quantity} left.`,
                timestamp: Date.now(),
              },
            });
          }
        });
      } catch (error) {
        console.error("Error fetching medication list:", error);
      }
    };

    // Set up an interval to check low stock every minute (adjust interval as needed)
    if (isLoggedIn && location.pathname !== "/notifications") {
      intervalId = setInterval(checkLowStock, 60000); // Check every 60 seconds
    }

    // Clear the interval when component unmounts or dependencies change
    return () => clearInterval(intervalId);
  }, [dispatch, isLoggedIn, location.pathname, notifications]);

  return null;
};

export default NotificationManager;
