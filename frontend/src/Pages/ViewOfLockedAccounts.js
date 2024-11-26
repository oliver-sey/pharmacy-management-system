import { React, useRef, useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { Snackbar, Alert, Button} from "@mui/material";
import { IconButton, Tooltip } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CheckUserType from "../Functions/CheckUserType";
import LocalPharmacyOutlinedIcon from '@mui/icons-material/LocalPharmacyOutlined';
import BaseTable from "../Components/BaseTable";
import LockOpenOutlinedIcon from '@mui/icons-material/LockOpenOutlined';


function ViewOfLockedAccounts() {
	// the columns for the table
	// headerName is what shows up on the website
	// width is the default width of the column, user can adjust it
	const [rows, setRows] = useState([]);
	const [errorMessage, setErrorMessage] = useState(null);
	const [openSnackbar, setOpenSnackbar] = useState(false);
	const navigate = useNavigate();
	const role = ["Pharmacy Manager"]
	const token = localStorage.getItem('token');
	const [updated, setUpdated] = useState(false);
	



	const fetchUsers = async () => {
		try {
			const response = await fetch('http://localhost:8000/userslist', {
				headers: {
					'Authorization': 'Bearer ' + token,
				},
			});
			const data = await response.json()

			console.log("users data: " + JSON.stringify(data))
			
			return data
		} catch (error) {
			console.error('Error fetching users:', error);
			// error handling
			setErrorMessage('Failed to fetch users');
			setOpenSnackbar(true); // Show Snackbar when error occurs
		}
	}

	const fetchActivities = async () => {
		try {
			const response = await fetch('http://localhost:8000/user-activities', {
				headers: {
					'Authorization': 'Bearer ' + token,
				},
			});
			const data = await response.json()
			
			return data
		} catch (error) {
			console.error('Error fetching user activities:', error);
			// error handling
			setErrorMessage('Failed to fetch user activities');
			setOpenSnackbar(true); // Show Snackbar when error occurs
		}
	}

	const loadRows = async () =>{
		const users = await fetchUsers();
		const activities = await fetchActivities();

		const lockedAccounts = users.filter(user => user.is_locked_out === true)

		const updatedLockedAccounts = lockedAccounts.map(account => {
		
		
			return {
			...account,
			
			name: account.first_name + ' ' + account.last_name,
			};
		})

		updatedLockedAccounts.forEach(account => {
			delete account.first_name;
			delete account.last_name;
			delete account.password;
			
		});

		setRows(updatedLockedAccounts)
	}

		
	const deleteUser = async (id) => {
		try {
			
			const response = await fetch(`http://localhost:8000/users/${id}`, {
				method: 'DELETE',
				headers: { 'Authorization': 'Bearer ' + token }
			});
			if (!response.ok) {
				throw new Error('Failed to delete account');
			}
			loadRows()
		} catch (error) {
			console.error('Error deleting account:', error);
			setErrorMessage('Failed to delete account' + error);
			setOpenSnackbar(true);
		}
	}

	const unlockAccount = async (row) => {
		try {
			
			const response = await fetch(`http://localhost:8000/users/lock_status/${row}`, {
				method: 'PUT',
				headers: {'Authorization': 'Bearer ' + token}
			});
			if (!response.ok) {
				throw new Error('Failed to unlock account');
			}
			loadRows()
		} catch (error) {
			console.error('Error unlocking account:', error);
			setErrorMessage('Failed to unlock account' + error);
			setOpenSnackbar(true);
		}
	}

	const HandleDelete = async (row) => {
		//TO DO: confirmation message
		deleteUser(row.id)

	}

	const HandleUnlock = async (row) => {
		//TO DO: confirmation message
		unlockAccount(row.id)

	}
   

	// useEffect to fetch data when the component mounts
	useEffect(() => {
		CheckUserType(role, navigate)
		loadRows()
		
	  }, []);

	  

	  const columns = [
		
		{ field: 'name', headerName: 'Name' },
		{ field: 'email', headerName: 'Email' },
		{ field: 'user_type', headerName: 'User Type' },
		//{ field: 'date_locked', headerName: 'Date Locked Out' }
        
	  ];




	// Handle closing of the Snackbar
	const handleCloseSnackbar = () => {
		setOpenSnackbar(false);
	};

	const actionButtons = (row) => (
		<div style={{ display: "flex", width: "100%" }}>
			{/* unlock button */}
			{( 
				<Tooltip id="unlock" title="Unlock" style={{ flex: 1 }}>
					<IconButton
						onClick={() => HandleUnlock(row)}
						style={{ width: "auto" }}
					>
						<LockOpenOutlinedIcon color="primary" />
					</IconButton>
				</Tooltip>
			)}

			{/* delete button */}
			{ ( 
				<Tooltip id="delete" title="Delete" style={{ flex: 1 }}>
					<IconButton
						onClick={() => HandleDelete(row)}
						style={{ width: "auto" }}
					>
						<DeleteIcon color="error" />
					</IconButton>
				</Tooltip>
			)}
		</div>
	);

	// the message format that should get used in the delete confirmation modal (popup) for this table
	// need this since we want a different format on other tables that use this same base component
	const prescriptionConfirmMessage = (row) =>
		`${row?.first_name || "Unknown First Name"} ${
			row?.last_name || "Unknown Last Name"
		}, with DOB ${row?.date_of_birth || "Unknown DOB"}`;


	return (
		<div>
		  <h2>Locked Accounts</h2>

			<BaseTable
				columns={columns}
				rows={rows}
				actionButtons={actionButtons}
			/>
		  
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
export default ViewOfLockedAccounts;
