import React, { useState, useEffect } from 'react';
import '../Styles/UserActivitiesTable.css'; // Import the CSS file for styling

const UserActivitiesTable = () => {
  const [activities, setActivities] = useState([]);
  const [filters, setFilters] = useState({
    userId: '',
    activity: '',
    startDate: '',
    endDate: '',
  });
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchActivities(); // Fetch all activities initially
  }, []);

  const fetchActivities = async () => {
    setError(null); // Reset error at the start of each fetch

    const params = new URLSearchParams();
    if (filters.userId) params.append('user_id', filters.userId);
    if (filters.activity) params.append('activity', filters.activity);
    if (filters.startDate) params.append('start_date', filters.startDate);
    if (filters.endDate) params.append('end_date', filters.endDate);

    const query = `http://localhost:8000/user-activities?${params.toString()}`;

    const token = localStorage.getItem('token');
    if (!token) {
      alert("No authentication token found. Please log in.");
      return;
    }

    try {
      const response = await fetch(query, {
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
        const errorMessage = `Server responded with status ${response.status}`;
        setError(errorMessage);
        throw new Error(errorMessage);
      }

      const data = await response.json();
      setActivities(data);
    } catch (error) {
      console.error("Error fetching activities:", error);
      setError("An error occurred while fetching user activities. Please check the server and try again.");
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({
      ...filters,
      [name]: value,
    });
  };

  const handleApplyFilters = () => {
    fetchActivities(); // Apply filters when button is clicked
  };

  const handleClearFilters = () => {
    setFilters({
      userId: '',
      activity: '',
      startDate: '',
      endDate: '',
    });
    fetchActivities(); // Refresh activities without filters
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
          <button className="apply-button" onClick={handleApplyFilters}>Apply Filters</button>
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
          {activities.length > 0 ? (
            activities.map((activity) => (
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
    </div>
  );
};

export default UserActivitiesTable;
