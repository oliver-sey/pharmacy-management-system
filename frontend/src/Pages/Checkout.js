import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from 'react-router-dom';
import '../Styles/Checkout.css';

import {
	Container,
	Grid,
	TextField,
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableRow,
	Button,
	Typography,
	Paper,
	List,
	ListItem,
	Divider,
	Skeleton,
	InputLabel, 
	MenuItem,
	FormControl,
	Select
} from "@mui/material";

import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import RemoveShoppingCartIcon from "@mui/icons-material/RemoveShoppingCart";
// import Autocomplete from "@mui/lab/Autocomplete";

// Mock data
const nonPrescriptionItems = [
	{ id: 1, name: "Pain Reliever", unitPrice: 5.0, details: "200mg Tablet" },
	{ id: 2, name: "Cough Syrup", unitPrice: 8.5, details: "100ml Bottle" },
	{ id: 3, name: "Vitamin C", unitPrice: 12.0, details: "500mg Tablet" },
];

const patients = ["John Doe", "Jane Smith", "Michael Johnson", "Alice Brown"];

const prescriptions = [
	{
		id: 1,
		patientId: 1,
		patientName: "John Doe",
		name: "Antibiotic",
		unitPrice: 15.0,
		details: "500mg Tablet",
	},
	{
		id: 2,
		patientId: 1,
		patientName: "John Doe",
		name: "Blood Pressure Med",
		unitPrice: 20.0,
		details: "20mg Tablet",
	},
];

function Checkout() {
	const [cart, setCart] = useState({ nonPrescription: [], prescription: [] });
	const [patients, setPatients] = useState([]);
	const [selectedPatient, setSelectedPatient] = useState(null);
	const [searchTerm, setSearchTerm] = useState("");
	const [filteredPrescriptions, setFilteredPrescriptions] = useState([]);


	const [errorMessage, setErrorMessage] = useState(null);
	const [openSnackbar, setOpenSnackbar] = useState(false);

	// to see if the data is still loading for patients and prescriptions
	const [patientsLoading, setPatientsLoading] = useState(false);
	const [prescriptionsLoading, setPrescriptionsLoading] = useState(false);


	const navigate = useNavigate();
	const role = ["Pharmacist"];
	const token = localStorage.getItem("token");

	// Async function to fetch presciptions data
	const fetchPrescriptionsForPatient = async (patientId) => {
		// set that prescription data is still loading
		setPrescriptionsLoading(true);
		try {
			const response = await fetch(
				`http://localhost:8000/prescriptions?patient_id=${patientId}`,
				{
					headers: {
						Authorization: "Bearer " + token,
					},
				}
			);
			const data = await response.json(); // Convert response to JSON
			setFilteredPrescriptions(data); // Store the fetched data in state

			// return data;
		} catch (error) {
			console.error(`Error fetching prescriptions for patient_id ${patientId}: ${error}`);
			// error handling
			setErrorMessage("Failed to fetch prescriptions");
			setOpenSnackbar(true); // Show Snackbar when error occurs
		}
		finally {
			// done loading prescriptions data
			setPrescriptionsLoading(false);
		}
	};
	
	// function to get the details for one patient
	// gets used to display their name when they get selected in the dropdown
	const fetchOnePatient = async (patientId) => {
		try {
			const response = await fetch(
				`http://localhost:8000/patient/${patientId}`,
				{
					headers: {
						Authorization: "Bearer " + token,
					},
				}
			);
			if (!response.ok) {
				// TODO: do more to handle the error?
				throw new Error("Failed to fetch patient data");
			}
			const data = await response.json();

			return data;
		} catch (error) {
			console.error("Error fetching patient:", error);
			// error handling
			setErrorMessage("Failed to fetch patient");
			setOpenSnackbar(true); // Show Snackbar when error occurs
		}
	};

	// function to get the list of all patients, stores the data in the state in 'patients'
	const fetchPatients = useCallback(async () => {
		// set that patient data is still loading
		setPatientsLoading(true);
		try {
			const response = await fetch("http://localhost:8000/patients", {
				headers: {
					Authorization: "Bearer " + token,
				},
			});

			if (!response.ok) {
				throw new Error("Failed to fetch patient data");
			}

			const data = await response.json();
			setPatients(data); // Store the fetched data in state
			
			// console.log("patient data: " + JSON.stringify(data));
			// return data;
		} catch (error) {
			console.error("Error fetching patient:", error);
			// error handling
			setErrorMessage("Failed to fetch patient");
			setOpenSnackbar(true); // Show Snackbar when error occurs
		} finally {
			setPatientsLoading(false);
		}
	}, [token]);

	useEffect(() => {
		try {
			if (token) {
				fetchPatients();
			}
		}
		catch (error) {
			console.error("Error calling fetchPatients in the useEffect:", error);
		}
    }, [fetchPatients, token]);



	const handleAddToCart = (item, type) => {
		setCart((prevCart) => ({
			...prevCart,
			[type]: [...prevCart[type], { ...item, quantity: 1 }],
		}));
	};

	const handleRemoveFromCart = (id, type) => {
		setCart((prevCart) => ({
			...prevCart,
			[type]: prevCart[type].filter((item) => item.id !== id),
		}));
	};

	const handleQuantityChange = (id, type, quantity) => {
		setCart((prevCart) => ({
			...prevCart,
			[type]: prevCart[type].map((item) =>
				item.id === id
					? { ...item, quantity: quantity < 1 ? 1 : quantity }
					: item
			),
		}));
	};

	const handlePatientSelect = async (patientID) => {
		const patient = await fetchOnePatient(patientID);
		setSelectedPatient(patient);
		// call the function to get prescriptions for this patient, and put it into filteredPrescriptions
		// so it can be displayed in the list
		const prescriptions = await fetchPrescriptionsForPatient(patientID)
		setFilteredPrescriptions(
			// prescriptions.filter(
			// 	(prescription) => prescription.patientId === patientID
			// )

			prescriptions
		);
	};

	const calculateTotal = (items) =>
		items.reduce(
			(total, item) => total + item.unitPrice * item.quantity,
			0
		);

	const nonPrescriptionTotal = calculateTotal(cart.nonPrescription);
	const prescriptionTotal = calculateTotal(cart.prescription);
	const subtotal = nonPrescriptionTotal + prescriptionTotal;
	const tax = subtotal * 0.08;
	const grandTotal = subtotal + tax;

	return (
		<Container>
			<Grid container spacing={2}>
				<Grid item xs={8}>
					<Typography variant="h5">Non-Prescription Items</Typography>
					<Table>
						<TableHead>
							<TableRow>
								<TableCell>Name</TableCell>
								<TableCell>Details</TableCell>
								<TableCell>Unit Price</TableCell>
								<TableCell>Add to Cart</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{nonPrescriptionItems.map((item) => (
								<TableRow key={item.id}>
									<TableCell>{item.name}</TableCell>
									<TableCell>{item.details}</TableCell>
									<TableCell>
										${item.unitPrice.toFixed(2)}
									</TableCell>
									<TableCell>
										<Button
											variant="contained"
											color="primary"
											startIcon={<AddShoppingCartIcon />}
											onClick={() =>
												handleAddToCart(
													item,
													"nonPrescription"
												)
											}
										>
											Add
										</Button>
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>

					<Typography variant="h5" sx={{ mt: 4 }}>
						Prescription Items
					</Typography>
					{/* <Autocomplete */}
					{/* options={patients}
						inputValue={searchTerm}
						onInputChange={(e, newInputValue) => setSearchTerm(newInputValue)}
						onChange={(e, value) => handlePatientSelect(value)}
						renderInput={(params) => <TextField {...params} label="Patient Name" />}
					/> */}

					{/* use the skeleton from Material UI to show a placeholder while data is loading */}
					{/* handling the case if there is a problem fetching the patients */}
					{patientsLoading ? (
						<Skeleton
							variant="rectangular"
							width="100%"
							height={50}
						/>
					) : patients.length > 0 ? (
						<div id="patient-select-div">
							{/* take up the fill width of the parent element */}
							<FormControl fullWidth>
								<InputLabel id="patient-select-label">
									Patient
								</InputLabel>
								<Select
									labelId="patient-select-label"
									id="patient-select"
									// if selectedPatient is not null, show the name and DOB, otherwise show an empty string
									value={selectedPatient ? `${selectedPatient.first_name} ${selectedPatient.last_name} (DOB ${selectedPatient.date_of_birth})` : ""}
									label="Patient"
									onChange={(e) => {
										handlePatientSelect(e.target.value)
										// console.log("in the onChange for the patient selection. e.target.value: " + e.target.value + ", selected patient: " + selectedPatient)
									}
									}
								>
									{/* <MenuItem value={10}>Ten</MenuItem>
									<MenuItem value={20}>Twenty</MenuItem>
									<MenuItem value={30}>Thirty</MenuItem> */}

									{patients.map((patient) => (
										<MenuItem key={patient.id} value={patient.id}>
											{patient.first_name} {patient.last_name}{" "}
											(DOB {patient.date_of_birth})
										</MenuItem>
									))} 


									{/* code from before I started using Material UI and FormControl */}
									{/* placeholder value that you can't select */}
									{/* <option value="" disabled>
									Select Patient
								</option>

								{patients.map((patient) => (
									<option key={patient.id} value={patient.id}>
										{patient.first_name} {patient.last_name}{" "}
										(DOB {patient.date_of_birth})
									</option>
								))} */}
								</Select>
							</FormControl>
						</div>
					) : (
						<p>Loading patients...</p>
					)}

					{selectedPatient && (
						<>
							<Typography variant="h6" sx={{ mt: 2 }}>
								Prescriptions for {selectedPatient.first_name}{" "}
								{selectedPatient.last_name}
							</Typography>
							<Table>
								<TableHead>
									<TableRow>
										<TableCell>Name</TableCell>
										<TableCell>Details</TableCell>
										<TableCell>Unit Price</TableCell>
										<TableCell>Add to Cart</TableCell>
									</TableRow>
								</TableHead>
								<TableBody>
									{prescriptionsLoading ? (
										// Show skeletons while loading
										<>
											<TableRow>
												<TableCell colSpan={4}>
													<Skeleton variant="text" />
												</TableCell>
											</TableRow>
											<TableRow>
												<TableCell colSpan={4}>
													<Skeleton variant="text" />
												</TableCell>
											</TableRow>
											<TableRow>
												<TableCell colSpan={4}>
													<Skeleton variant="text" />
												</TableCell>
											</TableRow>
											{/* (a few rows below this, but we can't put a comment there) */}
											{/* handling the case if there is a problem getting the prescriptions */}
											{/* make sure filteredPrescriptions even exists, then make sure the length is greater than 0 */}
										</>
									) : filteredPrescriptions &&
									  filteredPrescriptions.length > 0 ? (
										filteredPrescriptions.map(
											(prescription) => (
												<TableRow key={prescription.id}>
													<TableCell>
														{prescription.name}
													</TableCell>
													<TableCell>
														{prescription.details}
													</TableCell>
													<TableCell>
														$
														{prescription.unitPrice.toFixed(
															2
														)}
													</TableCell>
													<TableCell>
														<Button
															variant="contained"
															color="primary"
															startIcon={
																<AddShoppingCartIcon />
															}
															onClick={() =>
																handleAddToCart(
																	prescription,
																	"prescription"
																)
															}
														>
															Add
														</Button>
													</TableCell>
												</TableRow>
											)
										)
									) : (
										// Show message if no prescriptions
										<TableRow>
											<TableCell colSpan={4}>
												No prescriptions found for this
												patient.
											</TableCell>
										</TableRow>
									)}
								</TableBody>
							</Table>
						</>
					)}
				</Grid>

				<Grid item xs={4}>
					<Paper
						elevation={3}
						sx={{ padding: 2, position: "sticky", top: 20 }}
					>
						<Typography variant="h6">Shopping Cart</Typography>
						{cart.nonPrescription.length === 0 &&
						cart.prescription.length === 0 ? (
							<Typography variant="body2" color="textSecondary">
								No items in cart.
							</Typography>
						) : (
							<>
								<Typography variant="subtitle1">
									Non-Prescription Items
								</Typography>
								<List>
									{cart.nonPrescription.map((item) => (
										<ListItem key={item.id}>
											{item.name} - ${item.unitPrice} x{" "}
											{item.quantity} = $
											{(
												item.unitPrice * item.quantity
											).toFixed(2)}
											<Button
												size="small"
												color="secondary"
												onClick={() =>
													handleRemoveFromCart(
														item.id,
														"nonPrescription"
													)
												}
											>
												Remove
											</Button>
										</ListItem>
									))}
								</List>
								<Divider />

								<Typography variant="subtitle1">
									Prescription Items
								</Typography>
								<List>
									{cart.prescription.map((item) => (
										<ListItem key={item.id}>
											{item.name} - ${item.unitPrice} x{" "}
											{item.quantity} = $
											{(
												item.unitPrice * item.quantity
											).toFixed(2)}
											<Button
												size="small"
												color="secondary"
												onClick={() =>
													handleRemoveFromCart(
														item.id,
														"prescription"
													)
												}
											>
												Remove
											</Button>
										</ListItem>
									))}
								</List>
								<Divider />

								<Typography variant="subtitle1">
									Subtotal: ${subtotal.toFixed(2)}
								</Typography>
								<Typography variant="subtitle1">
									Tax (8%): ${tax.toFixed(2)}
								</Typography>
								<Typography variant="h6">
									Grand Total: ${grandTotal.toFixed(2)}
								</Typography>
							</>
						)}
					</Paper>
				</Grid>
			</Grid>
		</Container>
	);
}

export default Checkout;
