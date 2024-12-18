import { React, useRef, useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { Snackbar, Alert, Button} from "@mui/material";
import { IconButton, Tooltip } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CheckUserType from "../Functions/CheckUserType";
import LocalPharmacyOutlinedIcon from '@mui/icons-material/LocalPharmacyOutlined';
import BaseTable from "../Components/BaseTable";



function PrescriptionsToFill() {
	// the columns for the table
	// headerName is what shows up on the website
	// width is the default width of the column, user can adjust it
	const [rows, setRows] = useState([]);
	const [errorMessage, setErrorMessage] = useState(null);
	const [openSnackbar, setOpenSnackbar] = useState(false);
	const navigate = useNavigate();
	const role = ["Pharmacist"]
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
		});
		const data = await response.json()
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
		});
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
		  });
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
	const patients = await fetchPatients();
	const medications = await fetchMedications();
	const prescriptions = await fetchPrescriptions();
	const users = await fetchUsers();

	const updatedPrescriptions = prescriptions.map(prescription => {
		// Find the patient object that matches the patient_id in the prescription
		const patient = patients.find(p => p.id === prescription.patient_id);
	  
		// Find the medication object that matches the medication_id in the prescription
		const medication = medications.find(m => m.id === prescription.medication_id);

		const entered_user = users.find(u => u.id === prescription.user_entered_id);
	  
		return {
		  ...prescription,
		  // Replace patient_id with patient_name
		  patient_name: patient ? patient.first_name + ' ' + patient.last_name : 'Unknown Patient',
		  // Replace medication_id with medication_name
		  medication_name: medication ? medication.name : 'Unknown Medication',

		  user_entered_name: entered_user ? entered_user.first_name + ' ' + entered_user.last_name : null
		
		  
		};
	  })

	  updatedPrescriptions.forEach(prescription => {
		delete prescription.patient_id;
		delete prescription.medication_id;
		delete prescription.user_entered_id;
		
	  });

	const filteredPrescriptions = updatedPrescriptions.filter(prescription => prescription.user_filled_id === null);

	setRows(filteredPrescriptions)
}

	
const deletePrescription = async (id) => {
	try {
		const response = await fetch(`http://localhost:8000/prescription/${id}`, {
			method: 'DELETE',
			headers: { 'Authorization': 'Bearer ' + token }
		});
		if (!response.ok) {
			throw new Error('Failed to delete prescription');
		}
		loadRows()
	} catch (error) {
		console.error('Error deleting prescription:', error);
		setErrorMessage('Failed to delete prescription' + error);
		setOpenSnackbar(true);
	}
}

	const FillPrescription = async (row) => {
		try {
		  // Fetch the medication details first
		  const medicationResponse = await fetch(`http://localhost:8000/medication/${row.id}`, {
			headers: { 'Authorization': 'Bearer ' + token },
		  });
	  
		  if (!medicationResponse.ok) {
			throw new Error('Failed to fetch medication data');
		  }
	  
		  const medicationData = await medicationResponse.json();
	  
		  // Get the current date and expiration date
		  const currentDate = new Date();
		  const expirationDate = new Date(medicationData.expiration_date);
	  
		  console.log("Current Date: " + currentDate.toISOString());
		  console.log("Expiration Date: " + expirationDate.toISOString());
	  
		  // Check if the medication is expired
		  if (currentDate > expirationDate) {
			// Medication is expired, show error message
			setErrorMessage('Cannot fill prescription: Medication is expired');
			setOpenSnackbar(true);
			return; // Exit the function early, don't proceed with filling the prescription
		  }
	  
		  // If medication is not expired, proceed with filling the prescription
		  const fillResponse = await fetch(`http://localhost:8000/prescription/${row.id}/fill`, {
			method: 'PUT',
			headers: { 'Authorization': 'Bearer ' + token },
		  });
	  
		  if (!fillResponse.ok) {
			throw new Error('Failed to fill prescription');
		  }
	  
		  // Reload the data after a successful fill
		  loadRows();
		} catch (error) {
		  console.error('Error filling prescription:', error);
		  setErrorMessage('Failed to fill prescription: ' + error.message);
		  setOpenSnackbar(true);
		}
	  };
	  
	  
	  
	const HandleDelete = async (row) => {
		//TO DO: confirmation message
		deletePrescription(row.id)

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
		{ field: 'id', headerName: 'ID' },
		{ field: 'medication_name', headerName: 'Medication' },
		{ field: 'dosage', headerName: 'Dosage' },
		{ field: 'patient_name', headerName: 'Patient' },
		{ field: 'date_prescribed', headerName: 'Date Prescribed' },
        { field: 'user_entered_name', headerName: 'Entered By' },
		{ field: 'doctor_name', headerName: 'Prescribing Doctor' }
	  ];


	  
	// only pharmacists or pharmacy managers can delete
	const canDelete = () => {
		const role = localStorage.getItem('role');
		return role === 'Pharmacist' || role === 'Pharmacy Manager';
	};


	
	/**

	 * @param {the data being sent to the server used to create a new prescription} data 
	 * @returns boolean indicating success or failure
	 */
	const addPrescription = async (data) => {
		try {
			const response = await fetch(`http://localhost:8000/prescription`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'Authorization': 'Bearer ' + token,
				},
				body: JSON.stringify(data),
			});
			if (!response.ok) {
				const responseData = await response.json(); // Wait for the JSON to be parsed
				var errorMessage;
				// if responseData.detail is a string, return the strig, else return the first element of the array
				if (typeof(responseData.detail) == 'string') {// check if response.detail is a string or an array
					errorMessage = responseData.detail;
				} else {
					errorMessage = responseData.detail[0].msg;
				}
				throw new Error(errorMessage);
			}
			fetchPrescriptions();
			return true;
			
		} catch (error) {
			setErrorMessage('Failed to add prescription: ' + error);
			setOpenSnackbar(true);
			return false;
		}
	}

	// Handle closing of the Snackbar
	const handleCloseSnackbar = () => {
		setOpenSnackbar(false);
	};

	const actionButtons = (row) => (
		<div style={{ display: "flex", width: "100%" }}>
			{/* fill button */}
			{( 
				<Tooltip id="fill" title="Fill" style={{ flex: 1 }}>
					<IconButton
						onClick={() => FillPrescription(row)}
						style={{ width: "auto" }}
					>
						<LocalPharmacyOutlinedIcon color="primary" />
					</IconButton>
				</Tooltip>
			)}

			{/* delete button */}
			{ ( 
				<Tooltip id="delete" title="Delete" style={{ flex: 1 }}>
					<IconButton
						onClick={() => HandleDelete(row)}
						style={{ width: "auto" }}
					>
						<DeleteIcon color="error" />
					</IconButton>
				</Tooltip>
			)}
		</div>
	);

	// the message format that should get used in the delete confirmation modal (popup) for this table
	// need this since we want a different format on other tables that use this same base component
	const prescriptionConfirmMessage = (row) =>
		`${row?.first_name || "Unknown First Name"} ${
			row?.last_name || "Unknown Last Name"
		}, with DOB ${row?.date_of_birth || "Unknown DOB"}`;

	const openAddPrescriptionModal = useRef(null);

	return (
		<div>
		  <h2>Unfilled Prescriptions</h2>

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
export default PrescriptionsToFill;
