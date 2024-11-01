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
    const { state: notifications, dispatch } = useContext(NotificationContext); // Get notifications from context
    const [hasUnreadNotifications, setHasUnreadNotifications] = useState(false);

    useEffect(() => {
        const unread = notifications.some(notification => !notification.read);
        setHasUnreadNotifications(unread);

       
        if (location.pathname === "/notifications" && unread) {
            dispatch({ type: "MARK_ALL_AS_READ" });
        }
    }, [notifications, location.pathname, dispatch]);

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
                {token && userRole === 'Pharmacy Manager' && (
                    <>
                        <li><Link to="/managerhome">Manager Dashboard</Link></li>
                        <li><Link to="/viewofusers">View Users</Link></li>
                        <li><Link to="/viewofmedications">View Medications</Link></li>
                        <li><Link to="/viewofpatients">View Patients</Link></li>
                    </>
                )}

                {token && userRole === 'Pharmacy Technician' && (
                    <>
                         <li><Link to="/pharmtechhome">Pharmacy Technician Dashboard</Link></li>
                         <li><Link to="/viewofmedications">View Medications</Link></li>
                    </>
                )}


                {token && userRole === 'Cashier' && (
                    <>
                        <li><Link to="/cashierhome">Cashier Dashboard</Link></li>
                        <li><Link to="/viewofpatients">View Patients</Link></li>
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
