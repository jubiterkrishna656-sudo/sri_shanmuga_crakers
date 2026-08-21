import axios from 'axios';

const API = axios.create({ baseURL: '/api' });

export const authAPI = {
  adminLogin: (data) => API.post('/auth/admin-login', data),
};

export const productAPI = {
  getAll: (params) => API.get('/products', { params }),
  getById: (id) => API.get(`/products/${id}`),
  getCategories: () => API.get('/products/categories'),
};

export const categoryAPI = {
  getAll: () => API.get('/categories'),
  create: (data) => API.post('/categories', data),
  update: (id, data) => API.put(`/categories/${id}`, data),
  delete: (id) => API.delete(`/categories/${id}`),
};

export const reviewAPI = {
  getByProduct: (id) => API.get(`/products/${id}/reviews`),
  add: (id, data) => API.post(`/products/${id}/reviews`, data),
  remove: (id, reviewId) => API.delete(`/products/${id}/reviews/${reviewId}`),
};

export const orderAPI = {
  place: (data) => API.post('/orders', data),
  getByPhone: (phone) => API.get(`/orders/phone/${encodeURIComponent(phone)}`),
};

export default API;
