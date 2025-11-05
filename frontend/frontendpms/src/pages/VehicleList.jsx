import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './VehicleList.css';

const VehicleList = () => {
  const [vehicles, setVehicles] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const vehiclesPerPage = 10;
  const navigate = useNavigate();

  useEffect(() => {
    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
    try {
      const res = await fetch('http://localhost:8080/api/vehicles');
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
      setVehicles(data || []);
    } catch (err) {
      setError('Failed to load vehicles: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // === FILTER + PAGINATION ===
  const filtered = vehicles.filter(v => {
    const vehicleNo = (v.vehicleNo || '').toString().toLowerCase();
    const phone = (v.phone || '').toString();
    const searchLower = search.toLowerCase();
    return vehicleNo.includes(searchLower) || phone.includes(searchLower);
  });

  const indexOfLast = currentPage * vehiclesPerPage;
  const indexOfFirst = indexOfLast - vehiclesPerPage;
  const currentVehicles = filtered.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filtered.length / vehiclesPerPage);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this vehicle?')) return;
    try {
      await fetch(`http://localhost:8080/api/vehicles/${id}`, { method: 'DELETE' });
      fetchVehicles();
    } catch (err) {
      alert('Delete failed');
    }
  };

  const formatDate = (dateStr) => {
    try {
      return new Date(dateStr).toLocaleString();
    } catch {
      return 'Invalid Date';
    }
  };

  return (
    <div className="list-container">
      <div className="list-card">
        <h1>Vehicle List</h1>

        <div className="search-bar">
          <input
            type="text"
            placeholder="Search by vehicle no or phone"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1); // Reset to page 1 on search
            }}
            className="search-input"
          />
        </div>

        {loading ? (
          <p>Loading vehicles...</p>
        ) : error ? (
          <p className="error-text">{error}</p>
        ) : currentVehicles.length === 0 ? (
          <p>No vehicles found</p>
        ) : (
          <>
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>Vehicle No</th>
                    <th>Phone</th>
                    <th>Price</th>
                    <th>Entry Time</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {currentVehicles.map(v => (
                    <tr key={v.id}>
                      <td><strong>{v.vehicleNo || 'N/A'}</strong></td>
                      <td>{v.phone || 'N/A'}</td>
                      <td>₹{v.price || 0}</td>
                      <td>{formatDate(v.date)}</td>
                      <td>
                        <button onClick={() => handleDelete(v.id)} className="delete-btn">
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* === PAGINATION === */}
            <div className="pagination">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                Previous
              </button>
              <span>
                Page <strong>{currentPage}</strong> of <strong>{totalPages}</strong>
              </span>
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </div>
          </>
        )}

        <button
          onClick={() => navigate('/incharge/dashboard')}
          className="back-btn"
        >
          Back to Dashboard
        </button>

        {/* === FOOTER === */}
        <footer className="list-footer">
          <p>© 2025 ParkSmart – Secure Parking Management System</p>
        </footer>
      </div>

      {/* === EXTRA SPACING === */}
      <div style={{ height: '80px' }}></div>
    </div>
  );
};

export default VehicleList;