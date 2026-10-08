import { create } from 'zustand';
import * as SecureStore from 'expo-secure-store';

interface AuthState {
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setToken: (token: string | null) => Promise<void>;
  hydrate: () => Promise<void>;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  isAuthenticated: false,
  isLoading: true,
  setToken: async (token) => {
    if (token) {
      await SecureStore.setItemAsync('auth_token', token);
      set({ token, isAuthenticated: true });
    } else {
      await SecureStore.deleteItemAsync('auth_token');
      set({ token: null, isAuthenticated: false });
    }
  },
  hydrate: async () => {
    try {
      const token = await SecureStore.getItemAsync('auth_token');
      if (token) {
        set({ token, isAuthenticated: true, isLoading: false });
      } else {
        set({ token: null, isAuthenticated: false, isLoading: false });
      }
    } catch (e) {
      set({ token: null, isAuthenticated: false, isLoading: false });
    }
  },
  logout: async () => {
    await SecureStore.deleteItemAsync('auth_token');
    set({ token: null, isAuthenticated: false });
  }
}));
