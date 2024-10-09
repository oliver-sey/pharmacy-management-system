// This is a component for editing a patient, and adding a new patient
// the same modal (popup) gets used for both, but when you are editing, the fields in the popup
// have the values from the existing patient

import React, { useState, useEffect } from "react";
import {
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	Button,
	TextField,
} from "@mui/material";

// for the date input component
// import { Dayjs } from 'dayjs';
// import { DatePicker } from '@mui/x-date-pickers/DatePicker';

const AddEditPatientModal = ({ open, onClose, row, onSave }) => {
	// Initialize form data
	const [formData, setFormData] = useState({
		id: "",
		first_name: "",
		last_name: "",
		date_of_birth: "",
		address: "",
		phone_number: "",
		email: "",
		insurance_name: "",
		insurance_group_number: "",
		insurance_member_id: "",
	});

	// Update form data when the row prop changes
	useEffect(() => {
		if (row) {
			setFormData({
				first_name: row.first_name || "",
				last_name: row.last_name || "",
				date_of_birth: row.date_of_birth || "",
				address: row.address || "",
				phone_number: row.phone_number || "",
				email: row.email || "",
				insurance_name: row.insurance_name || "",
				insurance_group_number: row.insurance_group_number || "",
				insurance_member_id: row.insurance_member_id || "",
			});
		} else {
			// Reset to empty fields when adding a new patient
			setFormData({
				first_name: "",
				last_name: "",
				date_of_birth: "",
				address: "",
				phone_number: "",
				email: "",
				insurance_name: "",
				insurance_group_number: "",
				insurance_member_id: "",
			});
		}
	}, [row]);

	// Update form data on input change
	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	// Handle saving of the updated data
	const handleSave = () => {
		onSave(formData, row?.id); // Pass updated form data to parent component
		onClose(); // Close the modal
	};

	// **************new stuff
	
	const [formErrors, setFormErrors] = useState({
		first_name: '',
		last_name: '',
		date_of_birth: '',
		address: '',
		phone_number: '',
		email: '',
		insurance_name: '',
		insurance_group_number: '',
		insurance_member_id: ''
	});

	// Track fields that have been touched
	// since it would be annoying to give an error message before the user has finished entering text into that box
	// so we will wait until after they are done and have "touched" it
	const [touched, setTouched] = useState({}); 

	const validateFieldsDirectly = (fieldName, value) => {
		let errors = { ...formErrors };
	
		const validateField = () => {
			switch (fieldName) {
				case 'first_name':
					errors.first_name = !value ? 'First name is required' : '';
					break;
				case 'last_name':
					errors.last_name = !value ? 'Last name is required' : '';
					break;
				case 'date_of_birth':
					errors.date_of_birth = !value ? 'Date of birth is required' : '';
					break;
				case 'address':
					errors.address = !value ? 'Address is required' : '';
					break;
				case 'phone_number':
					if (!value) {
						errors.phone_number = 'Phone number is required';
					} else if (/[A-Za-z]/.test(value)) {
						errors.phone_number = 'Phone number cannot contain letters';
					} else {
						errors.phone_number = '';
					}
					break;
				case 'email':
					if (!value) {
						errors.email = 'Email is required';
					} else if (!/\S+@\S+\.\S+/.test(value)) {
						errors.email = 'Email is invalid';
					} else {
						errors.email = '';
					}
					break;
				case 'insurance_name':
					errors.insurance_name = !value ? 'Insurance name is required' : '';
					break;
				case 'insurance_group_number':
					errors.insurance_group_number = !value ? 'Insurance group number is required' : '';
					break;
				case 'insurance_member_id':
					errors.insurance_member_id = !value ? 'Insurance member ID is required' : '';
					break;
				default:
					break;
			}
		};
	
		validateField();
	
		setFormErrors(errors);
	};
	
	// Validate field on focus to re-check errors when the user clicks back in
	const handleFocus = (e) => {
		const fieldName = e.target.name;
	// 	// setTouched((prevTouched) => ({ ...prevTouched, [fieldName]: true }));

	// 	// Re-validate field when user focuses back on it
	// 	validateFields(fieldName);
	};

	// Adjust handleFieldChange to validate immediately if the field has already been touched once
	const handleFieldChange = (e) => {
		const { name, value } = e.target;
	
		// Update the form data immediately
		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));
	
		// Perform immediate validation based on the latest input value
		if (touched[name]) {
			validateFieldsDirectly(name, value);
		}
	};
	

	// HandleBlur ensures that validation is performed only when the user blurs the input for the first time
	const handleBlur = (e) => {
		const fieldName = e.target.name;
		const fieldValue = e.target.value;  // Get the field's current value
		
		// Mark the field as touched after it is blurred
		setTouched((prevTouched) => ({
			...prevTouched,
			[fieldName]: true
		}));
		
		// Run validation only when the field is blurred
		validateFieldsDirectly(fieldName, fieldValue);
	};

	
	const handleSaveWithValidation = () => {
		// Flag to check if all fields are valid
		let allValid = true;
	
		// Validate each field in formData
		Object.keys(formData).forEach((fieldName) => {
			const fieldValue = formData[fieldName];
			validateFieldsDirectly(fieldName, fieldValue);
	
			// If there's an error, mark form as invalid
			if (formErrors[fieldName]) {
				allValid = false;
			}
		});
	
		// If all fields are valid, proceed with saving
		if (allValid) {
			handleSave();
		}
	};
	

	return (
		<Dialog open={open} onClose={onClose}>
			<DialogTitle>{row ? "Edit Patient" : "Add Patient"}</DialogTitle>
			<DialogContent>
				<TextField
					label="First Name"
					name="first_name"
					value={formData.first_name}
					onChange={handleFieldChange}
					onBlur={handleBlur}
					onFocus={handleFocus}
					error={!!formErrors.first_name && touched.first_name}
					helperText={touched.first_name && formErrors.first_name}
					fullWidth
					margin="dense"
				/>
				<TextField
					label="Last Name"
					name="last_name"
					value={formData.last_name}
					onChange={handleFieldChange}
					onBlur={handleBlur}
					onFocus={handleFocus}
					error={!!formErrors.last_name && touched.last_name}
					helperText={touched.last_name && formErrors.last_name}
					fullWidth
					margin="dense"
				/>
				<TextField
					label="Date of Birth"
					name="date_of_birth"
					value={formData.date_of_birth}
					onChange={handleFieldChange}
					onBlur={handleBlur}
					onFocus={handleFocus}
					error={!!formErrors.date_of_birth && touched.date_of_birth}
					helperText={touched.date_of_birth && formErrors.date_of_birth}
					fullWidth
					margin="dense"
				/>
				<TextField
					label="Address"
					name="address"
					value={formData.address}
					onChange={handleFieldChange}
					onBlur={handleBlur}
					onFocus={handleFocus}
					error={!!formErrors.address && touched.address}
					helperText={touched.address && formErrors.address}
					fullWidth
					margin="dense"
				/>
				<TextField
					label="Phone Number"
					name="phone_number"
					value={formData.phone_number}
					onChange={handleFieldChange}
					onBlur={handleBlur}
					onFocus={handleFocus}
					error={!!formErrors.phone_number && touched.phone_number}
					helperText={touched.phone_number && formErrors.phone_number}
					fullWidth
					margin="dense"
				/>
				<TextField
					label="Email"
					name="email"
					value={formData.email}
					onChange={handleFieldChange}
					onBlur={handleBlur}
					onFocus={handleFocus}
					error={!!formErrors.email && touched.email}
					helperText={touched.email && formErrors.email}
					fullWidth
					margin="dense"
				/>
				<TextField
					label="Insurance Name"
					name="insurance_name"
					value={formData.insurance_name}
					onChange={handleFieldChange}
					onBlur={handleBlur}
					onFocus={handleFocus}
					error={!!formErrors.insurance_name && touched.insurance_name}
					helperText={touched.insurance_name && formErrors.insurance_name}
					fullWidth
					margin="dense"
				/>
				<TextField
					label="Insurance Group #"
					name="insurance_group_number"
					value={formData.insurance_group_number}
					onChange={handleFieldChange}
					onBlur={handleBlur}
					onFocus={handleFocus}
					error={!!formErrors.insurance_group_number && touched.insurance_group_number}
					helperText={touched.insurance_group_number && formErrors.insurance_group_number}
					fullWidth
					margin="dense"
				/>
				<TextField
					label="Insurance Member ID"
					name="insurance_member_id"
					value={formData.insurance_member_id}
					onChange={handleFieldChange}
					onBlur={handleBlur}
					onFocus={handleFocus}
					error={!!formErrors.insurance_member_id && touched.insurance_member_id}
					helperText={touched.insurance_member_id && formErrors.insurance_member_id}
					fullWidth
					margin="dense"
				/>

			</DialogContent>
			<DialogActions>
				<Button onClick={onClose}>Cancel</Button>
				<Button onClick={handleSaveWithValidation} color="primary">
					{row ? "Save Changes" : "Add Patient"}
				</Button>
			</DialogActions>
		</Dialog>
	);
};

export default AddEditPatientModal;
