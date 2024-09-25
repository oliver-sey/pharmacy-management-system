// a modal (popup) asking the user if they are sure they want to delete something
// can reuse this for deleting patients, medications, etc.
import React from "react";
import {
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	Button,
} from "@mui/material";

const DeleteModal = ({ open, onClose, customMessage: customConfirmMessage, onConfirmDelete }) => {
	return (
		<Dialog open={open} onClose={onClose}>
			<DialogTitle>Delete {customConfirmMessage}?</DialogTitle>
			<DialogContent>
				Are you sure you want to delete {customConfirmMessage}? This action cannot be undone.
			</DialogContent>
			<DialogActions>
				<Button onClick={onClose}>Cancel</Button>
				<Button onClick={onConfirmDelete} color="error">
					Delete
				</Button>
			</DialogActions>
		</Dialog>
	);
};

export default DeleteModal;
