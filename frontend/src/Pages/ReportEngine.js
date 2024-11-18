import React, { useState, useEffect } from 'react';
import { Button, Select, MenuItem, FormControl, InputLabel, Snackbar, Alert } from "@mui/material";
import { jsPDF } from "jspdf"; // Import jsPDF for report generation
import '../Styles/UserActivitiesTable.css';

const ReportEngine = () => {
  const [allActivities, setAllActivities] = useState([]);
  const [filteredActivities, setFilteredActivities] = useState([]);
  const [filters, setFilters] = useState({
    userId: '',
    activity: '',
    startDate: '',
    endDate: '',
  });
  const [error, setError] = useState(null);
  const [selectedReport, setSelectedReport] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    fetchActivities();
  }, []);

  const fetchActivities = async () => {
    setError(null);
    const token = localStorage.getItem('token');
    if (!token) {
      alert("No authentication token found. Please log in.");
      return;
    }

    try {
      const response = await fetch("http://localhost:8000/user-activities", {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        if (response.status === 401) {
          alert("Session expired. Please log in again.");
          return;
        }
        setError(`Server responded with status ${response.status}`);
        throw new Error(`Server responded with status ${response.status}`);
      }

      const data = await response.json();
      setAllActivities(data);
      setFilteredActivities(data);
    } catch (error) {
      console.error("Error fetching activities:", error);
      setError("An error occurred while fetching user activities.");
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({
      ...filters,
      [name]: value,
    });
  };

  const applyFilters = () => {
    const filtered = allActivities.filter(activity => {
      const matchUserId = filters.userId ? activity.user_id.toString() === filters.userId : true;
      const matchActivity = filters.activity ? activity.activity === filters.activity : true;

      const activityDate = new Date(activity.timestamp);
      const startDate = filters.startDate ? new Date(filters.startDate) : null;
      const endDate = filters.endDate ? new Date(filters.endDate) : null;

      const matchStartDate = startDate ? activityDate >= startDate : true;
      const matchEndDate = endDate ? activityDate <= endDate : true;

      return matchUserId && matchActivity && matchStartDate && matchEndDate;
    });
    setFilteredActivities(filtered);
  };

  const handleClearFilters = () => {
    setFilters({
      userId: '',
      activity: '',
      startDate: '',
      endDate: '',
    });
    setFilteredActivities(allActivities);
  };

  const handleReportChange = (event) => {
    setSelectedReport(event.target.value);
  };

  const handleGenerateReport = () => {
    if (!selectedReport) {
      setErrorMessage("Please select a report type.");
      setOpenSnackbar(true);
      return;
    }
    generateReport();
  };

  const generateReport = () => {
    const doc = new jsPDF();
    doc.setFontSize(20);
    doc.text(`${selectedReport.replace(/([A-Z])/g, ' $1')} Report`, 10, 20);

    let yPosition = 30;
    if (selectedReport === "userActivities") {
      doc.setFontSize(12);
      doc.text("User ID", 10, yPosition);
      doc.text("Activity", 40, yPosition);
      doc.text("Timestamp", 90, yPosition);
      yPosition += 10;

      filteredActivities.forEach(activity => {
        doc.text(activity.user_id.toString(), 10, yPosition);
        doc.text(activity.activity, 40, yPosition);
        doc.text(new Date(activity.timestamp).toLocaleString(), 90, yPosition);
        yPosition += 10;
      });
    }

    doc.save(`${selectedReport}_report.pdf`);
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  return (
    <div className="user-activities-container">
      <h2>User Activities & Report Engine</h2>
      {error && <div className="error-message">{error}</div>}

      <div className="filters">
        <label>
          User ID:
          <input
            type="text"
            name="userId"
            value={filters.userId}
            onChange={handleFilterChange}
          />
        </label>
        <label>
          Activity Type:
          <select
            name="activity"
            value={filters.activity}
            onChange={handleFilterChange}
          >
            <option value="">All</option>
            <option value="Login">Login</option>
            <option value="Logout">Logout</option>
            <option value="Unlock Account">Unlock Account</option>
            <option value="Inventory Update">Inventory Update</option>
          </select>
        </label>
        <label>
          Start Date:
          <input
            type="date"
            name="startDate"
            value={filters.startDate}
            onChange={handleFilterChange}
          />
        </label>
        <label>
          End Date:
          <input
            type="date"
            name="endDate"
            value={filters.endDate}
            onChange={handleFilterChange}
          />
        </label>
        <div className="button-container">
          <button className="apply-button" onClick={applyFilters}>Apply Filters</button>
          <button className="clear-button" onClick={handleClearFilters}>Clear Filters</button>
        </div>
      </div>

      <table className="activities-table">
        <thead>
          <tr>
            <th>User ID</th>
            <th>Activity</th>
            <th>Timestamp</th>
          </tr>
        </thead>
        <tbody>
          {filteredActivities.length > 0 ? (
            filteredActivities.map((activity) => (
              <tr key={activity.id}>
                <td>{activity.user_id}</td>
                <td>{activity.activity}</td>
                <td>{new Date(activity.timestamp).toLocaleString()}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3" className="no-data">No activities found</td>
            </tr>
          )}
        </tbody>
      </table>

      <div className="report-engine">
        <h3>Generate Report</h3>
        <FormControl fullWidth style={{ marginBottom: "20px" }}>
          <InputLabel>Select Report Type</InputLabel>
          <Select
            value={selectedReport}
            onChange={handleReportChange}
            label="Select Report Type"
          >
            <MenuItem value="userActivities">User Activities Report</MenuItem>
            <MenuItem value="medication">Medication Inventory Report</MenuItem>
            <MenuItem value="transaction">Transaction Report</MenuItem>
          </Select>
        </FormControl>

        <Button 
          variant="contained" 
          color="primary" 
          onClick={handleGenerateReport} 
          disabled={!selectedReport}
        >
          Generate Report
        </Button>
      </div>

      <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity="error">
          {errorMessage}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default ReportEngine;
