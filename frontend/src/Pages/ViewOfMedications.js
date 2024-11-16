// src/Pages/ViewOfMedications.js

import React, { useRef, useState, useEffect } from "react";
import EditDeleteTable from "../Components/EditDeleteTable";
import AddEditMedicationModal from "../Components/AddEditMedicationModal";
import DeleteModal from "../Components/DeleteModal";
import { generateTransactionPDF } from "../Functions/GenerateFinancialReports"; // Import the transaction PDF function
import { IconButton, Button, Tooltip, Snackbar, Alert } from "@mui/material";
import HourglassBottomIcon from "@mui/icons-material/HourglassBottom";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import WarningIcon from "@mui/icons-material/Warning";
import { useNavigate } from "react-router-dom";
import CheckUserType from "../Functions/CheckUserType";
import { jsPDF } from "jspdf";

function ViewOfMedications() {
    const [rows, setRows] = useState([]);
    const [errorMessage, setErrorMessage] = useState(null);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const roles = ["Pharmacy Manager", "Pharmacist", "Pharmacy Technician"];
    const token = localStorage.getItem("token");
    const navigate = useNavigate();
    const openAddMedicationModal = useRef(null);

    // Columns for the medication table
    const columns = [
        { field: "name", headerName: "Medication Name", width: 200 },
        { field: "dosage", headerName: "Dosage", width: 100 },
        { field: "quantity", headerName: "Quantity", width: 100 },
        { field: "expiration_date", headerName: "Expiration Date", width: 100 },
        { field: "dollars_per_unit", headerName: "$ Per Unit", width: 100 },
    ];

    // Function to check if the user can edit
    const canEdit = () => localStorage.getItem("role") === "Pharmacy Manager";

    // Function to check if the user can delete
    const canDelete = () => localStorage.getItem("role") === "Pharmacy Manager";

    // Confirmation message format for deletion modal
    const medicationConfirmMessage = (row) => `${row?.name || "Unknown Medication Name"} - ${row?.dosage || "Unknown Dosage"}`;

    // Async function to fetch medications data
    const fetchMedications = async () => {
        try {
            const response = await fetch("http://localhost:8000/medicationlist", {
                headers: {
                    Authorization: "Bearer " + token,
                },
            });
            const data = await response.json();
            setRows(data);
        } catch (error) {
            console.error("Error fetching medications:", error);
            setErrorMessage("Failed to fetch medications");
            setOpenSnackbar(true);
        }
    };

    useEffect(() => {
        CheckUserType(roles, navigate);
        fetchMedications();
    }, []);

    const generateMedicationPDF = () => {
        const doc = new jsPDF();
        doc.setFontSize(20);
        doc.text("Medication Inventory Report", 10, 20);

        doc.setFontSize(12);
        let yPosition = 30;
        doc.text("Name", 10, yPosition);
        doc.text("Dosage", 40, yPosition);
        doc.text("Quantity", 60, yPosition);
        doc.text("Prescription Required", 80, yPosition);
        doc.text("Expiration Date", 130, yPosition);
        doc.text("Dollars per Unit", 170, yPosition);

        yPosition += 10;

        rows.forEach((medication) => {
            doc.text(medication.name, 10, yPosition);
            doc.text(medication.dosage, 40, yPosition);
            doc.text(medication.quantity.toString(), 60, yPosition);
            doc.text(medication.prescription_required ? "Yes" : "No", 80, yPosition);
            doc.text(medication.expiration_date, 130, yPosition);
            doc.text(medication.dollars_per_unit.toFixed(2), 170, yPosition);
            yPosition += 10;
        });

        doc.save("medication_inventory_report.pdf");
    };

    const handleCloseSnackbar = () => {
        setOpenSnackbar(false);
    };

    return (
        <div>
            <h2>Medication Inventory Table</h2>

            <Button variant="contained" onClick={generateMedicationPDF}>
                Generate Medication Inventory Report
            </Button>

            <Button variant="contained" onClick={generateTransactionPDF} style={{ marginLeft: 10 }}>
                Generate Transaction Report
            </Button>

            {localStorage.getItem("role") === "Pharmacy Manager" && (
                <Button
                    variant="contained"
                    onClick={() => {
                        if (openAddMedicationModal.current) {
                            openAddMedicationModal.current();
                        }
                    }}
                >
                    Add Medication
                </Button>
            )}

            <EditDeleteTable
                columns={columns}
                rows={rows}
                editModal={AddEditMedicationModal}
                deleteModal={DeleteModal}
                showEditButton={canEdit()}
                showDeleteButton={canDelete()}
                customConfirmMessage={medicationConfirmMessage}
                onAdd={(handler) => {
                    openAddMedicationModal.current = handler;
                }}
                onEdit={() => {}}
                onConfirmDelete={() => {}}
            />

            <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleCloseSnackbar}>
                <Alert onClose={handleCloseSnackbar} severity="error">
                    {errorMessage}
                </Alert>
            </Snackbar>
        </div>
    );
}

export default ViewOfMedications;
