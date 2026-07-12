import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/UseAuth.js';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';

// A temporary Dashboard/Home wrapper to verify context sessions
function HomePlaceholder() {
  const { user, logout } = useAuth();
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50">
      <div className="text-center space-y-4 p-8 bg-white rounded-2xl shadow-xs max-w-sm border border-slate-100">
        <h1 className="text-2xl font-bold">Welcome, {user?.name || 'Guest'}! 👋</h1>
        <p className="text-sm text-slate-500">Account Role: <span className="font-mono text-brand font-semibold">{user?.role}</span></p>
        <button 
          onClick={logout}
          className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 transition-colors cursor-pointer"
        >
          Logout Session
        </button>
      </div>
    </div>
  );
}

// Protected Route Guard component
function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="p-8 text-center text-slate-500">Validating connection state...</div>;
  return user ? children : <Navigate to="/login" />;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Authentication Pipelines */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Guarded Core Operational Views */}
        <Route 
          path="/" 
          element={
            <ProtectedRoute>
              <HomePlaceholder />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </BrowserRouter>
  );
}