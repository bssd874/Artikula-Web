import { Save } from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { userApi } from '../../api/userApi.js';
import { useAuth } from '../../contexts/AuthContext.jsx';

export default function ProfilePage() {
  const { user, refreshUser } = useAuth();
  const [form, setForm] = useState({ name: '', username: '', email: '', bio: '', phone: '', website: '' });
  const [message, setMessage] = useState('');
  const updateMutation = useMutation({
    mutationFn: (payload) => userApi.updateProfile(payload),
    onSuccess: async (response) => {
      setMessage(response.message);
      await refreshUser();
    },
  });

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name ?? '',
        username: user.username ?? '',
        email: user.email ?? '',
        bio: user.bio ?? '',
        phone: user.phone ?? '',
        website: user.website ?? '',
      });
    }
  }, [user]);

  const update = (field, value) => setForm((current) => ({ ...current, [field]: value }));

  return (
    <section className="max-w-3xl">
      <div className="mb-6">
        <p className="text-sm font-semibold text-teal-700">Akun</p>
        <h1 className="text-3xl font-black text-slate-950">Profil</h1>
      </div>
      {message ? <p className="mb-4 rounded-md bg-emerald-50 px-3 py-2 text-sm text-emerald-700">{message}</p> : null}
      {updateMutation.isError ? <p className="mb-4 rounded-md bg-rose-50 px-3 py-2 text-sm text-rose-700">{updateMutation.error.displayMessage}</p> : null}
      <form
        onSubmit={(event) => {
          event.preventDefault();
          updateMutation.mutate(form);
        }}
        className="space-y-4 rounded-lg border border-slate-200 bg-white p-5"
      >
        <div className="grid gap-4 md:grid-cols-2">
          <label className="block"><span className="text-sm font-semibold text-slate-700">Nama</span><input value={form.name} onChange={(event) => update('name', event.target.value)} className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 outline-none focus:border-teal-600" required /></label>
          <label className="block"><span className="text-sm font-semibold text-slate-700">Username</span><input value={form.username} onChange={(event) => update('username', event.target.value)} className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 outline-none focus:border-teal-600" required /></label>
          <label className="block"><span className="text-sm font-semibold text-slate-700">Email</span><input type="email" value={form.email} onChange={(event) => update('email', event.target.value)} className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 outline-none focus:border-teal-600" required /></label>
          <label className="block"><span className="text-sm font-semibold text-slate-700">Telepon</span><input value={form.phone ?? ''} onChange={(event) => update('phone', event.target.value)} className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 outline-none focus:border-teal-600" /></label>
        </div>
        <label className="block"><span className="text-sm font-semibold text-slate-700">Website</span><input value={form.website ?? ''} onChange={(event) => update('website', event.target.value)} className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 outline-none focus:border-teal-600" /></label>
        <label className="block"><span className="text-sm font-semibold text-slate-700">Bio</span><textarea value={form.bio ?? ''} onChange={(event) => update('bio', event.target.value)} className="mt-1 min-h-32 w-full rounded-lg border border-slate-200 px-3 py-2 outline-none focus:border-teal-600" /></label>
        <button disabled={updateMutation.isPending} className="inline-flex items-center gap-2 rounded-md bg-teal-700 px-4 py-2 text-sm font-bold text-white hover:bg-teal-800 disabled:opacity-50">
          <Save size={16} /> Simpan
        </button>
      </form>
    </section>
  );
}
