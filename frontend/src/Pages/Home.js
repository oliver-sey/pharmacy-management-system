import React from 'react';
import { useNavigate } from 'react-router-dom';
import "../Styles/Home.css";
import logo from '../assets/FishbowlLogo.png';  // Adjust the path to match where your logo is stored


const HomePage = () => {
    const navigate = useNavigate();

    const handleLogInClick = () => {
        navigate('/Login');
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
                </div>
            </header>
        </div>
    );
}

export default HomePage;