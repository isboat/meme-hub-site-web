import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import { BrowserRouter } from 'react-router-dom';
import { PrivyProvider } from '@privy-io/react-auth';
import { ThemeProvider } from './context/ThemeContext';
import { GlobalStyles } from './styles/GlobalStyles';
import { darkTheme } from './styles/themes';
import './index.css'; // <-- ensure Tailwind directives are loaded

// Ensure you have your Privy App ID in your .env file
const PRIVY_APP_ID = import.meta.env.VITE_PRIVY_APP_ID || '';

ReactDOM.createRoot(document.getElementById('root')!).render(
    <PrivyProvider
      appId={PRIVY_APP_ID}
      config={{
        // Customize appearance for dark theme
        appearance: {
          theme: 'dark', // Enforce dark theme for Privy UI
          accentColor: '#3B82F6', // A nice blue accent
          //contentWidth: '400px',
          //fontFamily: 'Inter, sans-serif',
          logo: 'https://your-domain.com/your-logo.svg', // Optional: Your app's logo
        },
        embeddedWallets: {
          createOnLogin: 'users-without-wallets', // Create an embedded wallet for new users
        },
        loginMethods: ['email', 'google', 'twitter'], // Example login methods
      }}
    >
      <ThemeProvider>
        <GlobalStyles theme={darkTheme} /> {/* Apply global dark theme styles */}
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </ThemeProvider>
    </PrivyProvider>
);