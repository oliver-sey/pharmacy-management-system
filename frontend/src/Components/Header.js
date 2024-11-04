import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const Header = () => {
    const navigate = useNavigate();
    const location = useLocation(); 
    const token = localStorage.getItem('token'); 
    const userRole = localStorage.getItem('role'); 
    console.log(userRole);

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

                {token && userRole === 'Pharmacist' && (
                    <>
                        <li><Link to="/pharmacisthome">Pharmacist Dashboard</Link></li>
                        <li><Link to="/viewofpatients">View Patients</Link></li>
                        <li><Link to="/viewofmedications">View Medications</Link></li>
                        <li><Link to="/prescriptionstofill">Fill Prescriptions</Link></li>
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

                {/* logout button only when logged in */}
                {token && <li><button onClick={handleLogout}>Logout</button></li>}
            </ul>
        </nav>
    );
};

export default Header;
