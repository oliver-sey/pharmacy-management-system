import React, {useEffect, useState} from 'react'
import { useNavigate } from 'react-router-dom'

function ManagerHome() {
  const navigate = useNavigate();
    

    useEffect(() => {
        const verifyToken = async () => {
            //retrieve token
            const token = localStorage.getItem('token');
            try {
                //verify token
                const response = await fetch('http://localhost:8000/verify-token/' + token);

                if (!response.ok) {
                    throw new Error('Token verification failed.');
                }

                //fetch current user data
                const userResponse = await fetch('http://localhost:8000/currentuser/me', {
                  method: 'GET',
                  headers: {'Authorization': 'Bearer ' + token}
        
                })
        
                if (userResponse.ok) {
                  const userData = await userResponse.json();
                  
                  //if user's role is one other than the following, they are redirected back to login
                  //TO DO: should they be redirected back to their own home page?
                  if (userData.role !== 'manager') {
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
      <p>manager home</p>
    </div>
  )
}

export default ManagerHome
