import React, {useEffect, useState} from 'react'
import { useNavigate } from 'react-router-dom'

function PharmacistHome() {

  const navigate = useNavigate();
    
    useEffect(() => {
        const verifyToken = async () => {
            const token = localStorage.getItem('token');
            console.log("hello world " + token)
            try {
                const response = await fetch('http://localhost:8000/verify-token/' + token);

                if (!response.ok) {
                    throw new Error('Token verification failed.');
                }

                const userResponse = await fetch('http://localhost:8000/currentuser/me', {
                  method: 'GET',
                  headers: {'Authorization': 'Bearer ' + token}
        
                })
        
                if (userResponse.ok) {
                  const userData = await userResponse.json();
                  
        
                  if (userData.role !== 'pharmacist') {
                    navigate('../', {replace: true})
                  } 
                }
                
            } catch (error) {
                    localStorage.removeItem('token');
                    navigate('/');
            }
        };
        verifyToken();

    }, [navigate]);


  return (
    <div>
      <p>pharmacist home</p>
    </div>
  )
}

export default PharmacistHome
