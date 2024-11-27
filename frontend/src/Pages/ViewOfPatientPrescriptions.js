import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    CircularProgress,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Alert,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
} from '@mui/material';

const ViewOfPatientPrescriptions = () => {
    const { patientId } = useParams(); // Extract patientId from the route
    const navigate = useNavigate();

    const [prescriptions, setPrescriptions] = useState([]);
    const [patientName, setPatientName] = useState('');
    const [medicationNames, setMedicationNames] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedPrescriptionHistory, setSelectedPrescriptionHistory] = useState([]);
    const [openModal, setOpenModal] = useState(false);

    const token = localStorage.getItem('token');

    // Fetch prescriptions for the patient
    const fetchPrescriptions = useCallback(async () => {
        try {
            const response = await fetch(`http://localhost:8000/prescriptions/?patient_id=${patientId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error('Failed to fetch prescriptions');
            }

            const data = await response.json();
            setPrescriptions(data);
        } catch (err) {
            console.error(err);
            setError('Failed to load prescriptions');
        } finally {
            setLoading(false);
        }
    }, [patientId, token]);

    // Fetch patient name
    const fetchPatientName = useCallback(async () => {
        try {
            const response = await fetch(`http://localhost:8000/patient/${patientId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error('Failed to fetch patient details');
            }

            const patientData = await response.json();
            setPatientName(`${patientData.first_name} ${patientData.last_name}`);
        } catch (err) {
            console.error(err);
            setError('Failed to load patient details');
        }
    }, [patientId, token]);

    // Fetch medication name by ID
    const fetchMedicationName = useCallback(async (medicationId) => {
        try {
            const response = await fetch(`http://localhost:8000/medication/${medicationId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error(`Failed to fetch medication details for ID: ${medicationId}`);
            }

            const medicationData = await response.json();
            setMedicationNames((prev) => ({
                ...prev,
                [medicationId]: medicationData.name,
            }));
        } catch (err) {
            console.error(err);
        }
    }, [token]);

    // Fetch prescriptions and patient name when the component mounts
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            await fetchPrescriptions();
            await fetchPatientName();
        };
        fetchData();
    }, [fetchPrescriptions, fetchPatientName]);

    // Fetch medication names after prescriptions are loaded
    useEffect(() => {
        prescriptions.forEach((prescription) => {
            if (!medicationNames[prescription.medication_id]) {
                fetchMedicationName(prescription.medication_id);
            }
        });
    }, [prescriptions, medicationNames, fetchMedicationName]);

    // Show prescription history in a modal
    const viewPrescriptionHistory = (medicationId) => {
        const history = prescriptions.filter((p) => p.medication_id === medicationId);
        setSelectedPrescriptionHistory(history);
        setOpenModal(true);
    };

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
            <h2>Prescriptions for Patient: {patientName}</h2>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Medication Name</TableCell>
                            <TableCell>Dosage</TableCell>
                            <TableCell>Doctor Name</TableCell>
                            <TableCell>Action</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {prescriptions.map((prescription) => (
                            <TableRow key={prescription.medication_id}>
                                <TableCell>{medicationNames[prescription.medication_id] || 'Loading...'}</TableCell>
                                <TableCell>{prescription.quantity}</TableCell>
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

            {/* Modal for Prescription History */}
            <Dialog open={openModal} onClose={() => setOpenModal(false)} fullWidth>
                <DialogTitle>Prescription History</DialogTitle>
                <DialogContent>
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Medication Name</TableCell>
                                    <TableCell>Dosage</TableCell>
                                    <TableCell>Doctor Name</TableCell>
                                    <TableCell>Date Prescribed</TableCell>
                                    <TableCell>Filled Timestamp</TableCell>
                                    <TableCell>Entered By</TableCell>
                                    <TableCell>Filled By</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {selectedPrescriptionHistory.map((history) => (
                                    <TableRow key={history.id}>
                                        <TableCell>{medicationNames[history.medication_id] || 'Loading...'}</TableCell>
                                        <TableCell>{history.quantity}</TableCell>
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
