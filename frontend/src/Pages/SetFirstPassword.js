import React, { useState, useEffect } from "react";
// this stylesheet imports the Login.css stylesheet for almost everything
import "../Styles/SetFirstPassword.css"; 
import { useNavigate } from "react-router-dom";

import { Snackbar, Alert } from "@mui/material";

function SetFirstPassword() {
	// the email and passwords that the user enters into the form
	const [email, setEmail] = useState("");
	const [firstPassword, setFirstPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");

	// the user ID of the user for which the password is being set
	const [userID, setUserID] = useState("");

	// changed these error fields to arrays to be able to 
	// store (and display) multiple errors at once
	const [emailErrors, setEmailErrors] = useState([]);

	// it's passwords since the user has to type in the password twice to confirm
	const [passwordsErrors, setPasswordsErrors] = useState([]);
	
	const [emailValid, setEmailValid] = useState(false);
	const [passwordsValid, setPasswordsValid] = useState(false);


	// whether or not the email field, or either of the password fields, have been "touched"
	// by the user clicking into them, before
	const [emailTouched, setEmailTouched] = useState(false);
	const [eitherPasswordTouched, setEitherPasswordTouched] = useState(false);


	const [loading, setLoading] = useState("");

	// the list of email addresses in user accounts in the system
	const [userEmails, setUserEmails] = useState([]);

	// TODO: don't need this because it happens in the validate email function
	// whether or not the entered email address is allowed to set their password with this form
	// (you can only do this for new accounts with no passwords)
	const [isAllowedEmail, setIsAllowedEmail] = useState(false);

	// to open the snackbar component with a little alert to the user
	// Snackbar handler state
	const [snackbar, setSnackbar] = useState({
		open: false,
		message: "",
		severity: "info", // Can be "success", "error", "warning", "info"
	});

	const navigate = useNavigate();

	// useEffect to fetch data when the component mounts
	useEffect(() => {
		fetchUserEmails();
	}, []);

	// Function to fetch all user emails
	const fetchUserEmails = async () => {
		try {
			console.log("fetching users with no password yet");
			// no token needed on this specific endpoint
			const response = await fetch(
				"http://localhost:8000/userslist/new/",
				{
					method: "GET",
				}
			);
			const data = await response.json(); // Convert response to JSON
			const emailsList = {};

			for (let user of data) {
				// also store the user ID
				emailsList[user.email] = user.id;
			}

			setUserEmails(emailsList);
		} catch (error) {
			console.error("Error fetching users:", error);
			// Set the error to display it
			showSnackbar("Error from the server: " + error, "error");
		}
	};

	const validateEmail = (passedEmail) => {
		// don't need to reset emailErrors here, it will get set to the proper value

		// reset the user ID since we're checking a new email
		setUserID(null);

		let newEmailErrors = [];

		// check that the email is valid at least at a basic level
		if (!passedEmail.includes("@")) {
			newEmailErrors.push("Email must contain an '@'.");
		}

		if (!passedEmail.includes(".")) {
			newEmailErrors.push("Email must contain a '.'.");
		}

		// check if the email is in our list of emails that don't have passwords yet
		if (userEmails.hasOwnProperty(passedEmail)) {
			// store the email and the user ID
			setUserID(userEmails[passedEmail]);
			setIsAllowedEmail(true);
		} else {
			// only show this error if the user has already typed in a valid email so far
			if (newEmailErrors.length === 0) {
				newEmailErrors.push(
					"This email address is either not in our system or has already set a password."
				);
			}
			setIsAllowedEmail(false);
		}

		// store whatever errors (none, or some) in the state to display
		setEmailErrors(newEmailErrors);

		// return false if we caught any errors
		if (newEmailErrors.length > 0) {
			setEmailValid(false);
			return false;
		}

		setEmailValid(true);
		return true;
	};

	// using the e.target.value values that get passed, not what's in the state
	const validatePasswords = (passedFirstPW, passedConfirmPW) => {
		// don't need to reset errors, passwordErrors will get set to the correct value

		const newPasswordsErrors = [];

		// perform validation on the first password, and then for the second just check if they match
		// at least 8 characters long
		if (!passedFirstPW.length >= 8) {
			newPasswordsErrors.push(
				"Password must be at least 8 characters long."
			);
		}
		// at least 1 uppercase
		if (!/[A-Z]/.test(passedFirstPW)) {
			newPasswordsErrors.push(
				"Password must contain at least one uppercase letter."
			);
		}
		// at least 1 lowercase
		if (!/[a-z]/.test(passedFirstPW)) {
			newPasswordsErrors.push(
				"Password must contain at least one lowercase letter."
			);
		}
		// at least 1 digit (number)
		if (!/\d/.test(passedFirstPW)) {
			newPasswordsErrors.push(
				"Password must contain at least one number."
			);
		}
		// at least 1 of these symbols
		if (!/[!@#$%^&*()_+]/.test(passedFirstPW)) {
			newPasswordsErrors.push(
				"Password must contain at least one special character."
			);
		}

		// now check if the second password matches
		if (passedFirstPW !== passedConfirmPW) {
			newPasswordsErrors.push("Passwords do not match.");
		}

		// Set the errors - this will make the list empty if there are none, or set it to have the current errors
		setPasswordsErrors(newPasswordsErrors);

		// return false if we caught any errors
		if (newPasswordsErrors.length > 0) {
			setPasswordsValid(false);
			return false;
		}

		// no errors if we reached here
		setPasswordsValid(true);
		return true;
	};

	// function to check both email and passwords
	const validateForm = () => {
		// check if both the email is a valid format and allowed, and the passwords are valid and match
		if (validateEmail() && validatePasswords()) {
			return true;
		}

		return false;
	};

	const handleSubmit = async (event) => {
		event.preventDefault();

		// ensures form is filled
		// if (!validateForm()) return;
		setLoading(true);

		try {
			// call to update the user's password
			// no token needed on this specific endpoint
			const response = await fetch(
				`http://localhost:8000/users/${userID}/setpassword`,
				{
					method: "PUT",
					headers: {
						"Content-Type": "application/json",
					},
					// doesn't matter which one we use since the passwords are the same
					body: JSON.stringify({
						password: firstPassword,
					}),
				}
			);

			setLoading(false);

			if (response.ok) {
				console.log("Successfully set password!");
				showSnackbar(
					"Successfully set password! Redirecting you to the login page in a moment", "success"
				);

				// wait 3 seconds then redirect them to the login page
				await new Promise((resolve) => setTimeout(resolve, 3000));
				navigate("../login", { replace: true });
			} else {
				const errorData = await response.json();
				showSnackbar(
					errorData.detail ||
						"Error setting new password. Please try again in a moment.", "error"
				);
			}
		} catch (error) {
			setLoading(false);
			showSnackbar("An error occurred. Please try again later.", "error");
		}
	};

	// Show Snackbar
	// default parameter for severity (possible values are 'error', 'info', 'success', or 'warning')
	const showSnackbar = (message, severity = "info") => {
		setSnackbar({ open: true, message, severity });
	};

	// Close Snackbar
	const handleCloseSnackbar = () => {
		setSnackbar((prev) => ({ ...prev, open: false }));
	};

	return (
		<div className="login-container">
			<h1>Set Your First Password Here</h1>
			<form className="login-box" onSubmit={handleSubmit}>
				<div className="form-group">
					<label>Email:</label>
					<input
						type="email"
						value={email}
						onChange={(e) => {
							const newEmail = e.target.value;
							setEmail(newEmail);
							validateEmail(newEmail);
						}}
						// set that the user has interacted with the email field, and now we can display the errors
						onBlur={() => {
							setEmailTouched(true);
						}}
						className={emailErrors.length > 0 ? "error-input" : ""}
					/>
				</div>

				{/* display a list of email errors */}
				{emailTouched && emailErrors.length > 0 && (
					<ul className="error-message">
						{emailErrors.map((error, index) => (
							<li key={index}>{error}</li>
						))}
					</ul>
				)}

				<div className="form-group">
					<label>Password:</label>
					<input
						type="password"
						value={firstPassword}
						// don't let them try to set a password if they haven't entered a proper email yet
						disabled={!isAllowedEmail}
						// validate both passwords if either password changes
						onChange={(e) => {
							let newFirstPassword = e.target.value;
							setFirstPassword(newFirstPassword);
							// use the updated firstPassword, but here we can only access the (possibly out of date) confirmPassword
							validatePasswords(
								newFirstPassword,
								confirmPassword
							);
						}}
						// set that the user has interacted with one of the password fields, and now we can display the errors
						onBlur={() => setEitherPasswordTouched(true)}
						className={
							passwordsErrors.length > 0 ? "error-input" : ""
						}
					/>
				</div>

				<div className="form-group">
					<label>Confirm Password:</label>
					<input
						type="password"
						value={confirmPassword}
						// don't let them try to set a password if they haven't entered a proper email yet
						disabled={!isAllowedEmail}
						// validate both passwords if either password changes
						onChange={(e) => {
							let newConfirmPassword = e.target.value;
							setConfirmPassword(newConfirmPassword);
							// use the updated confirmPassword, but here we can only access the (possibly out of date) firstPassword
							validatePasswords(
								firstPassword,
								newConfirmPassword
							);
						}}
						// set that the user has interacted with one of the password fields, and now we can display the errors
						onBlur={() => {
							setEitherPasswordTouched(true);
							// console.log(
							// 	"eitherPasswordTouched: " +
							// 		eitherPasswordTouched
							// );
						}}
						className={
							passwordsErrors.length > 0 ? "error-input" : ""
						}
					/>
				</div>

				{/* display a list of password errors */}
				{eitherPasswordTouched && passwordsErrors.length > 0 && (
					<ul className="error-message">
						{passwordsErrors.map((error, index) => (
							<li key={index}>{error}</li>
						))}
					</ul>
				)}

				{/* submit button
				disable it if still loading, or if either the email or passwords have any validation errors */}
				<div>
					<button
						type="submit"
						disabled={loading || !(emailValid && passwordsValid)}
					>
						{loading ? "Setting password..." : "Submit"}
					</button>
					{/* {error && <p className="error-message">{error}</p>} */}
				</div>
			</form>
			{/* Snackbar for error messages/messages to the user */}
			{/* get details from what is stored in the state */}
			<Snackbar
				open={snackbar.open}
				autoHideDuration={6000}
				onClose={handleCloseSnackbar}
			>
				<Alert
					onClose={handleCloseSnackbar}
					severity={snackbar.severity}
				>
					{snackbar.message}
				</Alert>
			</Snackbar>
		</div>
	);
}

export default SetFirstPassword;
