import axios from "axios";
import { API_BASE_URL } from "../../constants/site";

/**
 * Centralized Axios instance for the entire application.
 * This is the single point of configuration for the future MongoDB Atlas
 * backed REST API. Swapping mock services for real network calls only
 * requires updating the service files inside `src/services/` — no
 * component code needs to change since components only ever talk to
 * the service layer.
 */
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("eduepic_token");
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  const lang = localStorage.getItem("eduepic_lang") || "en";
  config.headers = config.headers || {};
  (config.headers as Record<string, string>)["Accept-Language"] = lang;
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Centralized error handling / logging hook for the whole app.
    if (error.response?.status === 401) {
      localStorage.removeItem("eduepic_token");
    }
    return Promise.reject(error);
  }
);

export default apiClient;
