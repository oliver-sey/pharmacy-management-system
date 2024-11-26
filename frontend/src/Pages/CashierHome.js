import React, {useEffect, useState} from 'react'
import CheckUserType from '../Functions/CheckUserType';
import { useNavigate } from 'react-router-dom';
import AddCircleOutlinedIcon from '@mui/icons-material/AddCircleOutlined';
import PointOfSaleOutlinedIcon from '@mui/icons-material/PointOfSaleOutlined';
import AddEditPrescriptionModal from '../Components/AddEditPrescriptionModal';

function CashierHome() {
    const navigate = useNavigate();
    const [isEditOpen, setIsEditOpen] = useState(false); // Tracks if the modal is open
    const [selectedRow, setSelectedRow] = useState(null); // Tracks the selected row for editing

    //Change this variable based on what type of user the page is for
    const role = ["Cashier"]

    useEffect(() => {
        CheckUserType(role, navigate);

    }, [role, navigate]);

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


  return (
    <div>
      <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={6} margin={4}>
          <Grid size={6}>
          
            <Item>
            Enter New Prescription
            <div/>
              <IconButton sx={{maxWidth: 60}} aria-label="enterPrescription" color='primary' onClick={openAddPrescriptionHandler}>
                <AddCircleOutlinedIcon />
              </IconButton>

            </Item>
          </Grid>
          <Grid size={6}>
          
            <Item>
              Check Out
              <div/>
              <IconButton sx={{maxWidth: 60}} aria-label="checkOut" color='primary' >
                <PointOfSaleOutlinedIcon />
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

export default CashierHome
