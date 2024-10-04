import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import "../Styles/Login.css";

const LoginComponent = () => {
	// ***IMPORTANT:*** OAuth requires that the variable be called username, even though here it is an email
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");

	const [emailError, setEmailError] = useState("");
	const [passwordError, setPasswordError] = useState("");

	const [maxAttempts] = useState(5); // Max attempts before account lock
	// the message to show to the user (either their attempts left, or that they're locked out)
	const [attemptsMessage, setAttemptsMessage] = useState("");
	const [showAttemptsMessage, setShowAttemptsMessage] = useState(false);

	// whether or not this account is locked out because of too many incorrect attempts
	const [isLockedOut, setIsLockedOut] = useState(false);

	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);

	const navigate = useNavigate();

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

	// handle submitting the login form
	const handleSubmit = async (event) => {
		event.preventDefault();

		// Reset errors
		setEmailError("");
		setPasswordError("");
		setError(null);

		// Basic email validation
		if (!username.includes("@")) {
			setEmailError("Please enter a valid email.");
			return;
		}

		// Password validation
		if (password.length < 6) {
			setPasswordError("Password must be at least 6 characters long.");
			return;
		}

		setLoading(true);

		// try a request to the backend
		try {
			const response = await fetch("http://localhost:8000/login", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					email: username,
					password: password,
				}),
			});

			// stop loading now that the request is done
			setLoading(false);

			// if successful, navigate to protected routes
			if (response.ok) {
				const data = await response.json();

				// If login is successful, clear failed attempts for this email address
				resetFailedAttempts(username);

				localStorage.setItem("token", data.token);
				console.log("navigating now");
				navigate("../protected", { replace: true });
			}
			// login was unsuccessful
			else {
				const errorData = await response.json();
				setError(errorData.detail || "Authentication failed!");

				handleIncorrectAttempt(username);
			}
		} catch (error) {
			setLoading(false);
			setError("An error occurred. Please try again later.");
		}
		// end of code from Katelyn's page
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

	return (
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
	);
};

export default LoginComponent;
