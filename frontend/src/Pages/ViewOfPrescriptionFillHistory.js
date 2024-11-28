import { React, useRef, useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { Snackbar, Alert, Button} from "@mui/material";
import { IconButton, Tooltip } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CheckUserType from "../Functions/CheckUserType";

import BaseTable from "../Components/BaseTable";



function ViewOfPrescriptionFillHistory() {
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
const fetchPrescriptions = async () => {
	try {
	  const response = await fetch('http://localhost:8000/prescriptions', {
		headers: {
			'Authorization': 'Bearer ' + token,
		},
	  });
	  const data = await response.json(); // Convert response to JSON

	  return data
	} catch (error) {
	  console.error('Error fetching prescriptions:', error);
	  // error handling
	  setErrorMessage('Failed to fetch prescriptions');
		setOpenSnackbar(true); // Show Snackbar when error occurs
	}
}; 

const fetchPatients = async () => {
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
	const patients = await fetchPatients();
	const medications = await fetchMedications();
	const prescriptions = await fetchPrescriptions();
	const users = await fetchUsers();

	const updatedPrescriptions = prescriptions.map(prescription => {
		// Find the patient object that matches the patient_id in the prescription
		const patient = patients.find(p => p.id === prescription.patient_id);
	  
		// Find the medication object that matches the medication_id in the prescription
		const medication = medications.find(m => m.id === prescription.medication_id);

        const filled_user = users.find(u => u.id === prescription.user_filled_id);

		const entered_user = users.find(u => u.id === prescription.user_entered_id);

		const createdAt = new Date(prescription.filled_timestamp);
	  
		return {
		  ...prescription,
		  // Replace patient_id with patient_name
		  patient_name: patient ? patient.first_name + ' ' + patient.last_name : 'Unknown Patient',
		  // Replace medication_id with medication_name
		  medication_name: medication ? medication.name : 'Unknown Medication',

          user_filled_name: filled_user ? filled_user.first_name + ' ' + filled_user.last_name : null,

		  user_entered_name: entered_user ? entered_user.first_name + ' ' + entered_user.last_name : null,

			date_filled: createdAt.toLocaleDateString('en-US'),

			time_filled: createdAt.toLocaleTimeString('en-US'),

			filled_timestamp: createdAt
		  
		};
	  }).sort((a, b) => a.filled_timestamp - b.filled_timestamp);

	  updatedPrescriptions.forEach(prescription => {
		delete prescription.patient_id
		delete prescription.medication_id
		delete prescription.user_entered_id
		delete prescription.user_filled_id
		delete prescription.filled_timestamp
	  })

	const filteredPrescriptions = updatedPrescriptions.filter(prescription => prescription.user_filled_name !== null);

	console.log(updatedPrescriptions)
	setRows(filteredPrescriptions)
}

	// useEffect to fetch data when the component mounts
	useEffect(() => {
		loadRows()
		
	  }, []);

	  // useEffect to fetch data when the component mounts
	useEffect(() => {
		
		CheckUserType(role, navigate);
	  }, []);

	  const columns = [
		{ field: 'date_filled', headerName: 'Date Filled' },
		{ field: 'time_filled', headerName: 'Time Filled' },
		{ field: 'user_filled_name', headerName: 'Filled By' },
		{ field: 'medication_name', headerName: 'Medication' },
		{ field: 'quantity', headerName: 'Quantity'},
		{ field: 'patient_name', headerName: 'Patient' },
		{ field: 'date_prescribed', headerName: 'Date Prescribed' },
        { field: 'user_entered_name', headerName: 'Entered By' },
		{ field: 'doctor_name', headerName: 'Prescribing Doctor' }
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
		  <h2>Filled Prescription Log</h2>

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
export default ViewOfPrescriptionFillHistory;
