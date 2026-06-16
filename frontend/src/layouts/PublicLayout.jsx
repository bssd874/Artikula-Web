import { BookOpen, LogIn, Menu, PenLine, Search, UserRound } from 'lucide-react';
import { useState } from 'react';
import { Link, NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';

const navLink = ({ isActive }) =>
  `rounded-md px-3 py-2 text-sm font-medium ${isActive ? 'bg-teal-50 text-teal-800' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-950'}`;

export default function PublicLayout() {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#f5f7f6]">
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
          <Link to="/" className="flex items-center gap-2 text-lg font-black tracking-tight text-slate-950">
            <span className="flex h-9 w-9 items-center justify-center rounded-md bg-teal-700 text-white">
              <BookOpen size={20} />
            </span>
            Artikula
          </Link>
          <nav className="hidden items-center gap-1 md:flex">
            <NavLink className={navLink} to="/articles">Artikel</NavLink>
            <NavLink className={navLink} to="/categories">Kategori</NavLink>
            <NavLink className={navLink} to="/search">Cari</NavLink>
          </nav>
          <div className="hidden items-center gap-2 md:flex">
            {user ? (
              <>
                <Link to={user.role === 'admin' ? '/admin/dashboard' : user.role === 'editor' ? '/editor/dashboard' : user.role === 'writer' ? '/writer/dashboard' : '/profile'} className="inline-flex items-center gap-2 rounded-md bg-slate-950 px-3 py-2 text-sm font-semibold text-white">
                  <UserRound size={16} /> Dashboard
                </Link>
                <button onClick={logout} className="rounded-md border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50">Logout</button>
              </>
            ) : (
              <>
                <Link to="/login" className="inline-flex items-center gap-2 rounded-md border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50">
                  <LogIn size={16} /> Login
                </Link>
                <Link to="/register" className="inline-flex items-center gap-2 rounded-md bg-teal-700 px-3 py-2 text-sm font-semibold text-white hover:bg-teal-800">
                  <PenLine size={16} /> Register
                </Link>
              </>
            )}
          </div>
          <button className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-slate-200 md:hidden" onClick={() => setOpen((value) => !value)} aria-label="Menu">
            <Menu size={19} />
          </button>
        </div>
        {open ? (
          <div className="border-t border-slate-200 bg-white px-4 py-3 md:hidden">
            <NavLink className={navLink} to="/articles">Artikel</NavLink>
            <NavLink className={navLink} to="/categories">Kategori</NavLink>
            <NavLink className={navLink} to="/search">Cari</NavLink>
            <Link to="/login" className="mt-2 flex items-center gap-2 rounded-md bg-teal-700 px-3 py-2 text-sm font-semibold text-white">
              <Search size={16} /> Mulai
            </Link>
          </div>
        ) : null}
      </header>
      <main>
        <Outlet />
      </main>
      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-8 text-sm text-slate-500 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
          <p>Artikula - Platform publikasi artikel berbasis React, Laravel, dan PostgreSQL.</p>
          <p>API v1 / Laravel Sanctum</p>
        </div>
      </footer>
    </div>
  );
}
