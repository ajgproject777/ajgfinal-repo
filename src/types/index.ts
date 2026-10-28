// DineGo Mobile Shared Type Definitions

export type UserRole = 'traveller' | 'owner' | 'admin';

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  phone?: string | null;
  role: UserRole;
  isActive: boolean;
  createdAt: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresIn: number;
}

export interface HealthStatus {
  status: string;
  app: string;
  version: string;
  environment: string;
  database?: string;
}
