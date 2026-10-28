import { ApiResponse, BackendHealth } from '../types';

export const API_BASE_URL: string =
  (import.meta.env.VITE_API_BASE_URL as string) || 'http://localhost:8000';

export async function fetchHealth(): Promise<ApiResponse<BackendHealth>> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/health`, {
      headers: {
        Accept: 'application/json',
      },
    });

    const status = response.status;
    if (!response.ok) {
      return {
        data: null,
        error: `Backend returned status ${status}`,
        status,
      };
    }

    const data: BackendHealth = await response.json();
    return {
      data,
      error: null,
      status,
    };
  } catch (err: any) {
    return {
      data: null,
      error: err.message || 'Failed to connect to FastAPI backend.',
      status: 0,
    };
  }
}

export const apiClient = {
  getHealth: fetchHealth,
  request: async <T = any>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> => {
    const normalized = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    try {
      const response = await fetch(`${API_BASE_URL}${normalized}`, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          ...(options.headers || {}),
        },
      });
      const data = await response.json();
      return {
        data: response.ok ? data : null,
        error: response.ok ? null : data.detail || 'Request failed',
        status: response.status,
      };
    } catch (err: any) {
      return {
        data: null,
        error: err.message || 'Network error',
        status: 0,
      };
    }
  },
};
