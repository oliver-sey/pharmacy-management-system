// src/Components/Header.js
import React, { useContext, useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { NotificationContext } from './NotificationProvider'; // Import your notification context if available
import "../Styles/Notification.css";

const Header = () => {
    const navigate = useNavigate();
    const location = useLocation(); 
    const token = localStorage.getItem('token'); 
    const userRole = localStorage.getItem('role'); 
    const { state: notifications } = useContext(NotificationContext); // Get notifications from context
    const [hasUnreadNotifications, setHasUnreadNotifications] = useState(false);

    useEffect(() => {
        // Check if there are any unread notifications
        const unread = notifications && notifications.some(notification => !notification.read);
        setHasUnreadNotifications(unread);
    }, [notifications]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        navigate('/login'); 
    };

    return (
        <nav>
            <ul>
                {location.pathname !== '/' && <li><Link to="/">Home</Link></li>}

                {/* user-specific links while logged in */}
<<<<<<< HEAD
                {token && userRole === 'pharmacymanager' && (
=======
                {token && userRole === 'Pharmacy Manager' && (
>>>>>>> 87787135591a27f1fc252d7b9d8980a8b988d2c7
                    <>
                        <li><Link to="/viewofusers">View Users</Link></li>
                        <li><Link to="/managerhome">Manager Dashboard</Link></li>
                        <li><Link to="/viewofmedications">View Medications</Link></li>
                    </>
                )}

                {token && userRole === 'Pharmacist' && (
                    <>
                        <li><Link to="/viewofpatients">View Patients</Link></li>
                        <li><Link to="/pharmacisthome">Pharmacist Dashboard</Link></li>
                        <li><Link to="/viewofmedications">View Medications</Link></li>
                    </>
                )}

<<<<<<< HEAD
                {token && userRole === 'pharmacytech' && (
=======
                {token && userRole === 'Pharmacy Technician' && (
>>>>>>> 87787135591a27f1fc252d7b9d8980a8b988d2c7
                    <>
                        <li><Link to="/fill">Fill Prescription</Link></li>
                    </>
                )}

                {token && userRole === 'Cashier' && (
                    <>
                        <li><Link to="/cashierhome">Cashier Dashboard</Link></li>
                    </>
                )}

                {/* Notifications link */}
                {token && (
                    <li>
                        <Link to="/notifications">
                            Notifications
                            {hasUnreadNotifications && <span className="new-notification-indicator" />}
                        </Link>
                    </li>
                )}

                {/* logout button only when logged in */}
                {token && <li><button onClick={handleLogout}>Logout</button></li>}
            </ul>
        </nav>
    );
};

export default Header;
