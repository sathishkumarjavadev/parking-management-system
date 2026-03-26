import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./AdminDashboard.css";

/* ================= HELPERS ================= */
const formatDuration = (seconds) => {
  const h = String(Math.floor(seconds / 3600)).padStart(2, "0");
  const m = String(Math.floor((seconds % 3600) / 60)).padStart(2, "0");
  const s = String(seconds % 60).padStart(2, "0");
  return `${h}:${m}:${s}`;
};

const AdminDashboard = () => {
  const [vehicles, setVehicles] = useState([]);
  const [search, setSearch] = useState("");
  const [editVehicle, setEditVehicle] = useState(null);
  const [formData, setFormData] = useState({
    vehicleNo: "",
    phone: "",
    entryTime: "",
    outTime: "",
  });

  const navigate = useNavigate();
  const API_URL = "http://localhost:8080/api/vehicles";

  /* ================= LOAD VEHICLES ================= */
  const loadVehicles = async () => {
    try {
      const res = await axios.get(API_URL);
      setVehicles(res.data);
    } catch (err) {
      alert("Failed to fetch vehicles"+err);
    }
  };

  useEffect(() => {
    loadVehicles();
  }, []);

  /* ================= LIVE TIMER ================= */
  const [timers, setTimers] = useState({});
  useEffect(() => {
    const interval = setInterval(() => {
      const updated = {};
      vehicles.forEach((v) => {
        if (v.status === "IN" && v.entryTime) {
          const start = new Date(v.entryTime);
          updated[v.id] = Math.floor((new Date() - start) / 1000);
        }
      });
      setTimers(updated);
    }, 1000);

    return () => clearInterval(interval);
  }, [vehicles]);

  /* ================= DELETE VEHICLE ================= */
  const deleteVehicle = async (id) => {
    if (!window.confirm("Delete this entry?")) return;
    try {
      await axios.delete(`${API_URL}/${id}`);
      loadVehicles();
    } catch {
      alert("Delete failed");
    }
  };

  /* ================= EDIT VEHICLE ================= */
  const openEditModal = (vehicle) => {
    setEditVehicle(vehicle);
    setFormData({
      vehicleNo: vehicle.vehicleNo,
      phone: vehicle.phone,
      entryTime: vehicle.entryTime?.slice(0, 16),
      outTime: vehicle.outTime?.slice(0, 16),
    });
  };

  const closeModal = () => setEditVehicle(null);

  const handleUpdateVehicle = async () => {
    try {
      await axios.put(`${API_URL}/${editVehicle.id}`, {
        vehicleNo: formData.vehicleNo.toUpperCase(),
        phone: formData.phone,
        entryTime: formData.entryTime
          ? new Date(formData.entryTime).toISOString()
          : null,
        outTime: formData.outTime ? new Date(formData.outTime).toISOString() : null,
      });
      loadVehicles();
      closeModal();
      alert("Vehicle updated");
    } catch {
      alert("Update failed");
    }
  };

  /* ================= FILTER + SEARCH ================= */
  const filteredVehicles = vehicles.filter((v) => {
    return (
      v.vehicleNo.toLowerCase().includes(search.toLowerCase()) ||
      v.phone.includes(search)
    );
  });

  const formatDateTime = (date) => (date ? date.replace("T", " ") : "-");

  return (
    <div className="admin-dashboard-container">
      <div className="dashboard-header">
        <h1>Admin Dashboard</h1>
        <button onClick={() => navigate("/")}>Logout</button>
      </div>

      {/* SEARCH */}
      <div className="search-filter">
        <input
          placeholder="Search Vehicle / Phone"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* TABLE */}
      <div className="vehicle-table-container">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Vehicle</th>
              <th>Phone</th>
              <th>Status</th>
              <th>Entry</th>
              <th>Out</th>
              <th>Total Hours</th>
              <th>Live Timer</th>
              <th>Price</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredVehicles.map((v) => {
              const liveSeconds = timers[v.id] || 0;
              const liveHours = v.status === "IN" ? Math.ceil(liveSeconds / 3600) : v.totalHours;
              const price = v.status === "IN" ? liveHours * 20 : v.price;

              return (
                <tr key={v.id}>
                  <td>{v.id}</td>
                  <td>{v.vehicleNo}</td>
                  <td>{v.phone}</td>
                  <td className={v.status === "IN" ? "status-in" : "status-out"}>
                    {v.status}
                  </td>
                  <td>{formatDateTime(v.entryTime)}</td>
                  <td>{formatDateTime(v.outTime)}</td>
                  <td>{liveHours}</td>
                  <td>
                    {v.status === "IN" ? formatDuration(liveSeconds) : "-"}
                  </td>
                  <td>₹{price}</td>
                  <td>
                    <button onClick={() => openEditModal(v)}>Edit</button>
                    <button onClick={() => deleteVehicle(v.id)}>Delete</button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* EDIT MODAL */}
      {editVehicle && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Edit Vehicle</h2>
            <input
              value={formData.vehicleNo}
              onChange={(e) => setFormData({ ...formData, vehicleNo: e.target.value })}
            />
            <input
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />
            <input
              type="datetime-local"
              value={formData.entryTime}
              onChange={(e) => setFormData({ ...formData, entryTime: e.target.value })}
            />
            <input
              type="datetime-local"
              value={formData.outTime}
              onChange={(e) => setFormData({ ...formData, outTime: e.target.value })}
            />
            <button onClick={handleUpdateVehicle}>Update</button>
            <button onClick={closeModal}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
