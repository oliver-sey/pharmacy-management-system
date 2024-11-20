import React, { useState, useEffect } from "react";
import "../Styles/Login.css"; // import the specific stylesheet for this page
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
	
	const [isFormValid, setIsFormValid] = useState(false);


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
	const [openSnackbar, setOpenSnackbar] = useState(false);
	const [snackbarMessage, setSnackbarMessage] = useState("");

	const navigate = useNavigate();

	// useEffect to fetch data when the component mounts
	useEffect(() => {
		fetchUserEmails();
	}, []);

	// Function to fetch all user emails
	const fetchUserEmails = async () => {
		try {
			// TODO: need to figure out how to do this without the token!!
			const token = localStorage.getItem("token");

			const response = await fetch("http://localhost:8000/userslist/", {
				method: "GET",
				headers: { Authorization: "Bearer " + token },
			});
			const data = await response.json(); // Convert response to JSON
			const emailsList = {};

			for (let user of data) {
				console.log("user in loop, has password: " + user.password);
				console.log(user);
				
				// we only want emails that have no password yet, since this page is to set your first password
				if (!user.password) {
					// also store the user ID
					emailsList[user.email] = user.id;
				}
			}

			setUserEmails(emailsList);
		} catch (error) {
			console.error("Error fetching users:", error);
			// Set the error to display it
			setSnackbarMessage("Error from the server: " + error);
			setOpenSnackbar(true);
		}
	};

	const validateEmail = () => {
		// don't need to reset emailErrors here, it will get set to the proper value

		// reset the user ID since we're checking a new email
		setUserID(null);

		let newEmailErrors = [];

		// check that the email is valid at least at a basic level
		if (!email.includes("@")) {
			newEmailErrors.push("Email must contain an '@'.");
		}

		if (!email.includes(".")) {
			newEmailErrors.push("Email must contain a '.'.");
		}

		// check if the email is in our list of emails that don't have passwords yet
		if (userEmails.hasOwnProperty(email)) {
			// store the email and the user ID
			setUserID(userEmails[email]);
			setIsAllowedEmail(true);
		} else {
			newEmailErrors.push(
				"This email address is either not in our system or has already set a password."
			);
			setIsAllowedEmail(false);
			return false;
		}

		// store whatever errors (none, or some) in the state to display
		setEmailErrors(newEmailErrors);


		// return false if we caught any errors
		if (newEmailErrors.length > 0) {
			return false;
		}

		return true;
	};

	const validatePasswords = () => {
		// don't need to reset errors, passwordErrors will get set to the correct value

		const newPasswordsErrors = [];

		// perform validation on the first password, and then for the second just check if they match
		// at least 8 characters long
		if (!firstPassword.length >= 8) {
			newPasswordsErrors.push(
				"Password must be at least 8 characters long."
			);
		}
		// at least 1 uppercase
		if (!/[A-Z]/.test(firstPassword)) {
			newPasswordsErrors.push(
				"Password must contain at least one uppercase letter."
			);
		}
		// at least 1 lowercase
		if (!/[a-z]/.test(firstPassword)) {
			newPasswordsErrors.push(
				"Password must contain at least one lowercase letter."
			);
		}
		// at least 1 digit (number)
		if (!/\d/.test(firstPassword)) {
			newPasswordsErrors.push(
				"Password must contain at least one number."
			);
		}
		// at least 1 of these symbols
		if (!/[!@#$%^&*()_+]/.test(firstPassword)) {
			newPasswordsErrors.push(
				"Password must contain at least one special character."
			);
		}

		// now check if the second password matches
		if (firstPassword !== confirmPassword) {
			newPasswordsErrors.push("Passwords do not match.");
		}

		// Set the errors - this will make the list empty if there are none, or set it to have the current errors
		setPasswordsErrors(newPasswordsErrors);

		// return false if we caught any errors
		if (newPasswordsErrors.length > 0) {
			return false;
		}

		// no errors if we reached here
		return true;
	};

	// function to check both email and passwords
	const validateForm = () => {
		// check if both the email is a valid format and allowed, and the passwords are valid and match
		if (validateEmail() && validatePasswords()) {
			setIsFormValid(true);
			return true;
		}

		setIsFormValid(false);
		return false;
	};

	const handleSubmit = async (event) => {
		event.preventDefault();

		// ensures form is filled
		if (!validateForm()) return;
		setLoading(true);

		try {
			// call to update the user's password
			const response = await fetch(
				`http://localhost:8000/users/${userID}`,
				{
					method: "PUT",
					headers: {
						"Content-Type": "application/x-www-form-urlencoded",
					},
					// doesn't matter which one we use since the passwords are the same
					body: {
						password: firstPassword,
					},
				}
			);

			setLoading(false);

			if (response.ok) {
				console.log("Successfully set password!");
				setSnackbarMessage(
					"Successfully set password! Redirecting you to the login page in a moment"
				);
				setOpenSnackbar(true);

				// wait 2 seconds then redirect them to the login page
				await new Promise((resolve) => setTimeout(resolve, 2000));
				navigate("../login", { replace: true });
			} else {
				const errorData = await response.json();
				setSnackbarMessage(
					errorData.detail ||
						"Error setting new password. Please try again in a moment."
				);
				setOpenSnackbar(true);
			}
		} catch (error) {
			setLoading(false);
			setSnackbarMessage("An error occurred. Please try again later.");
			setOpenSnackbar(true);
		}
	};

	// Handle closing of the Snackbar
	const handleCloseSnackbar = () => {
		setOpenSnackbar(false);
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
							setEmailTouched(true)
							console.log("emailTouched: " + emailTouched);
							console.log("isAllowedEmail: " + isAllowedEmail);
							console.log("userEmails: ");
							console.log(userEmails);
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
							setFirstPassword(e.target.value);
							validatePasswords();
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
							setConfirmPassword(e.target.value);
							validatePasswords();
						}}
						// set that the user has interacted with one of the password fields, and now we can display the errors
						onBlur={() => {
							setEitherPasswordTouched(true)
							console.log("eitherPasswordTouched: " + eitherPasswordTouched);	
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
				disable it if the form has any validation errors */}
				<div>
					<button type="submit" disabled={loading || !isFormValid}>
						{loading ? "Setting password..." : "Submit"}
					</button>
					{/* {error && <p className="error-message">{error}</p>} */}
				</div>
			</form>
			{/* Snackbar for error messages */}
			<Snackbar
				open={openSnackbar}
				autoHideDuration={6000}
				onClose={handleCloseSnackbar}
			>
				<Alert onClose={handleCloseSnackbar} severity="error">
					{snackbarMessage}
				</Alert>
			</Snackbar>
		</div>
	);
}

export default SetFirstPassword;