import { Bookmark, Heart, MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { compactNumber, formatDate } from '../../utils/formatters.js';
import StatusBadge from '../common/StatusBadge.jsx';

export default function ArticleCard({ article, showStatus = false }) {
  return (
    <article className="flex h-full flex-col overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <Link to={`/articles/${article.slug}`} className="block">
        <img
          src={article.thumbnail || 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&w=900&q=80'}
          alt=""
          className="h-48 w-full object-cover"
          loading="lazy"
        />
      </Link>
      <div className="flex flex-1 flex-col p-5">
        <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-slate-500">
          <span>{article.category?.name ?? 'Tanpa kategori'}</span>
          <span aria-hidden="true">/</span>
          <span>{formatDate(article.published_at ?? article.created_at)}</span>
          {showStatus ? <StatusBadge status={article.status} /> : null}
        </div>
        <Link to={`/articles/${article.slug}`} className="mt-3 block text-xl font-bold leading-tight text-slate-950 hover:text-teal-700">
          {article.title}
        </Link>
        <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-600">{article.excerpt}</p>
        <div className="mt-auto flex items-center justify-between gap-3 border-t border-slate-100 pt-4 text-sm text-slate-500">
          <Link to={`/authors/${article.author?.username}`} className="font-medium text-slate-700 hover:text-teal-700">
            {article.author?.name ?? 'Penulis'}
          </Link>
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1"><Heart size={15} />{compactNumber(article.likes_count)}</span>
            <span className="inline-flex items-center gap-1"><MessageCircle size={15} />{compactNumber(article.comments_count)}</span>
            <span className="inline-flex items-center gap-1"><Bookmark size={15} />{compactNumber(article.bookmarks_count)}</span>
          </div>
        </div>
      </div>
    </article>
  );
}
