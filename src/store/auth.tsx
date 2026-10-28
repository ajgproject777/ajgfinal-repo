import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';
import { AuthUser, signIn as serviceSignIn, register as serviceRegister, RegisterInput } from '../services/authService';
import { DEMO_MODE } from '../config';

export type UserRole = 'traveller' | 'owner';

export interface AppUser extends AuthUser {
  role: UserRole;
  isDemoSession: boolean;
}

interface AuthContextType {
  user: AppUser | null;
  isLoading: boolean;
  selectedRole: UserRole;
  setSelectedRole: (role: UserRole) => void;
  signIn: (email: string, password: string) => Promise<AppUser>;
  register: (input: RegisterInput) => Promise<AppUser>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const USER_STORAGE_KEY = 'dinego_auth_user';
const ACCESS_TOKEN_KEY = 'dinego_access_token';
const REFRESH_TOKEN_KEY = 'dinego_refresh_token';

async function safeStorageGet(key: string): Promise<string | null> {
  if (Platform.OS === 'web') {
    try {
      return localStorage.getItem(key);
    } catch {
      return null;
    }
  }
  try {
    return await SecureStore.getItemAsync(key);
  } catch {
    return null;
  }
}

async function safeStorageSet(key: string, value: string): Promise<void> {
  if (Platform.OS === 'web') {
    try {
      localStorage.setItem(key, value);
    } catch {}
    return;
  }
  try {
    await SecureStore.setItemAsync(key, value);
  } catch {}
}

async function safeStorageDelete(key: string): Promise<void> {
  if (Platform.OS === 'web') {
    try {
      localStorage.removeItem(key);
    } catch {}
    return;
  }
  try {
    await SecureStore.deleteItemAsync(key);
  } catch {}
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AppUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedRole, setSelectedRole] = useState<UserRole>('traveller');

  useEffect(() => {
    async function loadStoredAuth() {
      try {
        // In DEMO_MODE, do not automatically restore a simulated session on startup.
        // The app always starts signed out on the Login screen until real backend authentication is connected.
        if (DEMO_MODE) {
          setIsLoading(false);
          return;
        }

        const storedUser = await safeStorageGet(USER_STORAGE_KEY);
        if (storedUser) {
          const parsed = JSON.parse(storedUser) as AppUser;
          setUser(parsed);
          if (parsed.role) {
            setSelectedRole(parsed.role);
          }
        }
      } catch {
        // Error reading stored credentials; stay signed out
      } finally {
        setIsLoading(false);
      }
    }
    loadStoredAuth();
  }, []);

  const handleSignIn = async (email: string, password: string): Promise<AppUser> => {
    const authResult = await serviceSignIn(email, password);
    const appUser: AppUser = {
      ...authResult,
      role: selectedRole,
      isDemoSession: DEMO_MODE,
    };
    setUser(appUser);
    await safeStorageSet(USER_STORAGE_KEY, JSON.stringify(appUser));
    return appUser;
  };

  const handleRegister = async (input: RegisterInput): Promise<AppUser> => {
    const authResult = await serviceRegister(input);
    const appUser: AppUser = {
      ...authResult,
      role: selectedRole,
      isDemoSession: DEMO_MODE,
    };
    setUser(appUser);
    await safeStorageSet(USER_STORAGE_KEY, JSON.stringify(appUser));
    return appUser;
  };

  const handleSignOut = async () => {
    setUser(null);
    await safeStorageDelete(USER_STORAGE_KEY);
    await safeStorageDelete(ACCESS_TOKEN_KEY);
    await safeStorageDelete(REFRESH_TOKEN_KEY);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        selectedRole,
        setSelectedRole,
        signIn: handleSignIn,
        register: handleRegister,
        signOut: handleSignOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
