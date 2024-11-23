import React, { useState, useEffect } from 'react';
import '../Styles/UserActivitiesTable.css';

const UserActivitiesTable = () => {
  const [allActivities, setAllActivities] = useState([]); // Store all activities fetched from the backend
  const [filteredActivities, setFilteredActivities] = useState([]); // Store filtered activities for display
  const [filters, setFilters] = useState({
    userId: '',
    activity: '',
    startDate: '',
    endDate: '',
  });
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchActivities(); // Fetch all activities once on component mount
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
      setAllActivities(data); // Store all activities for reference
      setFilteredActivities(data); // Display all activities initially
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
      // Check each filter condition separately
      const matchUserId = filters.userId ? activity.user_id.toString() === filters.userId : true;
      const matchActivity = filters.activity ? activity.activity === filters.activity : true;
  
      // Parse dates for comparison
      const activityDate = new Date(activity.timestamp);
      const startDate = filters.startDate ? new Date(filters.startDate) : null;
      const endDate = filters.endDate ? new Date(filters.endDate) : null;
  
      const matchStartDate = startDate ? activityDate >= startDate : true;
      const matchEndDate = endDate ? activityDate <= endDate : true;

      // Return true only if all conditions match
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
    setFilteredActivities(allActivities); // Reset to show all activities
  };

  return (
    <div className="user-activities-container">
      <h2>User Activities</h2>
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
                <td>{activity.activity_type}</td>
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
    </div>
  );
};

export default UserActivitiesTable;
