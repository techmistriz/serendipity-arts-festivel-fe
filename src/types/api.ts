export interface ApiResponse<T = unknown> {
  status: boolean;
  success?: boolean;
  message: string;
  data: T;
  meta?: Record<string, unknown>;
}
