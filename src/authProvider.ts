import type { AuthProvider } from "@refinedev/core";
import axios from "axios";

export const TOKEN_KEY = "refine-auth";
export const REFRESH_TOKEN_KEY = "refresh-token";

const API_URL = "http://localhost:8080"; // Update this with your actual API URL

// Create an axios instance with custom config
const axiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true, // This is important for sending/receiving cookies
});

// Add a response interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Skip refresh requests to avoid infinite loop
    if (originalRequest.url === "/refresh") {
      return Promise.reject(error);
    }

    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        // Attempt to refresh the token
        const response = await axiosInstance.post<{
          access_token: string;
          refresh_token: string;
        }>("/refresh", {
          refresh_token: localStorage.getItem(REFRESH_TOKEN_KEY),
        });
        const { access_token, refresh_token } = response.data;
        localStorage.setItem(TOKEN_KEY, access_token);
        localStorage.setItem(REFRESH_TOKEN_KEY, refresh_token);
        // Retry the original request with the new token
        originalRequest.headers["Authorization"] = `Bearer ${access_token}`;
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        // If refresh fails, logout the user
        localStorage.removeItem(TOKEN_KEY);
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export const authProvider: AuthProvider = {
  login: async ({ email, password }) => {
    try {
      const response = await axiosInstance.post<{
        access_token: string;
        refresh_token: string;
      }>("/login", {
        email,
        password,
      });
      const { access_token, refresh_token } = response.data;
      localStorage.setItem(TOKEN_KEY, access_token);
      localStorage.setItem(REFRESH_TOKEN_KEY, refresh_token);
      return {
        success: true,
        redirectTo: "/",
      };
    } catch (error) {
      return {
        success: false,
        error: {
          name: "LoginError",
          message: "Invalid email or password",
        },
      };
    }
  },

  register: async ({ email, password }) => {
    try {
      const response = await axiosInstance.post("/register", {
        email,
        password,
      });

      if (response.status === 201) {
        return {
          success: true,
          redirectTo: "/login",
        };
      } else {
        return {
          success: false,
          error: {
            name: "RegisterError",
            message: "Failed to register",
          },
        };
      }
    } catch (error) {
      return {
        success: false,
        error: {
          name: "RegisterError",
          message: "Failed to register",
        },
      };
    }
  },
  logout: async () => {
    try {
      await axiosInstance.post("/logout");
    } catch (error) {
      console.error("Logout error:", error);
    }
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);

    return {
      success: true,
      redirectTo: "/login",
    };
  },

  check: async () => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) {
      return {
        authenticated: true,
      };
    }

    return {
      authenticated: false,
      redirectTo: "/login",
    };
  },
  getPermissions: async () => null,
  getIdentity: async () => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) {
      try {
        const response = await axiosInstance.get("/user");
        return response.data;
      } catch (error) {
        console.error("Error fetching user identity:", error);
        return null;
      }
    }
    return null;
  },
  onError: async (error) => {
    console.error(error);
    return { error };
  },
};
