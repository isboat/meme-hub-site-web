// client/src/styles/themes.ts
export const darkTheme = {
    colors: {
      background: '#1a202c',
      cardBackground: '#2d3748',
      text: '#e2e8f0',
      primary: '#3b82f6',
      secondary: '#6366f1',
      border: '#4a5568',
      placeholder: '#a0aec0',
      success: '#10b981',
      error: '#ef4444',
    },
    spacing: {
      small: '8px',
      medium: '16px',
      large: '24px',
    },
    borderRadius: '8px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.2)',
  };
  
  export type Theme = typeof darkTheme;