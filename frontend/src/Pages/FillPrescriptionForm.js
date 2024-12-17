import React, { useState } from 'react';

function FillPrescriptionForm() {
  const [formData, setFormData] = useState({
    medication: '',
    dosage: '',
    doctor: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormData({
      medication: '',
      dosage: '',
      doctor: ''
    });
  };

  return (
    <div style={styles.container}>
      <div className="FillPrescriptionForm" style={styles.formWrapper}>
        <h1>Fill Prescription</h1>
        <form onSubmit={handleSubmit}>
          <div style={styles.formGroup}>
            <label htmlFor="medication" style={styles.label}>Medication:</label>
            <input
              type="text"
              name="medication"
              value={formData.medication}
              onChange={handleChange}
              required
              style={styles.input}
            />
          </div>

          <div style={styles.formGroup}>
            <label htmlFor="dosage" style={styles.label}>Dosage:</label>
            <input
              type="text"
              name="dosage"
              value={formData.dosage}
              onChange={handleChange}
              required
              style={styles.input}
            />
          </div>

          <div style={styles.formGroup}>
            <label htmlFor="doctor" style={styles.label}>Doctor:</label>
            <input
              type="text"
              name="doctor"
              value={formData.doctor}
              onChange={handleChange}
              required
              style={styles.input}
            />
          </div>

          <button type="submit" style={styles.button}>Submit</button>
        </form>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-start',  
    paddingTop: '50px',
    height: '100vh',      
    backgroundColor: '#f5f5f5' 
  },
  formWrapper: {
    width: '400px',       
    padding: '20px',
    backgroundColor: '#fff',
    borderRadius: '10px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  },
  formGroup: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '20px'
  },
  label: {
    width: '150px',        
    marginRight: '10px',
    textAlign: 'right'     
  },
  input: {
    padding: '10px',
    borderRadius: '5px',
    border: '1px solid #ccc',
    width: '100%',         
    boxSizing: 'border-box'
  },
  button: {
    width: '100%',
    padding: '10px',
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer'
  }
};

export default FillPrescriptionForm;
