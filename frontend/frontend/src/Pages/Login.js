import React from "react";
import "../Styles/Login.css"; // import the specific stylesheet for this page

function Login() {
	return (
		<div>
			<h1>Employee Login</h1>
			<h3>Welcome to the Pharmacy Management System</h3>
			<div className="centered-div">
				<div className="form-group">
					<label htmlFor="email" className="input-label">
						Email:
					</label>
					<input
						type="text"
						className="input-field"
						id="email"
						placeholder="Email"
					/>
				</div>

				<div className="form-group">
					<label htmlFor="password" className="input-label">
						Password:
					</label>
					<input
						type="password"
						className="input-field"
						id="password"
						placeholder="Password"
					/>
				</div>

				<div>
					<p>
						Don't have an account yet? Ask your pharmacy manager to
						create one for you.
					</p>
				</div>

				<div>
					<input type="button" id="submit" value="Submit" />
				</div>
			</div>
		</div>
	);
}

export default Login;
