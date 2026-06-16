import { Bookmark, Eye, Heart, MessageCircle } from 'lucide-react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Link, useParams } from 'react-router-dom';
import { articleApi } from '../../api/articleApi.js';
import CommentSection from '../../components/comment/CommentSection.jsx';
import ArticleCard from '../../components/article/ArticleCard.jsx';
import { ErrorState, LoadingState } from '../../components/common/StateViews.jsx';
import { compactNumber, formatDate } from '../../utils/formatters.js';
import { useAuth } from '../../contexts/AuthContext.jsx';

export default function ArticleDetailPage() {
  const { slug } = useParams();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const detail = useQuery({ queryKey: ['article', slug], queryFn: () => articleApi.detail(slug) });
  const article = detail.data?.data?.article;
  const related = detail.data?.data?.related ?? [];
  const like = useMutation({ mutationFn: () => articleApi.like(article.id), onSuccess: () => queryClient.invalidateQueries({ queryKey: ['article', slug] }) });
  const bookmark = useMutation({ mutationFn: () => articleApi.bookmark(article.id), onSuccess: () => queryClient.invalidateQueries({ queryKey: ['article', slug] }) });

  if (detail.isLoading) return <section className="mx-auto max-w-5xl px-4 py-10"><LoadingState /></section>;
  if (detail.isError) return <section className="mx-auto max-w-5xl px-4 py-10"><ErrorState message={detail.error.displayMessage} /></section>;

  return (
    <article>
      <header className="bg-white">
        <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center gap-2 text-sm font-semibold text-teal-700">
            <Link to={`/categories/${article.category?.slug}`}>{article.category?.name}</Link>
            <span className="text-slate-300">/</span>
            <span>{formatDate(article.published_at)}</span>
          </div>
          <h1 className="mt-4 text-4xl font-black leading-tight text-slate-950 sm:text-5xl">{article.title}</h1>
          <p className="mt-5 text-lg leading-8 text-slate-600">{article.excerpt}</p>
          <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-slate-500">
            <Link to={`/authors/${article.author?.username}`} className="font-semibold text-slate-800 hover:text-teal-700">{article.author?.name}</Link>
            <span>{article.read_time} menit baca</span>
            <span className="inline-flex items-center gap-1"><Eye size={16} />{compactNumber(article.view_count)}</span>
            <span className="inline-flex items-center gap-1"><MessageCircle size={16} />{compactNumber(article.comments_count)}</span>
          </div>
        </div>
        <img src={article.thumbnail} alt="" className="h-[420px] w-full object-cover" />
      </header>
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[minmax(0,1fr)_300px] lg:px-8">
        <div>
          <div className="prose-article rounded-lg bg-white p-6 shadow-sm ring-1 ring-slate-200" dangerouslySetInnerHTML={{ __html: article.content }} />
          <CommentSection article={article} />
        </div>
        <aside className="space-y-4">
          <div className="rounded-lg border border-slate-200 bg-white p-4">
            <p className="mb-3 text-sm font-bold text-slate-950">Interaksi</p>
            <div className="grid grid-cols-2 gap-2">
              <button disabled={!user || like.isPending} onClick={() => like.mutate()} className={`inline-flex items-center justify-center gap-2 rounded-md px-3 py-2 text-sm font-semibold ring-1 ${article.is_liked ? 'bg-rose-50 text-rose-700 ring-rose-200' : 'bg-white text-slate-700 ring-slate-200'} disabled:opacity-50`}>
                <Heart size={16} /> {compactNumber(article.likes_count)}
              </button>
              <button disabled={!user || bookmark.isPending} onClick={() => bookmark.mutate()} className={`inline-flex items-center justify-center gap-2 rounded-md px-3 py-2 text-sm font-semibold ring-1 ${article.is_bookmarked ? 'bg-amber-50 text-amber-700 ring-amber-200' : 'bg-white text-slate-700 ring-slate-200'} disabled:opacity-50`}>
                <Bookmark size={16} /> Simpan
              </button>
            </div>
          </div>
          <div className="rounded-lg border border-slate-200 bg-white p-4">
            <p className="mb-3 text-sm font-bold text-slate-950">Tag</p>
            <div className="flex flex-wrap gap-2">
              {article.tags?.map((tag) => (
                <Link key={tag.id} to={`/tags/${tag.slug}`} className="rounded-full bg-slate-100 px-3 py-1 text-sm font-semibold text-slate-700 hover:bg-teal-50 hover:text-teal-800">
                  {tag.name}
                </Link>
              ))}
            </div>
          </div>
        </aside>
      </div>
      {related.length ? (
        <section className="mx-auto max-w-7xl px-4 pb-14 sm:px-6 lg:px-8">
          <h2 className="mb-5 text-2xl font-black text-slate-950">Artikel Terkait</h2>
          <div className="grid gap-5 md:grid-cols-3">
            {related.map((item) => <ArticleCard key={item.id} article={item} />)}
          </div>
        </section>
      ) : null}
    </article>
  );
}
