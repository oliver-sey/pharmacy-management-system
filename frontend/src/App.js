import logo from './logo.svg';
import './Styles/App.css';
import Header from './Components/Header';
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
          <Route path="/" element={<Login/>}/>
          <Route path="/pharmacisthome" element={<PharmacistHome/>}/>
          <Route path='/managerhome' element={<ManagerHome/>}/>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
