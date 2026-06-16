import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { articleApi } from '../../api/articleApi.js';
import ArticleCard from '../../components/article/ArticleCard.jsx';
import { EmptyState, ErrorState, LoadingState } from '../../components/common/StateViews.jsx';

export function CategoryDetailPage() {
  const { slug } = useParams();
  const query = useQuery({ queryKey: ['category', slug], queryFn: () => articleApi.category(slug) });
  const title = query.data?.data?.category?.name;
  const description = query.data?.data?.category?.description;
  const articles = query.data?.data?.articles ?? [];

  return <CollectionView loading={query.isLoading} error={query.error} title={title} eyebrow="Kategori" description={description} articles={articles} />;
}

export function TagDetailPage() {
  const { slug } = useParams();
  const query = useQuery({ queryKey: ['tag', slug], queryFn: () => articleApi.tag(slug) });
  const title = query.data?.data?.tag?.name;
  const articles = query.data?.data?.articles ?? [];

  return <CollectionView loading={query.isLoading} error={query.error} title={title} eyebrow="Tag" articles={articles} />;
}

export function AuthorPage() {
  const { username } = useParams();
  const query = useQuery({ queryKey: ['author', username], queryFn: () => articleApi.author(username) });
  const author = query.data?.data?.author;
  const articles = query.data?.data?.articles ?? [];

  return <CollectionView loading={query.isLoading} error={query.error} title={author?.name} eyebrow={`@${author?.username ?? username}`} description={author?.bio} articles={articles} />;
}

function CollectionView({ loading, error, title, eyebrow, description, articles }) {
  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8">
        <p className="text-sm font-semibold text-teal-700">{eyebrow}</p>
        <h1 className="text-3xl font-black text-slate-950">{title ?? 'Memuat'}</h1>
        {description ? <p className="mt-2 max-w-2xl leading-7 text-slate-600">{description}</p> : null}
      </div>
      {loading ? <LoadingState /> : null}
      {error ? <ErrorState message={error.displayMessage} /> : null}
      {!loading && !error && articles.length === 0 ? <EmptyState title="Belum ada artikel" /> : null}
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {articles.map((article) => <ArticleCard key={article.id} article={article} />)}
      </div>
    </section>
  );
}
