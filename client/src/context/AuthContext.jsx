import { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../utils/api';
import { adminApi } from '../utils/adminApi';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [adminUser, setAdminUser] = useState(null);
  const [adminToken, setAdminToken] = useState(localStorage.getItem('adminToken'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (adminToken) {
      let active = true;
      adminApi.getProfile()
        .then(res => { if (active && res.data.role === 'admin') setAdminUser(res.data); })
        .catch(() => { if (active) { localStorage.removeItem('adminToken'); setAdminToken(null); } })
        .finally(() => { if (active) setLoading(false); });
      return () => { active = false; };
    }
    setLoading(false);
  }, [adminToken]);

  const adminLogin = async (data) => {
    const res = await authAPI.adminLogin(data);
    localStorage.setItem('adminToken', res.data.token);
    sessionStorage.setItem('admin_splash_login', '1');
    setAdminToken(res.data.token);
    setAdminUser(res.data.user);
    return res.data;
  };

  const adminLogout = () => {
    localStorage.removeItem('adminToken');
    setAdminToken(null);
    setAdminUser(null);
  };

  return (
    <AuthContext.Provider value={{ loading, adminUser, adminToken, adminLogin, adminLogout }}>
      {children}
    </AuthContext.Provider>
  );
};
