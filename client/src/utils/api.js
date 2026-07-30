import axios from 'axios';

const API = axios.create({ baseURL: '/api' });

API.interceptors.request.use((req) => {
  const token = localStorage.getItem('token');
  if (token) req.headers.Authorization = `Bearer ${token}`;
  return req;
});

API.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      if (window.location.pathname !== '/login') window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

export const authAPI = {
  register: (data) => API.post('/auth/register', data),
  login: (data) => API.post('/auth/login', data),
  adminLogin: (data) => API.post('/auth/admin-login', data),
  getProfile: () => API.get('/auth/profile'),
  updateProfile: (data) => API.put('/auth/profile', data),
};

export const productAPI = {
  getAll: (params) => API.get('/products', { params }),
  getAllPaginated: (params) => API.get('/products', { params }).then(res => res.data),
  getById: (id) => API.get(`/products/${id}`),
  create: (data) => API.post('/products', data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  update: (id, data) => API.put(`/products/${id}`, data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  delete: (id) => API.delete(`/products/${id}`),
  getCategories: () => API.get('/products/categories'),
};

export const cartAPI = {
  get: () => API.get('/cart'),
  add: (data) => API.post('/cart', data),
  update: (data) => API.put('/cart', data),
  remove: (id) => API.delete(`/cart/${id}`),
  clear: () => API.delete('/cart'),
};

export const orderAPI = {
  place: (data) => API.post('/orders', data),
  getMyOrders: () => API.get('/orders/myorders'),
  getAll: () => API.get('/orders/all'),
  updateStatus: (id, data) => API.put(`/orders/status/${id}`, data),
};

export const userAPI = {
  getAll: () => API.get('/users'),
  toggleBlock: (id) => API.put(`/users/block/${id}`),
};

export const adminAPI = {
  getDashboard: () => API.get('/admin/dashboard'),
};

export default API;
