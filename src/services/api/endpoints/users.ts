/**
 * Users API Endpoints
 */
import { apiClient } from "../client";
import type {
  User,
  UserListResponse,
  UserListParams,
} from "../types";

export const usersApi = {
  /**
   * Get list of users (admin only)
   */
  async getUsers(params?: UserListParams): Promise<UserListResponse> {
    const response = await apiClient.get<UserListResponse>("/users", { params });
    return response.data || { users: [], total: 0, page: 1, limit: 10 };
  },

  /**
   * Get user by ID
   */
  async getUserById(id: string): Promise<User> {
    const response = await apiClient.get<User>(`/users/${id}`);
    if (!response.data) {
      throw new Error("User not found");
    }
    return response.data;
  },

  /**
   * Get current user profile
   */
  async getCurrentUser(): Promise<User> {
    const response = await apiClient.get<User>("/users/me");
    if (!response.data) {
      throw new Error("User not found");
    }
    return response.data;
  },

  /**
   * Update user profile
   */
  async updateUser(id: string, data: Partial<User>): Promise<User> {
    const response = await apiClient.put<User>(`/users/${id}`, data);
    if (!response.data) {
      throw new Error("Failed to update user");
    }
    return response.data;
  },

  /**
   * Update current user profile
   */
  async updateCurrentUser(data: Partial<User>): Promise<User> {
    const response = await apiClient.put<User>("/users/me", data);
    if (!response.data) {
      throw new Error("Failed to update user");
    }
    return response.data;
  },

  /**
   * Delete user (admin only)
   */
  async deleteUser(id: string): Promise<void> {
    await apiClient.delete(`/users/${id}`);
  },
};

