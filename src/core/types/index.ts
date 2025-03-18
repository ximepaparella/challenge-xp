// Common types used across the core module
export interface ApiResponse<T = unknown> {
  data: T;
  status: number;
  ok: boolean;
}
