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
	const [updated, setUpdated] = useState(false);
	
	// Async function to fetch presciptions data
const fetchInventoryChanges = async () => {
	try {
	  const response = await fetch('http://localhost:8000/inventory-updates');
	  const data = await response.json(); // Convert response to JSON

	  return data
	} catch (error) {
	  console.error('Error fetching prescriptions:', error);
	  // error handling
	  setErrorMessage('Failed to fetch prescriptions');
		setOpenSnackbar(true); // Show Snackbar when error occurs
	}
}; 

//TODO: Update when theres an endpoint
const fetchUserActivities = async () => {
	try {
		const response = await fetch('http://localhost:8000/patients', {
			headers: {
				'Authorization': 'Bearer ' + token,
			},
		  })
		const data = await response.json()

		console.log("patient data: " + JSON.stringify(data))
		return data
	} catch (error) {
		console.error('Error fetching patient:', error);
		// error handling
		setErrorMessage('Failed to fetch patient');
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

		console.log("medication data: " + JSON.stringify(data))
		
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

		console.log("users data: " + JSON.stringify(data))
		
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

	console.log(updatedInvChanges)
	setRows(updatedInvChanges)
}

	// useEffect to fetch data when the component mounts
	useEffect(() => {
		loadRows()
		
	  }, []);

	  // useEffect to fetch data when the component mounts
	useEffect(() => {
		
		CheckUserType(role, navigate);
	  }, []);

	//   id = Column(Integer, primary_key=True, index=True)
    // medication_id = Column(Integer, ForeignKey('medications.id'))
    // user_activity_id = Column(Integer, ForeignKey('user_activities.id'))
    
    // transaction_id = Column(Integer, ForeignKey('transactions.id'), nullable=True) # don't think we need this - Hsinwei
    
    // quantity_changed_by = Column(Integer)
    // timestamp = Column(DateTime, default=func.now())
    
    // activity_type = Column(SQLAlchemyEnum(InventoryUpdateType))

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
