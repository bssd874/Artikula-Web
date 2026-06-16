import { useQuery } from '@tanstack/react-query';
import { Link, useParams } from 'react-router-dom';
import { writerApi } from '../../api/articleApi.js';
import StatusBadge from '../../components/common/StatusBadge.jsx';
import { ErrorState, LoadingState } from '../../components/common/StateViews.jsx';

export default function ArticlePreviewPage() {
  const { id } = useParams();
  const article = useQuery({ queryKey: ['writer-article', id], queryFn: () => writerApi.article(id) });
  const data = article.data?.data;

  return (
    <section className="max-w-5xl">
      {article.isLoading ? <LoadingState /> : null}
      {article.isError ? <ErrorState message={article.error.displayMessage} /> : null}
      {data ? (
        <>
          <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
            <div>
              <StatusBadge status={data.status} />
              <h1 className="mt-3 text-4xl font-black text-slate-950">{data.title}</h1>
              <p className="mt-3 text-lg leading-8 text-slate-600">{data.excerpt}</p>
            </div>
            <Link to={`/writer/articles/${data.id}/edit`} className="rounded-md bg-teal-700 px-4 py-2 text-sm font-bold text-white">Edit</Link>
          </div>
          {data.thumbnail ? <img src={data.thumbnail} alt="" className="mb-6 h-80 w-full rounded-lg object-cover" /> : null}
          <div className="prose-article rounded-lg border border-slate-200 bg-white p-6" dangerouslySetInnerHTML={{ __html: data.content }} />
        </>
      ) : null}
    </section>
  );
}
