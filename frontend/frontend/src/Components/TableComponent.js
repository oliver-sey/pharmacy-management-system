import React from "react";

import { DataGrid } from "@mui/x-data-grid";
import {
	Paper,
	// IconButton, Dialog, DialogActions, DialogTitle, Button,
} from "@mui/material";
// import DeleteIcon from "@mui/icons-material/Delete"; // Material UI Delete Icon

// const paginationModel = { page: 0, pageSize: 25 };
function TableComponent(rows, columns, paginationModel = { page: 0, pageSize: 25 }) {
	return (
		<div>
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
		</div>
	);
}

export default TableComponent;
