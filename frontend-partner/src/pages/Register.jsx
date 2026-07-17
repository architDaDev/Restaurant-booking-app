import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/UseAuth.js';

export default function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phoneNumber: ''
  });
  const [uiError, setUiError] = useState('');
  const { register, error } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUiError('');
    
    // Automatically forcing the role property strictly to 'restaurant_owner'
    const result = await register(
      formData.name,
      formData.email,
      formData.password,
      'restaurant_owner', 
      formData.phoneNumber
    );

    if (result.success) {
      navigate('/');
    } else {
      setUiError(result.message);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-900 px-4 py-8">
      <div className="w-full max-w-md space-y-6 rounded-2xl bg-slate-800 p-8 shadow-xl border border-slate-700">
        <div className="text-center">
          <h2 className="text-3xl font-black tracking-tight text-white">Partner Registration</h2>
          <p className="mt-2 text-sm text-slate-400">Create your administrative business credential</p>
        </div>

        {(uiError || error) && (
          <div className="rounded-lg bg-red-500/10 p-3 text-sm text-red-400 border border-red-500/20">
            {uiError || error}
          </div>
        )}

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-slate-300">Owner Name</label>
            <input
              type="text"
              required
              className="mt-1 block w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-white focus:border-brand focus:outline-hidden"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300">Business Email</label>
            <input
              type="email"
              required
              className="mt-1 block w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-white focus:border-brand focus:outline-hidden"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300">Contact Number</label>
            <input
              type="text"
              required
              className="mt-1 block w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-white focus:border-brand focus:outline-hidden"
              value={formData.phoneNumber}
              onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300">Password</label>
            <input
              type="password"
              required
              className="mt-1 block w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-white focus:border-brand focus:outline-hidden"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
          </div>

          <button
            type="submit"
            className="w-full mt-2 rounded-xl bg-brand py-3 text-sm font-semibold text-white transition-all hover:bg-brand-dark cursor-pointer shadow-xs"
          >
            Register Account
          </button>
        </form>

        <p className="text-center text-sm text-slate-400">
          Already registered?{' '}
          <Link to="/login" className="font-medium text-brand hover:underline">
            Log in here
          </Link>
        </p>
      </div>
    </div>
  );
}