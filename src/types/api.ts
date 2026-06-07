export interface ApiResponse<T> {
  data: T;
  success: boolean;
  error?: string;
}

export interface PaginatedApiResponse<T> {
  data: T[];
  page: number;
  totalPages: number;
  totalResults: number;
  success: boolean;
  error?: string;
}

export interface ApiError {
  message: string;
  status: number;
  code?: string;
}
