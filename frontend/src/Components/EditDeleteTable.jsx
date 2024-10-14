// a component for a table, built off of BaseTable, with the action column having a button to edit and a button to delete
// handles stuff with open and closing the modals (popups) for these actions

// React imports
import { React, useState } from "react";

// Stylesheets
import "../Styles/styles.css";

// Components we made
import BaseTable from "./BaseTable";

// Material UI components
import { IconButton, Tooltip } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

const EditDeleteTable = ({
	rows,
	columns,
	editModal: EditModal,
	deleteModal: DeleteModal,
	showEditButton = true,
	showDeleteButton = true,
	onAdd,
	onConfirmDelete,
	onEdit,
	customConfirmMessage
}) => {
	const [isEditOpen, setEditOpen] = useState(false);
	const [isDeleteOpen, setDeleteOpen] = useState(false);
	const [selectedRow, setSelectedRow] = useState(null);
	// const [deleteMethod, setDeleteMethod] = useState(null);

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
		<div style={{ display: "flex", width: "100%" }}>
			{/* edit button */}
			{showEditButton && ( // Only show edit button if showEditButton is true
				<Tooltip id="edit" title="Edit" style={{ flex: 1 }}>
					<IconButton
						onClick={() => openEditModal(row)}
						style={{ width: "auto" }}
					>
						<EditIcon color="primary" />
					</IconButton>
				</Tooltip>
			)}

			{/* delete button */}
			{showDeleteButton && ( // Only show delete button if showDeleteButton is true
				<Tooltip id="delete" title="Delete" style={{ flex: 1 }}>
					<IconButton
						onClick={() => openDeleteModal(row)}
						style={{ width: "auto" }}
					>
						<DeleteIcon color="error" />
					</IconButton>
				</Tooltip>
			)}
		</div>
	);

	return (
		<>
			<div className="data-table-div">
				<BaseTable
					columns={columns}
					rows={rows}
					actionButtons={actionButtons}
					className="data-table"
				/>
			</div>

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
				onConfirmDelete={onConfirmDelete}
				itemID={selectedRow?.id}
			/>
		</>
	);
};

export default EditDeleteTable;
