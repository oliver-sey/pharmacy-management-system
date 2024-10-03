import React from "react";
import { useNavigate } from "react-router-dom";

const Logout = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear token and redirect
    localStorage.removeItem("token");
    navigate("/", { replace: true }); //prevents user from going back
  };

  const confirmLogout = () => {
    if (window.confirm("Are you sure you want to log out?")) {
      handleLogout();
    }
  };

  return (
    <button onClick={confirmLogout}>
      Logout
    </button>
  );
};

export default Logout;