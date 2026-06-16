import api from './axiosInstance.js';

const data = (request) => request.then((res) => res.data);

export const articleApi = {
  list: (params) => data(api.get('/articles', { params })),
  detail: (slug) => data(api.get(`/articles/${slug}`)),
  category: (slug) => data(api.get(`/categories/${slug}`)),
  tag: (slug) => data(api.get(`/tags/${slug}`)),
  author: (username) => data(api.get(`/authors/${username}`)),
  comments: (articleId) => data(api.get(`/articles/${articleId}/comments`)),
  createComment: (articleId, payload) => data(api.post(`/articles/${articleId}/comments`, payload)),
  updateComment: (commentId, payload) => data(api.put(`/comments/${commentId}`, payload)),
  deleteComment: (commentId) => data(api.delete(`/comments/${commentId}`)),
  like: (articleId) => data(api.post(`/articles/${articleId}/like`)),
  bookmark: (articleId) => data(api.post(`/articles/${articleId}/bookmark`)),
  bookmarks: (params) => data(api.get('/bookmarks', { params })),
  myComments: (params) => data(api.get('/my-comments', { params })),
  report: (payload) => data(api.post('/reports', payload)),
};

export const writerApi = {
  dashboard: () => data(api.get('/writer/dashboard')),
  articles: (params) => data(api.get('/my/articles', { params })),
  article: (id) => data(api.get(`/my/articles/${id}`)),
  create: (payload) => data(api.post('/articles', payload)),
  update: (id, payload) => data(api.put(`/my/articles/${id}`, payload)),
  remove: (id) => data(api.delete(`/my/articles/${id}`)),
  submit: (id) => data(api.post(`/my/articles/${id}/submit`)),
  archive: (id) => data(api.post(`/my/articles/${id}/archive`)),
};

export const editorApi = {
  dashboard: () => data(api.get('/editor/dashboard')),
  reviews: (params) => data(api.get('/editor/reviews', { params })),
  review: (id) => data(api.get(`/editor/reviews/${id}`)),
  approve: (id, payload) => data(api.post(`/editor/reviews/${id}/approve`, payload)),
  revision: (id, payload) => data(api.post(`/editor/reviews/${id}/revision`, payload)),
  reject: (id, payload) => data(api.post(`/editor/reviews/${id}/reject`, payload)),
};

export const adminApi = {
  dashboard: () => data(api.get('/admin/dashboard')),
  users: (params) => data(api.get('/admin/users', { params })),
  updateUserRole: (id, payload) => data(api.patch(`/admin/users/${id}/role`, payload)),
  updateUserStatus: (id, payload) => data(api.patch(`/admin/users/${id}/status`, payload)),
  articles: (params) => data(api.get('/admin/articles', { params })),
  updateArticleStatus: (id, payload) => data(api.patch(`/admin/articles/${id}/status`, payload)),
  deleteArticle: (id) => data(api.delete(`/admin/articles/${id}`)),
  reports: (params) => data(api.get('/admin/reports', { params })),
  updateReport: (id, payload) => data(api.patch(`/admin/reports/${id}`, payload)),
  comments: (params) => data(api.get('/admin/comments', { params })),
  hideComment: (id) => data(api.patch(`/admin/comments/${id}/hide`)),
};
