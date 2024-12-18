import { React, useRef, useState, useEffect } from "react";

import EditDeleteTable from "../Components/EditDeleteTable"
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
		{ field: "name", headerName: "Medication Name"},
		{ field: "dosage", headerName: "Dosage"},
		{ field: "quantity", headerName: "Quantity"},
		{
			field: "prescription_required",
			headerName: "Prescription Required"
			
		},
		{ field: "expiration_date", headerName: "Expiration Date"},
		{ field: "dollars_per_unit", headerName: "$ Per Unit"},
		{
			field: "alerts",
			headerName: "Alerts",
			
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
					icons.push(
						// empty hourglass icon, says "Expired" when you hover
						<IconButton sx={{maxWidth: 43}}>
							<Tooltip id="expired" title="Expired">
								<HourglassEmptyIcon color="error" />
							</Tooltip>
						</IconButton>
					);
				}
				// expiration date is within the next 30 days
				else if (differenceDays <= 30) {
					icons.push(
						// TODO: fix style?
						// <div style={[{"display": "flex"}, { "align-items": "center" }]}>
						// half-empty hourglass icon, says the warning when you hover
						<IconButton sx={{maxWidth: 43}}>
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
					
				}

				// check inventory
				// less than 120 should give a warning
				if (params.row.quantity < 120) {
					icons.push(
						<IconButton sx={{maxWidth: 43}}>
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
		return role === 'Pharmacy Manager';
	};
	  
	// only pharmacy managers can delete
	const canDelete = () => {
		const role = localStorage.getItem('role');
		return role === 'Pharmacy Manager';
	};


	const deleteMedication = async (id) => {
		try {
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
		  doc.text('ID', 10, yPosition);
		  doc.text('Medication Name', 30, yPosition);
		  doc.text('Quantity Changed', 70, yPosition);
		  doc.text('Quantity Left', 110, yPosition);
		  doc.text('Timestamp', 150, yPosition);
		
		  yPosition += 10; // Space after header row
		
		  // Loop through updates and add each inventory update
		  inventoryData.updates.forEach((update) => {
			// Truncate each column's text if necessary
			const medicationIdText = truncateText(update.medication_id.toString(), maxLength.medicationId);
			const medicationNameText = truncateText(update.medication_name || 'Unknown Medication', maxLength.medicationName);
			const quantityChangedText = truncateText(update.quantity_changed_by.toString(), maxLength.quantityChanged);
			const quantityLeftText = truncateText(update.resulting_total_quantity.toString(), maxLength.quantityChanged);
			const timestampText = truncateText(update.timestamp ? new Date(update.timestamp).toLocaleString() : 'N/A', maxLength.timestamp);
		
			// Add the truncated text to the PDF
			doc.text(medicationIdText, 10, yPosition);
			doc.text(medicationNameText, 30, yPosition);
			doc.text(quantityChangedText, 70, yPosition);
			doc.text(quantityLeftText, 110, yPosition);
			doc.text(timestampText, 150, yPosition);
		
			// Move to the next row
			yPosition += 10;
		  });
	  
		// Save the generated PDF
		doc.save('inventory_update_report.pdf');
	  };
	
	  const generateFinancialReport = async () => {
		try {
			// Fetch all transactions
			const transactionsResponse = await fetch('http://localhost:8000/transactions', {
				headers: { Authorization: 'Bearer ' + token },
			});
			if (!transactionsResponse.ok) throw new Error('Failed to fetch transactions');
			const transactions = await transactionsResponse.json();
	
			// Fetch all transaction items
			const transactionItemsResponse = await fetch('http://localhost:8000/transaction-items', {
				headers: { Authorization: 'Bearer ' + token },
			});
			if (!transactionItemsResponse.ok) throw new Error('Failed to fetch transaction items');
			const transactionItems = await transactionItemsResponse.json();
	
			// Initialize jsPDF
			const doc = new jsPDF();
			const pageHeight = doc.internal.pageSize.height; // Get page height
			let yPosition = 20; // Start position for the first page
	
			// Helper to add a new page if needed
			const addNewPageIfNeeded = () => {
				if (yPosition + 10 > pageHeight - 15) { // 15 is the bottom margin
					doc.addPage();
					yPosition = 20; // Reset yPosition for the new page
				}
			};
	
			// Title
			doc.setFontSize(20);
			doc.text('Financial Report', 10, yPosition);
			yPosition += 10;
	
			// Total Revenue
			const totalRevenue = transactions.reduce((sum, transaction) => sum + transaction.total_price, 0);
			doc.setFontSize(12);
			doc.text(`Total Revenue: $${totalRevenue.toFixed(2)}`, 10, yPosition);
			yPosition += 10;
	
			// Average Transaction Value
			const averageTransactionValue = totalRevenue / transactions.length;
			doc.text(`Average Transaction Value: $${averageTransactionValue.toFixed(2)}`, 10, yPosition);
			yPosition += 10;
	
			// Transaction Count
			doc.text(`Total Transactions: ${transactions.length}`, 10, yPosition);
			yPosition += 10;
	
			// Payment Method Breakdown
			const paymentMethods = transactions.reduce((totals, transaction) => {
				const method = transaction.payment_method;
				totals[method] = (totals[method] || 0) + 1; 
				return totals;
			}, {});
			const mostPopularPaymentMethod = Object.entries(paymentMethods).sort((a, b) => b[1] - a[1])[0][0];
			doc.text('Payment Method Breakdown:', 10, yPosition);
			yPosition += 10;
	
			Object.entries(paymentMethods).forEach(([method, count]) => {
				addNewPageIfNeeded();
				doc.text(`  - ${method}: ${count} transactions`, 10, yPosition);
				yPosition += 10;
			});
			doc.text(`Most Popular Payment Method: ${mostPopularPaymentMethod}`, 10, yPosition);
			yPosition += 20;
	
			// Top Selling Medications
			const medicationSales = transactionItems.reduce((totals, item) => {
				totals[item.medication_id] = (totals[item.medication_id] || 0) + item.quantity;
				return totals;
			}, {});
			const topSellingMedications = Object.entries(medicationSales)
				.sort((a, b) => b[1] - a[1])
				.slice(0, 5); // Top 5 medications
			doc.text('Top Selling Medications (by Quantity):', 10, yPosition);
			yPosition += 10;
	
			topSellingMedications.forEach(([medicationId, quantity]) => {
				addNewPageIfNeeded();
				doc.text(`  - Medication ID: ${medicationId}, Quantity Sold: ${quantity}`, 10, yPosition);
				yPosition += 10;
			});
	
			// Transaction Details
			doc.setFontSize(14);
			doc.text('Transaction Details:', 10, yPosition);
			yPosition += 10;
			doc.setFontSize(12);
	
			transactions.forEach((transaction) => {
				addNewPageIfNeeded();
				doc.text(`Transaction ID: ${transaction.id}`, 10, yPosition);
				doc.text(`  Patient ID: ${transaction.patient_id}`, 70, yPosition);
				doc.text(`  Total Price (incl. tax): $${transaction.total_price.toFixed(2)}`, 140, yPosition);
				yPosition += 10;
	
				// Transaction Items
				const items = transactionItems.filter((item) => item.transaction_id === transaction.id);
				items.forEach((item) => {
					addNewPageIfNeeded();
					const subtotalWithTax = item.subtotal_price * 1.08; // Assuming 8% tax
					doc.text(
						`    - Medication ID: ${item.medication_id}, Quantity: ${item.quantity}, Subtotal (w/tax): $${subtotalWithTax.toFixed(2)}`,
						20,
						yPosition
					);
					yPosition += 10;
				});
				yPosition += 10; // Space between transactions
			});
	
			// Save the generated PDF
			doc.save('financial_report_with_statistics.pdf');
		} catch (error) {
			console.error('Error generating financial report:', error);
			setErrorMessage('Failed to generate financial report: ' + error.message);
			setOpenSnackbar(true);
		}
	};
	
	
	
	return (
		<div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', margin: '20px' }}>
			<h2>Medication Inventory Table</h2>
	
			<div
				style={{
					display: 'flex',
					flexWrap: 'wrap',
					gap: '15px',
					justifyContent: 'center',
					alignItems: 'center',
					marginBottom: '20px',
					width: '100%',
					maxWidth: '800px',
				}}
			>
				<TextField
					type="datetime-local"
					value={timestamp1}
					onChange={(e) => setTimestamp1(e.target.value)}
					label="Inventory start date"
					InputLabelProps={{ shrink: true }}
					style={{
						flex: '1 1 auto',
						maxWidth: '250px',
						minWidth: '200px',
					}}
				/>
				<TextField
					type="datetime-local"
					value={timestamp2}
					onChange={(e) => setTimestamp2(e.target.value)}
					label="Inventory end date"
					InputLabelProps={{ shrink: true }}
					style={{
						flex: '1 1 auto',
						maxWidth: '250px',
						minWidth: '200px',
					}}
				/>
				<Button
					variant="contained"
					onClick={fetchInventory}
					style={{
						flex: '0 1 auto',
						maxWidth: '250px',
						minWidth: '150px',
						padding: '10px 15px',
					}}
				>
					Generate Medication Inventory Report
				</Button>
				<Button
					variant="contained"
					onClick={generateFinancialReport}
					style={{
						flex: '0 1 auto',
						maxWidth: '250px',
						minWidth: '150px',
						padding: '10px 15px',
					}}
				>
					Generate Financial Report
				</Button>
				{localStorage.getItem('role') === 'Pharmacy Manager' && (
					<Button
						variant="contained"
						onClick={() =>
							openAddMedicationModal.current && openAddMedicationModal.current()
						}
						style={{
							flex: '0 1 auto',
							maxWidth: '250px',
							minWidth: '150px',
							padding: '10px 15px',
						}}
					>
						Add Medication
					</Button>
				)}
			</div>
	
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
				fetchMedications={fetchMedications} // Pass fetchMedications as a prop
			/>
	
			{/* Snackbar for error messages */}
			<Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleCloseSnackbar}>
				<Alert onClose={handleCloseSnackbar} severity="error">
					{errorMessage}
				</Alert>
			</Snackbar>
		</div>
	);
}

export default ViewOfMedications;