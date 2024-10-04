import React, { useState } from "react";
import "../Styles/Login.css"; // import the specific stylesheet for this page;
import { useNavigate } from "react-router-dom";
import "../Styles/Login.css";

function Login() {
	// username is actually an email
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");

  const [emailError, setEmailError] = useState("");
	const [passwordError, setPasswordError] = useState("");
	const [error, setError] = useState("");
	const [loading, setLoading] = useState("");
  const [role, setRole] = useState('');

  const [maxAttempts] = useState(5); // Max attempts before account lock
	// the message to show to the user (either their attempts left, or that they're locked out)
	const [attemptsMessage, setAttemptsMessage] = useState("");
	const [showAttemptsMessage, setShowAttemptsMessage] = useState(false);

	// whether or not this account is locked out because of too many incorrect attempts
	const [isLockedOut, setIsLockedOut] = useState(false);


	const navigate = useNavigate();

	const validateForm = () => {
    // Reset errors
		setEmailError("");
		setPasswordError("");
		setError(null);

		// Basic email validation
		if (!username.includes("@")) {
			setEmailError("Please enter a valid email.");
			return false;
		}

		// Password validation
		if (password.length < 6) {
			setPasswordError("Password must be at least 6 characters long.");
			return false;
		}

		setError("");
		return true;
	};


  // Function to get failed attempts for a specific email
	const getFailedAttempts = (email) => {
		const storedAttempts = sessionStorage.getItem(email);
		return storedAttempts ? parseInt(storedAttempts) : 0;
	};

	// update the value of the number of failed login attempts for a specific email
	const updateFailedAttempts = (email) => {
		const currentAttempts = getFailedAttempts(email);
		const newAttempts = currentAttempts + 1;
		sessionStorage.setItem(email, newAttempts.toString());
		return newAttempts;
	};

	// get rid of the stored number of failed login attempts for a specific email
	// this is for if the user logs in successfully, and the next time they try to login we want them to have 5 fresh attempts
	const resetFailedAttempts = (email) => {
		sessionStorage.removeItem(email);
	};


  const handleIncorrectAttempt = (username) => {
		// increment the number of failed attempts for this email (username)
		updateFailedAttempts(username);

		updateMessageAndLockedOut(username);
	};

	const updateMessageAndLockedOut = (newEmail) => {
		// reset the value of isLockedOut and showAttemptsMessage
		setIsLockedOut(false);
		setShowAttemptsMessage(false);

		let failedAttempts = getFailedAttempts(newEmail);

		// no failed attempts on this email yet
		if (failedAttempts === 0) {
			// do nothing more
		}
		// at least 1 failed attempt, but they're not locked out yet
		else if (failedAttempts < maxAttempts) {
			// don't lock them out but show the message
			setAttemptsMessage(
				"You have " +
					(maxAttempts - failedAttempts) +
					" incorrect attempts left before your account gets locked."
			);

			setShowAttemptsMessage(true);
		}
		// too many failed attempts - lock them out
		else {
			// give them a pop-up, show the message, and lock them out
			alert(
				"Your account has been locked. Please contact your pharmacy manager."
			);
			setIsLockedOut(true);
			setAttemptsMessage(
				"Your account has been locked. Please contact your pharmacy manager."
			);
			setShowAttemptsMessage(true);
		}
	};


	const handleSubmit = async (event) => {
		event.preventDefault();

    // ensures form is filled
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
        // store response token when response is received
        const data = await response.json();

        // If login is successful, clear failed attempts for this email address
				resetFailedAttempts(username);

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
          setRole(userData.role)

          //redirects user to homepage for their role
          //more can be added as needed
          if (userData.role === 'manager') {
            navigate('../managerhome', {replace: true})
          } else if (userData.role === 'pharmacist') {
            navigate('../pharmacisthome', {replace: true})
          } else {
            navigate('../protected', {replace: true})
          }
      }
       
      } else {
        const errorData = await response.json();
        setError(errorData.detail || 'Authentication failed!');

        handleIncorrectAttempt(username);
      }

      } catch (error) {
        setLoading(false);
        setError('An error occurred. Please try again later.');
      }
    }
  

  return(
    <div className="login-container">
			<h1>Welcome to the Pharmacy Management System</h1>

			<form className="login-box" onSubmit={handleSubmit}>
				<div className="form-group">
					<label>Email:</label>
					<input
						type="email"
						value={username}
						onChange={(e) => {
							const newEmail = e.target.value;
							setUsername(newEmail);

							// update isLockedOut and the attempts message to the user for this new email
							updateMessageAndLockedOut(newEmail);
						}}
						className={emailError ? "error-input" : ""}
					/>
					{emailError && (
						<span className="error-message">{emailError}</span>
					)}
				</div>

				<div className="form-group">
					<label>Password:</label>
					<input
						type="password"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						className={passwordError ? "error-input" : ""}
					/>
					{passwordError && (
						<span className="error-message">{passwordError}</span>
					)}
				</div>

				<div>
					<button type="submit" disabled={loading || isLockedOut}>
						{loading ? "Logging in..." : "Login"}
					</button>
					{error && <p className="error-message">{error}</p>}
				</div>

				<p className="password-help">
					Forgot your password? Please contact your pharmacy manager.
				</p>

				{/* add the error-text class when the user is locked out */}
				{showAttemptsMessage && (
					<p
						className={isLockedOut ? "error-text" : ""}
						id="attempts-message"
					>
						{attemptsMessage}
					</p>
				)}
			</form>
		</div>
  )
}

export default Login;
