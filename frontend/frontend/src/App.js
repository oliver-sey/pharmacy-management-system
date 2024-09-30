import React, {useState} from 'react';
import './Styles/App.css';
import GeneralProtected from './Pages/GeneralProtected';
import Login from './Pages/Login';
import ManagerHome from './Pages/ManagerHome';
import PharmacistHome from './Pages/PharmacistHome';
import {BrowserRouter as Router, Route, Routes} from "react-router-dom";


function App() {

  
  return (
    <div className="App">
      <Router>
      
        
        <p> Hello world </p>

        
        <Routes>
          <Route exact path="/protected" element={<GeneralProtected/>}/>
          <Route exact path="/" element={<Login/>}/>
        </Routes>
        
        
        
      </Router>
    </div>
  );
}

export default App;
