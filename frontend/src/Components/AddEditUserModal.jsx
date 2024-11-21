import React, { useState, useEffect } from "react";
import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Button,
    TextField,
    Typography,
    DialogContentText,
} from "@mui/material";

const AddEditUserModal = ({ open, onClose, row, onSave }) => {
    const [formData, setFormData] = useState({
        id: "",
        first_name: "",
        last_name: "",
        user_type: "",
        email: "",
        password: "",
        is_locked_out: false, // Default value
    });

    const [confirmUnlock, setConfirmUnlock] = useState(false);

    useEffect(() => {
        if (row) {
            setFormData({
                first_name: row.first_name || "",
                last_name: row.last_name || "",
                user_type: row.user_type || "",
                email: row.email || "",
                password: row.password || "",
                is_locked_out: row.is_locked_out ?? false, // Set lock status from row data
            });
        } else {
            setFormData({
                first_name: "",
                last_name: "",
                user_type: "",
                email: "",
                password: "",
                is_locked_out: false,
            });
        }
    }, [row]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleUnlockAccount = () => {
        setConfirmUnlock(true); // Show confirmation dialog
    };

    const handleConfirmUnlock = () => {
        setConfirmUnlock(false);
        setFormData((prev) => ({ ...prev, is_locked_out: false })); // Unlock the account
    };

    const handleSave = () => {
        onSave(formData, row?.id);
        onClose();
    };

    return (
        <>
            <Dialog open={open} onClose={onClose}>
                <DialogTitle>{row ? "Edit User" : "Add User"}</DialogTitle>
                <DialogContent>
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

                    {/* Only show the locked-out message and unlock button if the account is locked */}
                    {formData.is_locked_out && (
                        <>
                            <Typography color="error" sx={{ mt: 2 }}>
                                This account is currently locked.
                            </Typography>
                            <Button
                                variant="contained"
                                color="secondary"
                                onClick={handleUnlockAccount}
                                sx={{ mt: 1 }}
                            >
                                Unlock Account
                            </Button>
                        </>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={onClose}>Cancel</Button>
                    <Button onClick={handleSave} color="primary">
                        {row ? "Save Changes" : "Add User"}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Confirmation dialog for unlocking */}
            <Dialog open={confirmUnlock} onClose={() => setConfirmUnlock(false)}>
                <DialogTitle>Confirm Unlock</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to unlock this user?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setConfirmUnlock(false)}>Cancel</Button>
                    <Button onClick={handleConfirmUnlock} color="primary">
                        Yes, Unlock
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default AddEditUserModal;
