import React, { useState } from "react";
import "../Styles/Login.css"; // import the specific stylesheet for this page;
import { useNavigate } from "react-router-dom";
import LoginComponent from "../Components/LoginComponent";
import "../Styles/Login.css";

function Login() {
	return (
		<div>
			<LoginComponent />
		</div>
	);
}

export default Login;
