import { useMutation, useQuery } from '@tanstack/react-query';
import { useNavigate, useParams } from 'react-router-dom';
import { writerApi } from '../../api/articleApi.js';
import ArticleForm from '../../components/form/ArticleForm.jsx';
import { ErrorState, LoadingState } from '../../components/common/StateViews.jsx';

export default function ArticleEditorPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);
  const article = useQuery({ queryKey: ['writer-article', id], queryFn: () => writerApi.article(id), enabled: isEdit });
  const save = useMutation({
    mutationFn: (payload) => (isEdit ? writerApi.update(id, payload) : writerApi.create(payload)),
    onSuccess: (response) => navigate(isEdit ? '/writer/articles' : `/writer/articles/${response.data.id}/edit`),
  });
  const submit = useMutation({
    mutationFn: () => writerApi.submit(id),
    onSuccess: () => navigate('/writer/articles'),
  });

  return (
    <section>
      <div className="mb-6">
        <p className="text-sm font-semibold text-teal-700">Penulis</p>
        <h1 className="text-3xl font-black text-slate-950">{isEdit ? 'Edit Artikel' : 'Artikel Baru'}</h1>
      </div>
      {article.isLoading ? <LoadingState /> : null}
      {article.isError ? <ErrorState message={article.error.displayMessage} /> : null}
      {save.isError ? <ErrorState message={save.error.displayMessage} /> : null}
      {(!isEdit || article.data?.data) ? (
        <ArticleForm
          initialValue={article.data?.data}
          saving={save.isPending || submit.isPending}
          onSubmit={(payload) => save.mutate(payload)}
          onSubmitForReview={isEdit ? () => submit.mutate() : null}
        />
      ) : null}
    </section>
  );
}
