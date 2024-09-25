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

const DeleteModal = ({ open, onClose, itemName, onConfirmDelete }) => {
	return (
		<Dialog open={open} onClose={onClose}>
			<DialogTitle>Delete {itemName}?</DialogTitle>
			<DialogContent>
				Are you sure you want to delete {itemName}?
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
