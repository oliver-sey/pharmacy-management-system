import React, {useEffect, useState, useRef} from 'react'
import CheckUserType from '../Functions/CheckUserType';
import { useNavigate } from 'react-router-dom';
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

function ManagerHome() {
  const role = ["pharmacy_manager"]
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
        doctor_name: formData.prescribing_doctor,
        quantity: formData.quantity
      }))

      closeEditModal(); // Close modal after saving
    };
  
    useEffect(() => {
        CheckUserType(role, navigate);
  
    }, []);
  
  
    return (
      <div>
        <h1 className='sectionheader'>
          Profiles
        </h1>
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
              <Item>xs=6 md=4</Item>
            </Grid>
            <Grid size={6}>
              <Item>xs=6 md=4</Item>
            </Grid>
            <Grid size={6}>
              <Item>xs=6 md=8</Item>
            </Grid>
          </Grid>
        </Box>

        <h1 className='sectionheader'>
          Prescriptions
        </h1>
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
              <Item>xs=6 md=4</Item>
            </Grid>
            <Grid size={6}>
              <Item>xs=6 md=4</Item>
            </Grid>
            <Grid size={6}>
              <Item>xs=6 md=8</Item>
            </Grid>
          </Grid>
        </Box>

        <h1 className='sectionheader'>
          Profiles
        </h1>
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
              <Item>xs=6 md=4</Item>
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

export default ManagerHome
