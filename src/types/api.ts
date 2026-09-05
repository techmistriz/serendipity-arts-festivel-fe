export interface ApiResponse<T = unknown> {
  errors: Record<string, string[]> | undefined;
  status: boolean;
  success?: boolean;
  message: string;
  data: T;
  meta?: Record<string, unknown>;
}
