import { React, useRef, useState, useEffect } from "react";

import EditDeleteTable from "../Components/EditDeleteTable";
import AddEditPatientModal from "../Components/AddEditPatientModal";
import DeleteModal from "../Components/DeleteModal";
import Button from "@mui/material/Button";

function ViewOfPatients() {
	// the columns for the table
	// headerName is what shows up on the website
	// width is the default width of the column, user can adjust it
	const [rows, setRows] = useState([]);

	// Async function to fetch patients data
	const fetchPatients = async () => {
		try {
		  const response = await fetch('http://localhost:8000/patients');
		  const data = await response.json(); // Convert response to JSON
		  setRows(data); // Update rows state with fetched data
		} catch (error) {
		  console.error('Error fetching patients:', error);
		}
	}; 

	// useEffect to fetch data when the component mounts
	useEffect(() => {
		fetchPatients(); // Call the async function
	  }, []); // Empty array means this effect runs once when the component mounts

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
		{ field: 'insurance_member_id', headerName: 'Member ID' }
	  ];

	// all users can edit patients
	const canEdit = () => {
		// const userType = localStorage.getItem('userType');
		// TODO: should we do this with no checks?
		return true;
	};
	  
	// only pharmacists or pharmacy managers can delete
	const canDelete = () => {
		const role = localStorage.getItem('role');
		return role === 'pharmacist' || role === 'pharmacymanager';
	};

	const deletePatient = async (id) => {
		try {
			console.log("row", id);
			const response = await fetch(`http://localhost:8000/patient/${id}`, {
				method: 'DELETE',
			});
			if (!response.ok) {
				throw new Error('Failed to delete patient');
			}
			fetchPatients();
		} catch (error) {
			console.error('Error deleting patient:', error);
		}
	}

	const addEditPatient = async (data, id) => {
		if (id) {
			editPatient(data, id);
		} else {
			addPatient(data);
		}
	}

	const editPatient = async (data, id) => {
		try {
			
			console.log("row in editPatient", id, data)
			const response = await fetch(`http://localhost:8000/patient/${id}`, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(data),
			});
			if (!response.ok) {
				throw new Error('Failed to update patient');
			}
			fetchPatients();
		} catch (error) {
			console.error('Error updating patient:', error);
		}
	}

	const addPatient = async (data) => {
		try {
			console.log("row in addPatient", data)
			const response = await fetch(`http://localhost:8000/patient`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(data),
			});
			if (!response.ok) {
				throw new Error('Failed to add patient');
			}
			fetchPatients();
		} catch (error) {
			console.error('Error adding patient:', error);
		}
	}

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
		</div>
	  );
	  
}
export default ViewOfPatients;
