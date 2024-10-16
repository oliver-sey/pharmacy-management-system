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
		console.log("in der")
		onSave(formData, row?.id); // Pass updated form data to parent component
		onClose(); // Close the modal
	};

	return (
		<Dialog open={open} onClose={onClose}>
			{/* depending on if row is not null or null, change the title from editing to adding a new patient */}
			<DialogTitle>{row ? "Edit Patient" : "Add Patient"}</DialogTitle>
			<DialogContent>
				{/* Fields for editing/adding patient */}
				<TextField
					label="First Name"
					name="first_name"
					value={formData.first_name}
					onChange={handleChange}
					fullWidth
					margin="dense"
				/>
				<TextField
					label="Last Name"
					name="last_name"
					value={formData.last_name}
					onChange={handleChange}
					fullWidth
					margin="dense"
				/>
				<TextField
					label="Date of Birth"
					name="date_of_birth"
					value={formData.date_of_birth}
					onChange={handleChange}
					fullWidth
					margin="dense"
				/>
				<TextField
					label="Address"
					name="address"
					value={formData.address}
					onChange={handleChange}
					fullWidth
					margin="dense"
				/>
				<TextField
					label="Phone Number"
					name="phone_number"
					value={formData.phone_number}
					onChange={handleChange}
					fullWidth
					margin="dense"
				/>
				<TextField
					label="Email"
					name="email"
					value={formData.email}
					onChange={handleChange}
					fullWidth
					margin="dense"
				/>
				<TextField
					label="Insurance Name"
					name="insurance_name"
					value={formData.insurance_name}
					onChange={handleChange}
					fullWidth
					margin="dense"
				/>
				<TextField
					label="Insurance Group #"
					name="insurance_group_number"
					value={formData.insurance_group_number}
					onChange={handleChange}
					fullWidth
					margin="dense"
				/>
				<TextField
					label="Insurance Member ID"
					name="insurance_member_id"
					value={formData.insurance_member_id}
					onChange={handleChange}
					fullWidth
					margin="dense"
				/>
			</DialogContent>
			<DialogActions>
				<Button onClick={onClose}>Cancel</Button>
				<Button onClick={handleSave} color="primary">
					{/* depending on if row is not null or null, change the text from saving edits to adding a new patient */}
					{row ? "Save Changes" : "Add Patient"}
				</Button>
			</DialogActions>
		</Dialog>
	);
};

export default AddEditPatientModal;
