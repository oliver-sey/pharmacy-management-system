import React, { useState, useEffect } from "react";
import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Button,
    TextField,
    MenuItem,
} from "@mui/material";

const AddEditEmployeeModal = ({ open, onClose, row, onSave }) => {
  // Initialize form data with default values
  const [formData, setFormData] = useState({
    employeeId: "",
    firstName: "",
    lastName: "",
    username: "",
    password: "password", // Default password
    employeeType: "",
  });

  // Update form data when the row prop changes (for editing)
  useEffect(() => {
    if (row) {
      setFormData({
        employeeId: row.employeeId || "",
        firstName: row.firstName || "",
        lastName: row.lastName || "",
        username: row.username || "",
        password: row.password || "password", // Start with "password" if none is provided
        employeeType: row.employeeType || "",
      });
    } else {
      // Reset to default values when adding a new employee
      setFormData({
        employeeId: "",
        firstName: "",
        lastName: "",
        username: "",
        password: "password",
        employeeType: "",
      });
    }
  }, [row]);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle save action
  const handleSave = () => {
    onSave(formData); // Pass updated form data to parent component
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{row ? "Edit Employee" : "Add Employee"}</DialogTitle>
      <DialogContent>
        {/* Fields for editing/adding employee */}
        <TextField
          label="Employee ID"
          name="employeeId"
          value={formData.employeeId}
          onChange={handleChange}
          fullWidth
          margin="dense"
        />
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
          label="Username"
          name="username"
          value={formData.username}
          onChange={handleChange}
          fullWidth
          margin="dense"
        />
        <TextField
          label="Password"
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          fullWidth
          margin="dense"
        />
        <TextField
          select
          label="Employee Type"
          name="employeeType"
          value={formData.employeeType}
          onChange={handleChange}
          fullWidth
          margin="dense"
        >
          {/* Employee type options */}
          <MenuItem value="Pharmacy Manager">Pharmacy Manager</MenuItem>
          <MenuItem value="Pharmacist">Pharmacist</MenuItem>
          <MenuItem value="Pharmacist Technician">Pharmacist Technician</MenuItem>
          <MenuItem value="Cashier">Cashier</MenuItem>
        </TextField>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSave} color="primary">
          {row ? "Save Changes" : "Add Employee"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddEditEmployeeModal;
