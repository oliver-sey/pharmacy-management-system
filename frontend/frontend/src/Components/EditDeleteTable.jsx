// EditDeleteTable.jsx
import { React, useState } from "react";
import { IconButton, Tooltip } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import BaseTable from "./BaseTable";

// Slightly separated modal handling logic
const useModals = () => {
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

	return {
		isEditOpen,
		isDeleteOpen,
		selectedRow,
		openEditModal,
		closeEditModal,
		openDeleteModal,
		closeDeleteModal,
	};
};

const EditDeleteTable = ({
	rows,
	columns,
	editModal: EditModal,
	deleteModal: DeleteModal,
}) => {
	const {
		isEditOpen,
		isDeleteOpen,
		selectedRow,
		openEditModal,
		closeEditModal,
		openDeleteModal,
		closeDeleteModal,
	} = useModals();

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
					console.log("Save new data:", updatedRow);
					closeEditModal();
				}}
			/>

			{/* Delete Modal */}
			<DeleteModal
				open={isDeleteOpen}
				onClose={closeDeleteModal}
				itemName={`${selectedRow?.firstName} ${selectedRow?.lastName}`} // Example item name
				onConfirmDelete={() => {
					console.log("Delete confirmed for:", selectedRow);
					closeDeleteModal();
				}}
			/>
		</>
	);
};

export default EditDeleteTable;
