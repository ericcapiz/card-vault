import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "https://card-vault.fly.dev",
  headers: {
    "Content-Type": "application/json",
  },
});

// Add a request interceptor to add the auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem("token");
      // You might want to dispatch a logout action here
    }
    return Promise.reject(error);
  }
);

export default api;
