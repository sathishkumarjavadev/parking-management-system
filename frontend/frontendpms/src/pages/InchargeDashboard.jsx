import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./InchargeDashboard.css";

const API_URL = "http://localhost:8080/api/vehicles";

const InchargeDashboard = () => {
  const [vehicleNo, setVehicleNo] = useState("");
  const [phone, setPhone] = useState("");
  const [vehicles, setVehicles] = useState([]);
  const [timers, setTimers] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Load vehicles from backend
  const loadVehicles = async () => {
    try {
      const res = await axios.get(API_URL);
      setVehicles(res.data);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch vehicles");
    }
  };

  useEffect(() => {
    loadVehicles();
  }, []);

  // Live timers for IN vehicles
  useEffect(() => {
    const interval = setInterval(() => {
      const updatedTimers = {};
      vehicles.forEach((v) => {
        if (v.status === "IN" && v.entryTime) {
          const start = new Date(v.entryTime);
          updatedTimers[v.id] = Math.floor((new Date() - start) / 1000);
        }
      });
      setTimers(updatedTimers);
    }, 1000);
    return () => clearInterval(interval);
  }, [vehicles]);

  // Calculate price based on seconds
  const calculatePrice = (seconds) => {
    const minutes = Math.ceil(seconds / 60);
    return Math.max(minutes * 1, 10); // ₹1 per min, min ₹10
  };

  const formatDuration = (seconds) => {
    const h = String(Math.floor(seconds / 3600)).padStart(2, "0");
    const m = String(Math.floor((seconds % 3600) / 60)).padStart(2, "0");
    const s = String(seconds % 60).padStart(2, "0");
    return `${h}:${m}:${s}`;
  };

  // Add vehicle
  const handleAddVehicle = async (e) => {
    e.preventDefault();
    if (!vehicleNo || !phone) return alert("Fill all fields");

    const existing = vehicles.find(
      (v) => v.vehicleNo === vehicleNo && v.status === "IN",
    );
    if (existing) return alert("Vehicle already IN");

    const newVehicle = {
      vehicleNo: vehicleNo.toUpperCase(),
      phone,
    };

    setLoading(true);
    try {
      await axios.post(API_URL, newVehicle, {
        headers: { "Content-Type": "application/json" },
      });
      setVehicleNo("");
      setPhone("");
      loadVehicles();
    } catch (err) {
      console.error(err);
      alert("Failed to add vehicle");
    } finally {
      setLoading(false);
    }
  };

  // Mark OUT vehicle
  const handleMarkOut = async (id) => {
    try {
      await axios.put(`${API_URL}/mark-out/${id}`);
      loadVehicles();
    } catch (err) {
      console.error(err);
      alert("Failed to mark OUT");
    }
  };

  return (
    <div className="incharge-wrapper">
      <div className="dashboard-header">
        <h1>Incharge Dashboard</h1>
        <button onClick={() => navigate("/")} style={{ background: "red" }}>
          Logout
        </button>
      </div>

      {/* Vehicle Entry Form */}
      <div className="entry-card">
        <h2>Add Vehicle</h2>
        <form onSubmit={handleAddVehicle}>
          <input
            type="text"
            placeholder="Vehicle No"
            value={vehicleNo}
            onChange={(e) => setVehicleNo(e.target.value.toUpperCase())}
            required
          />
          <input
            type="tel"
            placeholder="Phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value.replace(/[^0-9]/g, ""))}
            maxLength="10"
            required
          />
          <button type="submit" disabled={loading}>
            {loading ? "Adding..." : "Add Vehicle"}
          </button>
        </form>
      </div>

      {/* Vehicle List Table */}
      <div className="vehicle-list">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Vehicle</th>
              <th>Phone</th>
              <th>Status</th>
              <th>Entry Time</th>
              <th>Out Time</th>
              <th>Total Hours</th>
              <th>Live Timer</th>
              <th>Price</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {vehicles.map((v) => {
              const liveSec = timers[v.id] || 0;
              const livePrice =
                v.status === "IN" ? calculatePrice(liveSec) : v.price;
              const totalHours =
                v.status === "IN" ? Math.ceil(liveSec / 3600) : v.totalHours;

              return (
                <tr key={v.id}>
                  <td>{v.id}</td>
                  <td>{v.vehicleNo}</td>
                  <td>{v.phone}</td>
                  <td
                    className={v.status === "IN" ? "status-in" : "status-out"}
                  >
                    {v.status}
                  </td>
                  <td>
                    {v.entryTime ? new Date(v.entryTime).toLocaleString() : "-"}
                  </td>
                  <td>
                    {v.outTime ? new Date(v.outTime).toLocaleString() : "-"}
                  </td>
                  <td>{totalHours}</td>
                  <td>{v.status === "IN" ? formatDuration(liveSec) : "-"}</td>
                  <td>₹{livePrice}</td>
                  <td>
                    {v.status === "IN" && (
                      <button onClick={() => handleMarkOut(v.id)}>
                        Mark OUT
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default InchargeDashboard;
