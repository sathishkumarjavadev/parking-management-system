import { useState, useEffect } from 'react';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [vehicles, setVehicles] = useState([]);
  const [search, setSearch] = useState('');

  // Load vehicles from localStorage
  useEffect(() => {
    const data = JSON.parse(localStorage.getItem('vehicles') || '[]');
    setVehicles(data);
  }, []);

  // Filter vehicles based on search
  const filtered = vehicles.filter(v =>
    v.vehicleNo.toLowerCase().includes(search.toLowerCase()) ||
    v.phone.includes(search)
  );

  // Calculate totals
  const totalVehicles = vehicles.length;
  const totalRevenue = vehicles.reduce((sum, v) => sum + v.price, 0);

  // Delete vehicle
  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this vehicle record?')) {
      const updated = vehicles.filter(v => v.id !== id);
      localStorage.setItem('vehicles', JSON.stringify(updated));
      setVehicles(updated);
    }
  };

  return (
    <div className="admin-container">
      {/* Header */}
      <header className="admin-header">
        <h1>Admin Dashboard</h1>
        <p>Owner View – Parking Management System</p>
      </header>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-box">
          <h3>Total Vehicles</h3>
          <p className="number">{totalVehicles}</p>
        </div>
        <div className="stat-box">
          <h3>Total Revenue</h3>
          <p className="number">₹{totalRevenue}</p>
        </div>
      </div>

      {/* Vehicle Records Table */}
      <div className="table-card">
        <div className="table-top">
          <h2>All Vehicle Records</h2>
          <input
            type="text"
            placeholder="Search by vehicle no or phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="table-wrapper">
          {filtered.length === 0 ? (
            <p className="no-data">
              {vehicles.length === 0 ? 'No vehicles added yet.' : 'No matching vehicles found.'}
            </p>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Vehicle No</th>
                  <th>Phone</th>
                  <th>Date & Time</th>
                  <th>Price</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(v => (
                  <tr key={v.id}>
                    <td>{v.id}</td>
                    <td><strong>{v.vehicleNo}</strong></td>
                    <td>{v.phone}</td>
                    <td>{new Date(v.date).toLocaleString()}</td>
                    <td>₹{v.price}</td>
                    <td>
                      <button
                        className="delete-btn"
                        onClick={() => handleDelete(v.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;