import React, {useEffect, useState} from 'react'
import CheckUserType from '../Functions/CheckUserType';
import { useNavigate } from 'react-router-dom';

function PharmacistHome() {
    const navigate = useNavigate();

    //Change this variable based on what type of user the page is for
    const role = ["pharmacist"]

    useEffect(() => {
        CheckUserType(role, navigate);

    }, [role, navigate]);


  return (
    <div>
      <p>pharmacist home</p>
    </div>
  )
}

export default PharmacistHome
