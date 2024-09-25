import Header from "../Components/Header";
import EditDeleteTable from "../Components/EditDeleteTable";
import EditModal from "../Components/EditModal";
import DeleteModal from "../Components/DeleteModal";

function ViewOfMedications() {
	const columns = [
		{ field: "id", headerName: "ID", width: 70 },
		{ field: "name", headerName: "Medication Name", width: 200 },
		{ field: "dosage", headerName: "Dosage", width: 100 },
	];

	const rows = [
		{ id: 1, "name": "dat purple drank", "dosage": "not strong enuff" },
		{ id: 2, "name": "tylenol", "dosage": "5mg" },
		{ id: 3, "name": "the melly", "dosage": "3mg" },
	];

	return (
		<div>
		<h2>Medication Inventory Table</h2>
			<EditDeleteTable columns={columns} rows={rows} editModal = {EditModal} deleteModal={DeleteModal}></EditDeleteTable>
		</div>
	);
}

export default ViewOfMedications;
