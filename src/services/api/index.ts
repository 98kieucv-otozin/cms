/**
 * API Service - Main Export
 * Centralized export for all API endpoints
 */
export { apiClient, ApiClient } from "./client";
export * from "./types";
export { authApi } from "./endpoints/auth";
export { carsApi } from "./endpoints/cars";
export { usersApi } from "./endpoints/users";

// Re-export for backward compatibility
export { apiClient as api } from "./client";

