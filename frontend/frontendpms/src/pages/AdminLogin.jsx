import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AdminLogin.css";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    // Demo login validation
    if (email === "admin@park.com" && password === "admin123") {
      alert("Login Successful!");
      navigate("/admin/dashboard");
    } else {
      alert("Invalid email or password");
    }
  };

  return (
    <div className="admin-login-wrapper">
      <div className="admin-card">
        <h2 className="title">Admin Login</h2>
        <p className="subtitle">Secure Access Only</p>

        <form onSubmit={handleSubmit} className="admin-form">
          <div className="form-field">
            <label>Email</label>
            <input
              type="email"
              placeholder="admin@park.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-field">
            <label>Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="login-btn">
            Login
          </button>
        </form>

        <div className="demo-credentials">
          <p>
            <strong>Demo:</strong> admin@park.com / admin123
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
