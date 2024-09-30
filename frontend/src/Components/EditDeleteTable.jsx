// a component for a table, built off of BaseTable, with the action column having a button to edit and a button to delete
// handles stuff with open and closing the modals (popups) for these actions

import { React, useState } from "react";
import { IconButton, Tooltip } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import BaseTable from "./BaseTable";

const EditDeleteTable = ({
	rows,
	columns,
	editModal: EditModal,
	deleteModal: DeleteModal,
	onAdd,
	customConfirmMessage,
}) => {
	const [isEditOpen, setEditOpen] = useState(false);
	const [isDeleteOpen, setDeleteOpen] = useState(false);
	const [selectedRow, setSelectedRow] = useState(null);

	// Open/Close handlers
	const openEditModal = (row) => {
		setSelectedRow(row);
		setEditOpen(true);
	};
	const closeEditModal = () => setEditOpen(false);

	const openDeleteModal = (row) => {
		setSelectedRow(row);
		setDeleteOpen(true);
	};
	const closeDeleteModal = () => setDeleteOpen(false);

	// Ensure customConfirmMessage is a function before calling it
	const getConfirmMessage = (row) => {
		return typeof customConfirmMessage === "function"
			? customConfirmMessage(row)
			: "this item";
	};

	// Call onAdd when Add  button is clicked
	if (onAdd) {
		onAdd(() => openEditModal(null));
	}

	// Define the action buttons for each row
	const actionButtons = (row) => (
		<>
			<Tooltip id="edit" title="Edit">
				<IconButton onClick={() => openEditModal(row)}>
					<EditIcon color="primary" />
				</IconButton>
			</Tooltip>
			<Tooltip id="delete" title="Delete">
				<IconButton onClick={() => openDeleteModal(row)}>
					<DeleteIcon color="error" />
				</IconButton>
			</Tooltip>
		</>
	);

	return (
		<>
			<BaseTable
				columns={columns}
				rows={rows}
				actionButtons={actionButtons}
			/>

			{/* Edit Modal */}
			<EditModal
				open={isEditOpen}
				onClose={closeEditModal}
				row={selectedRow}
				onSave={(updatedRow) => {
					console.log("Saved new data:", updatedRow);
					closeEditModal();
				}}
			/>

			{/* Delete Modal */}
			<DeleteModal
				open={isDeleteOpen}
				onClose={closeDeleteModal}
				customMessage={getConfirmMessage(selectedRow)}
				onConfirmDelete={() => {
					// TODO: Handle delete logic here
					console.log(`Deleting ${getConfirmMessage(selectedRow)}`);
					closeDeleteModal();
				}}
			/>
		</>
	);
};

export default EditDeleteTable;
