import React, { useState, useEffect } from 'react';

const Leaderboard = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const codespaceUrl = process.env.REACT_APP_CODESPACE_NAME
          ? `https://${process.env.REACT_APP_CODESPACE_NAME}-8000.app.github.dev`
          : 'https://localhost:8000';
        
        const apiUrl = `${codespaceUrl}/api/leaderboard/`;
        
        console.log('Fetching Leaderboard from:', apiUrl);
        
        const response = await fetch(apiUrl);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        console.log('Raw Leaderboard Response:', data);
        
        // Handle both paginated (.results) and plain array responses
        const leaderboardData = data.results ? data.results : Array.isArray(data) ? data : [];
        
        console.log('Processed Leaderboard Data:', leaderboardData);
        
        setLeaderboard(leaderboardData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching leaderboard:', error);
        setError(error.message);
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  if (loading) return <div className="container mt-5"><div className="spinner-border text-primary" role="status"><span className="visually-hidden">Loading...</span></div><p className="mt-3">Loading leaderboard...</p></div>;
  if (error) return <div className="container mt-5"><div className="alert alert-danger" role="alert"><strong>Error:</strong> {error}</div></div>;

  return (
    <div className="container">
      <div className="row mb-4">
        <div className="col-lg-8">
          <h2>🏆 Leaderboard</h2>
        </div>
        <div className="col-lg-4 text-end">
          <button className="btn btn-secondary">Reset Scores</button>
        </div>
      </div>
      
      {leaderboard.length === 0 ? (
        <div className="alert alert-info" role="alert">
          <strong>No leaderboard data found.</strong> Start logging activities to see the rankings!
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table table-striped table-hover">
            <thead>
              <tr>
                <th scope="col">Rank</th>
                <th scope="col">User</th>
                <th scope="col">Score</th>
                <th scope="col">Points</th>
              </tr>
            </thead>
            <tbody>
              {leaderboard.map((entry, index) => {
                const medalIcon = 
                  index === 0 ? '🥇' :
                  index === 1 ? '🥈' :
                  index === 2 ? '🥉' :
                  '';
                
                return (
                  <tr key={entry.id} className={index < 3 ? 'table-light' : ''}>
                    <td>
                      <span className="fs-5 fw-bold">
                        {medalIcon} #{index + 1}
                      </span>
                    </td>
                    <td><strong>{entry.user}</strong></td>
                    <td>
                      <span className="badge bg-info">{entry.score}</span>
                    </td>
                    <td>
                      <span className="badge bg-success fs-6">{entry.points} pts</span>
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

export default Leaderboard;
