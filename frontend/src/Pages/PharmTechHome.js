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

function PharmTechHome() {
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

  const token = localStorage.getItem('token');

   // Function to open the Add/Edit modal
  const openAddPrescriptionHandler = () => {
    setSelectedRow(null); // Clear any selected row (for new Prescription)
    setIsEditOpen(true); // Open modal
  };

  // Close the modal
  const closeEditModal = () => {
    setIsEditOpen(false);
  };

  const addPrescription = async (data) => {
		try {
			const response = await fetch(`http://localhost:8000/prescription`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token,
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
    addPrescription(PrescriptionData);
    closeEditModal(); // Close modal after saving
  };
  const navigate = useNavigate();

  //Change this variable based on what type of user the page is for
  const role = ["Pharmacy Technician"]

  useEffect(() => {
      CheckUserType(role, navigate);

  }, [role, navigate]);


  return (
    <div>
      <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={6}>
        <Grid size={6}>
          <Item>
          Enter new prescription
          <div/>
          <IconButton aria-label="addPrescription" size="large" color='primary' onClick={openAddPrescriptionHandler}>
              <AddCircleOutlinedIcon />
            </IconButton>
          </Item>
        </Grid>
        <Grid size={6}>
        <Item>
              <Link to="/viewofmedications" style={{ textDecoration: 'none', color: '#007bff' }}>
                View of Medications
              </Link>
            </Item>
        </Grid>
        <Grid size={6}>
          <Item>xs=6 md=4</Item>
        </Grid>
        <Grid size={6}>
          <Item>xs=6 md=8</Item>
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

export default PharmTechHome
