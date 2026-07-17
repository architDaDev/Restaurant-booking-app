import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/UseAuth.js';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import DashboardLayout from './components/DashboardLayout.jsx';
import DashboardHome from './pages/DashboardHome.jsx';
import ManageMenu from './pages/ManageMenu.jsx';
import Profile from './pages/Profile.jsx';

function ProtectedPartnerRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="p-10 text-slate-500">Checking corporate credentials...</div>;
  
  if (!user || user.role !== 'restaurant_owner') {
    return <Navigate to="/login" replace />;
  }
  return <DashboardLayout>{children}</DashboardLayout>;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Authentication Pipelines */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Secure Dashboard Shell Paths */}
        <Route 
          path="/" 
          element={
            <ProtectedPartnerRoute>
              <DashboardHome />
            </ProtectedPartnerRoute>
          } 
        />
        <Route 
          path="/menu" 
          element={
            <ProtectedPartnerRoute>
              <ManageMenu />
            </ProtectedPartnerRoute>
          } 
        />
        <Route 
          path="/profile" 
          element={
            <ProtectedPartnerRoute>
              <Profile />
            </ProtectedPartnerRoute>
          } 
        />
      </Routes>
    </BrowserRouter>
  );
}