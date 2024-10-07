import React, {useEffect, useState} from 'react'
import CheckUserType from '../Functions/CheckUserType';
import { useNavigate } from 'react-router-dom';

function ManagerHome() {
  const role = "manager"
  const navigate = useNavigate();

    useEffect(() => {
        CheckUserType(role, navigate);

    }, [role, navigate]);


  return (
    <div>
      <p>manager home</p>
    </div>
  )
}

export default ManagerHome
