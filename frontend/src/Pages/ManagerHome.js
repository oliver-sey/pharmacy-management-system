import React, {useEffect, useState, useRef} from 'react'
import CheckUserType from '../Functions/CheckUserType';
import { useNavigate, Link } from 'react-router-dom';
import { styled, makeStyles } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid2';
import IconButton from '@mui/material/IconButton';
import AddCircleOutlinedIcon from '@mui/icons-material/AddCircleOutlined';
import AddEditPrescriptionModal from '../Components/AddEditPrescriptionModal';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import HistoryOutlinedIcon from '@mui/icons-material/HistoryOutlined';
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';
import "../Styles/ManagerHome.css"

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

function ManagerHome() {
  const role = ["Pharmacy Manager"]
  const navigate = useNavigate();
  const [curr_user_id, set_curr_user_id] = useState("");


    const [isEditOpen, setIsEditOpen] = useState(false); // Tracks if the modal is open
    const [selectedRow, setSelectedRow] = useState(null); // Tracks the selected row for editing
    const openAddPrescriptionModal = useRef(null);
  
    const [PrescriptionData, setPrescriptionData] = useState({
      patient_id: "",
       user_entered_id: "", 
       user_filled_id: "",
      date_prescribed: "",
      filled_timestamp: "",
      medication_id: "",
      doctor_name: "",
      quantity: ""
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
          throw new Error('Failed to add prescription');
        }
        
      } catch (error) {
        console.error('Error adding prescription:', error);
      }
    }
  
    // Handle saving Prescription data
    const handleSavePrescription = (formData) => {
      CheckUserType(role, navigate)
      .then((curr_user_data) => addPrescription({
        patient_id: formData.patient,
        user_entered_id: curr_user_data.id, 
        user_filled_id: null,
        filled_timestamp: null,
        //date_prescribed: datetime.datetime.now(),
        medication_id: formData.medication,
        doctor_name: formData.doctor_name,
        quantity: formData.quantity
      }))

      closeEditModal(); // Close modal after saving
    };

    const handleViewPrescriptionsClick = () => {
      navigate('../viewofprescriptions', {replace: true})
    }

    const handleViewPrescriptionFillHistoryClick = () => {
      navigate('../viewofprescriptionfillhistory', {replace: true})
    }

    const handleViewUsersClick = () => {
      navigate('../viewofusers', {replace: true})
    }

    const handleViewPatientsClick = () => {
      navigate('../viewofpatients', {replace: true})
    }

    const handleViewMedicationsClick = () => {
      navigate('../viewofmedications', {replace: true})
    }

    //TODO: update when page is added
    const handleViewInventoryChangesClick = () => {
      
    }
  
    useEffect(() => {
        CheckUserType(role, navigate);
  
    }, []);
  
  
    return (
      <div >
        <h1 className='section-header'>Prescriptions</h1>
        <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={6} margin={4}>
          <Grid size={6}>
            <Item>
            Enter New Prescription
            <div/>
            <IconButton sx={{maxWidth: 60}} aria-label="addPrescription" color='primary' onClick={openAddPrescriptionHandler}>
                <AddCircleOutlinedIcon />
              </IconButton>
            </Item>
          </Grid>
          <Grid size={6}>
            <Item>
              View All Prescriptions
              <div/>
              <IconButton sx={{maxWidth: 60}} aria-label="viewPrescriptions" color='primary' onClick={handleViewPrescriptionsClick}>
                <VisibilityOutlinedIcon />
              </IconButton>
            </Item>
          </Grid>
          <Grid size={6}>
            <Item>
              See Prescription Fill History
              <div/>
              <IconButton sx={{maxWidth: 60}} aria-label="viewPrescriptionFillHistory" color='primary' onClick={handleViewPrescriptionFillHistoryClick}>
                <HistoryOutlinedIcon />
              </IconButton>
            </Item>
          </Grid>
        </Grid>
      </Box>

      <div/>
      
      <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={6} margin={4}>
          <Grid size={6}>
          <h1 className='section-header'>Patients</h1>
            <Item>
            View/Add Patients
            <div/>
              <IconButton sx={{maxWidth: 60}} aria-label="viewPrescriptions" color='primary' onClick={handleViewPatientsClick}>
                <VisibilityOutlinedIcon />
              </IconButton>

            </Item>
          </Grid>
          <Grid size={6}>
          <h1 className='section-header'>Users</h1>
            <Item>
              View/Add Users
              <div/>
              <IconButton sx={{maxWidth: 60}} aria-label="addPatient" color='primary' onClick={handleViewUsersClick}>
                <VisibilityOutlinedIcon />
              </IconButton>
            </Item>
          </Grid>
        </Grid>
      </Box>

      <div/>
      <h1 className='section-header'>Medications</h1>
        <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={6} margin={4}>
          <Grid size={6}>
            <Item>
              View Medications
              <div/>
              <IconButton sx={{maxWidth: 60}} aria-label="viewMedications" color='primary' onClick={handleViewMedicationsClick}>
                  <VisibilityOutlinedIcon />
              </IconButton>
            </Item>
          </Grid>
          <Grid size={6}>
            <Item>
              View Inventory Changes
              <div/>
              <IconButton sx={{maxWidth: 60}} aria-label="viewInventoryChanges"  color='primary' onClick={handleViewInventoryChangesClick}>
                <Inventory2OutlinedIcon />
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

export default ManagerHome
