import React, { useState, useEffect } from "react";
import {
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	Button,
	TextField,
} from "@mui/material";

const AddEditUserModal = ({open, onClose, row, onSave}) => {
    // Initialize form data
    const [formData, setFormData] = useState({

        id: "",
        first_name: "",
        last_name: "",
        user_type: "",
        email: "",
        password: "",

    });

    useEffect(() => {
        if (row) {
            setFormData({
                first_name: row.first_name || "",
                last_name: row.last_name || "",
                user_type: row.user_type || "",
                email: row.email || "",
                password: row.password || "",
            })
        } else {
            setFormData({
				first_name: "",
				last_name: "",
				user_type: "",
                email: "",
                password: "",
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

    return (
		<Dialog open={open} onClose={onClose}>
			{/* depending on if row is not null or null, change the title from editing to adding a new user */}
			<DialogTitle>{row ? "Edit User" : "Add User"}</DialogTitle>
			<DialogContent>
				{/* Fields for editing/adding user */}
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
					label="Email"
					name="email"
					value={formData.email}
					onChange={handleChange}
					fullWidth
					margin="dense"
				/>
				<TextField
					label="Password"
					name="password"
					value={formData.password}
					onChange={handleChange}
					fullWidth
					margin="dense"
				/>
				<TextField
					label="User Type"
					name="user_type"
					value={formData.user_type}
					onChange={handleChange}
					fullWidth
					margin="dense"
				/>
				
			</DialogContent>
			<DialogActions>
				<Button onClick={onClose}>Cancel</Button>
				<Button onClick={handleSave} color="primary">
					{/* depending on if row is not null or null, change the text from saving edits to adding a new user */}
					{row ? "Save Changes" : "Add User"}
				</Button>
			</DialogActions>
		</Dialog>
	);
};

export default AddEditUserModal;