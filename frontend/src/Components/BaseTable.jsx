// A base component for a page with a DataGrid table from Material UI
// with an optional column for buttons to interact with the rows
// this gets used in some pages, and used as a starting point for EditDeleteTable


import React from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Paper } from "@mui/material";
import { useGridApiRef } from "@mui/x-data-grid";



const BaseTable = ({ columns, rows, actionButtons }) => {
	const apiRef = useGridApiRef();
	const [isLoading, setIsLoading] = React.useState(false);

	React.useEffect(() => {
		setIsLoading(true);
		const timeoutId = setTimeout(() => {
			
			setIsLoading(false);
			setTimeout(() => {
				apiRef.current.autosizeColumns({ includeOutliers: false, includeHeaders: true });
			}, 200)

		}, 1000);
		return () => {
			clearInterval(timeoutId);
		};
	}, [apiRef]);


	// Conditionally add the actions column if actionButtons is provided
	const modifiedColumns = [
		...columns,
		// an extra columns with buttons that you can use to interact with that row (edit, delete, unlock that account, etc.)
		...(actionButtons
			? [
					{
						field: "actions",
						headerName: "Actions",
						width: 100,
						sortable: false,
						renderCell: (params) => (
							<>
								{actionButtons(params.row)}
							</>
						),
					},
			  ]
			: []), // No column with buttons if not provided
	];

	return (
		<Paper sx={{ height: "85vh", width: "100%" }}>
		<DataGrid
			rows={rows}
			columns={modifiedColumns}
			pageSizeOptions={[5, 10]}
			sx={{
			border: 0,
			"& .MuiDataGrid-columnHeaders": {
				fontWeight: "bold",
				backgroundColor: "#00008B",
				color: "#000000",
			},
			"& .MuiDataGrid-cell": {
				display: 'flex',
				alignItems: 'center',
				gap: '4px', // Adjust space between buttons
			},
			}}
			apiRef={apiRef}
			loading={isLoading}
		/>
		</Paper>
	);
};

export default BaseTable;
