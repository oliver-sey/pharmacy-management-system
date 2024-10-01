import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import "../Styles/Login.css";

const LoginComponent = () => {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");

	const [emailError, setEmailError] = useState("");
	const [passwordError, setPasswordError] = useState("");

	const [failedAttempts, setFailedAttempts] = useState(0);
	const [maxAttempts] = useState(5); // Max attempts before account lock
	const [attemptsMessage, setAttemptsMessage] = useState("");
	const [showAttemptsMessage, setShowAttemptsMessage] = useState(false);

	const [isLockedOut, setIsLockedOut] = useState(false);

	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);

	const navigate = useNavigate();

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

		// code from Katelyn's page
		const formDetails = new URLSearchParams();
		formDetails.append("username", username);
		formDetails.append("password", password);

		// TODO: get rid of this
		// wait 1 second
		// await new Promise((resolve) => setTimeout(resolve, 1000));

		// try a request to the backend
		try {
			const response = await fetch("http://localhost:8000/token", {
				method: "POST",
				headers: {
					"Content-Type": "application/x-www-form-urlencoded",
				},
				body: formDetails,
			});

			// stop loading now that the request is done
			setLoading(false);

			// if successful, navigate to protected routes
			if (response.ok) {
				const data = await response.json();
				localStorage.setItem("token", data.access_token);
				console.log("navigating now");
				navigate("../protected", { replace: true });
			}
			// login was unsuccessful
			else {
				const errorData = await response.json();
				setError(errorData.detail || "Authentication failed!");

				handleIncorrectAttempt();
			}
		} catch (error) {
			setLoading(false);
			setError("An error occurred. Please try again later.");
		}
		// end of code from Katelyn's page
	};

	const handleIncorrectAttempt = () => {
		// TODO: fix this!
		const newFailedAttempts = failedAttempts + 1;
		setFailedAttempts(newFailedAttempts);

		// reference newFailedAttempts here, since it can take a moment for the new value to get stored in failedAttempts
		setAttemptsMessage(
			"You have " + 
			(maxAttempts - newFailedAttempts) +
			" incorrect attempts left before your account gets locked."
		);
		setShowAttemptsMessage(true);

		// reference newFailedAttempts here, since it can take a moment for the new value to get stored in failedAttempts
		if (newFailedAttempts >= maxAttempts) {
			alert(
				"Your account has been locked. Please contact your pharmacy manager."
			);
			setIsLockedOut(true);
			setAttemptsMessage(
				"Your account has been locked. Please contact your pharmacy manager."
			);
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
						onChange={(e) => setUsername(e.target.value)}
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
					<button
						type="submit"
						disabled={loading || isLockedOut}
					>
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
						{/* You have {maxAttempts - failedAttempts} incorrect
						attempts left before your account gets locked. */}
						{attemptsMessage}
					</p>
				)}
			</form>
		</div>
	);
};

export default LoginComponent;
