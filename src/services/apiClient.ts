import { API_BASE_URL } from '../config';

export interface ApiResponse<T = any> {
  data: T | null;
  error: string | null;
  status: number;
}

export interface RequestOptions extends Omit<RequestInit, 'body'> {
  body?: any;
  token?: string | null;
  timeoutMs?: number;
}

/**
 * Core reusable HTTP client for the DineGo mobile application.
 * Manages request headers, authentication headers, JSON parsing, and error handling.
 */
export async function apiRequest<T = any>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<ApiResponse<T>> {
  const { body, token, timeoutMs = 10000, headers = {}, ...rest } = options;

  // Normalize endpoint URL
  const normalizedEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  const url = `${API_BASE_URL}${normalizedEndpoint}`;

  const requestHeaders: Record<string, string> = {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    ...(headers as Record<string, string>),
  };

  if (token) {
    requestHeaders['Authorization'] = `Bearer ${token}`;
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      ...rest,
      headers: requestHeaders,
      body: body ? JSON.stringify(body) : undefined,
      signal: controller.signal,
    });

    clearTimeout(timer);

    const status = response.status;
    let data: T | null = null;
    let error: string | null = null;

    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      const json = await response.json();
      if (response.ok) {
        data = json;
      } else {
        error = json.detail || json.message || `Request failed with status ${status}`;
      }
    } else {
      const text = await response.text();
      if (!response.ok) {
        error = text || `Request failed with status ${status}`;
      }
    }

    return { data, error, status };
  } catch (err: any) {
    clearTimeout(timer);
    const isTimeout = err.name === 'AbortError';
    return {
      data: null,
      error: isTimeout
        ? 'Network request timed out. Please check your backend connection.'
        : err.message || 'Unable to connect to DineGo server.',
      status: isTimeout ? 408 : 0,
    };
  }
}

export const apiClient = {
  get: <T = any>(endpoint: string, options?: Omit<RequestOptions, 'method' | 'body'>) =>
    apiRequest<T>(endpoint, { ...options, method: 'GET' }),

  post: <T = any>(endpoint: string, body?: any, options?: Omit<RequestOptions, 'method' | 'body'>) =>
    apiRequest<T>(endpoint, { ...options, method: 'POST', body }),

  put: <T = any>(endpoint: string, body?: any, options?: Omit<RequestOptions, 'method' | 'body'>) =>
    apiRequest<T>(endpoint, { ...options, method: 'PUT', body }),

  delete: <T = any>(endpoint: string, options?: Omit<RequestOptions, 'method' | 'body'>) =>
    apiRequest<T>(endpoint, { ...options, method: 'DELETE' }),

  /** Quick health check verification */
  checkHealth: async () => {
    return apiRequest<{ status: string; app: string; version: string }>('/api/v1/health');
  },
};
