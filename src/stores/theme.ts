import { create } from 'zustand';

interface ThemeState {
  isDarkMode: boolean;
  setDarkMode: (value: boolean) => void;
}

export const useThemeStore = create<ThemeState>((set) => ({
  isDarkMode: false,
  setDarkMode: (value: boolean) => set({ isDarkMode: value })
}));

export const Colors = {
  light: {
    background: '#F2F2F7',
    card: '#FFFFFF',
    text: '#000000',
    textSub: '#8E8E93',
    primary: '#007AFF',
    border: '#E5E5EA',
    cardInverted: '#1C1C1E',
    textInverted: '#FFFFFF',
    textSubInverted: '#98989D'
  },
  dark: {
    background: '#000000',
    card: '#1C1C1E',
    text: '#FFFFFF',
    textSub: '#98989D',
    primary: '#0A84FF',
    border: '#38383A',
    cardInverted: '#2C2C2E',
    textInverted: '#FFFFFF',
    textSubInverted: '#98989D'
  }
};

export function useTheme() {
  const isDarkMode = useThemeStore((state) => state.isDarkMode);
  return {
    dark: isDarkMode,
    colors: isDarkMode ? Colors.dark : Colors.light,
  };
}
