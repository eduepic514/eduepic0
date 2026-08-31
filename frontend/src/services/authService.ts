import apiClient from "./api";

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: "superadmin" | "editor" | "author";
  avatar?: string;
  bio?: string;
}

interface LoginResponse {
  success: boolean;
  message: string;
  data: {
    token: string;
    user: AdminUser;
  };
}

export const login = async (email: string, password: string): Promise<{ token: string; user: AdminUser }> => {
  try {
    console.log("Attempting login for:", email);
    const response = await apiClient.post<LoginResponse>('/auth/login', { email, password });
    console.log("Login response:", response.data);
    
    if (response.data.success) {
      const { token, user } = response.data.data;
      localStorage.setItem("eduepic_token", token);
      localStorage.setItem("eduepic_user", JSON.stringify(user));
      return { token, user };
    } else {
      throw new Error(response.data.message || "Login failed");
    }
  } catch (error: any) {
    console.error("Login error:", error);
    const message = error.response?.data?.message || error.message || "Invalid credentials";
    throw new Error(message);
  }
};

export const logout = () => {
  localStorage.removeItem("eduepic_token");
  localStorage.removeItem("eduepic_user");
};

export const getCurrentUser = (): AdminUser | null => {
  try {
    const raw = localStorage.getItem("eduepic_user");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

export const isAuthenticated = (): boolean => Boolean(localStorage.getItem("eduepic_token"));

export const getAuthToken = (): string | null => {
  const token = localStorage.getItem("eduepic_token");
  console.log("Auth token:", token ? "Present" : "Missing");
  return token;
};