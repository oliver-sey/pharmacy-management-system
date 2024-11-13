import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from 'react-router-dom';
import '../Styles/Checkout.css';

import {
	TextField,
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableRow,
	Button,
	Paper,
	List,
	ListItem,
	Divider,
	Skeleton,
	InputLabel, 
	MenuItem,
	FormControl,
	Select,
	Snackbar
} from "@mui/material";


// TODO: use RemoveShoppingCartIcon instead of Button
// TODO: clear cart when the selected patient changes? don't want to let the wrong patient buy prescription items
	// or just clear prescriptions items from the cart?
// TODO: put the patient at the top and require the patient dropdown before checking out 
// (need patient_id for the transaction)


import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import RemoveShoppingCartIcon from "@mui/icons-material/RemoveShoppingCart";
// import Autocomplete from "@mui/lab/Autocomplete";

// Mock data
// const nonPrescriptionItems = [
	// 	{ id: 1, name: "Pain Reliever", dollars_per_unit: 5.0, details: "200mg Tablet" },
	// 	{ id: 2, name: "Cough Syrup", dollars_per_unit: 8.5, details: "100ml Bottle" },
	// 	{ id: 3, name: "Vitamin C", dollars_per_unit: 12.0, details: "500mg Tablet" },
	// ];


function Checkout() {
	const [cart, setCart] = useState({ nonPrescription: [], prescription: [] });
	const [patients, setPatients] = useState([]);
	const [selectedPatient, setSelectedPatient] = useState(null);
	const [searchTerm, setSearchTerm] = useState("");
	const [filteredPrescriptions, setFilteredPrescriptions] = useState([]);
	const [nonPrescriptionItems, setNonPrescriptionItems] = useState([]);


	const [errorMessage, setErrorMessage] = useState(null);
	const [openSnackbar, setOpenSnackbar] = useState(false);

	// to see if the data is still loading for patients, non-prescription items, and prescriptions
	const [patientsLoading, setPatientsLoading] = useState(false);
	const [nonPrescriptionItemsLoading, setNonPrescriptionItemsLoading] = useState(false);
	const [prescriptionsLoading, setPrescriptionsLoading] = useState(false);


	const navigate = useNavigate();
	const role = ["Pharmacist"];
	const token = localStorage.getItem("token");


	const fetchNonPrescriptionItems = useCallback(async () => {
		// set that non-prescription items data is still loading
		setNonPrescriptionItemsLoading(true);

		try {
			// get all the medications first
			const response = await fetch(
				`http://localhost:8000/medicationlist`,
				{
					headers: {
						Authorization: "Bearer " + token,
					},
				}
			);
			if (response.status === 400) {
				throw new Error("Bad request fetching non-prescription items data. There may be a bug in the code, please contact the development team.");
			} else if (response.status === 401) {
				throw new Error("Unauthorized request to fetch non-prescription items. Please log in and try again.");
			} else if (response.status === 404) {
				throw new Error("404 error while fetching non-prescription items. The API route may have a typo in it, please contact the development team.");
			} else if (response.status === 500) {
				throw new Error("Server error fetching non-prescription items. Please try again later.");
			}
			if (!response.ok) {
				// TODO: do more to handle the error?
				throw new Error("Failed to fetch non-prescription items");
			}

			const originalMedications = await response.json(); // Convert response to JSON

			// filter out medications that require a prescription
			// since this is for the non-prescription items
			const nonPrescriptionMedications = originalMedications.filter(
				(medication) => !medication.prescription_required
			);

			setNonPrescriptionItems(nonPrescriptionMedications); // Store the fetched data in state
		} catch (error) {
			console.error(
				`Error fetching non-prescription items (medications): ${error}`
			);
			// error handling
			// setErrorMessage("Failed to fetch non-prescription items");
			// use the error message from the Error that gives some more details
			// TODO: is this right?
			setErrorMessage(error.message);

			setOpenSnackbar(true); // Show Snackbar when error occurs
		} finally {
			// done loading non-prescription items data
			// wait 5 seconds
			// await new Promise(resolve => setTimeout(resolve, 5000));
			setNonPrescriptionItemsLoading(false);
		}
	}, [token]);


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
			const originalPrescriptions = await response.json(); // Convert response to JSON

			// make requests to the API with the original data to get the medication names
			const medicationPromises = originalPrescriptions.map(
				async (prescription) => {
					const response = await fetch(
						`http://localhost:8000/medication/${prescription.medication_id}`,
						{
							headers: {
								Authorization: "Bearer " + token,
							},
						}
					);
					const medicationData = await response.json();
					return {
						...prescription,
						medication_name: medicationData.name,
						dosage: medicationData.dosage,
						dollars_per_unit: medicationData.dollars_per_unit,
					};
				}
			);

			// wait on all the requests
			const PrescriptionsWithMedNames = await Promise.all(
				medicationPromises
			);

			// filter out prescriptions that are not yet filled - can't sell a medication to a patient if we haven't put it in the bottle yet
			const filledPrescriptionsWithMedNames =
				PrescriptionsWithMedNames.map((prescription) => ({
					...prescription,
					medication_name: prescription.medication_name,
				})).filter(
					(prescription) =>
						prescription.filled_timestamp &&
						prescription.user_filled_id
				);

			setFilteredPrescriptions(filledPrescriptionsWithMedNames); // Store the fetched data in state
		} catch (error) {
			console.error(
				`Error fetching prescriptions for patient_id ${patientId}: ${error}`
			);
			// error handling
			setErrorMessage("Failed to fetch prescriptions");
			setOpenSnackbar(true); // Show Snackbar when error occurs
		} finally {
			// done loading prescriptions data
			// wait 5 seconds
			// await new Promise(resolve => setTimeout(resolve, 5000));
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
			if (response.status === 400) {
				throw new Error("Bad request fetching patient data. There may be a bug in the code, please contact the development team.");
			} else if (response.status === 401) {
				throw new Error("Unauthorized request to fetch patient data. Please log in and try again.");
			} else if (response.status === 500) {
				throw new Error("Server error fetching patient data. Please try again later.");
			}
			if (!response.ok) {
				// TODO: do more to handle the error?
				throw new Error("Failed to fetch patient data");
			}
			const data = await response.json();

			return data;
		} catch (error) {
			console.error("Error fetching patient:", error);
			// error handling
			setErrorMessage(error.message);
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
			if (response.status === 400) {
				throw new Error("Bad request fetching prescription data. There may be a bug in the code, please contact the development team.");
			} else if (response.status === 401) {
				throw new Error("Unauthorized request to fetch prescription data. Please log in and try again.");
			} else if (response.status === 500) {
				throw new Error("Server error fetching prescription data. Please try again later.");
			}
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
				// get data on patients and non-prescription items
				fetchPatients();
				fetchNonPrescriptionItems();
			}
			else {
				console.error(`Token is ${token} in useEffect when trying to call fetchPatients() and fetchNonPrescriptionItems()`);
			}
		}
		catch (error) {
			console.error("Error calling fetchPatients() and fetchNonPrescriptionItems() in the useEffect:", error);
		}
    }, [fetchNonPrescriptionItems, fetchPatients, token]);



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
		// Clear the prescription items in the cart if the selected patient changes (from a value other than the default, to a new value)
		// and also if there were any prescription items in the cart
		// we don't want to have prescription items in the cart that the newly-selected
		// patient possibly isn't allowed to purchase
		if (cart.prescription.length && selectedPatient && selectedPatient.id !== patientID) {
			setCart((prevCart) => ({
				...prevCart,
				prescription: []
			}));

			// it's not really an error message, but the Snackbar always just displays the text in errorMessage
			setErrorMessage("Cleared prescription items from cart since patient changed");
			// show the snackbar with the message
			setOpenSnackbar(true);
		}

		const patient = await fetchOnePatient(patientID);
		setSelectedPatient(patient);
		// call the function to get prescriptions for this patient, and put it into filteredPrescriptions
		// so it can be displayed in the list

		// don't need to call setFilteredPrescriptions here since it is already called in fetchPrescriptionsForPatient
		// const prescriptions = await fetchPrescriptionsForPatient(patientID)
		await fetchPrescriptionsForPatient(patientID)

	};

	const calculateTotal = (items) =>
		items.reduce(
			(total, item) => total + item.dollars_per_unit * item.quantity,
			0
		);

	const nonPrescriptionTotal = calculateTotal(cart.nonPrescription);
	const prescriptionTotal = calculateTotal(cart.prescription);
	const subtotal = nonPrescriptionTotal + prescriptionTotal;
	const tax = subtotal * 0.08;
	const grandTotal = subtotal + tax;

	return (
		<div className="checkout-page">
			<div className="checkout-container">
				<div className="tables-container">
					<h3>Non-Prescription Items</h3>
					<Table>
						<TableHead>
							<TableRow>
								<TableCell>Name</TableCell>
								<TableCell>Dosage</TableCell>
								<TableCell>Quantity</TableCell>
								<TableCell>Unit Price</TableCell>
								<TableCell>Add to Cart</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{nonPrescriptionItemsLoading ? (
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
								</>
							) : nonPrescriptionItems &&
							  nonPrescriptionItems.length > 0 ? (
								nonPrescriptionItems.map((medication) => (
									<TableRow key={medication.id}>
										<TableCell>{medication.name}</TableCell>
										<TableCell>
											{medication.dosage}
										</TableCell>
										<TableCell>
											{medication.quantity}
										</TableCell>
										<TableCell>
											{/* TODO: how many decimal places here?? */}
											$
											{medication.dollars_per_unit.toFixed(
												4
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
														medication,
														"nonPrescription"
													)
												}
											>
												Add
											</Button>
										</TableCell>
									</TableRow>
								))
							) : (
								// Show message if no non-prescription items
								<TableRow>
									<TableCell colSpan={4}>
										No non-prescription items found.
									</TableCell>
								</TableRow>
							)}
						</TableBody>
					</Table>

					<h4 className="cart-section-title">Prescription Items</h4>
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
									// value={selectedPatient ? `${selectedPatient.first_name} ${selectedPatient.last_name} (DOB ${selectedPatient.date_of_birth})` : ""}
									value={
										selectedPatient
											? selectedPatient.id
											: ""
									}
									label="Patient"
									onChange={(e) => {
										handlePatientSelect(e.target.value);
										// console.log("in the onChange for the patient selection. e.target.value: " + e.target.value + ", selected patient: " + selectedPatient)
									}}
								>
									{patients.map((patient) => (
										<MenuItem
											key={patient.id}
											value={patient.id}
										>
											{patient.first_name}{" "}
											{patient.last_name} (DOB{" "}
											{patient.date_of_birth})
										</MenuItem>
									))}
								</Select>
							</FormControl>
						</div>
					) : (
						<p>Loading patients...</p>
					)}

					{selectedPatient && (
						<>
							<h3 className="prescriptions-title">
								Prescriptions for {selectedPatient.first_name} {selectedPatient.last_name}
							</h3>
							<Table>
								<TableHead>
									<TableRow>
										<TableCell>Name</TableCell>
										<TableCell>Dosage</TableCell>
										<TableCell>Quantity</TableCell>
										<TableCell>Date Prescribed</TableCell>
										<TableCell>Date Filled</TableCell>
										<TableCell>Doctor Name</TableCell>
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
											{/* (these comments are for a few rows below this, but we can't put a comment there) */}
											{/* handling the case if there is a problem getting the prescriptions */}
											{/* make sure filteredPrescriptions even exists, then make sure the length is greater than 0 */}
										</>
									) : filteredPrescriptions &&
									  filteredPrescriptions.length > 0 ? (
										filteredPrescriptions.map(
											(prescription) => (
												<TableRow key={prescription.id}>
													{/* for the medication name */}
													<TableCell>
														{
															prescription.medication_name
														}
													</TableCell>
													<TableCell>
														{prescription.dosage}
													</TableCell>
													<TableCell>
														{prescription.quantity}
													</TableCell>
													<TableCell>
														{
															prescription.date_prescribed
														}
													</TableCell>
													<TableCell>
														{
															prescription.filled_timestamp
														}
													</TableCell>
													<TableCell>
														{
															prescription.doctor_name
														}
													</TableCell>
													<TableCell>
														{/* TODO: how many decimal places here?? */}
														$
														{prescription.dollars_per_unit.toFixed(
															4
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
				</div>
				<div className="cart-container">
					<Paper
						elevation={3}
						sx={{ padding: 2, position: "sticky", top: 20 }}
					>
						<h2>Shopping Cart</h2>
						{cart.nonPrescription.length === 0 &&
						cart.prescription.length === 0 ? (
							<p className="cart-empty">No items in cart.</p>
						) : (
							<>
								<h3 className="cart-section-title">Non-Prescription Items</h3>
								<List>
									{cart.nonPrescription.map((item) => (
										<ListItem key={item.id}>
											{item.name} - ${item.dollars_per_unit} x{" "}
											{item.quantity} = $
											{(
												item.dollars_per_unit * item.quantity
											).toFixed(2)}
											<Button
												size="small"
												variant="outlined"
												className="remove-from-cart-button"
												startIcon={
													<RemoveShoppingCartIcon />
												}
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

								<h3 className="cart-section-title">Prescription Items</h3>
								<List>
									{cart.prescription.map((item) => (
										<ListItem key={item.id}>
											{item.name} - ${item.dollars_per_unit} x{" "}
											{item.quantity} = $
											{(
												item.dollars_per_unit * item.quantity
											).toFixed(2)}


											<Button
												size="small"
												variant="outlined"
												className="remove-from-cart-button"
												startIcon={
													<RemoveShoppingCartIcon />
												}
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

								<p className="cart-summary">Subtotal: ${subtotal.toFixed(2)}</p>
								<p className="cart-summary">Tax (8%): ${tax.toFixed(2)}</p>
								<h4 className="cart-total">Grand Total: ${grandTotal.toFixed(2)}</h4>
							</>
						)}
					</Paper>
					</div>
				</div>
			<Snackbar
				open={openSnackbar}
				message={errorMessage}
				autoHideDuration={6000}
				onClose={() => setOpenSnackbar(false)}
			/>
		</div>
	);
}

export default Checkout;