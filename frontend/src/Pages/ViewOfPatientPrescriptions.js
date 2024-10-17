import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CircularProgress, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Alert, Button, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';

const ViewOfPatientPrescriptions = () => {
    const { patientId } = useParams(); 
    const navigate = useNavigate();
    const [prescriptions, setPrescriptions] = useState([]);  
    const [loading, setLoading] = useState(true);  
    const [error, setError] = useState(null);  
    const [selectedPrescriptionHistory, setSelectedPrescriptionHistory] = useState([]);  
    const [openModal, setOpenModal] = useState(false);  

    // Fetch prescriptions for the patient from the API
    const fetchPrescriptions = async () => {
        try {
            // replacing this call with the updated API that we have
            // const response = await fetch(`http://localhost:8000/prescription/patient/${patientId}`);
            const response = await fetch(`http://localhost:8000/prescriptions/?patient_id=${patientId}`);

            if (!response.ok) {
                throw new Error('Failed to fetch prescriptions');
            }
            const data = await response.json();
            console.log("Fetched data:", data);
            if (Array.isArray(data)) { //This make sure its in array.
                setPrescriptions(data);
            } else {
                throw new Error('Expected an array but got something else');
            }
        } catch (err) {
            console.error(err);
            setError('Failed to load prescriptions');
        } finally {
            setLoading(false);
        }
    };

    // Fetch prescriptions when the component mounts
    useEffect(() => {
        fetchPrescriptions();
    }, [patientId]);

    // Function to show detailed prescription history
    const viewPrescriptionHistory = (medicationId) => {
        const history = prescriptions.filter(p => p.medication_id === medicationId);
        setSelectedPrescriptionHistory(history);
        setOpenModal(true); 
    };

    // Extract Main prescriptions by Medication ID
    const uniquePrescriptions = [...new Map(prescriptions.map(p => [p.medication_id, p])).values()];

    if (loading) {
        return <CircularProgress />;
    }

    if (error) {
        return <Alert severity="error">{error}</Alert>;
    }

    if (prescriptions.length === 0) {
        return <p>No prescriptions found for this patient.</p>;
    }

    return (
        <div>
            <h2>Prescriptions for Patient {patientId}</h2>

            {/* Initial Simplified Table (Unique Medications Only) */}
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Medication ID</TableCell>
                            <TableCell>Dosage</TableCell>
                            <TableCell>Doctor Name</TableCell>
                            <TableCell>Action</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {uniquePrescriptions.map((prescription) => (
                            <TableRow key={prescription.medication_id}>
                                <TableCell>{prescription.medication_id}</TableCell>
                                <TableCell>{prescription.dosage}</TableCell>
                                <TableCell>{prescription.doctor_name}</TableCell>
                                <TableCell>
                                    <Button 
                                        variant="contained" 
                                        color="primary"
                                        onClick={() => viewPrescriptionHistory(prescription.medication_id)}
                                    >
                                        View History
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* (Popup) for Detailed Prescription History */}
            <Dialog open={openModal} onClose={() => setOpenModal(false)} fullWidth>
                <DialogTitle>Prescription History</DialogTitle>
                <DialogContent>
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Medication ID</TableCell>
                                    <TableCell>Dosage</TableCell>
                                    <TableCell>Doctor Name</TableCell>
                                    <TableCell>Date Prescribed</TableCell>
                                    <TableCell>Filled Timestamp</TableCell>
                                    <TableCell>Entered By (User ID)</TableCell>
                                    <TableCell>Filled By (User ID)</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {selectedPrescriptionHistory.map((history) => (
                                    <TableRow key={history.id}>
                                        <TableCell>{history.medication_id}</TableCell>
                                        <TableCell>{history.dosage}</TableCell>
                                        <TableCell>{history.doctor_name}</TableCell>
                                        <TableCell>{new Date(history.date_prescribed).toLocaleDateString()}</TableCell>
                                        <TableCell>{new Date(history.filled_timestamp).toLocaleString()}</TableCell>
                                        <TableCell>{history.user_entered_id}</TableCell>
                                        <TableCell>{history.user_filled_id}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenModal(false)} color="primary">
                        Close
                    </Button>
                </DialogActions>
            </Dialog>

            <Button variant="contained" color="primary" onClick={() => navigate(-1)}>
                Back
            </Button>
        </div>
    );
};

export default ViewOfPatientPrescriptions;
