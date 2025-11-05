import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './InchargeLogin.css';

const InchargeLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email === 'incharge@park.com' && password === '12345') {
      alert('Login Successful!');
      navigate('/incharge/dashboard');
    } else {
      alert('Invalid credentials');
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1>Parking Incharge Login</h1>
        <p>Secure access to parking management system</p>

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Email Address</label>
            <input
              type="email"
              placeholder="Enter incharge email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="login-btn">
            Login to Dashboard
          </button>
        </form>

        <div className="demo-box">
          <p><strong>Demo:</strong> incharge@park.com / 12345</p>
        </div>
      </div>
    </div>
  );
};

export default InchargeLogin;