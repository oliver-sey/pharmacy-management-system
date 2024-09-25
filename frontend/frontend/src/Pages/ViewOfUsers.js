import React from "react";
import BaseTable from "../Components/BaseTable";
import { IconButton } from "@mui/material";

import LockOpenIcon from "@mui/icons-material/LockOpen";

function ViewOfUsers() {
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

	const rows = [
		{
			id: 1,
			firstName: "Silly",
			lastName: "McGiggles",
			email: "silly.giggles@example.com",
		},
		{
			id: 2,
			firstName: "Chuckles",
			lastName: "VonLaugh",
			email: "chuckles.von@example.com",
		},
		{
			id: 3,
			firstName: "Giggle",
			lastName: "FitzSnicker",
			email: "giggle.fitz@example.com",
		},
		{
			id: 4,
			firstName: "Snort",
			lastName: "McChuckle",
			email: "snort.mcchuckle@example.com",
		},
		{
			id: 5,
			firstName: "Wheezy",
			lastName: "Snickersson",
			email: "wheezy.snickersson@example.com",
		},
		{
			id: 6,
			firstName: "Tickles",
			lastName: "McJester",
			email: "tickles.mcjester@example.com",
		},
		{
			id: 7,
			firstName: "Chuck",
			lastName: "Tickler",
			email: "chuck.tickler@example.com",
		},
		{
			id: 8,
			firstName: "Goofy",
			lastName: "Hilarious",
			email: "goofy.hilarious@example.com",
		},
		{
			id: 9,
			firstName: "Wobble",
			lastName: "Snortson",
			email: "wobble.snortson@example.com",
		},
		{
			id: 10,
			firstName: "Belly",
			lastName: "Laughlin",
			email: "belly.laughlin@example.com",
		},
		{
			id: 11,
			firstName: "Giggles",
			lastName: "McWheeze",
			email: "giggles.mcwheeze@example.com",
		},
		{
			id: 12,
			firstName: "Bubbles",
			lastName: "Jokerstein",
			email: "bubbles.jokerstein@example.com",
		},
		{
			id: 13,
			firstName: "Zany",
			lastName: "McLaughs",
			email: "zany.mclaughs@example.com",
		},
		{
			id: 14,
			firstName: "Scooter",
			lastName: "Funster",
			email: "scooter.funster@example.com",
		},
		{
			id: 15,
			firstName: "Dizzy",
			lastName: "Laughalot",
			email: "dizzy.laughalot@example.com",
		},
		{
			id: 16,
			firstName: "Jolly",
			lastName: "Snickers",
			email: "jolly.snickers@example.com",
		},
		{
			id: 17,
			firstName: "Bozo",
			lastName: "Gigglestein",
			email: "bozo.gigglestein@example.com",
		},
		{
			id: 18,
			firstName: "Quirky",
			lastName: "Chucklemeister",
			email: "quirky.chucklemeister@example.com",
		},
		{
			id: 19,
			firstName: "Punny",
			lastName: "Guffawson",
			email: "punny.guffawson@example.com",
		},
		{
			id: 20,
			firstName: "Buffo",
			lastName: "Laughmore",
			email: "buffo.laughmore@example.com",
		},
	];

	// Action buttons with unlock logic
	const actionButtons = (row) => (
		<IconButton
			onClick={() => console.log("Unlocking:", row.id)}
			disabled={!row.isLockedOut} // Disable if already unlocked
		>
			<LockOpenIcon color={row.isLockedOut ? "primary" : "disabled"} />
		</IconButton>
	);

	return (
		<BaseTable
			columns={columns}
			rows={rows}
			actionButtons={actionButtons}
		/>
	);
}
export default ViewOfUsers;
