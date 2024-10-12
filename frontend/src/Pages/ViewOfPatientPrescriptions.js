import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Button from '@mui/material/Button';
import EditDeleteTable from '../Components/EditDeleteTable'; // You can reuse your table component

function ViewOfPatientPrescriptions() {
    const { patientId } = useParams(); // Get patient ID from URL
    const [prescriptions, setPrescriptions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [patientName, setPatientName] = useState(''); // Store the patient's name

    // Fetch prescriptions for the selected patient
    const fetchPrescriptions = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`http://localhost:8000/patients/${patientId}/prescriptions`);
            if (!response.ok) {
                throw new Error('Failed to fetch prescriptions');
            }
            const data = await response.json();
            setPrescriptions(data.prescriptions); // Assuming prescriptions are in the `data.prescriptions` field
            setPatientName(data.patientName); // Assuming patient name is in `data.patientName`
        } catch (error) {
            console.error('Error fetching prescriptions:', error);
            setError('Could not load prescriptions. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPrescriptions();
    }, [patientId]);

    const columns = [
        { field: 'medication_name', headerName: 'Medication Name', width: 200 },
        { field: 'dosage', headerName: 'Dosage', width: 150 },
        { field: 'doctor_name', headerName: 'Doctor Name', width: 200 },
        { field: 'date_prescribed', headerName: 'Date Prescribed', width: 200 },
        { field: 'filled_timestamp', headerName: 'Filled Timestamp', width: 200 },
        { field: 'user_entered_id', headerName: 'Entered By (User ID)', width: 200 },
        { field: 'user_filled_id', headerName: 'Filled By (User ID)', width: 200 }
    ];

    return (
        <div>
            <h2>Prescriptions for {patientName} (ID: {patientId})</h2>

            {loading ? (
                <p>Loading...</p>
            ) : error ? (
                <p style={{ color: 'red' }}>{error}</p>
            ) : prescriptions.length > 0 ? (
                <EditDeleteTable
                    rows={prescriptions}
                    columns={columns}
                    showEditButton={false} // Disable edit button if not needed
                    showDeleteButton={false} // Disable delete button if not needed
                />
            ) : (
                <p>No prescriptions found for this patient.</p>
            )}

            <Button variant="contained" color="primary" onClick={() => window.history.back()}>
                Back
            </Button>
        </div>
    );
}

export default ViewOfPatientPrescriptions;
