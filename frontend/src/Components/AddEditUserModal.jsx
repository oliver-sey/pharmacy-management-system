import React, { useState, useEffect } from "react";
import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Button,
    TextField,
	Select,
	MenuItem,
	FormControl,
	InputLabel
} from "@mui/material";



const AddEditUserModal = ({ open, onClose, row, onSave }) => {
    const [formData, setFormData] = useState({
        id: "",
        first_name: "",
        last_name: "",
        user_type: "",
        email: "",
        password: "",
    });
    const [errors, setErrors] = useState({});

	const errorMessages = {
        first_name: "First name is required",
        last_name: "Last name is required",
        email: "Email is required",
        password: "Password is required",
        user_type: "User type is required",
    };
	
    useEffect(() => {
        if (row) {
            setFormData({
                first_name: row.first_name || "",
                last_name: row.last_name || "",
                user_type: row.user_type || "",
                email: row.email || "",
                password: row.password || "",
            });
        } else {
            setFormData({
                first_name: "",
                last_name: "",
                user_type: "",
                email: "",
                password: "",
            });
        }
        setErrors({}); // Reset errors when modal opens
    }, [open, row]);

    // Update form data on input change
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));

        // Clear the error for this field if valid
        if (value.trim() !== "") {
            setErrors((prev) => ({ ...prev, [name]: "" }));
        }
    };

	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Simple regex for email validation

    // Validate a single field when it loses focus
    const handleBlur = (e) => {
        const { name, value } = e.target;
        setErrors((prev) => {
			const newErrors = { ...prev };
	
			if (!value.trim() && name === "first_name") {
				newErrors[name] = "First name is required";
			} else if (!value.trim() && name === "last_name") {
				newErrors[name] = "Last name is required";
			} else if (!value.trim() && name === "email") {
				newErrors[name] = "Email address is required";
			} else if (!value.trim() && name === "password") {
				newErrors[name] = "Password is required";
			} else if (!value.trim() && name === "user_type") {
				newErrors[name] = "User type is required";
			} else if (name === "email" && !emailRegex.test(value)) {
				newErrors[name] = "Please enter a valid email address";
			} else if (name === "password" && value.length < 6) {
				newErrors[name] = "Password must be at least 6 characters";
			} else {
				delete newErrors[name];
			}
	
			return newErrors;
		});
    };

    // Validate all fields before saving
    const validateAll = () => {
        const newErrors = {};
        Object.keys(formData).forEach((key) => {
            if (formData[key].trim() === "") {
                newErrors[key] = errorMessages[key]; // Use the custom error message
            }
        });
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0; // Return true if no errors
    };

    const handleSave = () => {
        if (validateAll()) {
            onSave(formData, row?.id); // Pass updated form data to parent component
            onClose(); // Close the modal
        }
    };

    return (
		<Dialog open={open} onClose={onClose}>
			<DialogTitle>{row ? "Edit User" : "Add User"}</DialogTitle>
			<DialogContent>
				<TextField
					label="First Name"
					name="first_name"
					value={formData.first_name}
					onChange={handleChange}
					onBlur={handleBlur}
					fullWidth
					margin="dense"
					error={!!errors.first_name}
					helperText={errors.first_name}
				/>
				<TextField
					label="Last Name"
					name="last_name"
					value={formData.last_name}
					onChange={handleChange}
					onBlur={handleBlur}
					fullWidth
					margin="dense"
					error={!!errors.last_name}
					helperText={errors.last_name}
				/>
				<TextField
					label="Email"
					name="email"
					value={formData.email}
					onChange={handleChange}
					onBlur={handleBlur}
					fullWidth
					margin="dense"
					error={!!errors.email}
					helperText={errors.email}
				/>
				<TextField
					label="Password"
					name="password"
					value={formData.password}
					onChange={handleChange}
					onBlur={handleBlur}
					fullWidth
					margin="dense"
					error={!!errors.password}
					helperText={errors.password}
				/>
				<FormControl
					fullWidth
					margin="dense"
					error={!!errors.user_type} // Display error state if applicable
				>
					<InputLabel>User Type</InputLabel>
					<Select
						name="user_type"
						value={formData.user_type}
						onChange={handleChange}
						onBlur={handleBlur}
					>
						<MenuItem value="">Select a User Type</MenuItem>
						<MenuItem value="Cashier">Cashier</MenuItem>
						<MenuItem value="Pharmacy Manager">Pharmacy Manager</MenuItem>
						<MenuItem value="Pharmacy Technician">Pharmacy Technician</MenuItem>
						<MenuItem value="Pharmacist">Pharmacist</MenuItem>
					</Select>
					{errors.user_type && (
						<p style={{ color: "red", fontSize: "0.8rem", margin: "5px 0 0" }}>
							{errors.user_type}
						</p>
					)}
				</FormControl>
			</DialogContent>
			<DialogActions>
				<Button onClick={onClose}>Cancel</Button>
				<Button onClick={handleSave} color="primary">
					{row ? "Save Changes" : "Add User"}
				</Button>
			</DialogActions>
		</Dialog>
	);
};

export default AddEditUserModal;