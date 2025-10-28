import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL || import.meta.env.VITE_API_URL || "https://cryptoalarm.onrender.com",
});

// Request interceptor for adding auth headers
api.interceptors.request.use(
  (config) => {
    // You can add authorization headers here if needed
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle common errors here
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export default api;