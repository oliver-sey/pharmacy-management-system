import { React, useRef, useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { Snackbar, Alert, Button} from "@mui/material";

import CheckUserType from "../Functions/CheckUserType";

import BaseTable from "../Components/BaseTable";


function ViewOfInventoryChanges() {
	// the columns for the table
	// headerName is what shows up on the website
	// width is the default width of the column, user can adjust it
	const [rows, setRows] = useState([]);
	const [errorMessage, setErrorMessage] = useState(null);
	const [openSnackbar, setOpenSnackbar] = useState(false);
	const navigate = useNavigate();
	const role = ["Pharmacist", "Pharmacy Manager"]
	const token = localStorage.getItem('token');


	// useEffect to fetch data when the component mounts
	useEffect( () => {
		CheckUserType(role, navigate).then(loadRows())
		
		}, []);
	
	// Async function to fetch presciptions data
const fetchInventoryChanges = async () => {
	try {
	  const response = await fetch('http://localhost:8000/inventory-updates', {
		headers: {
			'Authorization': 'Bearer ' + token,
		},
	  })
	  const data = await response.json(); // Convert response to JSON

	  return data
	} catch (error) {
	  console.error('Error fetching prescriptions:', error);
	  // error handling
	  setErrorMessage('Failed to fetch prescriptions');
		setOpenSnackbar(true); // Show Snackbar when error occurs
	}
}; 


const fetchUserActivities = async () => {
	try {
		const response = await fetch('http://localhost:8000/user-activities', {
			headers: {
				'Authorization': 'Bearer ' + token,
			},
		  })
		const data = await response.json()

		return data
	} catch (error) {
		console.error('Error fetching user activities:', error);
		// error handling
		setErrorMessage('Failed to fetch user activities');
		  setOpenSnackbar(true); // Show Snackbar when error occurs
	  }
}

const fetchMedications = async () => {
	try {
		const response = await fetch('http://localhost:8000/medicationlist', {
			headers: {
				'Authorization': 'Bearer ' + token,
			},
		  })
		const data = await response.json()
		
		return data
	} catch (error) {
		console.error('Error fetching medication:', error);
		// error handling
		setErrorMessage('Failed to fetch medication');
		  setOpenSnackbar(true); // Show Snackbar when error occurs
	  }
}

const fetchUsers = async () => {
	try {
		const response = await fetch('http://localhost:8000/userslist', {
			headers: {
				'Authorization': 'Bearer ' + token,
			},
		  })
		const data = await response.json()
		
		return data
	} catch (error) {
		console.error('Error fetching users:', error);
		// error handling
		setErrorMessage('Failed to fetch users');
		  setOpenSnackbar(true); // Show Snackbar when error occurs
	  }
}

const loadRows = async () =>{
	const inventoryChanges = await fetchInventoryChanges();
	const medications = await fetchMedications();
	const userActivities = await fetchUserActivities();
	const users = await fetchUsers();

	const updatedInvChanges = inventoryChanges.map(invChange => {
	  
		// Find the medication object that matches the medication_id in the invChange
		const medication = medications.find(m => m.id === invChange.medication_id);

		const userActivity = userActivities.find(ua => ua.id === invChange.user_activity_id);

        const user = users.find(u => u.id === userActivity.user_id);

		const createdAt = new Date(userActivity.timestamp);
	  
		return {
		  ...invChange,

		  // Replace medication_id with medication_name
		  medication_name: medication ? medication.name : 'Unknown Medication',

          user_name: user ? user.first_name + ' ' + user.last_name : null,

			date: createdAt.toLocaleDateString('en-US'),

			time: createdAt.toLocaleTimeString('en-US'),

			timestamp: createdAt
		};
	  }).sort((a, b) => a.timestamp - b.timestamp);

	  updatedInvChanges.forEach(invChange => {
		delete invChange.user_activity_id
		delete invChange.medication_id
		delete invChange.transaction_id
		delete invChange.timestamp
	  })

	
	setRows(updatedInvChanges)
}

	  const columns = [
		
		{ field: 'date', headerName: 'Date' },
		{ field: 'time', headerName: 'Time' },
		{ field: 'user_name', headerName: 'User' },
		{ field: 'medication_name', headerName: 'Medication' },
		{ field: 'activity_type', headerName: 'Activity' },
		{ field: 'quantity_changed_by', headerName: 'Quantity'}
	  ];

	// Handle closing of the Snackbar
	const handleCloseSnackbar = () => {
		setOpenSnackbar(false);
	};

	const actionButtons = (row) => (
		<div >
		</div>
	);


	return (
		<div>
		  <h2>Inventory Changes Log</h2>

			<BaseTable
				columns={columns}
				rows={rows}
				actionButtons={actionButtons}
			/>
		  
		  {/* Snackbar for error messages */}
		  <Snackbar 
			open={openSnackbar} 
			autoHideDuration={6000} 
			onClose={handleCloseSnackbar}
		  >
			<Alert onClose={handleCloseSnackbar} severity="error">
			{errorMessage}
			</Alert>
		  </Snackbar>
		</div>
	  );
	  
}
export default ViewOfInventoryChanges;
