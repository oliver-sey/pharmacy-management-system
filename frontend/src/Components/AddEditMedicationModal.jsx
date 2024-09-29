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
		dosageStr: "",
		quantity: "",
		prescriptionRequired: "",
		expirationDate: "",
		dollarsPerUnit: "",
	});

	// Update form data when the row prop changes
	useEffect(() => {
		if (row) {
			setFormData({
				name: row?.name || "",
				dosageStr: row?.dosageStr || "",
				quantity: row?.quantity || "",
				prescriptionRequired: row?.prescriptionRequired || "",
				expirationDate: row?.expirationDate || "",
				dollarsPerUnit: row?.dollarsPerUnit || "",
			});
		} else {
			// Reset to empty fields when adding a new patient
			setFormData({
				name: "",
				dosageStr: "",
				quantity: "",
				prescriptionRequired: "",
				expirationDate: "",
				dollarsPerUnit: "",
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
					name="dosageStr"
					value={formData.dosageStr}
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
					name="prescriptionRequired"
					value={formData.prescriptionRequired}
					onChange={handleChange}
					fullWidth
					margin="dense"
				/>
				<TextField
					label="Expiration Date"
					name="expirationDate"
					value={formData.expirationDate}
					onChange={handleChange}
					fullWidth
					margin="dense"
				/>
				<TextField
					label="$ Per Unit"
					name="dollarsPerUnit"
					value={formData.dollarsPerUnit}
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
