import React from 'react';
import {useNavigate} from 'react-router-dom';
import "../Styles/Login.css";

const HomePage = () =>{
    const navigate = useNavigate();

    const handleLogInClick = () =>{
        navigate('/Login');
    }
}