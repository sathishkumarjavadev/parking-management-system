import { Link } from 'react-router-dom';
import { FaUserShield, FaCar } from 'react-icons/fa';
import './Welcome.css';

const Welcome = () => {
  return (
    <div className="welcome-container">
      <div className="welcome-card">
        <h1>Welcome to</h1>
        <h2>Smart Parking System </h2>
        <p>Secure, Fast & Smart Parking Solution</p>

        <div className="btn-container">
          <Link to="/admin" className="welcome-btn">
            <FaUserShield className="btn-icon" />
            <span>Admin Login</span>
          </Link>

          <Link to="/incharge" className="welcome-btn">
            <FaCar className="btn-icon" />
            <span>Incharge Login</span>
          </Link>
        </div>

        <div className="footer-text">
          Developed by <strong>&#128400;MUKESH MCA</strong> © JAN - JUL 2026
        </div>
      </div>
    </div>
  );
};

export default Welcome;