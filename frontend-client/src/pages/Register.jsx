import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/UseAuth.js';

export default function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phoneNumber: '',
    role: 'customer' // Defaults to a diner account
  });
  const [uiError, setUiError] = useState('');
  const { register, error } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUiError('');
    
    const result = await register(
      formData.name,
      formData.email,
      formData.password,
      formData.role,
      formData.phoneNumber
    );

    if (result.success) {
      navigate('/');
    } else {
      setUiError(result.message);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-8">
      <div className="w-full max-w-md space-y-6 rounded-2xl bg-white p-8 shadow-sm border border-slate-100">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900">Create Account</h2>
          <p className="mt-2 text-sm text-slate-500">Join us to explore and book culinary experiences</p>
        </div>

        {(uiError || error) && (
          <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
            {uiError || error}
          </div>
        )}

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-slate-700">Full Name</label>
            <input
              type="text"
              required
              className="mt-1 block w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm focus:border-brand focus:bg-white focus:outline-hidden"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700">Email Address</label>
            <input
              type="email"
              required
              className="mt-1 block w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm focus:border-brand focus:bg-white focus:outline-hidden"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700">Phone Number</label>
            <input
              type="text"
              required
              className="mt-1 block w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm focus:border-brand focus:bg-white focus:outline-hidden"
              value={formData.phoneNumber}
              onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700">Password</label>
            <input
              type="password"
              required
              className="mt-1 block w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm focus:border-brand focus:bg-white focus:outline-hidden"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700">Account Type</label>
            <select
              className="mt-1 block w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm focus:border-brand focus:bg-white focus:outline-hidden"
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
            >
              <option value="customer">Diner (Book Tables)</option>
              <option value="restaurant_owner">Restaurant Owner (Manage Bookings)</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full mt-2 rounded-xl bg-brand py-3 text-sm font-semibold text-white transition-all hover:bg-brand-dark cursor-pointer shadow-xs"
          >
            Sign Up
          </button>
        </form>

        <p className="text-center text-sm text-slate-500">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-brand hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}