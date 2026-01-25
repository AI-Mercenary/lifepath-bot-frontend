import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api', // Backend URL from env or default to local
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to add auth token in future if needed
api.interceptors.request.use(
  async (config) => {
    // const token = await auth.currentUser?.getIdToken();
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
