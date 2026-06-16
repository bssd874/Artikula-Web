import { BarChart3, BookOpenText, FileCheck2, FolderTree, Home, LogOut, MessageSquare, Tags, UsersRound } from 'lucide-react';
import { Link, NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';

const links = {
  reader: [
    ['Profil', '/profile', Home],
    ['Bookmark', '/bookmarks', BookOpenText],
    ['Komentar', '/my-comments', MessageSquare],
  ],
  writer: [
    ['Dashboard', '/writer/dashboard', BarChart3],
    ['Artikel Saya', '/writer/articles', BookOpenText],
    ['Statistik', '/writer/statistics', BarChart3],
  ],
  editor: [
    ['Dashboard', '/editor/dashboard', BarChart3],
    ['Review', '/editor/reviews', FileCheck2],
  ],
  admin: [
    ['Dashboard', '/admin/dashboard', BarChart3],
    ['Pengguna', '/admin/users', UsersRound],
    ['Artikel', '/admin/articles', BookOpenText],
    ['Kategori', '/admin/categories', FolderTree],
    ['Tag', '/admin/tags', Tags],
    ['Komentar', '/admin/comments', MessageSquare],
    ['Laporan', '/admin/reports', FileCheck2],
  ],
};

export default function DashboardLayout() {
  const { user, logout } = useAuth();
  const roleLinks = links[user?.role] ?? links.reader;

  return (
    <div className="min-h-screen bg-[#f5f7f6]">
      <aside className="fixed inset-y-0 left-0 hidden w-64 border-r border-slate-200 bg-white p-4 lg:block">
        <Link to="/" className="flex items-center gap-2 px-2 text-lg font-black text-slate-950">
          <span className="flex h-9 w-9 items-center justify-center rounded-md bg-teal-700 text-white">
            <BookOpenText size={20} />
          </span>
          Artikula
        </Link>
        <nav className="mt-8 space-y-1">
          {roleLinks.map(([label, href, Icon]) => (
            <NavLink key={href} to={href} className={({ isActive }) => `flex items-center gap-3 rounded-md px-3 py-2 text-sm font-semibold ${isActive ? 'bg-teal-50 text-teal-800' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-950'}`}>
              <Icon size={17} /> {label}
            </NavLink>
          ))}
        </nav>
        <button onClick={logout} className="absolute bottom-4 left-4 right-4 flex items-center justify-center gap-2 rounded-md border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50">
          <LogOut size={16} /> Logout
        </button>
      </aside>
      <div className="lg:pl-64">
        <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/95 px-4 py-3 backdrop-blur sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm text-slate-500">Masuk sebagai {user?.role}</p>
              <h1 className="text-lg font-bold text-slate-950">{user?.name}</h1>
            </div>
            <Link to="/" className="rounded-md border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50">Lihat situs</Link>
          </div>
          <nav className="mt-3 flex gap-2 overflow-x-auto lg:hidden">
            {roleLinks.map(([label, href]) => (
              <NavLink key={href} to={href} className={({ isActive }) => `shrink-0 rounded-md px-3 py-2 text-sm font-semibold ${isActive ? 'bg-teal-50 text-teal-800' : 'bg-white text-slate-600'}`}>
                {label}
              </NavLink>
            ))}
          </nav>
        </header>
        <main className="px-4 py-6 sm:px-6 lg:px-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
