import React, {useState} from 'react';
import './Styles/App.css';
import GeneralProtected from './Pages/GeneralProtected';
import Login from './Pages/Login';
import ManagerHome from './Pages/ManagerHome';
import PharmacistHome from './Pages/PharmacistHome';
import ViewOfPatients from './Pages/ViewOfPatients';
import ViewOfPrescriptions from './Pages/ViewOfPrescriptions';
import PrescriptionsToFill from './Pages/PrescriptionsToFill';
import ViewOfUsers from './Pages/ViewOfUsers';
import {BrowserRouter as Router, Route, Routes} from "react-router-dom";
import ViewOfMedications from './Pages/ViewOfMedications';
import ResetPassword from './Pages/ResetPassword'
import ViewOfEmployees from './Pages/ViewOfEmployees';
import PharmTechHome from './Pages/PharmTechHome';
import CashierHome from './Pages/CashierHome';
import FillPrescriptionForm from './Pages/FillPrescriptionForm';
import ViewOfPatientPrescriptions from './Pages/ViewOfPatientPrescriptions';
import HomePage from './Pages/Home';
import Header from "./Components/Header"; 
function App() {

  const [userRole, setUserRole] = useState(localStorage.getItem('role')); // Store user role in state
  // Function to update the role on login
  const updateUserRole = (role) => {
      setUserRole(role);
      localStorage.setItem('role', role); 
  };
  
  return (
    <div className="App">
      <Router>
        <Header userRole={userRole} />
        <p> Hello world </p>
        <Routes>
          <Route path='/' element={<HomePage/>}/>
          <Route exact path='/managerhome' element={<ManagerHome/>}/>
          <Route exact path='/pharmacisthome' element={<PharmacistHome/>}/>
          <Route exact path="/protected" element={<GeneralProtected/>}/>
          <Route exact path='/PharmTechHome' element={<PharmTechHome/>}/>
          <Route exact path='/CashierHome' element={<CashierHome/>}/>
          <Route exact path="/Login" element={<Login updateUserRole={updateUserRole} />} />
          <Route path='/viewofpatients' element={<ViewOfPatients/>}/>
          <Route path='/viewofmedications' element={<ViewOfMedications/>}/>
          <Route path='/viewofusers' element={<ViewOfUsers/>}/>
          <Route path='/viewofprescriptions' element={<ViewOfPrescriptions/>}/>
          <Route path='/prescriptionstofill' element={<PrescriptionsToFill/>}/>
          <Route path='/resetpassword' element ={<ResetPassword/>}/>
          <Route path='/viewofemployees' element ={<ViewOfEmployees/>}/>
          <Route path='/fill' element ={<FillPrescriptionForm/>}/>
          <Route path='/viewofpatients/:patientId/prescriptions' element ={<ViewOfPatientPrescriptions/>}/>

        </Routes>
      </Router>
    </div>
  );
}

export default App;
