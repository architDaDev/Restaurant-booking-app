import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/UseAuth.js';

export default function DashboardLayout({ children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="flex min-h-screen bg-slate-900 text-slate-100">
      
      {/* Persistent Sidebar Navigation */}
      <aside className="w-64 bg-slate-800 border-r border-slate-700 flex flex-col justify-between p-6">
        <div className="space-y-8">
          <div className="text-xl font-black tracking-tight text-brand">
            Bite<span className="text-white">Booker Partner</span>
          </div>

          <nav className="space-y-2">
            <Link to="/" className="block rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white hover:bg-brand transition-all">
              📊 Live Booking Manifest
            </Link>
            <Link to="/menu" className="block rounded-xl px-4 py-3 text-sm font-medium text-slate-400 hover:bg-slate-700 hover:text-white transition-all">
              🍳 Digital Menu Editor
            </Link>
            <Link to="/profile" className="block rounded-xl px-4 py-3 text-sm font-medium text-slate-400 hover:bg-slate-700 hover:text-white transition-all">
              🏪 Restaurant Profile
            </Link>
          </nav>
        </div>

        {/* User Footer Utility */}
        <div className="border-t border-slate-700 pt-4 space-y-3">
          <div className="text-xs">
            <p className="text-slate-500 font-medium">Logged in as:</p>
            <p className="text-slate-300 font-semibold truncate">{user?.name}</p>
          </div>
          <button 
            onClick={handleLogout}
            className="w-full rounded-xl bg-slate-900 py-2 text-xs font-semibold hover:bg-red-950 hover:text-red-400 border border-slate-700 hover:border-red-900/40 transition-all cursor-pointer"
          >
            Logout Session
          </button>
        </div>
      </aside>

      {/* Main Content Workspace viewport */}
      <main className="flex-1 p-10 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}