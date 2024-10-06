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
	// useEffect to fetch data when the component mounts
	useEffect(() => {
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
	
		fetchPatients(); // Call the async function
	  }, []); // Empty array means this effect runs once when the component mounts

	  const columns = [
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
	

	// the message format that should get used in the delete confirmation modal (popup) for this table
	// need this since we want a different format on other tables that use this same base component
	const patientConfirmMessage = (row) =>
		`${row?.firstName || "Unknown First Name"} ${
			row?.lastName || "Unknown Last Name"
		}, with DOB ${row?.dateOfBirth || "Unknown DOB"}`;

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
			customConfirmMessage={patientConfirmMessage}
			onAdd={(handler) => {
			  openAddPatientModal.current = handler; // Store the open modal handler
			}}
		  />
		</div>
	  );
	  
}
export default ViewOfPatients;
