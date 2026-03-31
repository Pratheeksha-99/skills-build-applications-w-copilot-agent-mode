import React, { useState, useEffect } from 'react';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const codespaceUrl = process.env.REACT_APP_CODESPACE_NAME
          ? `https://${process.env.REACT_APP_CODESPACE_NAME}-8000.app.github.dev`
          : 'https://localhost:8000';
        
        const apiUrl = `${codespaceUrl}/api/users/`;
        
        console.log('Fetching Users from:', apiUrl);
        
        const response = await fetch(apiUrl);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        console.log('Raw Users Response:', data);
        
        // Handle both paginated (.results) and plain array responses
        const usersData = data.results ? data.results : Array.isArray(data) ? data : [];
        
        console.log('Processed Users Data:', usersData);
        
        setUsers(usersData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching users:', error);
        setError(error.message);
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (loading) return <div className="container mt-5"><div className="spinner-border text-primary" role="status"><span className="visually-hidden">Loading...</span></div><p className="mt-3">Loading users...</p></div>;
  if (error) return <div className="container mt-5"><div className="alert alert-danger" role="alert"><strong>Error:</strong> {error}</div></div>;

  return (
    <div className="container">
      <div className="row mb-4">
        <div className="col-lg-8">
          <h2>Users</h2>
        </div>
        <div className="col-lg-4 text-end">
          <button className="btn btn-primary">Add User</button>
        </div>
      </div>
      
      {users.length === 0 ? (
        <div className="alert alert-info" role="alert">
          <strong>No users found.</strong> Start by adding users to your fitness tracking community.
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table table-striped table-hover">
            <thead>
              <tr>
                <th scope="col">ID</th>
                <th scope="col">Username</th>
                <th scope="col">Email</th>
                <th scope="col">First Name</th>
                <th scope="col">Last Name</th>
                <th scope="col">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td>
                    <span className="badge bg-primary">{user.id}</span>
                  </td>
                  <td><strong>{user.username}</strong></td>
                  <td>
                    <a href={`mailto:${user.email}`} className="text-decoration-none">{user.email}</a>
                  </td>
                  <td>{user.first_name}</td>
                  <td>{user.last_name}</td>
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

export default Users;
