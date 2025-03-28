import axios, { AxiosRequestConfig } from "axios";

// Environment check for development/production
const BASE_URL =
  process.env.NODE_ENV === "production"
    ? "/api/" // In production, served from the same backend
    : "http://localhost:3000/api/"; // In development, call the local backend


// Create Axios instance
const axiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

export const httpService = {
  get<T>(endpoint: string, params?: any) {
    return request<T>(endpoint, "GET", null, params);
  },
  post<T>(endpoint: string, data: any) {
    return request<T>(endpoint, "POST", data);
  },
  put<T>(endpoint: string, data: any) {
    return request<T>(endpoint, "PUT", data);
  },
  delete<T>(endpoint: string) {
    return request<T>(endpoint, "DELETE");
  },
};

async function request<T>(
  endpoint: string,
  method: AxiosRequestConfig["method"],
  data?: any,
  params?: any
): Promise<T> {
  try {
    const response = await axiosInstance.request<T>({
      url: endpoint,
      method,
      data,
      params,
    });
    return response.data;
  } catch (err: any) {
    if (axios.isAxiosError(err)) {
      console.error(`Error ${method}ing to ${endpoint}`, err);
      if (err.response?.status === 401) {
        sessionStorage.clear();
        // window.location.assign('/login');
      }
      throw err;
    } else {
      console.error("Unexpected error", err);
      throw new Error("An unexpected error occurred");
    }
  }
}
