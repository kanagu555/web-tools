'use client';

import { useTheme as useMuiTheme } from '@mui/material/styles';
import { useThemeMode } from '@/lib/theme/ThemeContext';

/**
 * Custom hook that combines Material-UI theme with our theme mode context
 * Provides access to both the MUI theme object and theme switching functionality
 */
export const useTheme = () => {
  const muiTheme = useMuiTheme();
  const { mode, toggleTheme, mounted } = useThemeMode();
  
  return {
    theme: muiTheme,
    mode,
    toggleTheme,
    isDark: mode === 'dark',
    isLight: mode === 'light',
    mounted,
  };
};