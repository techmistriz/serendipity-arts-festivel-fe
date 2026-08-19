export interface ApiResponse<T = unknown> {
  status: boolean;
  success: boolean;
  message: string;
  data: T;
}
