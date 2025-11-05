import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './VehicleList.css';

const VehicleList = () => {
  const [vehicles, setVehicles] = useState([]);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem('vehicles') || '[]');
    setVehicles(data);
  }, []);

  const filtered = vehicles.filter(v =>
    v.vehicleNo.toLowerCase().includes(search.toLowerCase()) ||
    v.phone.includes(search)
  );

  const handleDelete = (id) => {
    if (window.confirm('Delete this vehicle?')) {
      const updated = vehicles.filter(v => v.id !== id);
      localStorage.setItem('vehicles', JSON.stringify(updated));
      setVehicles(updated);
    }
  };

  return (
    <div className="list-container">
      <div className="list-card">
        <div className="list-header">
          <h1>Vehicle List</h1>
          <button className="add-btn" onClick={() => navigate('/incharge/dashboard')}>
            + Add Vehicle
          </button>
        </div>

        <div className="search-bar">
          <input
            type="text"
            placeholder="Search by vehicle no or phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="table-container">
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
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan="6" className="no-data">No vehicles found</td>
                </tr>
              ) : (
                filtered.map(v => (
                  <tr key={v.id}>
                    <td>{v.id}</td>
                    <td><strong>{v.vehicleNo}</strong></td>
                    <td>{v.phone}</td>
                    <td>{new Date(v.date).toLocaleString()}</td>
                    <td>₹{v.price}</td>
                    <td>
                      <div className="dropdown">
                        <button className="dots">⋮</button>
                        <div className="dropdown-menu">
                          <button onClick={() => alert('Edit coming soon!')}>Edit</button>
                          <button onClick={() => handleDelete(v.id)} className="delete">
                            Delete
                          </button>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default VehicleList;