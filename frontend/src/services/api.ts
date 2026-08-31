import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api/v1";

/**
 * Centralized Axios instance for the entire application.
 * This is the single point of configuration for the REST API.
 */
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 95000,
  // ✅ REMOVED default Content-Type header - let browser handle it
});

// Request interceptor - Add auth token and language
apiClient.interceptors.request.use((config) => {
  // Add auth token
  const token = localStorage.getItem("eduepic_token");
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  // Add language preference
  const lang = localStorage.getItem("eduepic_lang") || "en";
  config.headers = config.headers || {};
  (config.headers as Record<string, string>)["Accept-Language"] = lang;

  // ✅ IMPORTANT: If data is FormData, do NOT set Content-Type
  // The browser will set it automatically with the correct boundary
  if (config.data instanceof FormData) {
    delete config.headers["Content-Type"];
  } else {
    // Only set Content-Type for non-FormData requests
    config.headers["Content-Type"] = "application/json";
  }
  
  return config;
});

// Response interceptor - Handle errors globally
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle 401 Unauthorized
    if (error.response?.status === 401) {
      localStorage.removeItem("eduepic_token");
      localStorage.removeItem("eduepic_user");
      // Redirect to login if not already there
      if (window.location.pathname !== "/admin/login") {
        window.location.href = "/admin/login";
      }
    }
    
    // Log errors in development
    if (import.meta.env.DEV) {
      console.error("API Error:", error.response?.data || error.message);
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;