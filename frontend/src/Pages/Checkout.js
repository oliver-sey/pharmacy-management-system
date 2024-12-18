import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from 'react-router-dom';
import VerifyToken from '../Functions/VerifyToken';
import '../Styles/Checkout.css';
import CheckUserType from "../Functions/CheckUserType";
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
	Snackbar,
	Alert
} from "@mui/material";
import { jsPDF} from 'jspdf'; 


import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import RemoveShoppingCartIcon from "@mui/icons-material/RemoveShoppingCart";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import CheckoutModal from "../Components/CheckoutModal";


function Checkout() {
	const [cart, setCart] = useState({ nonPrescription: [], prescription: [] });
	const [patients, setPatients] = useState([]);
	const [selectedPatient, setSelectedPatient] = useState(null);
	const [filteredPrescriptions, setFilteredPrescriptions] = useState([]);
	const [nonPrescriptionItems, setNonPrescriptionItems] = useState([]);
	const [isEditOpen, setIsEditOpen] = useState(false)
	const [payment, setPayment] = useState("")

	// to open the snackbar component with a little alert to the user
	// Snackbar handler state
	const [snackbar, setSnackbar] = useState({
		open: false,
		message: "",
		severity: "info", // Can be "success", "error", "warning", "info"
	});


	// to see if the data is still loading for patients, non-prescription items, and prescriptions
	const [patientsLoading, setPatientsLoading] = useState(false);
	const [nonPrescriptionItemsLoading, setNonPrescriptionItemsLoading] = useState(false);
	const [prescriptionsLoading, setPrescriptionsLoading] = useState(false);

	// quantities for the non prescription items in the table
	// either the quantityInCart or this gets displayed in the text input in the table
	const [quantitiesInTable, setQuantitiesInTable] = useState({});

	const [subtotal, setSubtotal] = useState(0);
	const [tax, setTax] = useState(0);
	const [grandTotal, setGrandTotal] = useState(0);

	const navigate = useNavigate();
	const token = localStorage.getItem("token");
	const roles = ["Pharmacist", "Pharmacy Manager", "Cashier"]


    useEffect(() => {
		VerifyToken(navigate);

		const calculateTotals = () => {
			const nonPrescriptionSubtotal = cart.nonPrescription.reduce(
				(acc, item) =>
					acc + item.quantityInCart * item.dollars_per_unit,
				0
			);
			const prescriptionSubtotal = cart.prescription.reduce(
				(acc, item) =>
					acc + item.quantityInCart * item.dollars_per_unit,
				0
			);
			const newSubtotal = nonPrescriptionSubtotal + prescriptionSubtotal;
			const newTax = newSubtotal * 0.08; // Assuming 8% tax rate
			const newGrandTotal = newSubtotal + newTax;

			setSubtotal(newSubtotal);
			setTax(newTax);
			setGrandTotal(newGrandTotal);
		};

		calculateTotals();
	}, [navigate, cart]);


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
			let nonPrescriptionMedications = originalMedications.filter(
				(medication) => !medication.prescription_required
			);

			// add a quantityInCart property to each item in the nonPrescriptionMedications array
			nonPrescriptionMedications = nonPrescriptionMedications.map((item) => ({
				...item,
				// set a default value of 0 in cart
				quantityInCart: 0,
			}));

			// set values for the quantities which will get displayed in the table
			// either 100 units, or if there are less than 100 units, all of the quantity available
			const quantities = {};
			nonPrescriptionMedications.forEach((item) => {
				const quantityToStore = item.quantity >= 100 ? 100 : item.quantity;
				quantities[item.id] = quantityToStore;
			});
			setQuantitiesInTable(quantities);

			setNonPrescriptionItems(nonPrescriptionMedications); // Store the fetched data in state
		} catch (error) {
			console.error(
				`Error fetching non-prescription items (medications): ${error}`
			);
			// error handling
			// use the error message from the Error that gives some more details
			showSnackbar(error.message, "error");
		} finally {
			// done loading non-prescription items data
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
						// set a default value of 0 in cart
						quantityInCart: 0,
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
					// set a default value of 0 in cart
					quantityInCart: 0,
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
			showSnackbar("Failed to fetch prescriptions", "error");
		} finally {
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
			showSnackbar(error.message, "error");
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
			
		} catch (error) {
			console.error("Error fetching patient:", error);
			// error handling
			showSnackbar("Failed to fetch patient", "error");
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
				[type]: [...prevCart[type], { ...item, quantityInCart: item.quantity}],
				
			}));
	};

	// TODO: can we combine handleAddToCart and handleAddNonPrescToCart into one function?
	const handleAddNonPrescToCart = (item, type, quantityToAdd) => {
		// new code that doesn't let you add a non-prescription item to the cart twice
		// (can still increase the quantity in the cart though)
		if (cart.nonPrescription.some((cartItem) => cartItem.id === item.id)) {
			showSnackbar("Item already in cart. Increase quantity in cart instead.", "error");
		} else {
			// add item to the cart with the quantity that is in the text input field
			const quantityInCart = quantityToAdd || 0;

			if (quantityInCart === 0) {
				showSnackbar("Quantity must be greater than 0.", "error");
			}

			else if (quantityInCart <= item.quantity) {
				// Add item to cart with selected quantity
				setCart((prevCart) => ({
					...prevCart,
					[type]: [...prevCart[type], { ...item, quantityInCart }],
				}));
			}
			else {
				showSnackbar("Quantity exceeds available stock.", "error");
			}
		}
	};
	

	const handleRemoveFromCart = (id, type) => {
		setCart((prevCart) => ({
			...prevCart,
			[type]: prevCart[type].filter((item) => item.id !== id),
		}));
	};


	const handleQuantityChange = (itemId, change) => {
		// console.log("in handleQuantityChange, itemId: " + itemId + ", change: " + change);
		setCart((prev) => {
		  const updatedNonPrescription = prev.nonPrescription.map(item => {
			if (item.id === itemId) {
			  const newQty = item.quantityInCart + change;
			  if (newQty >= 0 && newQty <= item.quantity) {
				return { ...item, quantityInCart: newQty };
			  }
			}
			return item;
		  });
		  return { ...prev, nonPrescription: updatedNonPrescription };
		});

		// update quantitiesInTable
		setQuantitiesInTable((prev) => ({
			...prev,
			[itemId]: (prev[itemId] || 0) + change
		  }));
	  };
	
	const handleManualQuantityChange = (itemId, newQuantityString) => {
		// parse the parameter as an integer in base 10
		let newQuantityInCart = parseInt(newQuantityString, 10);
		const maxQuantity = nonPrescriptionItems.find(item => item.id === itemId).quantity;
		
		// if the text field is empty, set the quantity to 0
		// TODO: which I guess just means remove it??
		if (newQuantityString === "") {
			// handleRemoveFromCart(itemId, "nonPrescription");
			newQuantityInCart = 0;
		}
		else if (isNaN(newQuantityInCart)) {
			// Show Snackbar error
			showSnackbar("Error reading a quantity from the input box. Input must be a whole number.", "error");
		}
		else if (newQuantityInCart <= 0) {
			// remove the item from the cart
			handleRemoveFromCart(itemId, "nonPrescription");
		}
		else if (newQuantityInCart <= maxQuantity) {
			console.log("calling setCart in handleManualQuantityChange, with newQuantityInCart: " + newQuantityInCart);

			setCart((prev) => {
				// find the item in the nonPrescription array that has the same id as the item we are changing
				// and update the quantityInCart property to the new value
				const updatedNonPrescriptionCart = prev.nonPrescription.map(item => 
				  item.id === itemId ? { ...item, quantityInCart: newQuantityInCart } : item
				);
				return {
				  ...prev,
				  nonPrescription: updatedNonPrescriptionCart
				};
			  });

			// update quantitiesInTable
			  setQuantitiesInTable((prev) => ({
				...prev,
				[itemId]: newQuantityInCart
			  }));
		} else {
			// Show Snackbar error
			showSnackbar("Quantity exceeds available stock for this item, or there was an error.", "error");
		}
	};
	
	const closeEditModal = () => {
		
		setIsEditOpen(false);
	};

	const handleCompletePayment = (paymentMethod) => {
		const allItems = [...cart.nonPrescription, ...cart.prescription];
		
		if (paymentMethod === "credit") {
			setPayment("CREDIT_CARD")
		} else if (paymentMethod === "debit") {
			setPayment("DEBIT_CARD")
		} else {
			setPayment("CASH")
		}

		const transactionItems = 
		allItems.map((item) => {return {
			medication_id: item.id,
			quantity: item.quantityInCart
		}})
		
		console.log(payment)
		addTransaction({
			
			patient_id: selectedPatient.id, 
			payment_method: paymentMethod === "credit" ? "CREDIT_CARD" : paymentMethod === "debit" ? "DEBIT" : "CASH",
			transaction_items: transactionItems
		})
		.then(() => {
            generateReceipt(); // Generate the receipt after the payment is completed
            showSnackbar("Payment completed! Receipt generated.", "success");
        })
		.catch((error) => {
            console.error("Error completing payment:", error);
            showSnackbar("Failed to complete payment.", "error");
        });

	}

	const addTransaction = async (data) => {
		try {
		  
		  const response = await fetch(`http://localhost:8000/transaction`, {
			method: 'POST',
			headers: {
			  'Content-Type': 'application/json',
			  'Authorization': 'Bearer ' + token,
			},
			body: JSON.stringify(data),
		  });
		  if (!response.ok) {
			throw new Error('Failed to add transaction');
		  }
		  
		} catch (error) {
		  console.error('Error adding transaction:', error);
		}
	  }

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
			showSnackbar("Cleared prescription items from cart since patient changed", "error");
			// show the snackbar with the message
		}

		const patient = await fetchOnePatient(patientID);
		setSelectedPatient(patient);
		// call the function to get prescriptions for this patient, and put it into filteredPrescriptions
		// so it can be displayed in the list

		// don't need to call setFilteredPrescriptions here since it is already called in fetchPrescriptionsForPatient
		// const prescriptions = await fetchPrescriptionsForPatient(patientID)
		await fetchPrescriptionsForPatient(patientID)

	};

	// Show Snackbar
	// default parameter for severity (possible values are 'error', 'info', 'success', or 'warning')
	const showSnackbar = (message, severity = "info") => {
		setSnackbar({ open: true, message, severity });
	};

	// Close Snackbar
	const handleCloseSnackbar = () => {
		setSnackbar((prev) => ({ ...prev, open: false }));
	};


	const calculateTotal = (items) => 
		items.reduce(
			(total, item) => total + item.dollars_per_unit * item.quantityInCart,
			0
		);
	
	
	const nonPrescriptionTotal = calculateTotal(cart.nonPrescription);
	const prescriptionTotal = calculateTotal(cart.prescription);

	
	const generateReceipt = () => {
		const doc = new jsPDF();

		// Title
		doc.setFontSize(18);
		doc.text("Receipt", 10, 20);

		// Patient Details
		doc.setFontSize(12);
		if (selectedPatient) {
			doc.text(`Patient: ${selectedPatient.first_name} ${selectedPatient.last_name}`, 10, 30);
			doc.text(`DOB: ${selectedPatient.date_of_birth}`, 10, 40);
		}

		// Cart Details
		let yPosition = 50;
		doc.text("Items Purchased:", 10, yPosition);
		yPosition += 10;

		// Non-Prescription Items
		if (cart.nonPrescription.length > 0) {
			cart.nonPrescription.forEach((item) => {
				doc.text(
					`${item.name} (${item.quantityInCart} x $${item.dollars_per_unit.toFixed(2)}) = $${(
						item.dollars_per_unit * item.quantityInCart
					).toFixed(2)}`,
					10,
					yPosition
				);
				yPosition += 10;
			});
		}

		// Prescription Items
		if (cart.prescription.length > 0) {
			cart.prescription.forEach((item) => {
				doc.text(
					`${item.medication_name} (${item.quantityInCart} x $${item.dollars_per_unit.toFixed(2)}) = $${(
						item.dollars_per_unit * item.quantityInCart
					).toFixed(2)}`,
					10,
					yPosition
				);
				yPosition += 10;
			});
		}

    // Summary
    yPosition += 10;
    doc.text(`Subtotal: $${subtotal.toFixed(2)}`, 10, yPosition);
    yPosition += 10;
    doc.text(`Tax (8%): $${tax.toFixed(2)}`, 10, yPosition);
    yPosition += 10;
    doc.text(`Grand Total: $${grandTotal.toFixed(2)}`, 10, yPosition);

    // Save the PDF
    doc.save("receipt.pdf");
};



	return (
		<div className="checkout-page">
			<div className="checkout-container">
				<div className="tables-container">
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
									className="patient-dropdown"
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

					{selectedPatient ? (
						<>
							<h1 className="prescriptions-title">
								Non-Prescription Items
							</h1>
							<Table>
								<TableHead>
									<TableRow>
										<TableCell>Name</TableCell>
										<TableCell>Dosage</TableCell>
										<TableCell>
											Quantity Available
										</TableCell>
										<TableCell>Unit Price</TableCell>
										<TableCell>Edit Quantity</TableCell>
										<TableCell>Total Price</TableCell>
										<TableCell>Add to Cart</TableCell>
									</TableRow>
								</TableHead>
								<TableBody>
									{/* 6 Skeletons, one per column in the table */}
									{nonPrescriptionItemsLoading ? (
										// Show skeletons while loading
										<>
											{[...Array(6)].map((_, index) => (
												<TableRow key={index}>
													<TableCell colSpan={4}>
														<Skeleton variant="text" />
													</TableCell>
												</TableRow>
											))}
										</>
									) : nonPrescriptionItems &&
									  nonPrescriptionItems.length > 0 ? (
										nonPrescriptionItems.map(
											(medication) => (
												<TableRow key={medication.id}>
													<TableCell>
														{medication.name}
													</TableCell>
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
														<div className="quantity-controls">
															<Button
																variant="filled"
																onClick={() =>
																	handleQuantityChange(
																		medication.id,
																		-1
																	)
																}
																color="primary"
																startIcon={
																	<RemoveCircleOutlineIcon />
																}
																className="quantity-button"
																size="small"
																disabled={
																	cart.nonPrescription.find(
																		(
																			item
																		) =>
																			item.id ===
																			medication.id
																	)
																		?.quantityInCart ===
																		0 ||
																	(!cart.nonPrescription.find(
																		(
																			item
																		) =>
																			item.id ===
																			medication.id
																	) &&
																		quantitiesInTable[
																			medication
																				.id
																		] === 0)
																}
															></Button>
															<TextField
																type="number"
																value={
																	// either display the quantity in the cart currently, or the value in quantitiesInTable
																	cart.nonPrescription.find(
																		(
																			item
																		) =>
																			item.id ===
																			medication.id
																	)
																		?.quantityInCart ||
																	quantitiesInTable[
																		medication
																			.id
																	]
																}
																onChange={(e) =>
																	handleManualQuantityChange(
																		medication.id,
																		e.target
																			.value
																	)
																}
																className="quantity-input"
																style={{
																	minWidth: 80,
																}}
															/>
															<Button
																variant="filled"
																onClick={() =>
																	handleQuantityChange(
																		medication.id,
																		1
																	)
																}
																startIcon={
																	<AddCircleOutlineIcon />
																}
																className="quantity-button"
																size="small"
																// Disable the button if the quantity in the cart is already the max quantity
																// or if the item is not in the cart and the quantity in quantitiesInTable is the max quantity
																disabled={
																	cart.nonPrescription.find(
																		(
																			item
																		) =>
																			item.id ===
																			medication.id
																	)
																		?.quantityInCart >=
																		medication.quantity ||
																	(!cart.nonPrescription.find(
																		(
																			item
																		) =>
																			item.id ===
																			medication.id
																	) &&
																		quantitiesInTable[
																			medication
																				.id
																		] >=
																			medication.quantity)
																}
															></Button>
														</div>
													</TableCell>

													<TableCell>
														$
														{(
															medication.dollars_per_unit *
															// either display the quantity in the cart currently, or the value in quantitiesInTable
															(cart.nonPrescription.find(
																(item) =>
																	item.id ===
																	medication.id
															)?.quantityInCart ||
																quantitiesInTable[
																	medication
																		.id
																])
														).toFixed(2)}
													</TableCell>

													<TableCell>
														<Button
															variant="contained"
															color="primary"
															startIcon={
																<AddShoppingCartIcon />
															}
															onClick={() => {
																console.log(
																	"trying to add non-prescription item to cart, quantity in table: " +
																		quantitiesInTable[
																			medication
																				.id
																		]
																);
																handleAddNonPrescToCart(
																	medication,
																	"nonPrescription",
																	quantitiesInTable[
																		medication
																			.id
																	]
																);
															}}
															disabled={
																Array.isArray(
																	cart.nonPrescription
																) &&
																cart.nonPrescription.some(
																	(item) =>
																		item.id ===
																		medication.id
																)
															}
															className="add-to-cart-button"
														>
															Add
														</Button>
													</TableCell>
												</TableRow>
											)
										)
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

							<h1 className="prescriptions-title">
								Prescription Items
							</h1>
							<h3 className="prescriptions-title">
								Prescriptions for {selectedPatient.first_name}{" "}
								{selectedPatient.last_name}
							</h3>
							<Table>
								<TableHead>
									<TableRow>
										<TableCell>Name</TableCell>
										<TableCell>Dosage</TableCell>
										<TableCell>Quantity</TableCell>
										<TableCell>Unit Price</TableCell>
										<TableCell>Date Prescribed</TableCell>
										<TableCell>Date Filled</TableCell>
										<TableCell>Doctor Name</TableCell>
										<TableCell>Total Price</TableCell>
										<TableCell>Add to Cart</TableCell>
									</TableRow>
								</TableHead>
								<TableBody>
									{/* 9 Skeletons, one per column in the table */}
									{prescriptionsLoading ? (
										// Show skeletons while loading
										<>
											{[...Array(9)].map((_, index) => (
												<TableRow key={index}>
													<TableCell colSpan={4}>
														<Skeleton variant="text" />
													</TableCell>
												</TableRow>
											))}
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
														$
														{prescription.dollars_per_unit.toFixed(
															2
														)}
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
														{/* here use the quantity not quantityInCart, since quantity in cart will be 0 or 1
														and doesn't really make sense. We want the price that the patient will pay 
														for just this item */}
														$
														{prescription.dollars_per_unit.toFixed(
															2
														) *
															prescription.quantity}
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
															disabled={cart.prescription.some(
																(item) =>
																	item.id ===
																	prescription.id
															)}
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
					) : (
						<p className="select-patient-message">
							Please select a patient before proceeding.
						</p>
					)}
				</div>
				<div className="cart-container">
					<Paper
						elevation={3}
						sx={{
							padding: 2,
							position: "sticky",
							top: 20,
							minWidth: 250,
						}}
					>
						<h2>Shopping Cart</h2>
						{cart.nonPrescription.length === 0 &&
						cart.prescription.length === 0 ? (
							<p className="cart-empty">No items in cart.</p>
						) : (
							<>
								<h3 className="cart-section-title">
									Non-Prescription Items
								</h3>
								<List>
									{cart.nonPrescription.map((item) => (
										<ListItem key={item.id} className="cart-item">
											<div className="cart-item-details">
												{item.name} - $
												{item.dollars_per_unit} x{" "}
												{item.quantityInCart} = $
												{(
													item.dollars_per_unit *
													item.quantityInCart
												).toFixed(2)}
											</div>
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
												style={{ minWidth: 110 }}
											>
												Remove
											</Button>
										</ListItem>
									))}
								</List>
								<Divider />

								<h3 className="cart-section-title">
									Prescription Items
								</h3>
								<List>
									{cart.prescription.map((item) => (
										<ListItem key={item.id} className="cart-item">
											<div className="cart-item-details">
												{/* use medication_name here since that is what we call it 
												when we add the name (from Medication) into the list of Prescriptions */}
												{item.medication_name} - $
												{item.dollars_per_unit} x{" "}
												{item.quantityInCart} = $
												{(
													item.dollars_per_unit *
													item.quantityInCart
												).toFixed(2)}
											</div>
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
												style={{ minWidth: 110 }}
											>
												Remove
											</Button>
										</ListItem>
									))}
								</List>
								<Divider />

								<p className="cart-summary">
									Subtotal: ${subtotal.toFixed(2)}
								</p>
								<p className="cart-summary">
									Tax (8%): ${tax.toFixed(2)}
								</p>
								<p className="cart-total">
									Grand Total: ${grandTotal.toFixed(2)}
								</p>
								<Button
									variant="outlined"
									className="pay-button"
									onClick={() =>
										setIsEditOpen(true)
									}
									style={{minWidth: 110}}
								>
									Pay
								</Button>
							</>
						)}
					</Paper>
				</div>
			</div>
			{/* Snackbar for error messages/messages to the user */}
			{/* get details from what is stored in the state */}
			<Snackbar
				open={snackbar.open}
				autoHideDuration={6000}
				onClose={handleCloseSnackbar}
			>
				<Alert
					onClose={handleCloseSnackbar}
					severity={snackbar.severity}
				>
					{snackbar.message}
				</Alert>
			</Snackbar>

			<CheckoutModal
			open={isEditOpen}
			onClose={closeEditModal}
			patient={selectedPatient}
			total={grandTotal.toFixed(2)}
			onSave={handleCompletePayment}
			/>
		</div>
		
	);
}

export default Checkout;
