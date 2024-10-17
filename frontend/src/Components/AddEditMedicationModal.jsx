// This is a component for editing a medication, and adding a new medication
// the same modal (popup) gets used for both, but when you are editing, the fields in the popup
// have the values from the existing medication


import React, { useState, useEffect } from "react";
import {
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	Button,
	TextField,
} from "@mui/material";

const AddEditMedicationModal = ({ open, onClose, row, onSave }) => {
	// Initialize form data for medication
	const [formData, setFormData] = useState({
		name: "",
		dosage: "",
		quantity: "",
		prescription_required: "",
		expiration_date: "",
		dollars_per_unit: "",
	});

	// Initialize error state for each field
	const [formErrors, setFormErrors] = useState({
		name: '',
		dosage: '',
		quantity: '',
		prescription_required: '',
		expiration_date: '',
		dollars_per_unit: ''
	});

	// Track which fields have been touched
	const [touched, setTouched] = useState({});

	// Function to reset the form and errors based on whether we're adding or editing
	useEffect(() => {
		const resetForm = () => {
			setFormData({
				name: row?.name || "",
				dosage: row?.dosage || "",
				quantity: row?.quantity || "",
				prescription_required: row?.prescription_required || "",
				expiration_date: row?.expiration_date || "",
				dollars_per_unit: row?.dollars_per_unit || "",
			});

			setFormErrors({
				name: '',
				dosage: '',
				quantity: '',
				prescription_required: '',
				expiration_date: '',
				dollars_per_unit: ''
			});

			setTouched({});
		};

		if (open) {
			resetForm();
		}
	}, [open, row]);

	// Validate specific field based on its name and value
	const validateFieldsDirectly = (fieldName, value) => {
		let errors = { ...formErrors };

		const validateField = () => {
			switch (fieldName) {
				case 'name':
					errors.name = !value ? 'Medication name is required' : '';
					break;
				case 'dosage':
					errors.dosage = !value ? 'Dosage is required' : '';
					break;

				case 'quantity':
					if (!value) {
						errors.quantity = 'Quantity is required';
					} else if (!/^[1-9]\d*$/.test(value)) {
						errors.quantity = 'Quantity must be a positive integer';
					} else {
						errors.quantity = '';
					}
					break;
				case 'prescription_required':
					if (!value) {
						errors.prescription_required = 'Prescription required field is required';
					} else if (String(value) !== "true" && String(value) !== "false") {
						errors.prescription_required = 'Prescription required must be either "true" or "false", lowercase';
					} else {
						errors.prescription_required = '';
					}
					break;
				case 'expiration_date':
					if (!value) {
						errors.expiration_date ='Expiration date is required';
					}
					// expect a ####-##-## format 
					else if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
						errors.expiration_date = 'Expiration date must be in the format YYYY-MM-DD';
					}
					else {
						errors.expiration_date = '';
					}
					break;
				case 'dollars_per_unit':
					if (!value) {
						errors.dollars_per_unit = 'Dollars per unit is required';
					} else if (!/^\d+(\.\d+)?$/.test(value) || parseFloat(value) < 0) {
						errors.dollars_per_unit = 'Dollars per unit must be a positive number';
					} else {
						errors.dollars_per_unit = '';
					}
					break;
				default:
					break;
			}
		};

		validateField();
		setFormErrors(errors);
	};

	// Handle field changes and immediate validation if the field has already been touched
	const handleFieldChange = (e) => {
		const { name, value } = e.target;

		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));

		if (touched[name]) {
			validateFieldsDirectly(name, value);
		}
	};

	// Mark the field as touched and perform validation when the field loses focus (onBlur)
	const handleBlur = (e) => {
		const { name, value } = e.target;

		setTouched((prevTouched) => ({
			...prevTouched,
			[name]: true,
		}));

		validateFieldsDirectly(name, value);
	};

	// Validate all fields before saving the medication
	const handleSaveWithValidation = () => {
		let allValid = true;

		// Validate all fields
		Object.keys(formData).forEach((fieldName) => {
			const fieldValue = formData[fieldName];
			validateFieldsDirectly(fieldName, fieldValue);

			// If there's an error, mark the form as invalid
			if (formErrors[fieldName]) {
				allValid = false;
			}
		});

		if (allValid) {
			// onSave(formData); // Call onSave function passed as prop with valid form data
			// onClose();        // Close the modal
			handleSave();
		}
	};

	// Handle saving of the updated data
	const handleSave = () => {
		onSave(formData, row?.id); // Pass updated form data to parent component
		onClose(); // Close the modal
	};

	return (
		<Dialog open={open} onClose={onClose}>
			<DialogTitle>{row ? "Edit Medication" : "Add Medication"}</DialogTitle>
			<DialogContent>
				<TextField
					label="Medication Name"
					name="name"
					value={formData.name}
					onChange={handleFieldChange}
					onBlur={handleBlur}
					error={!!formErrors.name && touched.name}
					helperText={touched.name && formErrors.name}
					fullWidth
					margin="dense"
				/>
				<TextField
					label="Dosage"
					name="dosage"
					value={formData.dosage}
					onChange={handleFieldChange}
					onBlur={handleBlur}
					error={!!formErrors.dosage && touched.dosage}
					helperText={touched.dosage && formErrors.dosage}
					fullWidth
					margin="dense"
				/>
				<TextField
					label="Quantity"
					name="quantity"
					value={formData.quantity}
					onChange={handleFieldChange}
					onBlur={handleBlur}
					error={!!formErrors.quantity && touched.quantity}
					helperText={touched.quantity && formErrors.quantity}
					fullWidth
					margin="dense"
				/>
				<TextField
					label="Prescription Required"
					name="prescription_required"
					value={formData.prescription_required}
					onChange={handleFieldChange}
					onBlur={handleBlur}
					error={!!formErrors.prescription_required && touched.prescription_required}
					helperText={touched.prescription_required && formErrors.prescription_required}
					fullWidth
					margin="dense"
				/>
				<TextField
					label="Expiration Date"
					name="expiration_date"
					value={formData.expiration_date}
					onChange={handleFieldChange}
					onBlur={handleBlur}
					error={!!formErrors.expiration_date && touched.expiration_date}
					helperText={touched.expiration_date && formErrors.expiration_date}
					fullWidth
					margin="dense"
				/>
				<TextField
					label="Dollars per Unit"
					name="dollars_per_unit"
					value={formData.dollars_per_unit}
					onChange={handleFieldChange}
					onBlur={handleBlur}
					error={!!formErrors.dollars_per_unit && touched.dollars_per_unit}
					helperText={touched.dollars_per_unit && formErrors.dollars_per_unit}
					fullWidth
					margin="dense"
				/>
			</DialogContent>
			<DialogActions>
				<Button onClick={onClose}>Cancel</Button>
				<Button 
					onClick={handleSaveWithValidation} 
					color="primary"
					disabled={Object.values(formErrors).some(error => error !== '')}
				>
					{row ? "Save Changes" : "Add Medication"}
				</Button>
			</DialogActions>
		</Dialog>
	);
};

export default AddEditMedicationModal;
