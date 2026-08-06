import axios from 'axios';
import { useAuthStore } from '../store/authStore';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

// Attach the bearer token from the auth store to every request.
apiClient.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// If the backend says the token is invalid/expired, log the admin out.
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      useAuthStore.getState().logout();
    }
    return Promise.reject(error);
  }
);

export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
}

export interface AdminUser {
  id: number;
  email: string;
  full_name: string;
}

export async function login(payload: LoginPayload): Promise<LoginResponse> {
  const { data } = await apiClient.post<LoginResponse>('/api/auth/login', payload);
  return data;
}

export async function fetchCurrentUser(): Promise<AdminUser> {
  const { data } = await apiClient.get<AdminUser>('/api/auth/me');
  return data;
}

export interface LeaderboardEntryDTO {
  rank: number;
  name: string;
  time: number;
  moves: number;
  date: string;
}

export async function fetchLeaderboard(brand: string, limit = 50): Promise<LeaderboardEntryDTO[]> {
  const { data } = await apiClient.get<LeaderboardEntryDTO[]>('/api/games/leaderboard', { params: { brand, limit } });
  return data;
}

export interface AnalyticsSummary {
  totalGames: number;
  completedGames: number;
  completionRate: number;
  totalLeads: number;
  eventsByType: Record<string, number>;
}

export async function fetchAnalyticsSummary(brand: string): Promise<AnalyticsSummary> {
  const { data } = await apiClient.get<AnalyticsSummary>('/api/analytics/summary', { params: { brand } });
  return data;
}

export default apiClient;
