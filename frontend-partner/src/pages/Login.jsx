import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/UseAuth.js';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [uiError, setUiError] = useState('');
  const { login, error } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUiError('');
    
    const result = await login(email, password);
    if (result.success) {
      navigate('/'); 
    } else {
      setUiError(result.message);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-900 px-4">
      <div className="w-full max-w-md space-y-8 rounded-2xl bg-slate-800 p-8 shadow-xl border border-slate-700">
        <div className="text-center">
          <h2 className="text-3xl font-black tracking-tight text-white">Partner Portal</h2>
          <p className="mt-2 text-sm text-slate-400">Manage your restaurant and seating schedules</p>
        </div>

        {(uiError || error) && (
          <div className="rounded-lg bg-red-500/10 p-3 text-sm text-red-400 border border-red-500/20">
            {uiError || error}
          </div>
        )}

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-slate-300">Business Email</label>
            <input
              type="email"
              required
              className="mt-1 block w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-white focus:border-brand focus:outline-hidden"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300">Password</label>
            <input
              type="password"
              required
              className="mt-1 block w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-white focus:border-brand focus:outline-hidden"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-xl bg-brand py-3 text-sm font-semibold text-white transition-all hover:bg-brand-dark cursor-pointer shadow-xs"
          >
            Access Dashboard
          </button>
        </form>

        <p className="text-center text-sm text-slate-400">
          New restaurant owner?{' '}
          <Link to="/register" className="font-medium text-brand hover:underline">
            Register your business
          </Link>
        </p>
      </div>
    </div>
  );
}