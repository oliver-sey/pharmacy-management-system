import { React, useRef, useState, useEffect } from "react";

import EditDeleteTable from "../Components/EditDeleteTable";
import AddEditUserModal from "../Components/AddEditUserModal";
import DeleteModal from "../Components/DeleteModal";
import Button from "@mui/material/Button";
// Stylesheets
import "../Styles/styles.css";

// COmponents we made
import BaseTable from "../Components/BaseTable";

// Material UI components
import { IconButton } from "@mui/material";
import LockOpenIcon from "@mui/icons-material/LockOpen";

function ViewOfUsers() {
	const [rows, setUsers] = useState([]);

	// const fetchUsers = async () => {
	// 	console.log("In fetchUsers");
	// 	try {
	// 		const response = await fetch(
	// 			"http://localhost:8000/userslist/",
	// 			{
	// 				method: "GET",
	// 				// TODO: do we need this??
	// 				headers: {
	// 					"Content-Type": "application/json",
	// 				},
	// 			}
	// 		);

	// 		if (!response.ok) {
	// 			throw new Error("Failed to fetch users");

	// 			// TODO: add a snackbar for an alert?
	// 		}

	// 		const data = await response.json();
	// 		console.log(data);
	// 		// update the state with the fetched users
	// 		setUsers(data);
	// 	} catch (error) {
	// 		console.error("Error fetching users:", error);
	// 	}
	// };

	const fetchUsers = async () => {
		try {
		  const response = await fetch('http://localhost:8000/userslist');
		  const data = await response.json(); // Convert response to JSON
		  console.log(data);
		  setUsers(data); // Update rows state with fetched data
		} catch (error) {
		  console.error('Error fetching users:', error);
		}
	}; 

	useEffect(() => {
		fetchUsers();
	}, []);

	// the columns for the table
	// headerName is what shows up on the website
	// width is the default width of the column, user can adjust it
	const columns = [
		{ field: "id", headerName: "ID", width: 70 },
		{ field: "first_name", headerName: "First name", width: 130 },
		{ field: "last_name", headerName: "Last name", width: 130 },
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
		{ field: "email", headerName: "Email", width: 220 },
		{ field: "password", headerName: "Password", width: 220 }


		
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

	// all users can edit users
	const canEdit = () => {
		// const userType = localStorage.getItem('userType');
		// TODO: should we do this with no checks?
		return true;
	};
	  
	// only pharmacists or pharmacy managers can delete
	const canDelete = () => {
		//const role = localStorage.getItem('role');
		//return role === 'pharmacist' || role === 'pharmacymanager';
		return true;
	};

	const deleteUser = async (id) => {
		try {
			console.log("row", id);
			const response = await fetch(`http://localhost:8000/users/${id}`, {
				method: 'DELETE',
			});
			if (!response.ok) {
				throw new Error('Failed to delete user');
			}
			fetchUsers();
		} catch (error) {
			console.error('Error deleting user:', error);
		}
	}

	const addEditUser = async (data, id) => {
		if (id) {
			editUser(data, id);
		} else {
			addUser(data);
		}
	}

	const editUser = async (data, id) => {
		try {
			
			console.log("row in editUser", id, data)
			const response = await fetch(`http://localhost:8000/users/${id}`, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(data),
			});
			if (!response.ok) {
				throw new Error('Failed to update user');
			}
			fetchUsers();
		} catch (error) {
			console.error('Error updating user:', error);
		}
	}

	const addUser = async (data) => {
		try {
			console.log("row in addUser", data)
			const response = await fetch(`http://localhost:8000/users`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(data),
			});
			if (!response.ok) {
				throw new Error('Failed to add user');
			}
			fetchUsers();
		} catch (error) {
			console.error('Error adding user:', error);
		}
	}
	// a column for buttons the user can click
	// the message format that should get used in the delete confirmation modal (popup) for this table
	// need this since we want a different format on other tables that use this same base component
	const userConfirmMessage = (row) =>
		`${row?.first_name || "Unknown First Name"} ${
			row?.last_name || "Unknown Last Name"
		}, with email ${row?.email || "Unknown Email"}`;

	const openAddUserModal = useRef(null);

	// return the page, using the BaseTable component with a few changes (custom columns and rows, the actionButtons column)
	return (
		<div>
		  <h2>Users Table</h2>
			<Button
			  variant="contained"
			  onClick={() => {
				if (openAddUserModal.current) {
				  openAddUserModal.current(); // Trigger modal to open for adding a user
				}
			  }}
			>
			  Add User
			</Button>
	  
		  <EditDeleteTable
			rows={rows}
			columns={columns}
			editModal={AddEditUserModal}
			deleteModal={DeleteModal}
			showEditButton={canEdit()}
			showDeleteButton={canDelete()}
			customConfirmMessage={userConfirmMessage}
			onAdd={(handler) => {
			  openAddUserModal.current = handler; // Store the open modal handler
			}}
			onEdit={addEditUser}
			onConfirmDelete={deleteUser}
		  />
		</div>
	  );
}
export default ViewOfUsers;
