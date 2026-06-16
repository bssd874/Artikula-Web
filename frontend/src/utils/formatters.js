export function formatDate(value) {
  if (!value) return '-';

  return new Intl.DateTimeFormat('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(value));
}

export function compactNumber(value) {
  return new Intl.NumberFormat('id-ID', {
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(value ?? 0);
}

export function statusLabel(status) {
  const labels = {
    draft: 'Draft',
    pending_review: 'Review',
    revision: 'Revisi',
    published: 'Published',
    rejected: 'Ditolak',
    archived: 'Arsip',
    visible: 'Visible',
    hidden: 'Hidden',
    reported: 'Reported',
    pending: 'Pending',
    reviewed: 'Reviewed',
    resolved: 'Resolved',
  };

  return labels[status] ?? status;
}
