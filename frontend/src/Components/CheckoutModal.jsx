// This is a component for editing a prescription, and adding a new prescription
// the same modal (popup) gets used for both, but when you are editing, the fields in the popup

//NOTES: will have to collect the patient, user, and medication ID on the backend
//also will have to set the filled ID and time of fill as null if adding prescription

import React, { useState, useEffect } from "react";
import {
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	Button,
	TextField,
	DialogContentText,
	MenuItem,
	FormControl,
	Select,
	InputLabel
} from "@mui/material";
import "../Styles/SearchBar.css"
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';

const CheckoutModal = ({ open, onClose, patient, total, onSave}) => {
	// Initialize form data
	const [formData, setFormData] = useState({
		cardType: "",
		cardNumber: "",
		month: "",
		year: "",
		CVC: "",
		zip: ""
	});


	const [isSigned, setIsSigned] = useState(false)
	const months = Array.from({ length: 12 }, (_, i) => (i + 1).toString().padStart(2, '0'));
	const years = Array.from({ length: 21 }, (_, i) => (2024 + i).toString());
	const [tenderAmount, setTenderAmount] = useState(0)
	const token = localStorage.getItem('token');
	const [signature, setSignature] = useState('')
	const [cardCashToggle, setCardCashToggle] = useState("card")


	// useEffect to fetch data when the component mounts
	useEffect(() => {
		console.log(patient)
		
	  }, []);


	const handleSetCardCash = (e) => {
		const { name, value } = e.target;

		if (value !== null){
      		setCardCashToggle((prev) => (prev === "card" ? "cash" : "card"))
		}

	}

	// Update form data on input change
	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	const handleSignatureChange = (e) => {
		const { name, value } = e.target;

		setSignature(value)
		
		 if (patient.first_name && (value === ( patient.first_name + " " + patient.last_name))) {
			
			setIsSigned(true)
		} else {
			setIsSigned(false)
		}
	}


	// Handle saving of the updated data
	const handleSave = () => {
		if (cardCashToggle === "cash") {
			setFormData((prev) => ({...prev, cardType: "cash"}))
		}

		onSave(formData.cardType); // Pass updated form data to parent component
		onClose()
	}

	const handleClose = () => {
		onClose()
	}

	const handleCashChange = (e, newValue) => {
		const {name, value} = e.target
		  
		if (value.includes('.')) {
			if (value[value.length - 3] === '.') {
			setTenderAmount(parseFloat(value).toFixed(2))
			} else {
			setTenderAmount(value)
			}
		} else if (value === "" || value === null) {
			setTenderAmount(0)
		} else {
			setTenderAmount(parseInt(value, 10))
		}
	}

	const handleChangeZip = (e) => {
		const {name, value} = e.target

		if (value.length <= 5) {
			const onlyNum = value.replace(/[^0-9]/g, '')
			
			setFormData((prev) => ({...prev, zip: onlyNum}))
		}
	}

	const handleChangeNum = (e) => {
		const {name, value} = e.target

		if (value.length <= 16) {
			const onlyNum = value.replace(/[^0-9]/g, '')
			
			setFormData((prev) => ({...prev, cardNumber: onlyNum}))
		}
	}

	return (
		<Dialog open={open} onClose={onClose} sx={{minWidth: 1500}}>
		{/* change the title based on if we are adding or editing,
		which we can tell from if row is null or not */}
		
		{patient ?
			<DialogTitle>
				Enter {patient.first_name}'s Payment
			</DialogTitle> 
			:
			<DialogTitle>
				Enter Payment
			</DialogTitle> 
			}
			<DialogContent>
			<DialogContentText sx={{mb:1, 
                  fontWeight: 'bold', 
                  textAlign: 'center'}}>
				Total: ${total}
			</DialogContentText>
			<ToggleButtonGroup
			color="primary"
			value={cardCashToggle}
			exclusive
			onChange={handleSetCardCash}
			aria-label="card or cash"
			margin="dense"
      		fullWidth
			
			>
				<ToggleButton value="card" aria-label="card">
					Card
				</ToggleButton>
				<ToggleButton value="cash" aria-label="cash">
					Cash
				</ToggleButton>
			</ToggleButtonGroup>
			<div/>
      {cardCashToggle === "card" ? <>
        <FormControl margin="dense">
		<InputLabel>Card Type</InputLabel>
		<Select
			id="card-type-selector"
			select
			label="Card Type"
			defaultValue="credit"
			
			slotProps={{
				select: {
				native: true,
				},
			}}
			sx={{minWidth: 200}}
			>
			<MenuItem key={"credit"} value={"credit"}>
				Credit
			</MenuItem>
			<MenuItem key={"debit"} value={"debit"}>
				Debit
			</MenuItem>
        </Select>
			</FormControl>
				<TextField
					label="Card Number"
					name="cardNumber"
					value={formData.cardNumber}
					onChange={handleChangeNum}
					fullWidth
					margin="dense"
					size="large"
					
				/>
        <DialogContentText>Expiration Date</DialogContentText>
      <FormControl margin="dense">
        <InputLabel> Month</InputLabel>
				<Select
				id="month-selector"
				select
				defaultValue="01"
				helperText="Month"
				slotProps={{
					select: {
					native: true,
					},
				}}
				sx={{width:90}}>
				{
					months.map((month) => (
						<MenuItem value={month} >
							{month}
						</MenuItem>
          			))
				}
				</Select>
        </FormControl>

        <FormControl margin="dense">
          <InputLabel>Year</InputLabel>
			<Select
			id="year-selector"
			select
			defaultValue="2024"
			helperText="Year"
			slotProps={{
				select: {
				native: true,
				},
			}}
			sx={{width:90}}
			
			>
			{
				years.map((year) => (
					<MenuItem value={year}>
						{year}
					</MenuItem>
				))
			}
        	</Select>
		</FormControl>

        <TextField
			label="Zip Code"
			name="zip"
			value={formData.zip}
			onChange={handleChangeZip}
			margin="dense"
			size="large"
          	sx={{ml: 2}}
		/>

		<TextField
			label="Signature"
			name="signature"
			value={signature}
			onChange={handleSignatureChange}
			fullWidth
			margin="dense"
			size="large"
			/>
		</>
      : <> 
      <TextField
			label="Tender Amount"
			name="tenderAmount"
			value={tenderAmount}
			onChange={handleCashChange}
			sx={{minWidth: 400}}
			margin="dense"
			size="large"
		/>
        
        {tenderAmount >= total &&
          <DialogContentText sx={{mt:1, 
                  fontWeight: 'bold', 
                  textAlign: 'center'}}>
              Change to give: ${(tenderAmount - total).toFixed(2)}
          </DialogContentText>
          }
      </>
      }

		</DialogContent>
			<DialogActions>
				<Button onClick={handleClose}>Cancel</Button>
				<Button onClick={handleSave} disabled={(cardCashToggle === "cash" && (tenderAmount < total)) || (cardCashToggle === "card" && (!isSigned || formData.zip.length < 5 || formData.cardNumber.length < 15))} color="primary">
					Complete Payment
				</Button>
			</DialogActions>
		</Dialog>
	);
};

export default CheckoutModal;
