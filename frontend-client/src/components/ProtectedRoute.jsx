import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/UseAuth.js';

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="text-sm font-medium text-slate-500 animate-pulse">
          Validating session connection...
        </div>
      </div>
    );
  }

  // If there is no authenticated user session, redirect back to login
  return user ? children : <Navigate to="/login" />;
}