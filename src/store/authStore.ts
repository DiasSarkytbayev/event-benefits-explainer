import { create } from 'zustand';
import { authAPI } from '../lib/api';

interface User {
  id: string;
  email: string;
  role: 'student' | 'staff' | 'admin';
  profile: {
    firstName: string;
    lastName: string;
    avatar?: string;
    bio?: string;
    isStudent: boolean;
    faculty?: string;
    course?: number;
    major?: string;
    degree?: string;
    isStaff: boolean;
    department?: string;
    position?: string;
    interests: string[];
    location: string;
  };
}

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => void;
  fetchUser: () => Promise<void>;
  setUser: (user: User) => void;
  updateProfile: (data: any) => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: localStorage.getItem('token'),
  isLoading: false,
  error: null,

  login: async (email, password) => {
    try {
      set({ isLoading: true, error: null });
      const response = await authAPI.login({ email, password });
      const { user, token } = response.data;
      
      localStorage.setItem('token', token);
      set({ user, token, isLoading: false });
    } catch (error: any) {
      set({ 
        error: error.response?.data?.error || 'Login failed', 
        isLoading: false 
      });
      throw error;
    }
  },

  register: async (data) => {
    try {
      set({ isLoading: true, error: null });
      const response = await authAPI.register(data);
      const { user, token } = response.data;
      
      localStorage.setItem('token', token);
      set({ user, token, isLoading: false });
    } catch (error: any) {
      set({ 
        error: error.response?.data?.error || 'Registration failed', 
        isLoading: false 
      });
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    set({ user: null, token: null });
  },

  setUser: (user) => {
    set({ user });
  },

  fetchUser: async () => {
    try {
      set({ isLoading: true });
      const response = await authAPI.getMe();
      set({ user: response.data.user, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      localStorage.removeItem('token');
      set({ user: null, token: null });
    }
  },

  updateProfile: async (data) => {
    try {
      set({ isLoading: true, error: null });
      const response = await authAPI.updateProfile(data);
      set({ user: response.data.user, isLoading: false });
    } catch (error: any) {
      set({ 
        error: error.response?.data?.error || 'Update failed', 
        isLoading: false 
      });
      throw error;
    }
  },
}));
