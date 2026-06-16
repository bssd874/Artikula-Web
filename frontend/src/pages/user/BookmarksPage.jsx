import { useQuery } from '@tanstack/react-query';
import { articleApi } from '../../api/articleApi.js';
import ArticleCard from '../../components/article/ArticleCard.jsx';
import { EmptyState, ErrorState, LoadingState } from '../../components/common/StateViews.jsx';

export default function BookmarksPage() {
  const bookmarks = useQuery({ queryKey: ['bookmarks'], queryFn: () => articleApi.bookmarks() });

  return (
    <section>
      <div className="mb-6">
        <p className="text-sm font-semibold text-teal-700">Pembaca</p>
        <h1 className="text-3xl font-black text-slate-950">Bookmark</h1>
      </div>
      {bookmarks.isLoading ? <LoadingState /> : null}
      {bookmarks.isError ? <ErrorState message={bookmarks.error.displayMessage} /> : null}
      {!bookmarks.isLoading && !bookmarks.isError && (bookmarks.data?.data ?? []).length === 0 ? <EmptyState title="Belum ada bookmark" /> : null}
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {(bookmarks.data?.data ?? []).map((article) => <ArticleCard key={article.id} article={article} />)}
      </div>
    </section>
  );
}
