import { Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Pages
import Welcome from "./pages/Welcome.jsx";
import AdminLogin from "./pages/AdminLogin.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";
import InchargeLogin from "./pages/InchargeLogin.jsx";
import InchargeDashboard from "./pages/InchargeDashboard.jsx";
import VehicleList from "./pages/VehicleList.jsx";

function App() {
  return (
    <div className="app-container">
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/admin" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/incharge" element={<InchargeLogin />} />
        <Route path="/incharge/dashboard" element={<InchargeDashboard />} />
        <Route path="/incharge/vehicle-list" element={<VehicleList />} />
      </Routes>
      <ToastContainer position="bottom-right" autoClose={3000} />
    </div>
  );
}

export default App;
