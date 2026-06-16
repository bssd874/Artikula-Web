import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { categoryApi, tagApi } from '../../api/categoryApi.js';
import { ErrorState, LoadingState } from '../../components/common/StateViews.jsx';

export default function CategoriesPage() {
  const categories = useQuery({ queryKey: ['categories'], queryFn: categoryApi.list });
  const tags = useQuery({ queryKey: ['tags'], queryFn: tagApi.list });

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8">
        <p className="text-sm font-semibold text-teal-700">Direktori</p>
        <h1 className="text-3xl font-black text-slate-950">Kategori dan Tag</h1>
      </div>
      {categories.isLoading ? <LoadingState /> : null}
      {categories.isError ? <ErrorState message={categories.error.displayMessage} /> : null}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {(categories.data?.data ?? []).map((category) => (
          <Link key={category.id} to={`/categories/${category.slug}`} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm hover:border-teal-300">
            <p className="text-lg font-bold text-slate-950">{category.name}</p>
            <p className="mt-2 text-sm leading-6 text-slate-500">{category.description}</p>
            <p className="mt-4 text-sm font-semibold text-teal-700">{category.articles_count ?? 0} artikel</p>
          </Link>
        ))}
      </div>
      <div className="mt-10 rounded-lg border border-slate-200 bg-white p-5">
        <h2 className="mb-4 text-xl font-black text-slate-950">Tag</h2>
        <div className="flex flex-wrap gap-2">
          {(tags.data?.data ?? []).map((tag) => (
            <Link key={tag.id} to={`/tags/${tag.slug}`} className="rounded-full bg-slate-100 px-3 py-1 text-sm font-semibold text-slate-700 hover:bg-amber-100 hover:text-amber-800">
              {tag.name} ({tag.articles_count ?? 0})
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
