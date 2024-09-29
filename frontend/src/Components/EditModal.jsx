// a component for a modal for editing
// I think this only gets used as a default, and always gets replaced with a different modal
// TODO: figure this out

import React, { useState } from "react";
import {
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	Button,
	TextField,
} from "@mui/material";

const EditModal = ({ open, onClose, row, onSave }) => {
	// Initialize form data with the values from the selected row
	const [formData, setFormData] = useState({
		firstName: row?.firstName || "",
		lastName: row?.lastName || "",
	});

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
			<DialogTitle>Edit Details</DialogTitle>
			<DialogContent>
				<TextField
					label="First Name"
					name="firstName"
					value={formData.firstName}
					onChange={handleChange}
					fullWidth
					margin="dense"
				/>
				<TextField
					label="Last Name"
					name="lastName"
					value={formData.lastName}
					onChange={handleChange}
					fullWidth
					margin="dense"
				/>
			</DialogContent>
			<DialogActions>
				<Button onClick={onClose}>Cancel</Button>
				<Button onClick={handleSave} color="primary">
					Save
				</Button>
			</DialogActions>
		</Dialog>
	);
};

export default EditModal;
