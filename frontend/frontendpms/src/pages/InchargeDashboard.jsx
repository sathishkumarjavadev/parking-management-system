import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './InchargeDashboard.css';

const InchargeDashboard = () => {
  const [vehicleNo, setVehicleNo] = useState('');
  const [phone, setPhone] = useState('');
  const [price, setPrice] = useState('');
  const [date, setDate] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!vehicleNo || !phone || !price || !date) {
      alert('Please fill all fields');
      return;
    }

    const priceNum = parseInt(price, 10);
    if (isNaN(priceNum) || priceNum <= 0) {
      alert('Enter valid price');
      return;
    }

    const newEntry = {
      vehicleNo: vehicleNo.toUpperCase().trim(),
      phone: phone.trim(),
      price: priceNum,
      date: date
    };

    setLoading(true);

    try {
      const res = await fetch('http://localhost:8080/api/vehicles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newEntry),
      });

      if (res.ok) {
        alert('Vehicle added successfully!');
        setVehicleNo('');
        setPhone('');
        setPrice('');
        setDate('');
        navigate('/incharge/vehicle-list');
      } else {
        const error = await res.text();
        alert('Error: ' + error);
      }
    } catch (err) {
      alert('Network error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard-container">
      <div className="entry-card">
        <h1>Vehicle Entry</h1>
        <p>Add new vehicle to parking system</p>

        <form onSubmit={handleSubmit} className="entry-form">
          <div className="input-group">
            <label>Vehicle Number</label>
            <input
              type="text"
              placeholder="e.g. MH 14 AB 1234"
              value={vehicleNo}
              onChange={(e) => setVehicleNo(e.target.value.toUpperCase())}
              required
            />
          </div>

          <div className="input-group">
            <label>Phone Number</label>
            <input
              type="tel"
              placeholder="e.g. 9876543210"
              value={phone}
              onChange={(e) => {
                const val = e.target.value.replace(/[^0-9]/g, '');
                if (val.length <= 10) setPhone(val);
              }}
              maxLength="10"
              required
            />
          </div>

          <div className="input-group">
            <label>Price (₹)</label>
            <input
              type="text"
              inputMode="numeric"
              placeholder="e.g. 50"
              value={price}
              onChange={(e) => {
                const val = e.target.value.replace(/[^0-9]/g, '');
                setPrice(val);
              }}
              className="price-input"
              required
            />
          </div>

          <div className="input-group">
            <label>Date & Time</label>
            <input
              type="datetime-local"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>

          <div className="btn-group">
            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? 'Adding...' : 'Add Vehicle'}
            </button>
            <button
              type="button"
              className="list-btn"
              onClick={() => navigate('/incharge/vehicle-list')}
            >
              View List
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InchargeDashboard;