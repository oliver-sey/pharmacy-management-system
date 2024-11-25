import React, { useState } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField } from "@mui/material";
import { IconButton, Tooltip } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import RestockIcon from "@mui/icons-material/Add";
import BaseTable from "./BaseTable";

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
    onRestock,
    customConfirmMessage,
    fetchMedications, // Accept fetchMedications as a prop
}) => {
    const [isEditOpen, setEditOpen] = useState(false);
    const [isDeleteOpen, setDeleteOpen] = useState(false);
    const [selectedRow, setSelectedRow] = useState(null);
    const [isRestockOpen, setRestockOpen] = useState(false);
    const [restockQuantity, setRestockQuantity] = useState(0);

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

    const openRestockModal = (row) => {
        setSelectedRow(row);
        setRestockOpen(true);
    };
    const closeRestockModal = () => setRestockOpen(false);

	const handleRestockSave = async () => {
        try {
            if (restockQuantity <= 0) {
                alert("Please enter a valid quantity greater than 0.");
                return;
            }

            const token = localStorage.getItem("token");
            if (!token) {
                alert("Authentication token is missing. Please log in again.");
                return;
            }

            const payload = {
                quantity: selectedRow.quantity + restockQuantity, // Calculate the new quantity
            };

            const response = await fetch(
                `http://localhost:8000/medication/${selectedRow.id}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify(payload),
                }
            );

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || "Failed to restock medication");
            }

            // Refresh the medications after restocking
            await fetchMedications(); // Use the prop to refresh
            alert("Medication restocked successfully!");
        } catch (error) {
            console.error("Error in restocking medication:", error);
            alert("Failed to restock medication: " + error.message);
        } finally {
            setRestockQuantity(0);
            closeRestockModal();
        }
    };

    // Rest of the component code...
	
	

    const getConfirmMessage = (row) => {
        return typeof customConfirmMessage === "function"
            ? customConfirmMessage(row)
            : "this item";
    };

    if (onAdd) {
        onAdd(() => openEditModal(null));
    }

    const actionButtons = (row) => {
        const today = new Date();
        const expirationDate = new Date(row.expiration_date);

        const isExpired = expirationDate <= today;
        const isLow = row.quantity < 120;

        return (
            <div style={{ display: "flex", width: "100%" }}>
                {showEditButton && (
                    <Tooltip id="edit" title="Edit" style={{ flex: 1 }}>
                        <IconButton onClick={() => openEditModal(row)} style={{ width: "auto" }}>
                            <EditIcon color="primary" />
                        </IconButton>
                    </Tooltip>
                )}
                {showDeleteButton && (
                    <Tooltip id="delete" title="Delete" style={{ flex: 1 }}>
                        <IconButton onClick={() => openDeleteModal(row)} style={{ width: "auto" }}>
                            <DeleteIcon color="error" />
                        </IconButton>
                    </Tooltip>
                )}
                {(isLow || isExpired) && (
                    <Tooltip id="restock" title="Restock" style={{ flex: 1 }}>
                        <IconButton onClick={() => openRestockModal(row)} style={{ width: "auto" }}>
                            <RestockIcon color="success" />
                        </IconButton>
                    </Tooltip>
                )}
            </div>
        );
    };

    return (
        <>
            <BaseTable columns={columns} rows={rows} actionButtons={actionButtons} />
            <EditModal open={isEditOpen} onClose={closeEditModal} row={selectedRow} onSave={onEdit} />
            <DeleteModal
                open={isDeleteOpen}
                onClose={closeDeleteModal}
                customMessage={getConfirmMessage(selectedRow)}
                onConfirmDelete={onConfirmDelete}
                itemID={selectedRow?.id}
            />
            <Dialog open={isRestockOpen} onClose={closeRestockModal}>
                <DialogTitle>Restock Medication</DialogTitle>
                <DialogContent>
                    <TextField
                        label="Quantity to Add"
                        type="number"
                        fullWidth
                        value={restockQuantity}
                        onChange={(e) => setRestockQuantity(Number(e.target.value))}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={closeRestockModal} color="secondary">
                        Cancel
                    </Button>
                    <Button onClick={handleRestockSave} color="primary">
                        Save
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default EditDeleteTable;
