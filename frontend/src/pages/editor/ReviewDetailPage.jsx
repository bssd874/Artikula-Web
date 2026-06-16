import { CheckCircle2, RotateCcw, XCircle } from 'lucide-react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { editorApi } from '../../api/articleApi.js';
import StatusBadge from '../../components/common/StatusBadge.jsx';
import { ErrorState, LoadingState } from '../../components/common/StateViews.jsx';

export default function ReviewDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [notes, setNotes] = useState('');
  const review = useQuery({ queryKey: ['review', id], queryFn: () => editorApi.review(id) });
  const approve = useMutation({ mutationFn: () => editorApi.approve(id, { notes }), onSuccess: () => navigate('/editor/reviews') });
  const revision = useMutation({ mutationFn: () => editorApi.revision(id, { notes }), onSuccess: () => navigate('/editor/reviews') });
  const reject = useMutation({ mutationFn: () => editorApi.reject(id, { notes }), onSuccess: () => navigate('/editor/reviews') });
  const article = review.data?.data;
  const error = approve.error || revision.error || reject.error;

  return (
    <section className="max-w-5xl">
      {review.isLoading ? <LoadingState /> : null}
      {review.isError ? <ErrorState message={review.error.displayMessage} /> : null}
      {error ? <ErrorState message={error.displayMessage} /> : null}
      {article ? (
        <>
          <div className="mb-6">
            <StatusBadge status={article.status} />
            <h1 className="mt-3 text-4xl font-black text-slate-950">{article.title}</h1>
            <p className="mt-3 leading-7 text-slate-600">{article.excerpt}</p>
          </div>
          {article.thumbnail ? <img src={article.thumbnail} alt="" className="mb-6 h-80 w-full rounded-lg object-cover" /> : null}
          <div className="prose-article rounded-lg border border-slate-200 bg-white p-6" dangerouslySetInnerHTML={{ __html: article.content }} />
          <div className="mt-6 rounded-lg border border-slate-200 bg-white p-5">
            <label className="block">
              <span className="text-sm font-semibold text-slate-700">Catatan review</span>
              <textarea value={notes} onChange={(event) => setNotes(event.target.value)} className="mt-1 min-h-28 w-full rounded-lg border border-slate-200 px-3 py-2 outline-none focus:border-teal-600" />
            </label>
            <div className="mt-4 flex flex-wrap gap-2">
              <button onClick={() => approve.mutate()} className="inline-flex items-center gap-2 rounded-md bg-emerald-600 px-4 py-2 text-sm font-bold text-white"><CheckCircle2 size={16} /> Setujui</button>
              <button onClick={() => revision.mutate()} className="inline-flex items-center gap-2 rounded-md bg-amber-500 px-4 py-2 text-sm font-bold text-slate-950"><RotateCcw size={16} /> Minta Revisi</button>
              <button onClick={() => reject.mutate()} className="inline-flex items-center gap-2 rounded-md bg-rose-600 px-4 py-2 text-sm font-bold text-white"><XCircle size={16} /> Tolak</button>
            </div>
          </div>
        </>
      ) : null}
    </section>
  );
}
