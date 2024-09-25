import React, { useState } from "react";
import TableComponent from "../Components/TableComponent";
import { DataGrid } from "@mui/x-data-grid";
// import Paper from "@mui/material/Paper";
import {
	Paper,
	IconButton,
	Dialog,
	DialogActions,
	DialogTitle,
	Button,
} from "@mui/material";

import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

function ViewOfPatients() {
	const columns = [
		{ field: "id", headerName: "ID", width: 70 },
		{ field: "firstName", headerName: "First name", width: 130 },
		{ field: "lastName", headerName: "Last name", width: 130 },
		// {
		// 	field: "fullName",
		// 	headerName: "Full name",
		// 	description: "This column has a value getter and is not sortable.",
		// 	sortable: false,
		// 	width: 160,
		// 	valueGetter: (value, row) =>
		// 		`${row.firstName || ""} ${row.lastName || ""}`,
		// },
		{ field: "dateOfBirth", headerName: "Date of Birth", width: 160 },

		{
			field: "age",
			headerName: "Age",
			type: "number",
			width: 90,
			valueGetter: (value, row) => {
				const today = new Date();
				const birthDate = new Date(row.dateOfBirth);
				let age = today.getFullYear() - birthDate.getFullYear();
				const monthDiff = today.getMonth() - birthDate.getMonth();
				if (
					monthDiff < 0 ||
					(monthDiff === 0 && today.getDate() < birthDate.getDate())
				) {
					age--;
				}
				return age;
			},
		},

		{ field: "address", headerName: "Address", width: 250 },
		{ field: "phoneNumberStr", headerName: "Phone Number", width: 150 },
		{ field: "email", headerName: "Email", width: 220 },
		{ field: "insuranceName", headerName: "Insurance Name", width: 180 },
		{
			field: "insuranceGroupNum",
			headerName: "Insurance Group Number",
			width: 180,
		},
		{
			field: "insuranceMemberID",
			headerName: "Insurance Member ID",
			width: 180,
		},
		{
			field: "actions",
			headerName: "Actions",
			width: 100,
			sortable: false,
			renderCell: (params) => (
				<span>
					{/* pencil icon to edit the patient */}
					<IconButton onClick={() => handleOpenEdit(params.row)}>
						<EditIcon color="black" />
					</IconButton>

					{/* trash can icon to delete the patient */}
					<IconButton onClick={() => handleOpenDelete(params.row)}>
						<DeleteIcon color="error" />
					</IconButton>
				</span>
			),
		},
	];

	// {ID: , firstName: "", lastName: "", dateOfBirth: "", address: "", phoneNumberStr: "", email: "", insuranceName: "", insuranceGroupNum: "", insuranceMemberID: ""}
	const rows = [
		{
			id: 1,
			firstName: "Silly",
			lastName: "McGiggles",
			dateOfBirth: "1990-04-15",
			address: "123 Banana St, Laughville",
			phoneNumberStr: "555-123-4567",
			email: "silly.giggles@example.com",
			insuranceName: "HealthySmiles Insurance",
			insuranceGroupNum: "HS1234",
			insuranceMemberID: "M123456789",
		},
		{
			id: 2,
			firstName: "Chuckles",
			lastName: "VonLaugh",
			dateOfBirth: "1985-09-22",
			address: "456 Comedy Ln, Funnytown",
			phoneNumberStr: "555-234-5678",
			email: "chuckles.von@example.com",
			insuranceName: "WeCare Health",
			insuranceGroupNum: "WC5678",
			insuranceMemberID: "M987654321",
		},
		{
			id: 3,
			firstName: "Giggle",
			lastName: "FitzSnicker",
			dateOfBirth: "1993-12-01",
			address: "789 Prank Ave, Joketon",
			phoneNumberStr: "555-345-6789",
			email: "giggle.fitz@example.com",
			insuranceName: "Laughsurance",
			insuranceGroupNum: "LS9101",
			insuranceMemberID: "M456789012",
		},
		{
			id: 4,
			firstName: "Snort",
			lastName: "McChuckle",
			dateOfBirth: "1998-07-11",
			address: "101 Funnybone Blvd, Giggleville",
			phoneNumberStr: "555-456-7890",
			email: "snort.mcchuckle@example.com",
			insuranceName: "ClownCare Insurance",
			insuranceGroupNum: "CC2345",
			insuranceMemberID: "M123456780",
		},
		{
			id: 5,
			firstName: "Wheezy",
			lastName: "Snickersson",
			dateOfBirth: "1983-02-27",
			address: "202 Guffaw Rd, Chuckletown",
			phoneNumberStr: "555-567-8901",
			email: "wheezy.snickersson@example.com",
			insuranceName: "HappyHealth",
			insuranceGroupNum: "HH6789",
			insuranceMemberID: "M987654320",
		},
		{
			id: 6,
			firstName: "Tickles",
			lastName: "McJester",
			dateOfBirth: "1995-05-13",
			address: "303 Prankster St, Jokersville",
			phoneNumberStr: "555-678-9012",
			email: "tickles.mcjester@example.com",
			insuranceName: "Gagsurance Health",
			insuranceGroupNum: "GS3456",
			insuranceMemberID: "M456789010",
		},
		{
			id: 7,
			firstName: "Chuck",
			lastName: "Tickler",
			dateOfBirth: "1987-10-19",
			address: "404 Laugh Blvd, Hahaville",
			phoneNumberStr: "555-789-0123",
			email: "chuck.tickler@example.com",
			insuranceName: "LaughingLife",
			insuranceGroupNum: "LL9101",
			insuranceMemberID: "M1234567890",
		},
		{
			id: 8,
			firstName: "Goofy",
			lastName: "Hilarious",
			dateOfBirth: "1999-03-03",
			address: "505 Jokes Rd, Funnytown",
			phoneNumberStr: "555-890-1234",
			email: "goofy.hilarious@example.com",
			insuranceName: "GiggleGuard Insurance",
			insuranceGroupNum: "GG5678",
			insuranceMemberID: "M9876543210",
		},
		{
			id: 9,
			firstName: "Wobble",
			lastName: "Snortson",
			dateOfBirth: "1991-06-25",
			address: "606 Comedy Cir, Prankland",
			phoneNumberStr: "555-901-2345",
			email: "wobble.snortson@example.com",
			insuranceName: "ChuckleCare",
			insuranceGroupNum: "CC2345",
			insuranceMemberID: "M4567890120",
		},
		{
			id: 10,
			firstName: "Belly",
			lastName: "Laughlin",
			dateOfBirth: "1989-11-30",
			address: "707 Guffaw Ave, Chuckleville",
			phoneNumberStr: "555-012-3456",
			email: "belly.laughlin@example.com",
			insuranceName: "SnickerShield Health",
			insuranceGroupNum: "SS6789",
			insuranceMemberID: "M1234567891",
		},
		{
			id: 11,
			firstName: "Giggles",
			lastName: "McWheeze",
			dateOfBirth: "1986-08-14",
			address: "808 Tickle St, Joketown",
			phoneNumberStr: "555-123-4567",
			email: "giggles.mcwheeze@example.com",
			insuranceName: "ClownCare Insurance",
			insuranceGroupNum: "CC9101",
			insuranceMemberID: "M9876543211",
		},
		{
			id: 12,
			firstName: "Bubbles",
			lastName: "Jokerstein",
			dateOfBirth: "1992-04-08",
			address: "909 Prankster Blvd, Funnytown",
			phoneNumberStr: "555-234-5678",
			email: "bubbles.jokerstein@example.com",
			insuranceName: "LaughLife Health",
			insuranceGroupNum: "LL2345",
			insuranceMemberID: "M4567890121",
		},
		{
			id: 13,
			firstName: "Zany",
			lastName: "McLaughs",
			dateOfBirth: "1988-12-22",
			address: "1010 Joke Ln, Giggleville",
			phoneNumberStr: "555-345-6789",
			email: "zany.mclaughs@example.com",
			insuranceName: "SnickerCare",
			insuranceGroupNum: "SC5678",
			insuranceMemberID: "M1234567892",
		},
		{
			id: 14,
			firstName: "Scooter",
			lastName: "Funster",
			dateOfBirth: "1996-01-18",
			address: "1111 Chuckle Ave, Joketon",
			phoneNumberStr: "555-456-7890",
			email: "scooter.funster@example.com",
			insuranceName: "ClownShield Health",
			insuranceGroupNum: "CS9101",
			insuranceMemberID: "M9876543212",
		},
		{
			id: 15,
			firstName: "Dizzy",
			lastName: "Laughalot",
			dateOfBirth: "1984-05-20",
			address: "1212 Gag Rd, Chuckleland",
			phoneNumberStr: "555-567-8901",
			email: "dizzy.laughalot@example.com",
			insuranceName: "GagShield Insurance",
			insuranceGroupNum: "GS2345",
			insuranceMemberID: "M4567890122",
		},
		{
			id: 16,
			firstName: "Jolly",
			lastName: "Snickers",
			dateOfBirth: "1994-09-09",
			address: "1313 Prankster St, Guffawtown",
			phoneNumberStr: "555-678-9012",
			email: "jolly.snickers@example.com",
			insuranceName: "LaughShield Health",
			insuranceGroupNum: "LS5678",
			insuranceMemberID: "M1234567893",
		},
		{
			id: 17,
			firstName: "Bozo",
			lastName: "Gigglestein",
			dateOfBirth: "1997-11-01",
			address: "1414 Joke Cir, Jokersville",
			phoneNumberStr: "555-789-0123",
			email: "bozo.gigglestein@example.com",
			insuranceName: "SnickerCare",
			insuranceGroupNum: "SC9101",
			insuranceMemberID: "M9876543213",
		},
		{
			id: 18,
			firstName: "Quirky",
			lastName: "Chucklemeister",
			dateOfBirth: "1990-02-05",
			address: "1515 Guffaw Blvd, Laughville",
			phoneNumberStr: "555-890-1234",
			email: "quirky.chucklemeister@example.com",
			insuranceName: "ClownCare Insurance",
			insuranceGroupNum: "CC2345",
			insuranceMemberID: "M4567890123",
		},
		{
			id: 19,
			firstName: "Punny",
			lastName: "Guffawson",
			dateOfBirth: "1982-06-16",
			address: "1616 Prank Ave, Chuckletown",
			phoneNumberStr: "555-901-2345",
			email: "punny.guffawson@example.com",
			insuranceName: "GiggleGuard Insurance",
			insuranceGroupNum: "GG5678",
			insuranceMemberID: "M1234567894",
		},
		{
			id: 20,
			firstName: "Buffo",
			lastName: "Laughmore",
			dateOfBirth: "1981-03-29",
			address: "1717 Jokes Blvd, Funnytown",
			phoneNumberStr: "555-012-3456",
			email: "buffo.laughmore@example.com",
			insuranceName: "WeCare Health",
			insuranceGroupNum: "WC6789",
			insuranceMemberID: "M9876543214",
		},
	];

	const paginationModel = { page: 0, pageSize: 25 };

	// *** Modals ***
	const [selectedRow, setSelectedRow] = useState(null);

	// Code for edit modal
	const [openEdit, setOpenEdit] = useState(false);

	// Handle modal open and close
	const handleOpenEdit = (row) => {
		setSelectedRow(row);
		setOpenEdit(true);
	};

	const handleCloseEdit = () => {
		setOpenEdit(false);
	};

	// Code for delete modal
	const [openDelete, setOpenDelete] = useState(false);

	// Handle modal open and close
	const handleOpenDelete = (row) => {
		setSelectedRow(row);
		setOpenDelete(true);
	};

	const handleCloseDelete = () => {
		setOpenDelete(false);
	};

	return (
		<div>
			{/*  Modal for Delete Confirmation */}
			<Dialog open={openDelete} onClose={handleCloseDelete}>
				<DialogTitle>{`Delete ${selectedRow?.firstName} ${selectedRow?.lastName}?`}</DialogTitle>
				<DialogActions>
					<Button onClick={handleCloseDelete} color="primary">
						Cancel
					</Button>
					<Button
						onClick={() => {
							// Handle delete action here
							console.log(
								`Deleting patient ID: ${selectedRow?.id}`
							);
							handleCloseDelete();
						}}
						color="error"
					>
						Delete
					</Button>
				</DialogActions>
			</Dialog>
			<div>
				<div>
					<h2>Patients</h2>
				</div>

				<Paper sx={{ height: "0.8vwh", width: "100%" }}>
					<DataGrid
						rows={rows}
						columns={columns}
						initialState={{ pagination: { paginationModel } }}
						pageSizeOptions={[5, 10]}
						// checkboxSelection
						sx={{
							border: 0,
							"& .MuiDataGrid-columnHeaders": {
								fontWeight: "bold", // Make headers bold
								backgroundColor: "#000000", // Optional background color for headers
							},
						}}
					/>
				</Paper>
				{/* <TableComponent rows={rows}></TableComponent> */}
			</div>
		</div>
	);
}
export default ViewOfPatients;
