import { BookOpenText } from 'lucide-react';
import { Link, Outlet } from 'react-router-dom';

export default function AuthLayout() {
  return (
    <div className="grid min-h-screen bg-white lg:grid-cols-[1fr_1.05fr]">
      <section className="relative hidden overflow-hidden bg-slate-950 lg:block">
        <img
          src="https://images.unsplash.com/photo-1495020689067-958852a7765e?auto=format&fit=crop&w=1400&q=80"
          alt=""
          className="h-full w-full object-cover opacity-70"
        />
        <div className="absolute inset-x-0 bottom-0 p-10 text-white">
          <Link to="/" className="mb-8 inline-flex items-center gap-2 text-lg font-black">
            <span className="flex h-9 w-9 items-center justify-center rounded-md bg-amber-400 text-slate-950">
              <BookOpenText size={20} />
            </span>
            Artikula
          </Link>
          <h1 className="max-w-xl text-4xl font-black leading-tight">Kelola artikel dari draft sampai publikasi.</h1>
        </div>
      </section>
      <main className="flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-md">
          <div className="mb-8 lg:hidden">
            <Link to="/" className="inline-flex items-center gap-2 text-lg font-black text-slate-950">
              <span className="flex h-9 w-9 items-center justify-center rounded-md bg-teal-700 text-white">
                <BookOpenText size={20} />
              </span>
              Artikula
            </Link>
          </div>
          <Outlet />
        </div>
      </main>
    </div>
  );
}
