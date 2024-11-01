import React, {useEffect, useState, useRef} from 'react'
import CheckUserType from '../Functions/CheckUserType';
import { useNavigate, Link } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid2';
import IconButton from '@mui/material/IconButton';
import AddCircleOutlinedIcon from '@mui/icons-material/AddCircleOutlined';
import AddEditPrescriptionModal from '../Components/AddEditPrescriptionModal';

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(8),
  textAlign: 'center',
  color: theme.palette.text.secondary,
  ...theme.applyStyles('dark', {
    backgroundColor: '#1A2027',
  }),
}));

function PharmacistHome() {

  const [isEditOpen, setIsEditOpen] = useState(false); // Tracks if the modal is open
  const [selectedRow, setSelectedRow] = useState(null); // Tracks the selected row for editing
  const openAddPrescriptionModal = useRef(null);

  const [PrescriptionData, setPrescriptionData] = useState({
		medication: "",
		patient: "",
		date_prescribed: "",
		dosage: "",
		prescribing_doctor: ""
	});

   // Function to open the Add/Edit modal
  const openAddPrescriptionHandler = () => {
    console.log("Add Prescription button clicked");
    setSelectedRow(null); // Clear any selected row (for new Prescription)
    setIsEditOpen(true); // Open modal
  };

  // Close the modal
  const closeEditModal = () => {
    console.log("Closing modal");
    setIsEditOpen(false);
  };

  const addPrescription = async (data) => {
		try {
			console.log("row in addPrescription", data)
			const response = await fetch(`http://localhost:8000/prescription`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(data),
			});
			if (!response.ok) {
				throw new Error('Failed to add patient');
			}
			
		} catch (error) {
			console.error('Error adding patient:', error);
		}
	}

  // Handle saving Prescription data
  const handleSavePrescription = (formData) => {

    console.log("Prescription saved:", PrescriptionData);
    addPrescription(PrescriptionData);
    closeEditModal(); // Close modal after saving
  };

    const navigate = useNavigate();

    //Change this variable based on what type of user the page is for
    const role = ["pharmacist"]

    useEffect(() => {
        CheckUserType(role, navigate);

    }, [role, navigate]);


  return (
    <div>
      <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={6}>
        <Grid size={6}>
        <Item>
              {/* Link to the List of Patients page */}
              <Link to="/viewofpatients" style={{ textDecoration: 'none', color: '#007bff' }}>
                View of Patients
              </Link>
            </Item>
        </Grid>
        <Grid size={6}>
        <Item>
              {/* Link to the List of Patients page */}
              <Link to="/viewofmedications" style={{ textDecoration: 'none', color: '#007bff' }}>
                View of Medications
              </Link>
            </Item>
        </Grid>
        <Grid size={6}>
        <Item>
              {/* Link to the List of Patients page */}
              <Link to="/prescriptionstofill" style={{ textDecoration: 'none', color: '#007bff' }}>
                Fill Prescriptions
              </Link>
            </Item>
        </Grid>
        <Grid size={6}>
        <Item>
          Enter new prescription
          <div/>
          <IconButton aria-label="addPrescription" size="large" color='primary' onClick={openAddPrescriptionHandler}>
              <AddCircleOutlinedIcon />
            </IconButton>
          </Item>
        </Grid>
      </Grid>
    </Box>
    <AddEditPrescriptionModal
    open={isEditOpen}
    onClose={closeEditModal}
    row={selectedRow}
    onSave={handleSavePrescription}
    />
    </div>
  )
}

export default PharmacistHome
