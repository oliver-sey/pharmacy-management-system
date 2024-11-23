import { React, useRef, useState, useEffect } from "react";

import EditDeleteTable from "../Components/EditDeleteTable";
import AddEditMedicationModal from "../Components/AddEditMedicationModal";
import DeleteModal from "../Components/DeleteModal";

import { IconButton, Button, Tooltip, Snackbar, Alert, TextField, sliderClasses} from "@mui/material";

import HourglassBottomIcon from "@mui/icons-material/HourglassBottom";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import WarningIcon from "@mui/icons-material/Warning";

import { useNavigate } from "react-router-dom";
import CheckUserType from "../Functions/CheckUserType";

import { jsPDF} from 'jspdf'; // Import jsPDF


function ViewOfMedications() {
	const [rows, setRows] = useState([]);
	const [errorMessage, setErrorMessage] = useState(null);
	const [openSnackbar, setOpenSnackbar] = useState(false);
	const roles = ["Pharmacy Manager", "Pharmacist", "Pharmacy Technician"]
	const token = localStorage.getItem('token');
	const navigate = useNavigate();


	// Async function to fetch medications data
	const fetchMedications = async () => {
		try {
			const response = await fetch('http://localhost:8000/medicationlist', {
				headers: {
					'Authorization': 'Bearer ' + token,
				},
			  });
			const data = await response.json(); // Convert response to JSON
			setRows(data); // Update rows state with fetched data
		} catch (error) {
			console.error('Error fetching medications:', error);
			// error handling
			setErrorMessage('Failed to fetch medications');
			setOpenSnackbar(true); // Show Snackbar when error occurs
		}
	}; 

	// useEffect to fetch data when the component mounts
	useEffect(() => {
		CheckUserType(roles, navigate);
		fetchMedications(); // Call the async function
	  }, []); // Empty array means this effect runs once when the component mounts


	// the columns for the table
	// headerName is what shows up on the website
	// width is the default width of the column, user can adjust it
	const columns = [
		// { field: "id", headerName: "ID", width: 70 },
		{ field: "name", headerName: "Medication Name", width: 200 },
		{ field: "dosage", headerName: "Dosage", width: 100 },
		{ field: "quantity", headerName: "Quantity", width: 100 },
		{
			field: "prescription_required",
			headerName: "Prescription Required",
			width: 100,
		},
		{ field: "expiration_date", headerName: "Expiration Date", width: 100 },
		{ field: "dollars_per_unit", headerName: "$ Per Unit", width: 100 },
		{
			field: "alerts",
			headerName: "Alerts",
			width: 200,
			// calculate time between now and the expiration date, to see what alert icons we should show
			renderCell: (params) => {
				// TODO: fix some weird stuff with time zones??? dates still print weird
				const today = new Date();
				const expirationDate = new Date(params.row.expiration_date);

				// cut off anything beyond the date to avoid weird stuff with time zones
				const todayUTC = new Date(
					Date.UTC(
						today.getUTCFullYear(),
						today.getUTCMonth(),
						today.getUTCDate()
					)
				);
				const expirationDateUTC = new Date(
					Date.UTC(
						expirationDate.getUTCFullYear(),
						expirationDate.getUTCMonth(),
						expirationDate.getUTCDate()
					)
				);

				// TODO: is a medicine expired on the expiration date, or the next day??
				// get the difference in time in milliseconds, then convert to days
				// to avoid weird time zone differences
				let differenceMS =
					expirationDateUTC.getTime() - todayUTC.getTime();
				let differenceDays = differenceMS / (1000 * 60 * 60 * 24);

				// collection icons to end up in this cell together
				const icons = [];

				// expiration date is today or earlier
				if (differenceDays <= 0) {
					// console.log(
					// 	"Difference between expiration",
					// 	expirationDate,
					// 	"and today is",
					// 	differenceDays,
					// 	"**is expired"
					// );
					icons.push(
						// empty hourglass icon, says "Expired" when you hover
						<IconButton>
							<Tooltip id="expired" title="Expired">
								<HourglassEmptyIcon color="error" />
							</Tooltip>
						</IconButton>
					);
				}
				// expiration date is within the next 30 days
				else if (differenceDays <= 30) {
					// console.log(
					// 	"Difference between expiration (in UTC)",
					// 	expirationDate,
					// 	"and today is",
					// 	differenceDays,
					// 	"not expired, **but need a warning"
					// );
					icons.push(
						// TODO: fix style?
						// <div style={[{"display": "flex"}, { "align-items": "center" }]}>
						// half-empty hourglass icon, says the warning when you hover
						<IconButton>
							<Tooltip
								id="warning"
								title="Warning - expires within 30 days"
							>
								<HourglassBottomIcon color="warning" />
							</Tooltip>
						</IconButton>
						// </div>
					);
				}
				// expiration date is over 30 days into the future
				else {
					// console.log(
					// 	"Difference between expiration (in UTC)",
					// 	expirationDate,
					// 	"and today is",
					// 	differenceDays,
					// 	"not expired, and don't need a warning"
					// );
				}

				// check inventory
				// less than 120 should give a warning
				if (params.row.quantity < 120) {
					// console.log("Less than 120 units/doses, giving a warning");
					icons.push(
						<IconButton>
							<Tooltip
								id="inventoryWarning"
								title="Warning - less than 120 units/doses left"
							>
								<WarningIcon color="warning" />
							</Tooltip>
						</IconButton>
					);
				}

				// return the icons together
				return (
					<div style={{ display: "flex", alignItems: "center" }}>
						{icons}
					</div>
				);
			},
		},
	];


	// only pharmacy manager can edit
	const canEdit = () => {
		const role = localStorage.getItem('role');
		// console.log("canEdit:", (role === 'Pharmacy Manager'));
		return role === 'Pharmacy Manager';
	};
	  
	// only pharmacy managers can delete
	const canDelete = () => {
		const role = localStorage.getItem('role');
		// console.log("canDelete:", (role === 'Pharmacy Manager'));
		return role === 'Pharmacy Manager';
	};


	const deleteMedication = async (id) => {
		try {
			console.log("row", id);
			const response = await fetch(`http://localhost:8000/medication/${id}`, {
				method: 'DELETE',
				headers: {
					'Authorization': 'Bearer ' + token,
				},
			});
			if (!response.ok) {
				throw new Error('Failed to delete medication');
			}
			fetchMedications();
		} catch (error) {
			console.error('Error deleting medication:', error);
			setErrorMessage('Failed to delete medication' + error);
			setOpenSnackbar(true);
		}
	}

	const addEditMedication = async (data, id) => {
		if (id) {
			editMedication(data, id);
		} else {
			addMedication(data);
		}
	}

	const editMedication = async (data, id) => {
		try {
			console.log("row in editMedication", id, data)
			const response = await fetch(`http://localhost:8000/medication/${id}`, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json',
					'Authorization': 'Bearer ' + token,
				},
				body: JSON.stringify(data),
			});
			if (!response.ok) {
				const responseData = await response.json(); // Wait for the JSON to be parsed
				console.log("Error detail from response:", responseData.detail[0].msg);
				throw new Error(responseData.detail[0].msg);
			}
			fetchMedications();
		} catch (error) {
			setErrorMessage('Failed to update medication');
			setOpenSnackbar(true);
		}
	}

	const addMedication = async (data) => {
		try {
			console.log("row in addMedication", data)
			const response = await fetch(`http://localhost:8000/medication/`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'Authorization': 'Bearer ' + token,
				},
				body: JSON.stringify(data),
			});
			if (!response.ok) {
				const responseData = await response.json(); // Wait for the JSON to be parsed
				var errorMessage;
				// if responseData.detail is a string, return the strig, else return the first element of the array
				if (typeof(responseData.detail) == 'string') {// check if response.detail is a string or an array
					errorMessage = responseData.detail;
				} else {
					errorMessage = responseData.detail[0].msg;
				}
				throw new Error(errorMessage);
			}
			fetchMedications();
		} catch (error) {
			setErrorMessage('Failed to add medication: ' + error);
			setOpenSnackbar(true);
		}
	}


	// Handle closing of the Snackbar
	const handleCloseSnackbar = () => {
		setOpenSnackbar(false);
	};


	// the message format that should get used in the delete confirmation modal (popup) for this table
	// need this since we want a different format on other tables that use this same base component
	const medicationConfirmMessage = (row) =>
		`${row?.name || "Unknown Medication Name"} - ${
			row?.dosage || "Unknown Dosage"
		}`;

	const openAddMedicationModal = useRef(null);

	// State to store the inventory data
	const [inventoryData, setInventoryData] = useState({
		updates: [],          // Array of inventory updates
		totalRecords: 0,      // Total count of inventory records
		isLoading: false,     // Loading state for the fetch operation
		errorMessage: "",     // Error message, if any
	  });
	// Async function to fetch inventory update data
		const fetchInventory = async () => {
			try {
				const response = await fetch(`http://localhost:8000/inventory-updates?start_date=${timestamp1}&end_date=${timestamp2}`, {
					headers: {
						'Authorization': 'Bearer ' + token,
					},
				  });
				const data = await response.json(); // Convert response to JSON
				// set the received data in a data structure to generate PDF
				setInventoryData({
					updates: data,           // Assuming the response is an array of InventoryUpdateResponse objects
					totalRecords: data.length, // If data has length property for total count
					isLoading: false,
					errorMessage: "",
				  });
				
			} catch (error) {
				console.error('Error fetching inventory updates:', error);
				// error handling
				setErrorMessage('Failed to fetch inventory updates');
				setOpenSnackbar(true); // Show Snackbar when error occurs
			}
		}; 
	
		useEffect(() => {
			if (inventoryData.updates.length > 0) {
			  generatePDF();
			}
		  }, [inventoryData.updates]);

	const [timestamp1, setTimestamp1] = useState('');
	const [timestamp2, setTimestamp2] = useState('');

	// for generating inventory report
	const generatePDF = () => {

		const doc = new jsPDF();
	  
		// Set title for the PDF
		doc.setFontSize(20);
		doc.text(`Inventory Updates Report:`, 10, 20);
	  
		// Set table headers for inventory update data
		doc.setFontSize(12);
		let yPosition = 30;

		// Define maximum lengths for each column (in characters)
		const maxLength = {
			medicationId: 15,    // Max length for Medication ID
			medicationName: 25,  // Max length for Medication Name
			quantityChanged: 10, // Max length for Quantity Changed
			timestamp: 20        // Max length for Timestamp
		  };
		
		  // Function to truncate text and add ellipsis if needed
		  const truncateText = (text, maxLength) => {
			if (text.length > maxLength) {
			  return text.substring(0, maxLength) + '...'; // Truncate and add '...'
			}
			return text;
		  };
		
		  // Set the headers
		  doc.text('Medication ID', 10, yPosition);
		  doc.text('Medication Name', 40, yPosition);
		  doc.text('Quantity Changed', 100, yPosition);
		  doc.text('Timestamp', 150, yPosition);
		
		  yPosition += 10; // Space after header row
		
		  // Loop through updates and add each inventory update
		  inventoryData.updates.forEach((update) => {
			// Truncate each column's text if necessary
			const medicationIdText = truncateText(update.medication_id.toString(), maxLength.medicationId);
			const medicationNameText = truncateText(update.medication_name || 'Unknown Medication', maxLength.medicationName);
			const quantityChangedText = truncateText(update.quantity_changed_by.toString(), maxLength.quantityChanged);
			const timestampText = truncateText(update.timestamp ? new Date(update.timestamp).toLocaleString() : 'N/A', maxLength.timestamp);
		
			// Add the truncated text to the PDF
			doc.text(medicationIdText, 10, yPosition);
			doc.text(medicationNameText, 40, yPosition);
			doc.text(quantityChangedText, 100, yPosition);
			doc.text(timestampText, 150, yPosition);
		
			// Move to the next row
			yPosition += 10;
		  });
	  
		// Save the generated PDF
		doc.save('inventory_update_report.pdf');
	  };
	
	  const generateFinancialReport = () => {
        const doc = new jsPDF();

        // Set title for the PDF
        doc.setFontSize(20);
        doc.text('Financial Report', 10, 20);

        // Set table headers for financial data
        doc.setFontSize(12);
        let yPosition = 30;
        doc.text('Medication Name', 10, yPosition);
        doc.text('Dollars per Unit', 60, yPosition);
        doc.text('Quantity', 100, yPosition);
        doc.text('Total Value', 140, yPosition);

        yPosition += 10; // Space after header row

        // Loop through rows and add each medication financial detail
        rows.forEach((medication) => {
            const totalValue = (medication.dollars_per_unit * medication.quantity).toFixed(2); // Calculate total value
            doc.text(medication.name, 10, yPosition);
            doc.text(medication.dollars_per_unit.toFixed(2), 60, yPosition);
            doc.text(medication.quantity.toString(), 100, yPosition);
            doc.text(totalValue, 140, yPosition);
            yPosition += 10; // Move to the next row
        });

        // Save the generated PDF
        doc.save('financial_report.pdf');
    }
	return (
		<div>
			<h2>Medication Inventory Table</h2>

			<div style={{ display: 'flex', alignItems: 'center' }}>

    			<TextField
                  type="datetime-local"
                  value={timestamp1}
                  onChange={(e) => setTimestamp1(e.target.value)}
                  label="Inventory start date"
                  InputLabelProps={{ shrink: true }}
                  style={{ marginRight: '10px' }}
                />
                <TextField
                  type="datetime-local"
                  value={timestamp2}
                  onChange={(e) => setTimestamp2(e.target.value)}
                  label="Inventory end date"
                  InputLabelProps={{ shrink: true }}
                />
    			<Button variant="contained" onClick={fetchInventory}>
    				Generate Medication Inventory Report
    			</Button>
			</div>
			<Button variant="contained" onClick={generateFinancialReport} style={{ marginLeft: '10px' }}>
                Generate Financial Report
            </Button>

    {localStorage.getItem("role") === "Pharmacy Manager" &&
			<Button
				variant="contained"
				onClick={() => {
					if (openAddMedicationModal.current) {
						openAddMedicationModal.current(); // Trigger modal to open for adding a medication
					}
				}}
			>
				Add Medication
			</Button>}

			<EditDeleteTable
				columns={columns}
				rows={rows}
				editModal={AddEditMedicationModal}
				deleteModal={DeleteModal}
				showEditButton={canEdit()}
				showDeleteButton={canDelete()}
				customConfirmMessage={medicationConfirmMessage}
				onAdd={(handler) => {
					openAddMedicationModal.current = handler; // Store the open modal handler
				}}
				onEdit={addEditMedication}
				onConfirmDelete={deleteMedication}
			></EditDeleteTable>
			{/* Snackbar for error messages */}
			<Snackbar 
				open={openSnackbar} 
				autoHideDuration={6000} 
				onClose={handleCloseSnackbar}
		 	>
				<Alert onClose={handleCloseSnackbar} severity="error">
					{errorMessage}
				</Alert>
		  	</Snackbar>
		</div>
	);
}

export default ViewOfMedications;