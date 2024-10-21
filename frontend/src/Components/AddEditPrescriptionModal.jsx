// This is a component for editing a prescription, and adding a new prescription
// the same modal (popup) gets used for both, but when you are editing, the fields in the popup

//NOTES: will have to collect the patient, user, and medication ID on the backend
//also will have to set the filled ID and time of fill as null if adding prescription

import React, { useState, useEffect, useMemo } from "react";
import {
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	Button,
	TextField,
	DialogContentText,
} from "@mui/material";
import "../Styles/SearchBar.css"

const AddEditPrescriptionModal = ({ open, onClose, row, onSave }) => {
	// Initialize form data
	const [formData, setFormData] = useState({
		medication: "",
		patient: "",
		quantity: "",
		doctor_name: ""
	});

	const [medication_data, set_medication_data] = useState([]);
	const [patient_data, set_patient_data] = useState([])
	const [valid_patient, set_valid_patient] = useState(true)
	const [valid_medication, set_valid_medication] = useState(true)
	
	// Update form data on input change
	const onSearchChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
		set_valid_patient(true)
		set_valid_medication(true)
	};

	const onSearchSelect = (field, searchTerm) => {
		setFormData((prev) => ({ ...prev, [field]: searchTerm }));
	}

	const fetchMedication = async () => {
		try {
		  const response = await fetch('http://localhost:8000/medicationlist');
		  const data = await response.json(); // Convert response to JSON
		  const list = []
		  data.map((info) => { list.push({id: info.id, name: info.name + ", " + info.dosage}) })
		  
		  set_medication_data(list)
		} catch (error) {
		  console.error('Error fetching medication:', error);
		}
	}; 

	const fetchPatients = async () => {
		try {
		  const response = await fetch('http://localhost:8000/patients');
		  const data = await response.json(); // Convert response to JSON
		  const list = []
		  data.map((info) => { list.push({id: info.id, name: info.first_name + " " + info.last_name}) })
		  set_patient_data(list)
		} catch (error) {
		  console.error('Error fetching patients:', error);
		}
	}; 

	// useEffect to fetch data when the component mounts
	useEffect(() => {
		
		fetchPatients();
		fetchMedication(); // Call the async function
		set_valid_medication(true)
		set_valid_medication(true)

		console.log(valid_medication)
	  }, [formData]);

	// Update form data when the row prop changes
	useEffect(() => {
		if (row) {
			
			setFormData({
				medication: row?.medication_name || "",
				patient: row?.patient_name || "",
				quantity: row?.quantity || "",
				doctor_name: row?.doctor_name || ""
			});
		} else {
			// Reset to empty fields when adding a new patient
			setFormData({
				medication: "",
				patient: "",
				quantity: "",
				doctor_name: ""
			});
		}
	}, [row]);

	// Update form data on input change
	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	const checkValidPatient = () => {
		const patient_names = patient_data.map((item) => (item.name))
		if (!patient_names.includes(formData.patient)) {
			set_valid_patient(false)
			return false
		} 
		return true
	}

	const checkValidMedication = () => {
		const medication_names = medication_data.map((item) => (item.name))
		if (!medication_names.includes(formData.medication)) {
			set_valid_medication(false)
			return false
		}
		return true
	}

	// Handle saving of the updated data
	const handleSave = () => {
		const medication_valid = checkValidMedication()
		const patient_valid = checkValidPatient()

		if (medication_valid && patient_valid) {
			const patient_id = patient_data.filter(item => {
				const searchTerm = formData.patient.toLowerCase();
				const patient_name = item.name.toLowerCase();

				return patient_name === searchTerm;
			}).map(item => (item.id))[0].toString();

			const medication_id = medication_data.filter(item => {
				const searchTerm = formData.medication.toLowerCase();
				const medication_name = item.name.toLowerCase();

				return medication_name === searchTerm;
			}).map(item => (item.id))[0].toString();

			
			const data_to_return = {...formData, medication: medication_id, patient: patient_id}

			setFormData((prev) => ({medication: medication_id, patient: patient_id, ...prev}));
			
			onSave(data_to_return, row?.id); // Pass updated form data to parent component
			onClose()
		}
	};

	return (
		<Dialog open={open} onClose={onClose}>
		{/* change the title based on if we are adding or editing,
		which we can tell from if row is null or not */}
			<DialogTitle>
				{row ? "Edit Prescription" : "Add Prescription"}
			</DialogTitle>
			
			{/* To be honest, I'm not sure what fullWidth and margin do, open to changing them */}
			<DialogContent>
				<TextField
					label="Medication Name"
					name="medication"
					value={formData.medication}
					onChange={onSearchChange}
					fullWidth
					margin="dense"
				/>
				<DialogContentText>
				<div className="dropdown">
					{medication_data.filter(item => {
							
							const searchTerm = formData.medication.toLowerCase();
							const medication_name = item.name.toLowerCase();
							
						

							return searchTerm && medication_name.startsWith(searchTerm) && medication_name !== searchTerm;
						
					})
					.map(item => (<div onClick={() => onSearchSelect("medication", item.name)} className="dropdown-row">
						{item.name}
					</div> 
					))}
				</div>
				</DialogContentText>
				<TextField
					label="Patient"
					name="patient"
					value={formData.patient}
					onChange={onSearchChange}
					fullWidth
					margin="dense"
				/>
				<DialogContentText>
				<div className="dropdown">
					{patient_data.filter(item => {
						
							const searchTerm = formData.patient.toLowerCase();
							const patient_name = item.name.toLowerCase();
						

							return searchTerm && patient_name.startsWith(searchTerm) && patient_name !== searchTerm;
						
					})
					.map(item => (<div onClick={() => onSearchSelect("patient", item.name)} className="dropdown-row">
						{item.name}
					</div> 
					))}
				</div>
				</DialogContentText>
				<TextField
					label="quantity"
					name="quantity"
					value={formData.quantity}
					onChange={handleChange}
					fullWidth
					margin="dense"
				/>
				<TextField
					label="Prescribing Doctor"
					name="doctor_name"
					value={formData.doctor_name}
					onChange={handleChange}
					fullWidth
					margin="dense"
				/>
				<DialogContentText className="error-text">
					{!valid_medication && <p>Medication is not found.</p>}
				</DialogContentText>
				<DialogContentText className="error-text">
					{!valid_patient && <p>Patient is not found.</p>}
				</DialogContentText>
			</DialogContent>
			<DialogActions>
				<Button onClick={onClose}>Cancel</Button>
				{/* change the button text based on if we are adding or editing,
				which we can tell from if row is null or not */}
				<Button onClick={handleSave} color="primary">
					{row ? "Save Changes" : "Add Prescription"}
				</Button>
			</DialogActions>
		</Dialog>
	);
};

export default AddEditPrescriptionModal;
