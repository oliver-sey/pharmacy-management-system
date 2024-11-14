import React from 'react';
import { useNavigate } from 'react-router-dom';
import "../Styles/Home.css";
import logo from '../assets/FishbowlLogo.png';  // Adjust the path to match where your logo is stored


const HomePage = () => {
    const navigate = useNavigate();

    const handleLogInClick = async () => {
        if (localStorage.getItem('token') === null) {
            navigate('/Login');
        } else {
            const token = localStorage.getItem('token')
            const userResponse = await fetch('http://localhost:8000/currentuser/me', {
                method: 'GET',
                headers: {'Authorization': 'Bearer ' + token}
      
              })

              if (!userResponse.ok) {
                if (userResponse.status === 401) {
                    navigate('/Login')
                }
              } else if (userResponse.ok) {
                const userData = await userResponse.json();
                
                //if user's role is one other than the following, they are redirected back to login
                if (userData.user_type === 'Pharmacy Manager') {
                navigate('../managerhome', {replace: true})
                } else if (userData.user_type === 'Pharmacist') {
                navigate('../pharmacisthome', {replace: true})
                } else if (userData.user_type === 'Cashier'){
                navigate('../cashierhome', {replace: true})
                } else if (userData.user_type === 'Pharmacy Technician'){
                navigate('../pharmtechhome', {replace: true})
                } else {
                navigate('../protected', {replace: true})
                }
            }
        }
        
    }

    return (
        <div className='Home'>
            <header className="header-section">
                <div className="content-container">
                    <img src={logo} alt="Fishbowl Pharmacy Logo" className="logo" />
                    <h1>FishBowl Pharmacies</h1>
                    <p>
                        At Fishbowl, we believe in making waves when it comes to your health. 
                        Whether you’re in need of something to keep you feeling shipshape or just a little boost, 
                        we’ve got you covered. Our prescriptions are always fresh, 
                        and we’re known for serving up just what the doctor ordered—no fancy drinks here, 
                        but you’ll leave feeling better than ever. Dive into a healthier you with Fishbowl, where wellness is always on tap!
                    </p>
                    
                    <button className="login-button" onClick={handleLogInClick}>
                        Login
                    </button>

                    {/* Basic Pharmacy Information */}
                    <div className="pharmacy-info">
                        <h2>Contact Information</h2>
                        <p><strong>Address:</strong> 123 Ocean Drive, Seaside City, CA 90210</p>
                        <p><strong>Owner:</strong> Mary FishBowl</p>
                        <p><strong>Phone Number:</strong> (555) 123-4567</p>
                        <p><strong>Working Hours:</strong></p>
                        <ul>
                            <li>Monday to Friday: 9:00 AM - 7:00 PM</li>
                            <li>Saturday and Sunday: 10:00 AM - 5:00 PM</li>
                        </ul>
                    </div>
                </div>
            </header>
        </div>
    );
}

export default HomePage;
