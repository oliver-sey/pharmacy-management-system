import React, { createContext, useReducer, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";

export const NotificationContext = createContext();

const notificationReducer = (state, action) => {
   switch (action.type) {
       case "ADD_NOTIFICATION":
           return [...state, { ...action.payload, read: false }];
       case "MARK_AS_READ":
           return state.map((notification) =>
               notification.id === action.id ? { ...notification, read: true } : notification
           );
       case "MARK_ALL_AS_READ":
           return state.map((notification) => ({ ...notification, read: true }));
       case "DELETE_READ_NOTIFICATIONS":
           return state.filter(notification => !notification.read);
       case "CLEAR_NOTIFICATIONS":
           return []; // Clears all notifications
       case "REMOVE_NOTIFICATION":
           return state.filter(notification => notification.id !== action.id); // Clears individual notification
       default:
           return state;
   }
};

const NotificationProvider = ({ children }) => {
   const [state, dispatch] = useReducer(notificationReducer, [], () => {
      const storedNotifications = localStorage.getItem("notifications");
      return storedNotifications ? JSON.parse(storedNotifications) : [];
   });

   useEffect(() => {
      localStorage.setItem("notifications", JSON.stringify(state));
   }, [state]);

   return (
      <NotificationContext.Provider value={{ state, dispatch }}>
         {children}
      </NotificationContext.Provider>
   );
};

export default NotificationProvider;
