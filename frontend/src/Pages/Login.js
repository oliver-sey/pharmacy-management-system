import React, { useState } from "react";
import "../Styles/Login.css"; // import the specific stylesheet for this page;
import { useNavigate } from "react-router-dom";
import LoginComponent from "../Components/LoginComponent";
import "../Styles/Login.css";

function Login() {
	// username is actually an email
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");
	const [loading, setLoading] = useState("");
  const [role, setRole] = useState('');

	const navigate = useNavigate();

	const validateForm = () => {
		if (!username || !password) {
			setError("Email and password are required");
			return false;
		}
		setError("");
		return true;
	};

	const handleSubmit = async (event) => {
		event.preventDefault();

    //insures form is filled
		if (!validateForm()) return;
		setLoading(true);

		const formDetails = new URLSearchParams();
		formDetails.append("username", username);
		formDetails.append("password", password);

		try {
			//checks if the username and password are in the DB and grants a token if so
			const response = await fetch("http://localhost:8000/token", {
				method: "POST",
				headers: {
					"Content-Type": "application/x-www-form-urlencoded",
				},
				body: formDetails,
			});

      setLoading(false);
      
      
      if (response.ok) {
        //store response token when response is recieved
        const data = await response.json();
        localStorage.setItem('token', data.access_token);
        console.log(localStorage.getItem('token'))

        //fetches information about current user
        const userResponse = await fetch('http://localhost:8000/currentuser/me', {
          method: 'GET',
          headers: {'Authorization': 'Bearer ' + localStorage.getItem('token')}

        })

        if (userResponse.ok) {
          //stores user info
          //TO DO: put user info in local storage?
          const userData = await userResponse.json();
          setRole(userData.user_type)

          //redirects user to homepage for their role
          //more can be added as needed
          if (userData.user_type === 'manager') {
            navigate('../managerhome', {replace: true})
          } else if (userData.user_type === 'pharmacist') {
            navigate('../pharmacisthome', {replace: true})
          } else {
            navigate('../protected', {replace: true})
          }
      }
       
      } else {
        const errorData = await response.json();
        setError(errorData.detail || 'Authentication failed!');
      }

      } catch (error) {
        setLoading(false);
        setError('An error occured. Please try again later.');
      }
    }
  

  return(
    <div className="login-wrapper">
      <h1>Please Log In</h1>
      <form onSubmit={handleSubmit}>
        <label>
          <p>Username</p>
          <input 
            type="text" 
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </label>
        <label>
          <p>Password</p>
          <input 
            type="password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
        <div>
          <button type="submit" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
          {error && <p>{error}</p>}
        </div>
      </form>
    </div>
  )
}

export default Login;
