// EditModal.jsx
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
				<TextField
					label="Date of Birth"
					name="dateOfBirth"
					value={formData.dateOfBirth}
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
					name="phoneNumber"
					value={formData.phoneNumber}
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
					name="insuranceName"
					value={formData.insuranceName}
					onChange={handleChange}
					fullWidth
					margin="dense"
				/>
				<TextField
					label="Insurance Group #"
					name="insuranceGroupNum"
					value={formData.insuranceGroupNum}
					onChange={handleChange}
					fullWidth
					margin="dense"
				/>
				<TextField
					label="Insurance Member ID"
					name="insuranceMemberID"
					value={formData.insuranceMemberID}
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
