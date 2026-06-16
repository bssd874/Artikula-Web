import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext.jsx';

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', username: '', email: '', password: '', password_confirmation: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const update = (field, value) => setForm((current) => ({ ...current, [field]: value }));

  const submit = async (event) => {
    event.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register(form);
      navigate('/profile', { replace: true });
    } catch (err) {
      setError(err.displayMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submit} className="space-y-4">
      <div>
        <p className="text-sm font-semibold text-teal-700">Akun baru</p>
        <h1 className="mt-1 text-3xl font-black text-slate-950">Register</h1>
      </div>
      {error ? <p className="rounded-md bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</p> : null}
      <label className="block"><span className="text-sm font-semibold text-slate-700">Nama</span><input value={form.name} onChange={(event) => update('name', event.target.value)} className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 outline-none focus:border-teal-600" required /></label>
      <label className="block"><span className="text-sm font-semibold text-slate-700">Username</span><input value={form.username} onChange={(event) => update('username', event.target.value)} className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 outline-none focus:border-teal-600" required /></label>
      <label className="block"><span className="text-sm font-semibold text-slate-700">Email</span><input type="email" value={form.email} onChange={(event) => update('email', event.target.value)} className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 outline-none focus:border-teal-600" required /></label>
      <label className="block"><span className="text-sm font-semibold text-slate-700">Password</span><input type="password" value={form.password} onChange={(event) => update('password', event.target.value)} className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 outline-none focus:border-teal-600" required minLength={8} /></label>
      <label className="block"><span className="text-sm font-semibold text-slate-700">Konfirmasi password</span><input type="password" value={form.password_confirmation} onChange={(event) => update('password_confirmation', event.target.value)} className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 outline-none focus:border-teal-600" required minLength={8} /></label>
      <button disabled={loading} className="w-full rounded-md bg-teal-700 px-4 py-3 text-sm font-bold text-white hover:bg-teal-800 disabled:opacity-50">Register</button>
      <p className="text-sm text-slate-500">Sudah punya akun? <Link to="/login" className="font-semibold text-teal-700">Login</Link></p>
    </form>
  );
}
