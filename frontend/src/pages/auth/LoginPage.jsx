import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext.jsx';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ login: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    setError('');
    setLoading(true);
    try {
      const response = await login(form);
      navigate(location.state?.from?.pathname ?? defaultPath(response.data.user.role), { replace: true });
    } catch (err) {
      setError(err.displayMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submit} className="space-y-4">
      <div>
        <p className="text-sm font-semibold text-teal-700">Masuk</p>
        <h1 className="mt-1 text-3xl font-black text-slate-950">Login Artikula</h1>
      </div>
      {error ? <p className="rounded-md bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</p> : null}
      <label className="block">
        <span className="text-sm font-semibold text-slate-700">Email atau username</span>
        <input value={form.login} onChange={(event) => setForm({ ...form, login: event.target.value })} className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 outline-none focus:border-teal-600" required />
      </label>
      <label className="block">
        <span className="text-sm font-semibold text-slate-700">Password</span>
        <input type="password" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 outline-none focus:border-teal-600" required />
      </label>
      <button disabled={loading} className="w-full rounded-md bg-teal-700 px-4 py-3 text-sm font-bold text-white hover:bg-teal-800 disabled:opacity-50">Login</button>
      <div className="flex justify-between text-sm">
        <Link to="/forgot-password" className="font-semibold text-teal-700">Lupa password</Link>
        <Link to="/register" className="font-semibold text-slate-700">Buat akun</Link>
      </div>
    </form>
  );
}

function defaultPath(role) {
  if (role === 'admin') return '/admin/dashboard';
  if (role === 'editor') return '/editor/dashboard';
  if (role === 'writer') return '/writer/dashboard';

  return '/profile';
}
