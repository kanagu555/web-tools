'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ThemeProvider as MuiThemeProvider, createTheme, Theme } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v14-appRouter';

// Theme mode type
export type ThemeMode = 'light' | 'dark';

// Theme context interface
interface ThemeContextType {
  mode: ThemeMode;
  toggleTheme: () => void;
  mounted: boolean;
}

// Create theme context
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Custom hook to use theme context
export const useThemeMode = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    // Return a safe default instead of throwing during SSR
    return {
      mode: 'dark',
      toggleTheme: () => {},
      mounted: false,
    };
  }
  return context;
};

// Create theme based on mode
const createAppTheme = (mode: ThemeMode): Theme => {
  const isDark = mode === 'dark';
  
  return createTheme({
    palette: {
      mode,
      primary: {
        main: '#6366f1', // Indigo
        light: '#818cf8',
        dark: '#4f46e5',
      },
      secondary: {
        main: '#10b981', // Emerald
        light: '#34d399',
        dark: '#059669',
      },
      background: {
        default: isDark ? '#111827' : '#ffffff',
        paper: isDark ? '#1f2937' : '#ffffff',
      },
      text: {
        primary: isDark ? '#f3f4f6' : '#111827',
        secondary: isDark ? '#d1d5db' : '#6b7280',
      },
      error: {
        main: '#ef4444', // Red
      },
      warning: {
        main: '#f59e0b', // Amber
      },
      success: {
        main: '#10b981', // Emerald
      },
      info: {
        main: '#3b82f6', // Blue
      },
    },
    typography: {
      fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
      h1: {
        fontWeight: 700,
        fontSize: '3rem',
        lineHeight: 1.2,
      },
      h2: {
        fontWeight: 700,
        fontSize: '2.5rem',
        lineHeight: 1.2,
      },
      h3: {
        fontWeight: 600,
        fontSize: '2rem',
        lineHeight: 1.2,
      },
      h4: {
        fontWeight: 600,
        fontSize: '1.5rem',
        lineHeight: 1.2,
      },
      h5: {
        fontWeight: 600,
        fontSize: '1.25rem',
        lineHeight: 1.2,
      },
      h6: {
        fontWeight: 600,
        fontSize: '1rem',
        lineHeight: 1.2,
      },
      subtitle1: {
        fontSize: '1.125rem',
        lineHeight: 1.5,
      },
      body1: {
        fontSize: '1rem',
        lineHeight: 1.5,
      },
      body2: {
        fontSize: '0.875rem',
        lineHeight: 1.5,
      },
      button: {
        textTransform: 'none',
        fontWeight: 500,
      },
    },
    shape: {
      borderRadius: 8,
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            padding: '8px 16px',
            fontWeight: 500,
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 12,
            boxShadow: isDark 
              ? '0 4px 20px 0 rgba(0, 0, 0, 0.3)' 
              : '0 4px 20px 0 rgba(0, 0, 0, 0.1)',
            transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
            '&:hover': {
              transform: 'translateY(-4px)',
              boxShadow: isDark 
                ? '0 10px 30px 0 rgba(0, 0, 0, 0.4)' 
                : '0 10px 30px 0 rgba(0, 0, 0, 0.2)',
            },
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
            backdropFilter: 'blur(10px)',
            backgroundColor: isDark 
              ? 'rgba(31, 41, 55, 0.8)' 
              : 'rgba(255, 255, 255, 0.8)',
          },
        },
      },
    },
  });
};

// Theme provider component props
interface ThemeProviderProps {
  children: ReactNode;
}

// Theme provider component
export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  // Always start with dark theme to avoid hydration mismatch
  const [mode, setMode] = useState<ThemeMode>('dark');
  const [mounted, setMounted] = useState(false);

  // Handle hydration - only run on client
  useEffect(() => {
    setMounted(true);
    
    // Only access localStorage after component mounts
    const initializeTheme = () => {
      try {
        const savedTheme = localStorage.getItem('theme-mode') as ThemeMode;
        if (savedTheme && (savedTheme === 'light' || savedTheme === 'dark')) {
          setMode(savedTheme);
        } else {
          // Check system preference
          if (typeof window !== 'undefined' && window.matchMedia) {
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            setMode(prefersDark ? 'dark' : 'light');
          }
        }
      } catch (error) {
        console.warn('Failed to load theme from localStorage:', error);
        setMode('dark'); // fallback
      }
    };

    // Small delay to ensure DOM is ready
    const timeoutId = setTimeout(initializeTheme, 100);
    return () => clearTimeout(timeoutId);
  }, []);

  // Update document class and localStorage when mode changes
  useEffect(() => {
    if (mounted && typeof window !== 'undefined') {
      try {
        document.documentElement.classList.toggle('dark', mode === 'dark');
        localStorage.setItem('theme-mode', mode);
      } catch (error) {
        console.warn('Failed to save theme to localStorage:', error);
      }
    }
  }, [mode, mounted]);

  const toggleTheme = () => {
    setMode(prevMode => {
      const newMode = prevMode === 'light' ? 'dark' : 'light';
      
      // Track theme change in analytics (only on client side)
      if (typeof window !== 'undefined') {
        // Dynamically import to avoid SSR issues
        import('@/lib/analytics/googleAnalytics').then(({ trackThemeChange }) => {
          trackThemeChange(newMode);
        });
      }
      
      return newMode;
    });
  };

  const theme = createAppTheme(mode);

  return (
    <AppRouterCacheProvider>
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        <ThemeContext.Provider value={{ mode, toggleTheme, mounted }}>
          {children}
        </ThemeContext.Provider>
      </MuiThemeProvider>
    </AppRouterCacheProvider>
  );
};