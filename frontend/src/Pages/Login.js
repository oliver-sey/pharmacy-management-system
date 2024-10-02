import React, { useState } from "react";
import "../Styles/Login.css"; // import the specific stylesheet for this page;
import { useNavigate } from "react-router-dom";
import LoginComponent from "../Components/LoginComponent"
import "../Styles/Login.css";

// ***IMPORTANT:*** OAuth requires that the variable be called username, even though here it is an email

function Login() {
	// username is actually an email
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");
	const [loading, setLoading] = useState("");

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
		if (!validateForm()) return;
		setLoading(true);

		const formDetails = new URLSearchParams();
		formDetails.append("username", username);
		formDetails.append("password", password);

		try {
			await (1500)
			const response = await fetch("http://localhost:8000/token", {
				method: "POST",
				headers: {
					"Content-Type": "application/x-www-form-urlencoded",
				},
				body: formDetails,
			});

			setLoading(false);

			if (response.ok) {
				const data = await response.json();
				localStorage.setItem("token", data.access_token);
				console.log("navigating now");
				navigate("../protected", { replace: true });
			} else {
				const errorData = await response.json();
				setError(errorData.detail || "Authentication failed!");
			}
		} catch (error) {
			setLoading(false);
			setError("An error occured. Please try again later.");
		}
	};

	return (
		<div>
			<LoginComponent />
		</div>
	);
}

export default Login;
