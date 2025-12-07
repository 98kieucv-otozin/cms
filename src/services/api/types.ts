/**
 * API Types and Interfaces
 * Centralized type definitions for API requests and responses
 */

// ==================== Authentication Types ====================
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  message?: string;
  user?: {
    id: string;
    username: string;
    email?: string;
    role?: string;
  };
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  role?: "dealer" | "admin";
}

export interface RegisterResponse {
  success: boolean;
  message?: string;
  user?: {
    id: string;
    username: string;
    email: string;
  };
}

export interface AuthStatusResponse {
  isAuthenticated: boolean;
  user?: {
    id: string;
    username: string;
    email?: string;
    role?: string;
  };
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ForgotPasswordResponse {
  success: boolean;
  message?: string;
}

// ==================== Car Types ====================
export interface Car {
  id: string;
  name: string;
  price: number;
  images: string[];
  thumbnail: string;
  description?: string;
  brand?: string;
  model?: string;
  year?: number;
  mileage?: number;
  color?: string;
  fuelType?: string;
  transmission?: string;
  status?: "pending" | "approved" | "rejected" | "sold";
  dealerId?: string;
  dealerName?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateCarRequest {
  name: string;
  price: number;
  images?: File[] | string[];
  description?: string;
  brand?: string;
  model?: string;
  year?: number;
  mileage?: number;
  color?: string;
  fuelType?: string;
  transmission?: string;
}

export interface UpdateCarRequest extends Partial<CreateCarRequest> {
  id: string;
}

export interface CarListResponse {
  hits: Car[];
  found: number;
  page: number;
  per_page: number;
}

export interface CarListParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  dealerId?: string;
  minPrice?: number;
  maxPrice?: number;
  brand?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

// ==================== User Types ====================
export interface User {
  id: string;
  username: string;
  email: string;
  role: "admin" | "dealer";
  createdAt?: string;
  updatedAt?: string;
}

export interface UserListResponse {
  users: User[];
  total: number;
  page: number;
  limit: number;
}

export interface UserListParams {
  page?: number;
  limit?: number;
  search?: string;
  role?: string;
}

// ==================== Common Types ====================
export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// ==================== Search Types ====================
export type SearchEntityType = "cars" | "users" | "all";

export interface SearchParams {
  query: string;
  type?: SearchEntityType;
  page?: number;
  limit?: number;
  filters?: {
    // Car filters
    status?: string;
    minPrice?: number;
    maxPrice?: number;
    brand?: string;
    // User filters
    role?: string;
  };
}

export interface SearchResult {
  data: {
    hits: any[];
  };

  page: number;
  found: number;
}

