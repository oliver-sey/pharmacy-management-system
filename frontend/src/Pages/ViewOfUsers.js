import React from "react";
import BaseTable from "../Components/BaseTable";
import { IconButton } from "@mui/material";

import LockOpenIcon from "@mui/icons-material/LockOpen";

function ViewOfUsers() {
	// the columns for the table
	// headerName is what shows up on the website
	// width is the default width of the column, user can adjust it
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
		{ field: "email", headerName: "Email", width: 220 },
	];

	// hardcoded values for development, this will come from the backend/database later
	// TODO: get rid of hardcoded values
	const rows = [
		{
			id: 1,
			firstName: "Silly",
			lastName: "McGiggles",
			email: "silly.giggles@example.com",
			isLockedOut: "true",
		},
		{
			id: 2,
			firstName: "Chuckles",
			lastName: "VonLaugh",
			email: "chuckles.von@example.com",
			isLockedOut: "false",
		},
		{
			id: 3,
			firstName: "Giggle",
			lastName: "FitzSnicker",
			email: "giggle.fitz@example.com",
			isLockedOut: "false",
		},
		{
			id: 4,
			firstName: "Snort",
			lastName: "McChuckle",
			email: "snort.mcchuckle@example.com",
			isLockedOut: "true",
		},
		{
			id: 5,
			firstName: "Wheezy",
			lastName: "Snickersson",
			email: "wheezy.snickersson@example.com",
			isLockedOut: "false",
		},
		{
			id: 6,
			firstName: "Tickles",
			lastName: "McJester",
			email: "tickles.mcjester@example.com",
			isLockedOut: "true",
		},
		{
			id: 7,
			firstName: "Chuck",
			lastName: "Tickler",
			email: "chuck.tickler@example.com",
			isLockedOut: "false",
		},
		{
			id: 8,
			firstName: "Goofy",
			lastName: "Hilarious",
			email: "goofy.hilarious@example.com",
			isLockedOut: "false",
		},
		{
			id: 9,
			firstName: "Wobble",
			lastName: "Snortson",
			email: "wobble.snortson@example.com",
			isLockedOut: "false",
		},
		{
			id: 10,
			firstName: "Belly",
			lastName: "Laughlin",
			email: "belly.laughlin@example.com",
			isLockedOut: "false",
		},
		{
			id: 11,
			firstName: "Giggles",
			lastName: "McWheeze",
			email: "giggles.mcwheeze@example.com",
			isLockedOut: "false",
		},
		{
			id: 12,
			firstName: "Bubbles",
			lastName: "Jokerstein",
			email: "bubbles.jokerstein@example.com",
			isLockedOut: "false",
		},
		{
			id: 13,
			firstName: "Zany",
			lastName: "McLaughs",
			email: "zany.mclaughs@example.com",
			isLockedOut: "false",
		},
		{
			id: 14,
			firstName: "Scooter",
			lastName: "Funster",
			email: "scooter.funster@example.com",
			isLockedOut: "false",
		},
		{
			id: 15,
			firstName: "Dizzy",
			lastName: "Laughalot",
			email: "dizzy.laughalot@example.com",
			isLockedOut: "false",
		},
		{
			id: 16,
			firstName: "Jolly",
			lastName: "Snickers",
			email: "jolly.snickers@example.com",
			isLockedOut: "false",
		},
		{
			id: 17,
			firstName: "Bozo",
			lastName: "Gigglestein",
			email: "bozo.gigglestein@example.com",
			isLockedOut: "false",
		},
		{
			id: 18,
			firstName: "Quirky",
			lastName: "Chucklemeister",
			email: "quirky.chucklemeister@example.com",
			isLockedOut: "false",
		},
		{
			id: 19,
			firstName: "Punny",
			lastName: "Guffawson",
			email: "punny.guffawson@example.com",
			isLockedOut: "false",
		},
		{
			id: 20,
			firstName: "Buffo",
			lastName: "Laughmore",
			email: "buffo.laughmore@example.com",
			isLockedOut: "false",
		},
	];

	// a column for buttons the user can click
	const actionButtons = (row) =>
		// only make the unlock icon appear if the user is locked out
		row.isLockedOut == "true" && (
			<div>
				<IconButton
				// TODO: do something when they click the button!
					onClick={() => console.log("Unlocking:", row.id)}
					disabled={!row.isLockedOut} // Disable if already unlocked
				>
					{/* <LockOpenIcon color={row.isLockedOut ? "primary" : "disabled"} /> */}
					<LockOpenIcon color="primary" />
				</IconButton>
			</div>
		);

	// return the page, using the BaseTable component with a few changes (custom columns and rows, the actionButtons column)
	return (
		<BaseTable
			columns={columns}
			rows={rows}
			actionButtons={actionButtons}
		/>
	);
}
export default ViewOfUsers;
