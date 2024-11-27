import { React, useRef, useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';import { Snackbar, Alert, Button} from "@mui/material";

import EditDeleteTable from "../Components/EditDeleteTable";
import AddEditPrescriptionModal from "../Components/AddEditPrescriptionModal";
import DeleteModal from "../Components/DeleteModal";
import CheckUserType from "../Functions/CheckUserType";

function ViewOfPrescriptions() {
	// the columns for the table
	// headerName is what shows up on the website
	// width is the default width of the column, user can adjust it
	const [rows, setRows] = useState([]);
	const [errorMessage, setErrorMessage] = useState(null);
	const [openSnackbar, setOpenSnackbar] = useState(false);
	const navigate = useNavigate();
    const role = ['Pharmacist', 'Pharmacy Manager']
	const token = localStorage.getItem('token');


	// Async function to fetch presciptions data
	const fetchPrescriptions = async () => {
		try {
		  const response = await fetch('http://localhost:8000/prescriptions', {
			headers: { 'Authorization': 'Bearer ' + token }
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
				headers: { 'Authorization': 'Bearer ' + token }
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
				headers: { 'Authorization': 'Bearer ' + token }
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
				headers: { 'Authorization': 'Bearer ' + token }
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

    const loadRows = async () => {
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
          
            return {
              ...prescription,
              // Replace patient_id with patient_name
              patient_name: patient ? patient.first_name + ' ' + patient.last_name : 'Unknown Patient',
              // Replace medication_id with medication_name
              medication_name: medication ? medication.name + ", " + medication.dosage : 'Unknown Medication',

              user_filled_name: filled_user ? filled_user.first_name + ' ' + filled_user.last_name : null,

              user_entered_name: entered_user ? entered_user.first_name + ' ' + entered_user.last_name : null
            
              
            };
          });

          updatedPrescriptions.forEach(prescription => {
            delete prescription.patient_id;
            delete prescription.medication_id;
            delete prescription.user_entered_id;
            delete prescription.user_filled_id
          });

        setRows(updatedPrescriptions)
    }

	// useEffect to fetch data when the component mounts
	useEffect(() => {
		loadRows(); 
	  }, []);

	  const columns = [
		{ field: 'id', headerName: 'ID' },
		{ field: 'medication_name', headerName: 'Medication' },
		{ field: 'quantity', headerName: 'Quantity'},
		{ field: 'patient_name', headerName: 'Patient' },
		{ field: 'date_prescribed', headerName: 'Date Prescribed' },
        { field: 'user_entered_name', headerName: 'Entered By' },
		{ field: 'doctor_name', headerName: 'Prescribing Doctor' },
		{ field: 'user_filled_name', headerName: 'Filled By' },
		{ field: 'filled_timestamp', headerName: 'Date Filled' }
	  ];

	// all users can edit prescriptions
	const canEdit = () => {
		return true;
	};
	  
	// only pharmacists or pharmacy managers can delete
	const canDelete = () => {
		const role = localStorage.getItem('role');
		return role === 'Pharmacist' || role === 'Pharmacy Manager';
	};

	const deletePrescription = async (id) => {
		try {
			const response = await fetch(`http://localhost:8000/prescription/${id}`, {
				method: 'DELETE',
				headers: {
					'Authorization': 'Bearer ' + token,
				},
			});
			if (!response.ok) {
				throw new Error('Failed to delete prescription');
			}
			loadRows();
		} catch (error) {
			console.error('Error deleting prescription:', error);
			setErrorMessage('Failed to delete prescription' + error);
			setOpenSnackbar(true);
		}
	}

	/**
	 * @param {the data about the patient being added or edited that is send to the server} data 
	 * @param {the id of the patient being edited, should be null if adding a patient} id 
	 * @returns boolean indicating success or failure
	 */
	const addEditPrescription = async (data, id) => {
		if (id) {
			editPrescription(data, id)
		} else {
			handleSavePrescription(data)
		}
		
	}
	/**
	 * @param {data sent to sever, contains the changes made to the prescription} data 
	 * @param {the id of the prescription being edited} id 
	 * @returns boolean indicating success or failure
	 */
	const editPrescription = async (data, id) => {
		try {
			const response = await fetch(`http://localhost:8000/prescription/${id}`, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json',
					'Authorization': 'Bearer ' + token,
				},
				body: JSON.stringify(data),
			});
			if (!response.ok) {
				const responseData = await response.json(); // Wait for the JSON to be parsed
				throw new Error(responseData.detail[0].msg);
			}
			loadRows();
			return true;
		} catch (error) {
			setErrorMessage('Failed to update prescription');
			setOpenSnackbar(true);
			return false;
		}
	}
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
			loadRows();
			return true;
			
		} catch (error) {
			setErrorMessage('Failed to add prescription: ' + error);
			setOpenSnackbar(true);
			return false;
		}
	}

    const handleSavePrescription = (formData) => {
        CheckUserType(role, navigate)
        .then((curr_user_data) => addPrescription({
          patient_id: formData.patient,
          user_entered_id: curr_user_data.id, 
          user_filled_id: null,
          filled_timestamp: null,
          medication_id: formData.medication,
          doctor_name: formData.prescribing_doctor,
          quantity: formData.quantity
        }))
  
      };

	// Handle closing of the Snackbar
	const handleCloseSnackbar = () => {
		setOpenSnackbar(false);
	};

	// the message format that should get used in the delete confirmation modal (popup) for this table
	// need this since we want a different format on other tables that use this same base component
	const prescriptionConfirmMessage = (row) =>
		`${row?.first_name || "Unknown First Name"} ${
			row?.last_name || "Unknown Last Name"
		}, with DOB ${row?.date_of_birth || "Unknown DOB"}`;

	const openAddPrescriptionModal = useRef(null);

	return (
		<div>
		  <h2>Prescriptions</h2>
			<Button
			  variant="contained"
			  onClick={() => {
				if (openAddPrescriptionModal.current) {
				  openAddPrescriptionModal.current(); // Trigger modal to open for adding a prescription
				}
			  }}
			>
			  Add Prescription
			</Button>
	  
		  <EditDeleteTable
			rows={rows}
			columns={columns}
			editModal={AddEditPrescriptionModal}
			deleteModal={DeleteModal}
			showEditButton={canEdit()}
			showDeleteButton={canDelete()}
			customConfirmMessage={prescriptionConfirmMessage}
			onAdd={(handler) => {
			  openAddPrescriptionModal.current = handler; // Store the open modal handler
			}}
			onEdit={addEditPrescription}
			onConfirmDelete={deletePrescription}
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
export default ViewOfPrescriptions;
