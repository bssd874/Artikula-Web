import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { adminApi } from '../../api/articleApi.js';
import { ErrorState, LoadingState } from '../../components/common/StateViews.jsx';

const roles = ['reader', 'writer', 'editor', 'admin'];

export default function AdminUsersPage() {
  const queryClient = useQueryClient();
  const users = useQuery({ queryKey: ['admin-users'], queryFn: () => adminApi.users() });
  const roleMutation = useMutation({ mutationFn: ({ id, role }) => adminApi.updateUserRole(id, { role }), onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-users'] }) });
  const statusMutation = useMutation({ mutationFn: ({ id, is_active }) => adminApi.updateUserStatus(id, { is_active }), onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-users'] }) });

  return (
    <section>
      <div className="mb-6">
        <p className="text-sm font-semibold text-teal-700">Administrator</p>
        <h1 className="text-3xl font-black text-slate-950">Pengguna</h1>
      </div>
      {users.isLoading ? <LoadingState /> : null}
      {users.isError ? <ErrorState message={users.error.displayMessage} /> : null}
      <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white">
        <table className="min-w-full divide-y divide-slate-200 text-sm">
          <thead className="bg-slate-50 text-left text-slate-500">
            <tr><th className="px-4 py-3">User</th><th className="px-4 py-3">Role</th><th className="px-4 py-3">Status</th><th className="px-4 py-3">Dibuat</th></tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {(users.data?.data ?? []).map((user) => (
              <tr key={user.id}>
                <td className="px-4 py-3"><p className="font-semibold text-slate-950">{user.name}</p><p className="text-slate-500">@{user.username}</p></td>
                <td className="px-4 py-3">
                  <select value={user.role} onChange={(event) => roleMutation.mutate({ id: user.id, role: event.target.value })} className="rounded-md border border-slate-200 px-2 py-1">
                    {roles.map((role) => <option key={role} value={role}>{role}</option>)}
                  </select>
                </td>
                <td className="px-4 py-3">
                  <label className="inline-flex items-center gap-2">
                    <input type="checkbox" checked={Boolean(user.is_active)} onChange={(event) => statusMutation.mutate({ id: user.id, is_active: event.target.checked })} className="h-4 w-4 accent-teal-700" />
                    <span>{user.is_active ? 'Aktif' : 'Nonaktif'}</span>
                  </label>
                </td>
                <td className="px-4 py-3 text-slate-500">{user.created_at?.slice(0, 10)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
