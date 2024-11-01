// src/App.js
import React, { useState } from 'react';
import './Styles/App.css';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import GeneralProtected from './Pages/GeneralProtected';
import Login from './Pages/Login';
import ManagerHome from './Pages/ManagerHome';
import PharmacistHome from './Pages/PharmacistHome';
import ViewOfPatients from './Pages/ViewOfPatients';
import ViewOfPrescriptions from './Pages/ViewOfPrescriptions';
import PrescriptionsToFill from './Pages/PrescriptionsToFill';
import ViewOfUsers from './Pages/ViewOfUsers';
import ViewOfMedications from './Pages/ViewOfMedications';
import ResetPassword from './Pages/ResetPassword';
import ViewOfEmployees from './Pages/ViewOfEmployees';
import PharmTechHome from './Pages/PharmTechHome';
import CashierHome from './Pages/CashierHome';
import FillPrescriptionForm from './Pages/FillPrescriptionForm';
import ViewOfPatientPrescriptions from './Pages/ViewOfPatientPrescriptions';
import HomePage from './Pages/Home';
import NotificationsPage from './Pages/NotificationsPage';
import Header from "./Components/Header"; 
import NotificationProvider from './Components/NotificationProvider';
import NotificationManager from './Components/NotificationManager'; // Import NotificationManager

function App() {
  const [userRole, setUserRole] = useState(localStorage.getItem('role'));

  const updateUserRole = (role) => {
    setUserRole(role);
    localStorage.setItem('role', role);
  };

  return (
    <div className="App">
      <NotificationProvider>
        <Router>
          <Header />
          <NotificationManager />
          <Routes>
            <Route path='/' element={<HomePage />} />
            <Route exact path='/managerhome' element={<ManagerHome />} />
            <Route exact path='/pharmacisthome' element={<PharmacistHome />} />
            <Route exact path="/protected" element={<GeneralProtected />} />
            <Route exact path='/PharmTechHome' element={<PharmTechHome />} />
            <Route exact path='/CashierHome' element={<CashierHome />} />
            <Route exact path="/Login" element={<Login updateUserRole={updateUserRole} />} />
            <Route path='/viewofpatients' element={<ViewOfPatients />} />
            <Route path='/viewofmedications' element={<ViewOfMedications />} />
            <Route path='/viewofusers' element={<ViewOfUsers />} />
            <Route path='/viewofprescriptions' element={<ViewOfPrescriptions />} />
            <Route path='/prescriptionstofill' element={<PrescriptionsToFill />} />
            <Route path='/resetpassword' element={<ResetPassword />} />
            <Route path='/viewofemployees' element={<ViewOfEmployees />} />
            <Route path='/fill' element={<FillPrescriptionForm />} />
            <Route path='/viewofpatients/:patientId/prescriptions' element={<ViewOfPatientPrescriptions />} />
            <Route path='/notifications' element={<NotificationsPage />} />
          </Routes>
        </Router>
      </NotificationProvider>
    </div>
  );
}

export default App;
