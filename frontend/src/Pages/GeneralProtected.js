import React, {useEffect, useState} from 'react'
import { useNavigate } from 'react-router-dom'
import VerifyToken from '../Functions/VerifyToken';

function GeneralProtected() {
    const navigate = useNavigate();
    
    useEffect(() => {
        
        VerifyToken(navigate);

    }, [navigate]);

  return (
    <div>
      This is a protected page. You are a {localStorage.getItem('role')}
    </div>
  )
}

export default GeneralProtected
