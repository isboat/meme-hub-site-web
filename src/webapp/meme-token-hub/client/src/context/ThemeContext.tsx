// client/src/context/ThemeContext.tsx
import React, { createContext, useContext, ReactNode } from 'react';
import { Theme, darkTheme } from '../styles/themes';

interface ThemeContextType {
  theme: Theme;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // For now, we only support dark theme. If toggling is needed, useState would be used here.
  const theme = darkTheme;

  return <ThemeContext.Provider value={{ theme }}>{children}</ThemeContext.Provider>;
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context.theme;
};