/**
 * Cars API Endpoints
 */
import { apiClient } from "../client";
import type {
  Car,
  CreateCarRequest,
  UpdateCarRequest,
  CarListResponse,
  CarListParams,
} from "../types";

export const carsApi = {
  /**
   * Get list of cars with pagination and filters
   */
  async getCars(params?: CarListParams): Promise<CarListResponse> {
    const response = await apiClient.get<CarListResponse>("/cars", { params });
    return response.data || { hits: [], found: 0, page: 1, per_page: 10 };
  },

  /**
   * Get single car by ID
   */
  async getCarById(id: string): Promise<Car> {
    const response = await apiClient.get<Car>(`/cars/${id}`);
    if (!response.data) {
      throw new Error("Car not found");
    }
    return response.data;
  },

  /**
   * Create new car
   * If images are File objects, use FormData for upload
   */
  async createCar(data: CreateCarRequest): Promise<Car> {
    // Check if images are File objects
    const hasFileImages = data.images?.some((img) => img instanceof File);

    if (hasFileImages) {
      // Use FormData for file upload
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("price", String(data.price));

      if (data.description) formData.append("description", data.description);
      if (data.brand) formData.append("brand", data.brand);
      if (data.model) formData.append("model", data.model);
      if (data.year) formData.append("year", String(data.year));
      if (data.mileage) formData.append("mileage", String(data.mileage));
      if (data.color) formData.append("color", data.color);
      if (data.fuelType) formData.append("fuelType", data.fuelType);
      if (data.transmission) formData.append("transmission", data.transmission);

      // Append image files
      data.images?.forEach((file) => {
        if (file instanceof File) {
          formData.append("images", file);
        }
      });

      const response = await apiClient.upload<Car>("/cars", formData);
      if (!response.data) {
        throw new Error("Failed to create car");
      }
      return response.data;
    } else {
      // Use JSON for regular data
      const response = await apiClient.post<Car>("/cars", data);
      if (!response.data) {
        throw new Error("Failed to create car");
      }
      return response.data;
    }
  },

  /**
   * Update car by ID
   */
  async updateCar(data: UpdateCarRequest): Promise<Car> {
    const { id, ...updateData } = data;

    // Check if images are File objects
    const hasFileImages = updateData.images?.some((img) => img instanceof File);

    if (hasFileImages) {
      // Use FormData for file upload
      const formData = new FormData();

      if (updateData.name) formData.append("name", updateData.name);
      if (updateData.price) formData.append("price", String(updateData.price));
      if (updateData.description) formData.append("description", updateData.description);
      if (updateData.brand) formData.append("brand", updateData.brand);
      if (updateData.model) formData.append("model", updateData.model);
      if (updateData.year) formData.append("year", String(updateData.year));
      if (updateData.mileage) formData.append("mileage", String(updateData.mileage));
      if (updateData.color) formData.append("color", updateData.color);
      if (updateData.fuelType) formData.append("fuelType", updateData.fuelType);
      if (updateData.transmission) formData.append("transmission", updateData.transmission);

      // Append image files
      updateData.images?.forEach((file) => {
        if (file instanceof File) {
          formData.append("images", file);
        }
      });

      const response = await apiClient.upload<Car>(`/cars/${id}`, formData);
      if (!response.data) {
        throw new Error("Failed to update car");
      }
      return response.data;
    } else {
      // Use JSON for regular data
      const response = await apiClient.put<Car>(`/cars/${id}`, updateData);
      if (!response.data) {
        throw new Error("Failed to update car");
      }
      return response.data;
    }
  },

  /**
   * Delete car by ID
   */
  async deleteCar(id: string): Promise<void> {
    await apiClient.delete(`/cars/${id}`);
  },

  /**
   * Get cars by dealer (for dealer's own cars)
   */
  async getMyCars(params?: CarListParams): Promise<CarListResponse> {
    const response = await apiClient.get<CarListResponse>("/cars/my", { params });
    return response.data || { hits: [], found: 0, page: 1, per_page: 10 };
  },

  /**
   * Update car status (admin only)
   */
  async updateCarStatus(id: string, status: "pending" | "approved" | "rejected" | "sold"): Promise<Car> {
    const response = await apiClient.patch<Car>(`/cars/${id}/status`, { status });
    if (!response.data) {
      throw new Error("Failed to update car status");
    }
    return response.data;
  },

  /**
   * Get car detail by model, year, and trim
   */
  async getCarDetailByModelYearAndTrim(params: {
    model_year_id: string
    trim_id: string
  }): Promise<any> {
    const response = await apiClient.get<any>("/car-models/detail/by-model-year-and-trim", { params });
    if (!response.data) {
      throw new Error("Car detail not found");
    }
    return response.data;
  },

  /**
   * Upload car with FormData (for file uploads)
   */
  async uploadCar(formData: FormData): Promise<Car> {
    const response = await apiClient.upload<Car>("/cars/upload", formData);
    if (!response.data) {
      throw new Error("Failed to upload car");
    }
    return response.data;
  },

  async getPresignedUrl(body: { count: number, subfolder: string }): Promise<string[]> {
    const response = await apiClient.post<{ uploadUrls: string[] }>("/upload/presigned-urls", body);
    if (!response.data) {
      throw new Error("get url failed");
    }
    return response.data.uploadUrls;
  },

  /**
   * Create car for sale (Bán xe ngay)
   */
  async carForSale(data: CreateCarRequest): Promise<Car> {
    const response = await apiClient.post<Car>("/car-for-sale", data);
    console.log("response", response);
    if (!response.data) {
      throw new Error("Failed to create car for sale");
    }
    return response.data;
  },

  /**
   * Search cars for sale
   */
  async searchCarForSale(params?: CarListParams): Promise<CarListResponse> {
    const response = await apiClient.get<CarListResponse>("/car-for-sale/search", { params });
    return response.data || { hits: [], found: 0, page: 1, per_page: 10 };
  },
};

