import { useEffect, useContext } from "react";
import { NotificationContext } from "./NotificationProvider";
import { v4 as uuidv4 } from "uuid";

const NotificationManager = () => {
  const { dispatch } = useContext(NotificationContext);

  useEffect(() => {
    const checkLowStock = async () => {
      try {
        const response = await fetch("http://localhost:8000/medicationlist", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        });
        if (!response.ok) throw new Error("Failed to fetch medication list");

        const medications = await response.json();
        const lowStockItems = medications.filter((med) => med.quantity < 10);

        lowStockItems.forEach((item) => {
          dispatch({
            type: "ADD_NOTIFICATION",
            payload: {
              id: uuidv4(),
              type: "Warning",
              message: `Low stock alert for ${item.name}! Only ${item.quantity} left.`,
            },
          });
        });
      } catch (error) {
        console.error("Error fetching medication list:", error);
      }
    };

    checkLowStock();
  }, [dispatch]);

  return null;
};

export default NotificationManager;
