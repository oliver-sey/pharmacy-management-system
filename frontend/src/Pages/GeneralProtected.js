import React, {useEffect, useState} from 'react'
import { useNavigate } from 'react-router-dom'

function GeneralProtected() {
    const navigate = useNavigate();
    
    useEffect(() => {
        const verifyToken = async () => {
            //fetches token from local storage
            const token = localStorage.getItem('token');
            
            try {
                //checks if the token isn't expired
                const response = await fetch('http://localhost:8000/verify-token/' + token);

                if (!response.ok) {
                    throw new Error('Token verification failed.');
                }
                
            //redirects user to login page if token is no longer valid
            } catch (error) {
                    localStorage.removeItem('token');
                    navigate('/');
            }
        };
        verifyToken();

    }, [navigate]);

  return (
    <div>
      This is a protected page.
    </div>
  )
}

export default GeneralProtected
