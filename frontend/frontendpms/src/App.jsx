import { Routes, Route } from 'react-router-dom';
import Welcome from './pages/Welcome.jsx';
import AdminLogin from './pages/AdminLogin.jsx';
import AdminDashboard from './pages/AdminDashboard.jsx';
import InchargeLogin from './pages/InchargeLogin.jsx';
import InchargeDashboard from './pages/InchargeDashboard.jsx';
import VehicleList from './pages/VehicleList.jsx';

function App() {
  return (
    <Routes>
      {/* Welcome Page */}
      <Route path="/" element={<Welcome />} />

      {/* Admin Routes */}
      <Route path="/admin" element={<AdminLogin />} />
      <Route path="/admin/dashboard" element={<AdminDashboard />} />

      {/* Incharge Routes */}
      <Route path="/incharge" element={<InchargeLogin />} />
      <Route path="/incharge/dashboard" element={<InchargeDashboard />} />
      <Route path="/incharge/vehicle-list" element={<VehicleList />} />
    </Routes>
  );
}

export default App;