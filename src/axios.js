import axios from 'axios';
import router from '@/router';
import { useAuthStore } from './stores/WebAuth';

axios.defaults.baseURL = import.meta.env.VITE_URI || 'http://localhost:8000';
axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*';
axios.defaults.headers.common['Accept'] = 'application/json';
axios.defaults.headers.common['Content-Type'] = 'application/json';
axios.defaults.headers.common['local'] = localStorage.getItem('appLang') || 'en';

// Request interceptor
axios.interceptors.request.use((config) => {
  try {
    const currentRoute = router.currentRoute.value;
    console.log(currentRoute);
    let token = null;
    if (currentRoute.path.startsWith('/admin')) {
      token = localStorage.getItem('token');
    } else {
      token = localStorage.getItem('webToken');
    }

    if (token) {
      try {
        const parsedToken = JSON.parse(token);
        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${parsedToken}`;
      } catch (error) {
        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

    config.headers = config.headers || {};
    config.headers.Accept = 'application/json';
    config.headers['Content-Type'] = 'application/json';
  } catch (error) {
    console.error('Request interceptor error:', error);
  }

  return config;
});

// Response interceptor
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    // Initialize authStore inside the interceptor
    const authStore = useAuthStore(); // This will work if called during runtime
    if (error.response?.status === 401) {
      const currentRoute = router.currentRoute.value;
      if (currentRoute.path.startsWith('/admin')) {
        localStorage.removeItem('adminToken');
        router.push({ name: 'login' });
      } else {
        authStore.clearAllData();
        router.push({ name: 'home' });
      }
    } else if (error.response?.status === 403) {
      router.push({ name: 'home' });
    }

    // Enhanced error logging
    if (error.response) {
      console.error('API Error:', {
        status: error.response.status,
        data: error.response.data,
        url: error.config?.url,
      });
    } else {
      console.error('API Error:', error.message);
    }

    return Promise.reject(error);
  }
);

export default axios;
