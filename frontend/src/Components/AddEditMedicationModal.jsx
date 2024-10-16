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
	// Initialize form data
	const [formData, setFormData] = useState({
		name: "",
		dosage: "",
		quantity: "",
		prescription_required: "",
		expiration_date: "",
		dollars_per_unit: "",
	});

	// Update form data when the row prop changes
	useEffect(() => {
		if (row) {
			setFormData({
				name: row?.name || "",
				dosage: row?.dosage || "",
				quantity: row?.quantity || "",
				prescription_required: row?.prescription_required || "",
				expiration_date: row?.expiration_date || "",
				dollars_per_unit: row?.dollars_per_unit || "",
			});
		} else {
			// Reset to empty fields when adding a new patient
			setFormData({
				name: "",
				dosage: "",
				quantity: "",
				prescription_required: "",
				expiration_date: "",
				dollars_per_unit: "",
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
		onSave(formData); // Pass updated form data to parent component
	};

	return (
		<Dialog open={open} onClose={onClose}>
		{/* change the title based on if we are adding or editing,
		which we can tell from if row is null or not */}
			<DialogTitle>
				{row ? "Edit Medication" : "Add Medication"}
			</DialogTitle>
			
			{/* To be honest, I'm not sure what fullWidth and margin do, open to changing them */}
			<DialogContent>
				<TextField
					label="Medication Name"
					name="name"
					value={formData.name}
					onChange={handleChange}
					fullWidth
					margin="dense"
				/>
				<TextField
					label="Dosage"
					name="dosage"
					value={formData.dosage}
					onChange={handleChange}
					fullWidth
					margin="dense"
				/>
				<TextField
					label="Quantity"
					name="quantity"
					value={formData.quantity}
					onChange={handleChange}
					fullWidth
					margin="dense"
				/>
				<TextField
					label="Prescription Required"
					name="prescription_required"
					value={formData.prescription_required}
					onChange={handleChange}
					fullWidth
					margin="dense"
				/>
				<TextField
					label="Expiration Date"
					name="expiration_date"
					value={formData.expiration_date}
					onChange={handleChange}
					fullWidth
					margin="dense"
				/>
				<TextField
					label="$ Per Unit"
					name="dollars_per_unit"
					value={formData.dollars_per_unit}
					onChange={handleChange}
					fullWidth
					margin="dense"
				/>
			</DialogContent>
			<DialogActions>
				<Button onClick={onClose}>Cancel</Button>
				{/* change the button text based on if we are adding or editing,
				which we can tell from if row is null or not */}
				<Button onClick={handleSave} color="primary">
					{row ? "Save Changes" : "Add Medication"}
				</Button>
			</DialogActions>
		</Dialog>
	);
};

export default AddEditMedicationModal;
