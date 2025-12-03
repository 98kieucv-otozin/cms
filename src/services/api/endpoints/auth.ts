/**
 * Authentication API Endpoints
 */
import { apiClient } from "../client";
import type {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
  AuthStatusResponse,
  ForgotPasswordRequest,
  ForgotPasswordResponse,
} from "../types";

export const authApi = {
  /**
   * Login - Server will set HTTP-Only cookie in response header
   * Cookie will be automatically sent with subsequent requests
   */
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const response = await apiClient.post<LoginResponse>("/auth/login", credentials);
    return response.data || { success: false };
  },

  /**
   * Register new user
   */
  async register(data: RegisterRequest): Promise<RegisterResponse> {
    const response = await apiClient.post<RegisterResponse>("/auth/register", data);
    return response.data || { success: false };
  },

  /**
   * Check authentication status
   * Server reads HTTP-Only cookie from request and validates it
   */
  async checkAuth(): Promise<AuthStatusResponse> {
    try {
      const response = await apiClient.get<any>("/auth/status");
      console.log("response", response);
      if (response.data?.isAuthenticated) {
        return { isAuthenticated: true, user: response.data?.user };
      }
      return { isAuthenticated: false };
    } catch (error) {
      return { isAuthenticated: false };
    }
  },

  /**
   * Logout - Server will delete HTTP-Only cookie
   */
  async logout(): Promise<void> {
    await apiClient.post("/auth/logout");
  },

  /**
   * Request password reset
   */
  async forgotPassword(data: ForgotPasswordRequest): Promise<ForgotPasswordResponse> {
    const response = await apiClient.post<ForgotPasswordResponse>("/auth/forgot-password", data);
    return response.data || { success: false };
  },

  /**
   * Reset password with token
   */
  async resetPassword(token: string, newPassword: string): Promise<{ success: boolean; message?: string }> {
    const response = await apiClient.post("/auth/reset-password", {
      token,
      newPassword,
    });
    return response.data || { success: false };
  },
};

