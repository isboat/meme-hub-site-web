// client/src/styles/themes.ts
export const darkTheme = {
    colors: {
      background: '#000000',
      cardBackground: '#141414ff',
      navBarBackground: '#141414ff',
      text: '#ffffff',
      dimmedWhite: '#a2a4a5ff',
      primary: '#00b8d8',
      capsuleButton: '#1e293b',
      white: '#ffffff',
      ticker: '#fbbf24',
      secondary: '#6366f1',
      border: '#282829ff',
      footer: '#848585ff',
      placeholder: '#a0aec0',
      success: '#10b981',
      warning: '#ff9900',
      error: '#ef4444',
      twitter: '#1DA1F2',
    },
    button: {
      size : {
        medium: '200px',
        small: '100px',
        large: '300px'
      }
    },
    spacing: {
      extraSmall: '4px',
      small: '8px',
      medium: '16px',
      large: '24px',
      extraLarge: '48px',
    },
    borderRadius: '8px',

    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.2)',
    breakpoints: {
      small: '576px', // Example: for phones
      medium: '768px', // Example: for tablets
      large: '992px', // Example: for desktops
    }
  };
  
  export type Theme = typeof darkTheme;