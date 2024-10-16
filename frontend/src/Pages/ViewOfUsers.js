// React imports
import React, { useState, useEffect } from "react";

// Stylesheets
import "../Styles/styles.css";

// COmponents we made
import BaseTable from "../Components/BaseTable";

// Material UI components
import { IconButton } from "@mui/material";
import LockOpenIcon from "@mui/icons-material/LockOpen";

function ViewOfUsers() {
	const [users, setUsers] = useState([]);

	useEffect(() => {
		const fetchUsers = async () => {
			console.log("In fetchUsers");
			try {
				const response = await fetch(
					"http://localhost:8000/userslist/",
					{
						method: "GET",
						// TODO: do we need this??
						headers: {
							"Content-Type": "application/json",
						},
					}
				);

				if (!response.ok) {
					throw new Error("Failed to fetch users");

					// TODO: add a snackbar for an alert?
				}

				const data = await response.json();
				console.log(data);
				// update the state with the fetched users
				setUsers(data);
			} catch (error) {
				console.error("Error fetching users:", error);
			}
		};

		fetchUsers();
	}, []);

	// the columns for the table
	// headerName is what shows up on the website
	// width is the default width of the column, user can adjust it
	const columns = [
		// { field: "id", headerName: "ID", width: 70 },
		// { field: "firstName", headerName: "First name", width: 130 },
		// { field: "lastName", headerName: "Last name", width: 130 },
		{ field: "email", headerName: "Email", width: 220 },

		{
			field: "user_type",
			headerName: "User Type",
			width: 220,
			valueGetter: (value, row) => {
				switch (value) {
					case "cashier":
						return "Cashier";
					case "pharmacymanager":
						return "Pharmacy Manager";
					case "pharmacist":
						return "Pharmacist";
					case "pharmacytech":
						return "Pharmacy Technician";

					default:
						return "Error converting user type";
				}
			},
		},
	];

	// hardcoded values for development, this will come from the backend/database later
	// TODO: get rid of hardcoded values
	// const rows = [
	// 	{
	// 		id: 1,
	// 		firstName: "Silly",
	// 		lastName: "McGiggles",
	// 		email: "silly.giggles@example.com",
	// 		isLockedOut: "true",
	// 	},
	// 	{
	// 		id: 2,
	// 		firstName: "Chuckles",
	// 		lastName: "VonLaugh",
	// 		email: "chuckles.von@example.com",
	// 		isLockedOut: "false",
	// 	},
	// 	{
	// 		id: 3,
	// 		firstName: "Giggle",
	// 		lastName: "FitzSnicker",
	// 		email: "giggle.fitz@example.com",
	// 		isLockedOut: "false",
	// 	},
	// ];

	// a column for buttons the user can click
	const actionButtons = (row) =>
		// only make the unlock icon appear if the user is locked out
		row.isLockedOut == "true" && (
			<div>
				<IconButton
					// TODO: do something when they click the button!
					onClick={() => console.log("Unlocking:", row.id)}
					disabled={!row.isLockedOut} // Disable if already unlocked
				>
					{/* <LockOpenIcon color={row.isLockedOut ? "primary" : "disabled"} /> */}
					<LockOpenIcon color="primary" />
				</IconButton>
			</div>
		);

	// return the page, using the BaseTable component with a few changes (custom columns and rows, the actionButtons column)
	return (
		<div>
			<h2>Users Table</h2>
			<BaseTable
				columns={columns}
				rows={users}
				actionButtons={actionButtons}
			/>
		</div>
	);
}
export default ViewOfUsers;
