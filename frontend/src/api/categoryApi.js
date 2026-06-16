import api from './axiosInstance.js';

const data = (request) => request.then((res) => res.data);

export const categoryApi = {
  list: () => data(api.get('/categories')),
  create: (payload) => data(api.post('/admin/categories', payload)),
  update: (id, payload) => data(api.put(`/admin/categories/${id}`, payload)),
  remove: (id) => data(api.delete(`/admin/categories/${id}`)),
};

export const tagApi = {
  list: () => data(api.get('/tags')),
  create: (payload) => data(api.post('/admin/tags', payload)),
  update: (id, payload) => data(api.put(`/admin/tags/${id}`, payload)),
  remove: (id) => data(api.delete(`/admin/tags/${id}`)),
};
