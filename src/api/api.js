import axios from "axios";
import { handleError } from "../utils";

const api = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  timeout: 30000,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = token;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 403) {
      handleError("Session expired. Please log in again.");
      setTimeout(() => {
        const theme = localStorage.getItem("theme");

        // clear everything
        localStorage.clear();

        // restore theme
        if (theme) {
          localStorage.setItem("theme", theme);
        }
        window.location.href = "/login";
      }, 1000);
    }
    return Promise.reject(error);
  }
);

export default api;
