import React, { useState, useEffect } from 'react';

const Teams = () => {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const codespaceUrl = process.env.REACT_APP_CODESPACE_NAME
          ? `https://${process.env.REACT_APP_CODESPACE_NAME}-8000.app.github.dev`
          : 'https://localhost:8000';
        
        const apiUrl = `${codespaceUrl}/api/teams/`;
        
        console.log('Fetching Teams from:', apiUrl);
        
        const response = await fetch(apiUrl);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        console.log('Raw Teams Response:', data);
        
        // Handle both paginated (.results) and plain array responses
        const teamsData = data.results ? data.results : Array.isArray(data) ? data : [];
        
        console.log('Processed Teams Data:', teamsData);
        
        setTeams(teamsData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching teams:', error);
        setError(error.message);
        setLoading(false);
      }
    };

    fetchTeams();
  }, []);

  if (loading) return <div className="container mt-5"><div className="spinner-border text-primary" role="status"><span className="visually-hidden">Loading...</span></div><p className="mt-3">Loading teams...</p></div>;
  if (error) return <div className="container mt-5"><div className="alert alert-danger" role="alert"><strong>Error:</strong> {error}</div></div>;

  return (
    <div className="container">
      <div className="row mb-4">
        <div className="col-lg-8">
          <h2>Teams</h2>
        </div>
        <div className="col-lg-4 text-end">
          <button className="btn btn-primary">Create Team</button>
        </div>
      </div>
      
      {teams.length === 0 ? (
        <div className="alert alert-info" role="alert">
          <strong>No teams found.</strong> Create a team to compete with other fitness enthusiasts!
        </div>
      ) : (
        <div className="row">
          {teams.map((team) => (
            <div key={team.id} className="col-md-6 col-lg-4">
              <div className="card h-100">
                <div className="card-header d-flex align-items-center justify-content-between">
                  <h5 className="card-title mb-0">Team {team.id}</h5>
                </div>
                <div className="card-body d-flex flex-column">
                  <h6 className="card-subtitle mb-2 text-primary fw-bold">{team.name}</h6>
                  <p className="card-text flex-grow-1">{team.description}</p>
                  <div className="mt-3 mb-3">
                    <span className="badge bg-info rounded-pill">
                      👥 {team.members_count || 0} Members
                    </span>
                  </div>
                </div>
                <div className="card-footer bg-light border-top-0">
                  <button className="btn btn-sm btn-primary me-2">View Team</button>
                  <button className="btn btn-sm btn-outline-secondary">Edit</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Teams;
