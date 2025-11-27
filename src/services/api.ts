/**
 * API service for authentication
 * HTTP-Only cookies are automatically sent with requests and set by server
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

interface LoginResponse {
  success: boolean;
  message?: string;
  user?: {
    username: string;
  };
}

interface AuthStatusResponse {
  isAuthenticated: boolean;
  username?: string;
}

export const api = {
  /**
   * Login - Server will set HTTP-Only cookie in response header
   * Cookie will be automatically sent with subsequent requests
   */
  async login(username: string, password: string): Promise<LoginResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include", // Important: include cookies in request/response
      body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Đăng nhập thất bại");
    }

    return response.json();
  },

  /**
   * Check authentication status
   * Server reads HTTP-Only cookie from request and validates it
   */
  async checkAuth(): Promise<AuthStatusResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/status`, {
      method: "GET",
      credentials: "include", // Important: include cookies
    });

    if (!response.ok) {
      return { isAuthenticated: false };
    }

    return response.json();
  },

  /**
   * Logout - Server will delete HTTP-Only cookie
   */
  async logout(): Promise<void> {
    await fetch(`${API_BASE_URL}/auth/logout`, {
      method: "POST",
      credentials: "include", // Important: include cookies
    });
  },
};

