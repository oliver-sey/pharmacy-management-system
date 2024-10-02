// React imports
import { React, useRef } from "react";

// Stylesheets
import "../Styles/styles.css";

// Components we made
import Header from "../Components/Header";
import EditDeleteTable from "../Components/EditDeleteTable";
import AddEditMedicationModal from "../Components/AddEditMedicationModal";
import DeleteModal from "../Components/DeleteModal";

// Material UI components
import { IconButton, Tooltip } from "@mui/material";
import Button from "@mui/material/Button";
import HourglassBottomIcon from "@mui/icons-material/HourglassBottom";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import WarningIcon from "@mui/icons-material/Warning";

function ViewOfMedications() {
	// the columns for the table
	// headerName is what shows up on the website
	// width is the default width of the column, user can adjust it
	const columns = [
		{ field: "id", headerName: "ID", width: 70 },
		{ field: "name", headerName: "Medication Name", width: 200 },
		{ field: "dosageStr", headerName: "Dosage", width: 100 },
		{ field: "quantity", headerName: "Quantity", width: 100 },
		{
			field: "prescriptionRequired",
			headerName: "Prescription Required",
			width: 100,
		},
		{ field: "expirationDate", headerName: "Expiration Date", width: 100 },
		{ field: "dollarsPerUnit", headerName: "$ Per Unit", width: 100 },
		{
			field: "alerts",
			headerName: "Alerts",
			width: 100,
			// calculate time between now and the expiration date, to see what alert icons we should show
			renderCell: (params) => {
				// TODO: fix some weird stuff with time zones??? dates still print weird
				const today = new Date();
				const expirationDate = new Date(params.row.expirationDate);

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
					console.log(
						"Difference between expiration",
						expirationDate,
						"and today is",
						differenceDays,
						"**is expired"
					);
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
					console.log(
						"Difference between expiration (in UTC)",
						expirationDate,
						"and today is",
						differenceDays,
						"not expired, **but need a warning"
					);
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
					console.log(
						"Difference between expiration (in UTC)",
						expirationDate,
						"and today is",
						differenceDays,
						"not expired, and don't need a warning"
					);
				}

				// check inventory
				// less than 120 should give a warning
				if (params.row.quantity < 120) {
					console.log("Less than 120 units/doses, giving a warning");
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

	// hardcoded values for development, this will come from the backend/database later
	// TODO: get rid of hardcoded values
	const rows = [
		{
			id: 1,
			name: "dat good stuff",
			dosage: "not strong enuff",
			quantity: "200",
			prescriptionRequired: "true",
			expirationDate: "2024-10-25",
			dollarsPerUnit: "0.001",
		},
		{
			id: 2,
			name: "tylenol",
			dosage: "5mg",
			quantity: "100",
			prescriptionRequired: "false",
			expirationDate: "2024-09-25",
			dollarsPerUnit: "0.00002",
		},
		{
			id: 3,
			name: "melatonin",
			dosage: "3 mg",
			quantity: "1000",
			prescriptionRequired: "false",
			expirationDate: "2029-01-02",
			dollarsPerUnit: "0.0003",
		},
		{
			id: 4,
			name: "oxy",
			dosage: "100mg",
			quantity: "2",
			prescriptionRequired: "true",
			expirationDate: "2024-09-24",
			dollarsPerUnit: "1",
		},
	];

	// the message format that should get used in the delete confirmation modal (popup) for this table
	// need this since we want a different format on other tables that use this same base component
	const medicationConfirmMessage = (row) =>
		`${row?.name || "Unknown Medication Name"} - ${
			row?.dosage || "Unknown Dosage"
		}`;

	const openAddMedicationModal = useRef(null);

	return (
		<div>
			<h2>Medication Inventory Table</h2>
			<Button
				variant="contained"
				onClick={() => {
					if (openAddMedicationModal.current) {
						openAddMedicationModal.current(); // Trigger modal to open for adding a medication
					}
				}}
			>
				Add Medication
			</Button>

			<EditDeleteTable
				columns={columns}
				rows={rows}
				editModal={AddEditMedicationModal}
				deleteModal={DeleteModal}
				customConfirmMessage={medicationConfirmMessage}
				onAdd={(handler) => {
					openAddMedicationModal.current = handler; // Store the open modal handler
				}}
			></EditDeleteTable>
		</div>
	);
}

export default ViewOfMedications;
