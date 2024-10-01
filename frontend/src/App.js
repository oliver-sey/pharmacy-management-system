import React, {useState} from 'react';
import './Styles/App.css';
import GeneralProtected from './Pages/GeneralProtected';
import Login from './Pages/Login';
import ManagerHome from './Pages/ManagerHome';
import PharmacistHome from './Pages/PharmacistHome';
import ViewOfPatients from './Pages/ViewOfPatients';
import ViewOfUsers from './Pages/ViewOfUsers';
import {BrowserRouter as Router, Route, Routes} from "react-router-dom";
import ViewOfMedications from './Pages/ViewOfMedications';
import ResetPassword from './Pages/ResetPassword'


function App() {

  
  return (
    <div className="App">
      <Router>
        <p> Hello world </p>
        <Routes>
          <Route exact path='/managerhome' element={<ManagerHome/>}/>
          <Route exact path='/pharmacisthome' element={<PharmacistHome/>}/>
          <Route exact path="/protected" element={<GeneralProtected/>}/>
          <Route exact path="/" element={<Login/>}/>
          <Route path='/viewofpatients' element={<ViewOfPatients/>}/>
          <Route path='/viewofmedications' element={<ViewOfMedications/>}/>
          <Route path='/viewofusers' element={<ViewOfUsers/>}/>
          <Route path='/resetpassword' element ={<ResetPassword/>}/>

        </Routes>
      </Router>
    </div>
  );
}

export default App;
