import React, { useState, useEffect } from 'react';

const Activities = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const codespaceUrl = process.env.REACT_APP_CODESPACE_NAME
          ? `https://${process.env.REACT_APP_CODESPACE_NAME}-8000.app.github.dev`
          : 'https://localhost:8000';
        
        const apiUrl = `${codespaceUrl}/api/activities/`;
        
        console.log('Fetching Activities from:', apiUrl);
        
        const response = await fetch(apiUrl);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        console.log('Raw Activities Response:', data);
        
        // Handle both paginated (.results) and plain array responses
        const activitiesData = data.results ? data.results : Array.isArray(data) ? data : [];
        
        console.log('Processed Activities Data:', activitiesData);
        
        setActivities(activitiesData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching activities:', error);
        setError(error.message);
        setLoading(false);
      }
    };

    fetchActivities();
  }, []);

  if (loading) return <div className="container mt-5"><div className="spinner-border text-primary" role="status"><span className="visually-hidden">Loading...</span></div><p className="mt-3">Loading activities...</p></div>;
  if (error) return <div className="container mt-5"><div className="alert alert-danger" role="alert"><strong>Error:</strong> {error}</div></div>;

  return (
    <div className="container">
      <div className="row mb-4">
        <div className="col-lg-8">
          <h2>Activities</h2>
        </div>
        <div className="col-lg-4 text-end">
          <button className="btn btn-primary">Add Activity</button>
        </div>
      </div>
      
      {activities.length === 0 ? (
        <div className="alert alert-info" role="alert">
          <strong>No activities found.</strong> Start by adding a new activity to track your fitness journey.
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table table-striped table-hover">
            <thead>
              <tr>
                <th scope="col">ID</th>
                <th scope="col">User</th>
                <th scope="col">Activity Type</th>
                <th scope="col">Duration (min)</th>
                <th scope="col">Date</th>
                <th scope="col">Actions</th>
              </tr>
            </thead>
            <tbody>
              {activities.map((activity) => (
                <tr key={activity.id}>
                  <td>
                    <span className="badge bg-primary">{activity.id}</span>
                  </td>
                  <td><strong>{activity.user}</strong></td>
                  <td>{activity.activity_type}</td>
                  <td>
                    <span className="badge bg-info">{activity.duration} min</span>
                  </td>
                  <td>
                    <small className="text-muted">{activity.date}</small>
                  </td>
                  <td>
                    <button className="btn btn-sm btn-outline-primary me-2">Edit</button>
                    <button className="btn btn-sm btn-outline-danger">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Activities;
