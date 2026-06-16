import { MessageSquare, Send } from 'lucide-react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { articleApi } from '../../api/articleApi.js';
import { useAuth } from '../../contexts/AuthContext.jsx';
import { formatDate } from '../../utils/formatters.js';
import { EmptyState, ErrorState, LoadingState } from '../common/StateViews.jsx';

export default function CommentSection({ article }) {
  const { user } = useAuth();
  const [content, setContent] = useState('');
  const queryClient = useQueryClient();
  const comments = useQuery({
    queryKey: ['comments', article.id],
    queryFn: () => articleApi.comments(article.id),
  });
  const mutation = useMutation({
    mutationFn: () => articleApi.createComment(article.id, { content }),
    onSuccess: () => {
      setContent('');
      queryClient.invalidateQueries({ queryKey: ['comments', article.id] });
      queryClient.invalidateQueries({ queryKey: ['article', article.slug] });
    },
  });

  return (
    <section className="mt-12">
      <div className="mb-4 flex items-center gap-2">
        <MessageSquare size={20} className="text-teal-700" />
        <h2 className="text-xl font-bold text-slate-950">Komentar</h2>
      </div>
      {user && article.allow_comments ? (
        <form
          onSubmit={(event) => {
            event.preventDefault();
            if (content.trim()) mutation.mutate();
          }}
          className="mb-6 rounded-lg border border-slate-200 bg-white p-4"
        >
          <textarea value={content} onChange={(event) => setContent(event.target.value)} maxLength={1000} className="min-h-28 w-full rounded-lg border border-slate-200 px-3 py-2 outline-none focus:border-teal-600" required />
          <div className="mt-3 flex justify-end">
            <button disabled={mutation.isPending} className="inline-flex items-center gap-2 rounded-md bg-teal-700 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-800 disabled:opacity-50">
              <Send size={16} /> Kirim
            </button>
          </div>
        </form>
      ) : null}
      {comments.isLoading ? <LoadingState /> : null}
      {comments.isError ? <ErrorState message={comments.error.displayMessage} /> : null}
      {!comments.isLoading && !comments.isError && (comments.data?.data ?? []).length === 0 ? (
        <EmptyState title="Belum ada komentar" description="Komentar pertama akan tampil di sini." />
      ) : null}
      <div className="space-y-3">
        {(comments.data?.data ?? []).map((comment) => (
          <div key={comment.id} className="rounded-lg border border-slate-200 bg-white p-4">
            <div className="flex items-center justify-between gap-3">
              <p className="font-semibold text-slate-900">{comment.user?.name}</p>
              <p className="text-xs text-slate-500">{formatDate(comment.created_at)}</p>
            </div>
            <p className="mt-2 text-sm leading-6 text-slate-600">{comment.content}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
