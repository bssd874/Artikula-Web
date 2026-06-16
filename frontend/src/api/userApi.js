import api from './axiosInstance.js';

export const userApi = {
  profile: () => api.get('/profile').then((res) => res.data),
  updateProfile: (payload) => api.put('/profile', payload).then((res) => res.data),
};
