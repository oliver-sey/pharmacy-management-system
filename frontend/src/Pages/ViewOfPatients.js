import { React, useRef, useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';import { Snackbar, Alert, Button} from "@mui/material";

import EditDeleteTable from "../Components/EditDeleteTable";
import AddEditPatientModal from "../Components/AddEditPatientModal";
import DeleteModal from "../Components/DeleteModal";

function ViewOfPatients() {
	const [rows, setRows] = useState([]);
	const [errorMessage, setErrorMessage] = useState(null);
	const [openSnackbar, setOpenSnackbar] = useState(false);
	const navigate = useNavigate();
	const token = localStorage.getItem('token');

	// Async function to fetch patients data
	const fetchPatients = async () => {
		try {
		  const response = await fetch('http://localhost:8000/patients', {
			headers: {'Authorization': 'Bearer ' + token}
		  });
		  const data = await response.json(); // Convert response to JSON
		  setRows(data); // Update rows state with fetched data
		} catch (error) {
		  console.error('Error fetching patients:', error);
		  // error handling
		  setErrorMessage('Failed to fetch patients');
      	  setOpenSnackbar(true); // Show Snackbar when error occurs
		}
	}; 

	// useEffect to fetch data when the component mounts
	useEffect(() => {
		fetchPatients(); // Call the async function
	  }, []); // Empty array means this effect runs once when the component mounts

	// the columns for the table
	// headerName is what shows up on the website
	// width is the default width of the column, user can adjust it
	const columns = [
		{ field: 'id', headerName: 'ID' },
		{ field: 'first_name', headerName: 'First Name' },
		{ field: 'last_name', headerName: 'Last Name' },
		{ field: 'date_of_birth', headerName: 'Date of Birth' },
		{ field: 'address', headerName: 'Address' },
		{ field: 'phone_number', headerName: 'Phone Number' },
		{ field: 'email', headerName: 'Email' },
		{ field: 'insurance_name', headerName: 'Insurance Name' },
		{ field: 'insurance_group_number', headerName: 'Group Number' },
		{ field: 'insurance_member_id', headerName: 'Member ID' },
		{field : 'view_prescriptions', headerName: 'View Prescriptions', renderCell: (params) => (
			<Button 
			variant='contained' 
			color="primary" 
			onClick={() => handleViewPrescriptions(params.row.id)}  // Corrected the typo here
			>
				View Prescriptions
			</Button>
		)}//d
	  ];

	  const handleViewPrescriptions = (patientId) => {
		if (!patientId) {
			console.error("Patient ID is undefined");
			return;
		}
		navigate(`/viewofpatients/${patientId}/prescriptions`);
	};

	// all users can edit patients
	const canEdit = () => {
		// const userType = localStorage.getItem('userType');
		return true;
	};
	  
	// only pharmacists or pharmacy managers can delete
	const canDelete = () => {
		const role = localStorage.getItem('role');
		return role === 'Pharmacist' || role === 'Pharmacy Manager';
	};

	const deletePatient = async (id) => {
		try {
			console.log("row", id);
			const response = await fetch(`http://localhost:8000/patient/${id}`, {
				method: 'DELETE',
				headers: {'Authorization': 'Bearer ' + token}
			});
			if (!response.ok) {
				throw new Error('Failed to delete patient');
			}
			fetchPatients();
		} catch (error) {
			console.error('Error deleting patient:', error);
			setErrorMessage('Failed to delete patient' + error);
			setOpenSnackbar(true);
		}
	}

	/**
	 * @param {the data about the patient being added or edited that is send to the server} data 
	 * @param {the id of the patient being edited, should be null if adding a patient} id 
	 * @returns boolean indicating success or failure
	 */
	// this is 'onSave()'
	const addEditPatient = async (data, id) => {
		console.log("adding patient: ", data, id);
		try {
			if (id) {
				const result = await editPatient(data, id);
				console.log("editPatient result:", result);
				return result;
			} else {
				const result = await addPatient(data);
				console.log("addPatient result:", result);
				return result;
			}
		} catch (error) {
			console.error("Error in addEditPatient:", error);
			return false;
		}
	}
	/**
	 * @param {data sent to sever, contains the changes made to the patient} data 
	 * @param {the id of the patient being edited} id 
	 * @returns boolean indicating success or failure
	 */
	const editPatient = async (data, id) => {
		try {
			console.log("row in editPatient", id, data)
			const response = await fetch(`http://localhost:8000/patient/${id}`, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json',
					'Authorization': 'Bearer ' + token,
				},
				body: JSON.stringify(data),
			});
			if (!response.ok) {
				const responseData = await response.json(); // Wait for the JSON to be parsed
				console.log("Error detail from response:", responseData.detail[0].msg);
				throw new Error(responseData.detail[0].msg);
			}
			fetchPatients();
			return true;
		} catch (error) {
			setErrorMessage('Failed to update patient');
			setOpenSnackbar(true);
			return false;
		}
	}
	/**

	 * @param {the data being sent to the server used to create a new patient} data 
	 * @returns boolean indicating success or failure
	 */
	const addPatient = async (data) => {
		try {
			console.log("row in addPatient", data)
			const response = await fetch(`http://localhost:8000/patient`, {
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
			fetchPatients();
			return true;
			
		} catch (error) {
			setErrorMessage('Failed to add patient: ' + error);
			setOpenSnackbar(true);
			return false;
		}
	}

	// Handle closing of the Snackbar
	const handleCloseSnackbar = () => {
		setOpenSnackbar(false);
	};

	// the message format that should get used in the delete confirmation modal (popup) for this table
	// need this since we want a different format on other tables that use this same base component
	const patientConfirmMessage = (row) =>
		`${row?.first_name || "Unknown First Name"} ${
			row?.last_name || "Unknown Last Name"
		}, with DOB ${row?.date_of_birth || "Unknown DOB"}`;

	const openAddPatientModal = useRef(null);

	return (
		<div>
		  <h2>Patients Table</h2>
			<Button
			  variant="contained"
			  onClick={() => {
				if (openAddPatientModal.current) {
				  openAddPatientModal.current(); // Trigger modal to open for adding a patient
				}
			  }}
			>
			  Add Patient
			</Button>
	  
		  <EditDeleteTable
			rows={rows}
			columns={columns}
			editModal={AddEditPatientModal}
			deleteModal={DeleteModal}
			showEditButton={canEdit()}
			showDeleteButton={canDelete()}
			customConfirmMessage={patientConfirmMessage}
			onAdd={(handler) => {
			  openAddPatientModal.current = handler; // Store the open modal handler
			}}
			onEdit={addEditPatient}
			onConfirmDelete={deletePatient}
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
export default ViewOfPatients;
