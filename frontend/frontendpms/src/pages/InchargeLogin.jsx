import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./InchargeLogin.css";

const InchargeLogin = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    // Simple hardcoded login for demo
    if (username === "incharge" && password === "1234") {
      navigate("/incharge/dashboard");
    } else {
      alert("Invalid username or password");
    }
  };
  return (
    <div className="login-wrapper">
      <div className="login-card">
        <h2>Incharge Login</h2>
        <form onSubmit={handleLogin}>
          <div className="form-field">
            <label>Username</label>
            <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} 
            placeholder="Enter username" required/>
          </div>

          <div className="form-field">
            <label>Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password" required/>
          </div>
          <b>
            <p>Username: incharge</p>
            <p>Password: 1234</p>
          </b>
          <button type="submit">Login</button>
        </form>
      </div>
    </div>
  );
};

export default InchargeLogin;