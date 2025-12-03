/**
 * Search API Endpoints
 */
import { apiClient } from "../client";
import type {
  SearchParams,
  SearchResult,
} from "../types";

export const searchApi = {
  /**
   * Search across entities (cars, users, or all)
   */
  async search(params: SearchParams): Promise<SearchResult> {
    const response = await apiClient.get<SearchResult>("/search", { params });
    return response.data || { found: 0, page: 1, data: { hits: [] } };
  },

  async searchCarModels(params: SearchParams): Promise<SearchResult> {
    const response = await apiClient.get<SearchResult>("/search/car-models", { params });
    return response.data || { found: 0, page: 1, data: { hits: [] } };
  },

  /**
   * Search cars only
   */
  async searchCars(query: string, params?: Omit<SearchParams, "query" | "type">): Promise<SearchResult> {
    const response = await apiClient.get<SearchResult>("/search", {
      params: {
        query,
        type: "cars",
        ...params,
      },
    });
    return response.data || { found: 0, page: 1, data: { hits: [] } };
  },

  /**
   * Search users only
   */
  async searchUsers(query: string, params?: Omit<SearchParams, "query" | "type">): Promise<SearchResult> {
    const response = await apiClient.get<SearchResult>("/search", {
      params: {
        query,
        type: "users",
        ...params,
      },
    });
    return response.data || { found: 0, page: 1, data: { hits: [] } };
  },
};


