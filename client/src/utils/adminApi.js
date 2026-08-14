import axios from 'axios';
import { navigate } from './navigate';

const AdminAPI = axios.create({ baseURL: '/api' });

AdminAPI.interceptors.request.use((req) => {
  const token = localStorage.getItem('adminToken');
  if (token) req.headers.Authorization = `Bearer ${token}`;
  return req;
});

AdminAPI.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('adminToken');
      navigate('/admin/login');
    }
    return Promise.reject(err);
  }
);

export const adminApi = {
  getDashboard: () => AdminAPI.get('/admin/dashboard'),
  getReports: () => AdminAPI.get('/admin/reports'),
  getProfile: () => AdminAPI.get('/auth/profile'),
  getAllOrders: () => AdminAPI.get('/orders/all'),
  updateOrderStatus: (id, data) => AdminAPI.put(`/orders/status/${id}`, data),
  createProduct: (data) => AdminAPI.post('/products', data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  updateProduct: (id, data) => AdminAPI.put(`/products/${id}`, data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  deleteProduct: (id) => AdminAPI.delete(`/products/${id}`),
};

export default AdminAPI;
