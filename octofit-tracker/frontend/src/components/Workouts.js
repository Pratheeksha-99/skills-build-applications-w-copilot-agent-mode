import React, { useState, useEffect } from 'react';

const Workouts = () => {
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWorkouts = async () => {
      try {
        const codespaceUrl = process.env.REACT_APP_CODESPACE_NAME
          ? `https://${process.env.REACT_APP_CODESPACE_NAME}-8000.app.github.dev`
          : 'https://localhost:8000';
        
        const apiUrl = `${codespaceUrl}/api/workouts/`;
        
        console.log('Fetching Workouts from:', apiUrl);
        
        const response = await fetch(apiUrl);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        console.log('Raw Workouts Response:', data);
        
        // Handle both paginated (.results) and plain array responses
        const workoutsData = data.results ? data.results : Array.isArray(data) ? data : [];
        
        console.log('Processed Workouts Data:', workoutsData);
        
        setWorkouts(workoutsData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching workouts:', error);
        setError(error.message);
        setLoading(false);
      }
    };

    fetchWorkouts();
  }, []);

  if (loading) return <div className="container mt-5"><div className="spinner-border text-primary" role="status"><span className="visually-hidden">Loading...</span></div><p className="mt-3">Loading workouts...</p></div>;
  if (error) return <div className="container mt-5"><div className="alert alert-danger" role="alert"><strong>Error:</strong> {error}</div></div>;

  return (
    <div className="container">
      <div className="row mb-4">
        <div className="col-lg-8">
          <h2>Workouts</h2>
        </div>
        <div className="col-lg-4 text-end">
          <button className="btn btn-primary">Add Workout</button>
        </div>
      </div>
      
      {workouts.length === 0 ? (
        <div className="alert alert-info" role="alert">
          <strong>No workouts found.</strong> Create a workout routine to get started.
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table table-striped table-hover">
            <thead>
              <tr>
                <th scope="col">ID</th>
                <th scope="col">Name</th>
                <th scope="col">Description</th>
                <th scope="col">Duration</th>
                <th scope="col">Intensity</th>
                <th scope="col">Actions</th>
              </tr>
            </thead>
            <tbody>
              {workouts.map((workout) => {
                const intensityColor = 
                  workout.intensity === 'High' ? 'danger' :
                  workout.intensity === 'Medium' ? 'warning' :
                  'success';
                
                return (
                  <tr key={workout.id}>
                    <td>
                      <span className="badge bg-primary">{workout.id}</span>
                    </td>
                    <td><strong>{workout.name}</strong></td>
                    <td>{workout.description}</td>
                    <td>
                      <span className="badge bg-light text-dark">{workout.duration} min</span>
                    </td>
                    <td>
                      <span className={`badge bg-${intensityColor}`}>{workout.intensity}</span>
                    </td>
                    <td>
                      <button className="btn btn-sm btn-outline-primary me-2">Edit</button>
                      <button className="btn btn-sm btn-outline-danger">Delete</button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Workouts;
