export interface BackendHealth {
  status: string;
  app: string;
  version: string;
  environment: string;
  database?: string;
}

export interface ApiResponse<T = any> {
  data: T | null;
  error: string | null;
  status: number;
}
