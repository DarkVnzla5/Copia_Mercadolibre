export interface User {
  id: number;
  email: string;
  username?: string;
  first_name?: string;
  last_name?: string;
  date_joined?: string;
  last_login?: string;
  is_active?: boolean;
  is_staff?: boolean;
  is_superuser?: boolean;
}

export interface Credentials {
  email: string;
  password: string;
}

export interface RegisterData extends Credentials {
  username?: string;
  first_name?: string;
  last_name?: string;
  password_confirmation?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  refresh_token?: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}