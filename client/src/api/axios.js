// axios.js content placeholder
// src/api/axios.js
import axios from "axios";

// const api = axios.create({
//   baseURL: import.meta.env.VITE_BACKEND_URL || "http://localhost:5000/api",
//   withCredentials: false // enable if you use cookies for auth
// });

const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL || "https://ahmedabad-career-hub.onrender.com/api",
  withCredentials: false // enable if you use cookies for auth
});


// Optionally: attach token to all requests automatically
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Optionally: intercept errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Optionally handle auth expiration/logouts here
    return Promise.reject(error);
  }
);

export default api;
