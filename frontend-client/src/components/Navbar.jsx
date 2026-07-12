import { useAuth } from '../hooks/UseAuth.js';
import { Link } from 'react-router-dom';

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-slate-100 px-6 py-4">
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        <Link to="/" className="text-2xl font-black tracking-tight text-brand">
          Bite<span className="text-slate-900">Booker</span>
        </Link>

        <div className="flex items-center gap-6">
          {user ? (
            <>
            <Link to="/bookings" className="text-sm font-medium text-slate-600 hover:text-brand transition-colors">
        My Bookings
      </Link>
              <span className="text-sm font-medium text-slate-600">
                Hi, <span className="font-semibold text-slate-900">{user.name}</span>
              </span>
              <button
                onClick={logout}
                className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 transition-colors cursor-pointer"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="rounded-xl bg-brand px-4 py-2 text-sm font-medium text-white hover:bg-brand-dark transition-colors"
            >
              Sign In
            </Link>
          )
        }
        </div>
      </div>
    </nav>
  );
}