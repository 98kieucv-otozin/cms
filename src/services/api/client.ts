/**
 * Base API Client
 * Handles common request/response logic, error handling, and authentication
 */

const getApiBaseURL = (): string => {
  const envURL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

  // Ensure URL has protocol
  if (envURL.startsWith("http://") || envURL.startsWith("https://")) {
    return envURL;
  }

  // If no protocol, assume http://
  return `http://${envURL}`;
};

const API_BASE_URL = getApiBaseURL();

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface RequestOptions extends RequestInit {
  params?: Record<string, string | number | boolean | undefined | null> | { [key: string]: any };
  skipAuth?: boolean;
}

class ApiClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  /**
   * Build URL with query parameters
   */
  private buildURL(endpoint: string, params?: Record<string, string | number | boolean | undefined | null> | { [key: string]: any }): string {
    // Normalize endpoint - ensure it starts with /
    const normalizedEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;

    // Normalize baseURL - remove trailing slash if exists
    const normalizedBaseURL = this.baseURL.endsWith("/") ? this.baseURL.slice(0, -1) : this.baseURL;

    // Combine baseURL and endpoint
    const fullURL = `${normalizedBaseURL}${normalizedEndpoint}`;

    // Create URL object
    const url = new URL(fullURL);

    // Add query parameters
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          url.searchParams.append(key, String(value));
        }
      });
    }

    return url.toString();
  }

  /**
   * Handle response and parse JSON
   */
  private async handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
    const contentType = response.headers.get("content-type");

    if (!contentType?.includes("application/json")) {
      if (response.ok) {
        return { success: true };
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || data.error || `Request failed with status ${response.status}`);
    }

    // Tự động unwrap data.data nếu có (API response thường wrap trong data.data)
    const unwrappedData = data?.data !== undefined ? data.data : data;

    return {
      success: true,
      data: unwrappedData,
      message: data.message,
    };
  }

  /**
   * Make GET request
   */
  async get<T = any>(endpoint: string, options?: RequestOptions): Promise<ApiResponse<T>> {
    const url = this.buildURL(endpoint, options?.params);

    const response = await fetch(url, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
      ...options,
    });

    return this.handleResponse<T>(response);
  }

  /**
   * Make POST request
   */
  async post<T = any>(endpoint: string, body?: any, options?: RequestOptions): Promise<ApiResponse<T>> {
    const url = this.buildURL(endpoint, options?.params);

    const response = await fetch(url, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
      body: body ? JSON.stringify(body) : undefined,
      ...options,
    });

    return this.handleResponse<T>(response);
  }

  /**
   * Make PUT request
   */
  async put<T = any>(endpoint: string, body?: any, options?: RequestOptions): Promise<ApiResponse<T>> {
    const url = this.buildURL(endpoint, options?.params);

    const response = await fetch(url, {
      method: "PUT",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
      body: body ? JSON.stringify(body) : undefined,
      ...options,
    });

    return this.handleResponse<T>(response);
  }

  /**
   * Make PATCH request
   */
  async patch<T = any>(endpoint: string, body?: any, options?: RequestOptions): Promise<ApiResponse<T>> {
    const url = this.buildURL(endpoint, options?.params);

    const response = await fetch(url, {
      method: "PATCH",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
      body: body ? JSON.stringify(body) : undefined,
      ...options,
    });

    return this.handleResponse<T>(response);
  }

  /**
   * Make DELETE request
   */
  async delete<T = any>(endpoint: string, options?: RequestOptions): Promise<ApiResponse<T>> {
    const url = this.buildURL(endpoint, options?.params);

    const response = await fetch(url, {
      method: "DELETE",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
      ...options,
    });

    return this.handleResponse<T>(response);
  }

  /**
   * Upload file(s) with FormData
   */
  async upload<T = any>(
    endpoint: string,
    formData: FormData,
    options?: RequestOptions
  ): Promise<ApiResponse<T>> {
    const url = this.buildURL(endpoint, options?.params);

    const response = await fetch(url, {
      method: "POST",
      credentials: "include",
      headers: {
        // Don't set Content-Type header, browser will set it with boundary for multipart/form-data
        ...options?.headers,
      },
      body: formData,
      ...options,
    });

    return this.handleResponse<T>(response);
  }
}

// Export singleton instance
export const apiClient = new ApiClient(API_BASE_URL);

// Export class for testing or custom instances
export { ApiClient };

