// axios.js content placeholder
// src/api/axios.js
import axios from "axios";

// const api = axios.create({
//   baseURL: import.meta.env.VITE_BACKEND_URL || "http://localhost:5000/api",
//   withCredentials: false // enable if you use cookies for auth
// });

// Determine base URL based on environment
const getBaseURL = () => {
  // If VITE_BACKEND_URL is explicitly set, use it
  if (import.meta.env.VITE_BACKEND_URL) {
    return import.meta.env.VITE_BACKEND_URL;
  }
  // Default to localhost in development, production URL in production
  return import.meta.env.MODE === "production" 
    ? "https://ahmedabad-career-hub.onrender.com/api"
    : "http://localhost:5000/api";
};

const api = axios.create({
  baseURL: getBaseURL(),
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
