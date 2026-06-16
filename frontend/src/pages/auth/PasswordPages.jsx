import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { authApi } from '../../api/authApi.js';

export function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  return (
    <form
      onSubmit={async (event) => {
        event.preventDefault();
        const response = await authApi.forgotPassword({ email });
        setMessage(response.message);
      }}
      className="space-y-4"
    >
      <h1 className="text-3xl font-black text-slate-950">Lupa Password</h1>
      {message ? <p className="rounded-md bg-emerald-50 px-3 py-2 text-sm text-emerald-700">{message}</p> : null}
      <label className="block">
        <span className="text-sm font-semibold text-slate-700">Email</span>
        <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 outline-none focus:border-teal-600" required />
      </label>
      <button className="w-full rounded-md bg-teal-700 px-4 py-3 text-sm font-bold text-white">Kirim Link</button>
    </form>
  );
}

export function ResetPasswordPage() {
  const [params] = useSearchParams();
  const [form, setForm] = useState({ email: params.get('email') ?? '', token: params.get('token') ?? '', password: '', password_confirmation: '' });
  const [message, setMessage] = useState('');

  const update = (field, value) => setForm((current) => ({ ...current, [field]: value }));

  return (
    <form
      onSubmit={async (event) => {
        event.preventDefault();
        const response = await authApi.resetPassword(form);
        setMessage(response.message);
      }}
      className="space-y-4"
    >
      <h1 className="text-3xl font-black text-slate-950">Reset Password</h1>
      {message ? <p className="rounded-md bg-emerald-50 px-3 py-2 text-sm text-emerald-700">{message}</p> : null}
      <label className="block"><span className="text-sm font-semibold text-slate-700">Email</span><input type="email" value={form.email} onChange={(event) => update('email', event.target.value)} className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 outline-none focus:border-teal-600" required /></label>
      <label className="block"><span className="text-sm font-semibold text-slate-700">Token</span><input value={form.token} onChange={(event) => update('token', event.target.value)} className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 outline-none focus:border-teal-600" required /></label>
      <label className="block"><span className="text-sm font-semibold text-slate-700">Password</span><input type="password" value={form.password} onChange={(event) => update('password', event.target.value)} className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 outline-none focus:border-teal-600" required minLength={8} /></label>
      <label className="block"><span className="text-sm font-semibold text-slate-700">Konfirmasi password</span><input type="password" value={form.password_confirmation} onChange={(event) => update('password_confirmation', event.target.value)} className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 outline-none focus:border-teal-600" required minLength={8} /></label>
      <button className="w-full rounded-md bg-teal-700 px-4 py-3 text-sm font-bold text-white">Reset</button>
    </form>
  );
}
