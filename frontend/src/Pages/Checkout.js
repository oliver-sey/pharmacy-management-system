import React, { useState } from "react";
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
  { id: 1, patient: "John Doe", name: "Antibiotic", unitPrice: 15.0, details: "500mg Tablet" },
  { id: 2, patient: "John Doe", name: "Blood Pressure Med", unitPrice: 20.0, details: "20mg Tablet" },
];

function Checkout() {
  const [cart, setCart] = useState({ nonPrescription: [], prescription: [] });
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredPrescriptions, setFilteredPrescriptions] = useState([]);

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
        item.id === id ? { ...item, quantity: quantity < 1 ? 1 : quantity } : item
      ),
    }));
  };

  const handlePatientSelect = (patient) => {
    setSelectedPatient(patient);
    setFilteredPrescriptions(
      prescriptions.filter((prescription) => prescription.patient === patient)
    );
  };

  const calculateTotal = (items) =>
    items.reduce((total, item) => total + item.unitPrice * item.quantity, 0);

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
                  <TableCell>${item.unitPrice.toFixed(2)}</TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      color="primary"
                      startIcon={<AddShoppingCartIcon />}
                      onClick={() => handleAddToCart(item, "nonPrescription")}
                    >
                      Add
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <Typography variant="h5" sx={{ mt: 4 }}>
            Add Prescription Items
          </Typography>
          {/* <Autocomplete */}
            {/* options={patients}
            inputValue={searchTerm}
            onInputChange={(e, newInputValue) => setSearchTerm(newInputValue)}
            onChange={(e, value) => handlePatientSelect(value)}
            renderInput={(params) => <TextField {...params} label="Patient Name" />}
          /> */}
		  <input>
		  	inputValue={searchTerm}
            onInputChange={(e, newInputValue) => setSearchTerm(newInputValue)}
            onChange={(e, value) => handlePatientSelect(value)}
            renderInput={(params) => <TextField {...params} label="Patient Name" />}
		  </input>

          {selectedPatient && (
            <>
              <Typography variant="h6" sx={{ mt: 2 }}>
                Prescriptions for {selectedPatient}
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
                  {filteredPrescriptions.map((prescription) => (
                    <TableRow key={prescription.id}>
                      <TableCell>{prescription.name}</TableCell>
                      <TableCell>{prescription.details}</TableCell>
                      <TableCell>${prescription.unitPrice.toFixed(2)}</TableCell>
                      <TableCell>
                        <Button
                          variant="contained"
                          color="primary"
                          startIcon={<AddShoppingCartIcon />}
                          onClick={() => handleAddToCart(prescription, "prescription")}
                        >
                          Add
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </>
          )}
        </Grid>

        <Grid item xs={4}>
          <Paper elevation={3} sx={{ padding: 2, position: "sticky", top: 20 }}>
            <Typography variant="h6">Shopping Cart</Typography>
            {cart.nonPrescription.length === 0 && cart.prescription.length === 0 ? (
              <Typography variant="body2" color="textSecondary">
                No items in cart.
              </Typography>
            ) : (
              <>
                <Typography variant="subtitle1">Non-Prescription Items</Typography>
                <List>
                  {cart.nonPrescription.map((item) => (
                    <ListItem key={item.id}>
                      {item.name} - ${item.unitPrice} x {item.quantity} = $
                      {(item.unitPrice * item.quantity).toFixed(2)}
                      <Button
                        size="small"
                        color="secondary"
                        onClick={() => handleRemoveFromCart(item.id, "nonPrescription")}
                      >
                        Remove
                      </Button>
                    </ListItem>
                  ))}
                </List>
                <Divider />

                <Typography variant="subtitle1">Prescription Items</Typography>
                <List>
                  {cart.prescription.map((item) => (
                    <ListItem key={item.id}>
                      {item.name} - ${item.unitPrice} x {item.quantity} = $
                      {(item.unitPrice * item.quantity).toFixed(2)}
                      <Button
                        size="small"
                        color="secondary"
                        onClick={() => handleRemoveFromCart(item.id, "prescription")}
                      >
                        Remove
                      </Button>
                    </ListItem>
                  ))}
                </List>
                <Divider />

                <Typography variant="subtitle1">Subtotal: ${subtotal.toFixed(2)}</Typography>
                <Typography variant="subtitle1">Tax (8%): ${tax.toFixed(2)}</Typography>
                <Typography variant="h6">Grand Total: ${grandTotal.toFixed(2)}</Typography>
              </>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}

export default Checkout;
