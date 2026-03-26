import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from "react-toastify";
import './VehicleList.css';

const VehicleList = ({ role }) => {
  const [vehicles, setVehicles] = useState([]);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editData, setEditData] = useState({ id: "", vehicleNo: "", phone: "" });
  const navigate = useNavigate();
  const API_URL = 'http://localhost:8080/api/vehicles';

  // Fetch all vehicles from backend
  const fetchVehicles = async () => {
    try {
      const res = await axios.get(API_URL);
      setVehicles(res.data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch vehicles.");
    }
  };

  useEffect(() => {
    fetchVehicles();

    // Update live timer only for vehicles still IN
    const interval = setInterval(() => {
      setVehicles(prev =>
        prev.map(v => {
          if (v.status === 'IN' && v.entryTime) {
            const now = new Date();
            const inTime = new Date(v.entryTime);
            let diffHours = Math.ceil((now - inTime) / (1000 * 60 * 60));
            if ((now - inTime) / (1000 * 60) <= 5) diffHours = 0; // grace 5 min
            return { ...v, liveHours: diffHours, livePrice: diffHours * 20 };
          }
          return v;
        })
      );
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const filtered = vehicles.filter(v =>
    v.vehicleNo?.toLowerCase().includes(search.toLowerCase()) ||
    v.phone?.includes(search)
  );

  const formatDateTime = (dateString) => {
    if (!dateString) return '—';
    const dateObj = new Date(dateString);
    return isNaN(dateObj) ? 'Invalid Date' : dateObj.toLocaleString();
  };

  // Admin: open edit modal
  const openEditModal = (vehicle) => {
    setEditData({ id: vehicle.id, vehicleNo: vehicle.vehicleNo, phone: vehicle.phone });
    setShowModal(true);
  };
  const closeModal = () => setShowModal(false);

  // Admin: update vehicle
  const handleUpdateVehicle = async () => {
    try {
      await axios.put(`${API_URL}/${editData.id}`, {
        vehicleNo: editData.vehicleNo,
        phone: editData.phone,
      });

      setVehicles(prev =>
        prev.map(v =>
          v.id === editData.id
            ? { ...v, vehicleNo: editData.vehicleNo, phone: editData.phone }
            : v
        )
      );
      toast.success("Vehicle updated successfully!");
      setShowModal(false);
    } catch (err) {
      console.error(err);
      toast.error("Failed to update vehicle.");
    }
  };

  // IN → OUT toggle
  const handleMarkOut = async (id) => {
    const vehicle = vehicles.find(v => v.id === id);
    if (!vehicle || vehicle.status === 'OUT') return;

    const confirmOut = window.confirm(`Mark vehicle ${vehicle.vehicleNo} as OUT?`);
    if (!confirmOut) return;

    try {
      const res = await axios.put(`${API_URL}/mark-out/${id}`);
      setVehicles(prev =>
        prev.map(v => (v.id === id ? res.data : v))
      );
      toast.success(`Vehicle ${vehicle.vehicleNo} marked as OUT!`);
    } catch (err) {
      console.error(err);
      toast.error("Failed to mark vehicle OUT.");
    }
  };

  return (
    <div className="list-container">
      <div className="list-card">
        <div className="list-header">
          <h1>Vehicle List</h1>
          {role === 'incharge' && (
            <button className="add-btn" onClick={() => navigate('/incharge/dashboard')}>
              + Add Vehicle
            </button>
          )}
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
          <table className="styled-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Vehicle No</th>
                <th>Phone</th>
                <th>IN Time</th>
                <th>OUT Time</th>
                <th>Total Hours</th>
                <th>Price</th>
                {role === 'admin' && <th>Action</th>}
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={role === 'admin' ? 9 : 8} className="no-data">
                    No vehicles found
                  </td>
                </tr>
              ) : (
                filtered.map(v => (
                  <tr key={v.id} className={v.status === 'IN' ? 'row-in' : 'row-out'}>
                    <td>{v.id}</td>
                    <td>{v.vehicleNo}</td>
                    <td>{v.phone}</td>
                    <td>{formatDateTime(v.entryTime)}</td>
                    <td>{formatDateTime(v.outTime)}</td>
                    <td>{v.status === 'IN' ? v.liveHours : v.totalHours}</td>
                    <td>₹{v.status === 'IN' ? v.livePrice : v.price}</td>
                    {role === 'admin' && (
                      <td>
                        <button className="edit-btn" onClick={() => openEditModal(v)}>
                          Edit
                        </button>
                      </td>
                    )}
                    <td>
                      <button
                        className={`status-btn ${v.status === 'IN' ? 'in-btn' : 'out-btn'}`}
                        onClick={() => handleMarkOut(v.id)}
                        disabled={v.status === 'OUT'}
                      >
                        {v.status}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Modal */}
      {showModal && role === 'admin' && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Edit Vehicle</h2>
            <label>Vehicle No</label>
            <input
              type="text"
              value={editData.vehicleNo}
              onChange={(e) =>
                setEditData({ ...editData, vehicleNo: e.target.value.toUpperCase() })
              }
            />
            <label>Phone</label>
            <input
              type="text"
              maxLength="10"
              value={editData.phone}
              onChange={(e) =>
                setEditData({ ...editData, phone: e.target.value.replace(/[^0-9]/g, "") })
              }
            />
            <div className="modal-actions">
              <button className="update-btn" onClick={handleUpdateVehicle}>Update</button>
              <button className="cancel-btn" onClick={closeModal}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VehicleList;
