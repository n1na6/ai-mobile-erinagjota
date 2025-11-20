// Authentication types

export interface AuthUser {
  id: string;
  email: string;
  email_confirmed_at?: string;
  created_at: string;
  updated_at: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupCredentials {
  email: string;
  password: string;
  confirmPassword?: string;
}

export interface AuthResponse {
  user: AuthUser | null;
  error: Error | null;
}

export interface AuthState {
  user: AuthUser | null;
  session: any | null;
  loading: boolean;
  initialized: boolean;
}

export interface ResetPasswordRequest {
  email: string;
}

export interface UpdatePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export interface AuthError {
  message: string;
  status?: number;
}

