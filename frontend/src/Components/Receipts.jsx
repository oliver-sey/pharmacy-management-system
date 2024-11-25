import React from "react";
import PropTypes from "prop-types";
import { Paper, Typography, Divider, List, ListItem } from "@mui/material";

function Receipt({ cart, subtotal, tax, grandTotal }) {
    return (
        <Paper elevation={3} style={{ padding: 16, marginTop: 20 }}>
            <Typography variant="h5" gutterBottom>
                Receipt
            </Typography>
            <Divider style={{ marginBottom: 16 }} />

            <Typography variant="h6">Non-Prescription Items</Typography>
            <List>
                {cart.nonPrescription.length === 0 ? (
                    <Typography variant="body2" color="textSecondary">
                        No non-prescription items.
                    </Typography>
                ) : (
                    cart.nonPrescription.map((item) => (
                        <ListItem key={item.id}>
                            {item.name} - ${item.dollars_per_unit.toFixed(2)} x{" "}
                            {item.quantity} = $
                            {(item.dollars_per_unit * item.quantity).toFixed(2)}
                        </ListItem>
                    ))
                )}
            </List>
            <Divider style={{ margin: "16px 0" }} />

            <Typography variant="h6">Prescription Items</Typography>
            <List>
                {cart.prescription.length === 0 ? (
                    <Typography variant="body2" color="textSecondary">
                        No prescription items.
                    </Typography>
                ) : (
                    cart.prescription.map((item) => (
                        <ListItem key={item.id}>
                            {item.medication_name} - $
                            {item.dollars_per_unit.toFixed(2)} x {item.quantity}{" "}
                            = $
                            {(item.dollars_per_unit * item.quantity).toFixed(2)}
                        </ListItem>
                    ))
                )}
            </List>
            <Divider style={{ margin: "16px 0" }} />

            <Typography variant="body1">
                Subtotal: ${subtotal.toFixed(2)}
            </Typography>
            <Typography variant="body1">
                Tax (8%): ${tax.toFixed(2)}
            </Typography>
            <Typography variant="h6" style={{ marginTop: 8 }}>
                Grand Total: ${grandTotal.toFixed(2)}
            </Typography>
        </Paper>
    );
}

Receipt.propTypes = {
    cart: PropTypes.shape({
        nonPrescription: PropTypes.arrayOf(
            PropTypes.shape({
                id: PropTypes.number.isRequired,
                name: PropTypes.string.isRequired,
                dollars_per_unit: PropTypes.number.isRequired,
                quantity: PropTypes.number.isRequired,
            })
        ),
        prescription: PropTypes.arrayOf(
            PropTypes.shape({
                id: PropTypes.number.isRequired,
                medication_name: PropTypes.string.isRequired,
                dollars_per_unit: PropTypes.number.isRequired,
                quantity: PropTypes.number.isRequired,
            })
        ),
    }).isRequired,
    subtotal: PropTypes.number.isRequired,
    tax: PropTypes.number.isRequired,
    grandTotal: PropTypes.number.isRequired,
};

export default Receipt;


