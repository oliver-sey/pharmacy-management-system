import React, {useEffect, useState} from 'react'
import CheckUserType from '../Functions/CheckUserType';
import { useNavigate } from 'react-router-dom';

function PharmTechHome() {
    const navigate = useNavigate();

    //Change this variable based on what type of user the page is for
    const role = "pharmacy_tech"

    useEffect(() => {
        CheckUserType(role, navigate);

    }, [role, navigate]);


  return (
    <div>
      <p>pharm tech home</p>
    </div>
  )
}

export default PharmTechHome
