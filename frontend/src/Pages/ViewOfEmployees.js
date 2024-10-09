import { React, useRef, useState } from "react";
import EditDeleteTable from "../Components/EditDeleteTable";
import DeleteModal from "../Components/DeleteModal";
import Button from "@mui/material/Button";
import AddEditEmployeeModal from "../Components/AddEditEmployeeModal";

function ViewOfEmployees() {
    const [isEditOpen, setIsEditOpen] = useState(false); // Tracks if the modal is open
    const [selectedRow, setSelectedRow] = useState(null); // Tracks the selected row for editing
    const openAddEmployeeModal = useRef(null);

  // Debugging console logs to check state
  // console.log("isEditOpen:", isEditOpen);
  // console.log("selectedRow:", selectedRow);

  // Columns for the table
  const columns = [
    { field: "employeeId", headerName: "Employee ID", width: 100 },
    { field: "firstName", headerName: "First name", width: 130 },
    { field: "lastName", headerName: "Last name", width: 130 },
    { field: "username", headerName: "Username", width: 160 },
    {
      field: "password",
      headerName: "Password",
      width: 160,
      renderCell: (params) => "*******", // Always display password as ****
    },
    { field: "employeeType", headerName: "Employee Type", width: 200 },
  ];
  

  // Hardcoded employee rows for testing
  const rows = [
    {
      id: 1, 
      employeeId: 1,
      firstName: "John",
      lastName: "Doe",
      username: "john-doe",
      password: "password",
      employeeType: "Pharmacy Manager",
    },
    {
      id: 2, 
      employeeId: 2,
      firstName: "Jane",
      lastName: "Smith",
      username: "jane-smith",
      password: "password",
      employeeType: "Pharmacist",
    },
    {
      id: 3,
      employeeId: 3,
      firstName: "Alice",
      lastName: "Johnson",
      username: "alice-johnson",
      password: "password",
      employeeType: "Pharmacist Technician",
    },
    {
      id: 4,
      employeeId: 4,
      firstName: "Bob",
      lastName: "Lee",
      username: "bob-lee",
      password: "password",
      employeeType: "Cashier",
    },
  ];
  

  // Function to open the Add/Edit modal
  const openAddEmployeeHandler = () => {
    console.log("Add Employee button clicked");
    setSelectedRow(null); // Clear any selected row (for new employee)
    setIsEditOpen(true); // Open modal
  };

  // Close the modal
  const closeEditModal = () => {
    console.log("Closing modal");
    setIsEditOpen(false);
  };

  // Handle saving employee data
  const handleSaveEmployee = (employeeData) => {
    console.log("Employee saved:", employeeData);
    closeEditModal(); // Close modal after saving
  };

  return (
    <div>
      <h2>Employees Table</h2>
      <Button variant="contained" onClick={openAddEmployeeHandler}>
        Add Employee
      </Button>

      {/* Edit/Delete Table */}
      <EditDeleteTable
        rows={rows}
        columns={columns}
        editModal={AddEditEmployeeModal}
        deleteModal={DeleteModal}
        customConfirmMessage={(row) =>
          `${row?.firstName || "Unknown First Name"} ${
            row?.lastName || "Unknown Last Name"
          }`
        }
        onAdd={(handler) => {
          openAddEmployeeModal.current = handler; // Store the open modal handler
        }}
      />

      {/* Add/Edit Employee Modal */}
      <AddEditEmployeeModal
        open={isEditOpen}
        onClose={closeEditModal}
        row={selectedRow}
        onSave={handleSaveEmployee}
      />
    </div>
  );
}

export default ViewOfEmployees;
