// EditModal.jsx
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
		firstName: "",
		lastName: "",
		dateOfBirth: "",
		address: "",
		phoneNumberStr: "",
		email: "",
		insuranceName: "",
		insuranceGroupNum: "",
		insuranceMemberID: "",
	});

	// Update form data when the row prop changes
	useEffect(() => {
		if (row) {
			setFormData({
				firstName: row.firstName || "",
				lastName: row.lastName || "",
				dateOfBirth: row.dateOfBirth || "",
				address: row.address || "",
				phoneNumber: row.phoneNumberStr || "",
				email: row.email || "",
				insuranceName: row.insuranceName || "",
				insuranceGroupNum: row.insuranceGroupNum || "",
				insuranceMemberID: row.insuranceMemberID || "",
			});
		} else {
			// Reset to empty fields when adding a new patient
			setFormData({
				firstName: "",
				lastName: "",
				dateOfBirth: "",
				address: "",
				phoneNumberStr: "",
				email: "",
				insuranceName: "",
				insuranceGroupNum: "",
				insuranceMemberID: "",
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
			{/* depending on if row is not null or null, change the title from editing to adding a new patient */}
			<DialogTitle>{row ? "Edit Patient" : "Add Patient"}</DialogTitle>
			<DialogContent>
				{/* Fields for editing/adding patient */}
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
					{/* depending on if row is not null or null, change the text from saving edits to adding a new patient */}
					{row ? "Save Changes" : "Add Patient"}
				</Button>
			</DialogActions>
		</Dialog>
	);
};

export default AddEditPatientModal;
