import React, { useEffect, useState } from 'react';
import { usePrivy } from '@privy-io/react-auth';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useTheme } from '../context/ThemeContext';
import Button from '../components/common/Button';
import api from '../api/api'; // Import your Axios instance
import { User } from '../types'; // Import your User type (assuming it has _id)

const AuthContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background-color: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.text};
  text-align: center;
  padding: ${({ theme }) => theme.spacing.large};
`;

const AuthCard = styled.div`
  background-color: ${({ theme }) => theme.colors.cardBackground};
  padding: ${({ theme }) => theme.spacing.large};
  border-radius: ${({ theme }) => theme.borderRadius};
  box-shadow: ${({ theme }) => theme.boxShadow};
  max-width: 400px;
  width: 100%;
`;

const Title = styled.h2`
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: ${({ theme }) => theme.spacing.large};
`;

const AuthPage: React.FC = () => {
  const { ready, authenticated, login, user: privyUser, getAccessToken } = usePrivy(); // Destructure getAccessToken
  const navigate = useNavigate();
  const theme = useTheme();

  const [authStatusMessage, setAuthStatusMessage] = useState<string>('');

  useEffect(() => {
    const authenticateWithBackend = async () => {
      if (ready && authenticated && privyUser) {
        try {
          setAuthStatusMessage('Contacting backend to authenticate...');

          // CORRECTED LINE: Use getAccessToken() from the usePrivy hook
          const privyAccessToken = await getAccessToken();

          if (!privyAccessToken) {
            throw new Error('Privy access token not available. Please try logging in again.');
          }

          const payload = {
            privyId: privyUser.id,
            email: privyUser.email?.address || `${privyUser.id}@privy.io`,
            username: privyUser.email?.address?.split('@')[0] || privyUser.id.substring(0, 8),
            privyAccessToken, // Send Privy's access token for backend validation
            // Add other Privy user details you want to sync, e.g., wallet addresses
            walletAddress: privyUser.wallet?.address || null,
            privyUser: privyUser
          };

          // Define the expected response structure for clarity
          interface AuthBackendResponse {
            accessToken: string;
            refreshToken: string;
            user: User; // Assuming your backend returns a 'user' object matching your User type
          }

          const response = await api.post<AuthBackendResponse>('/auth/gettoken', payload);

          const { accessToken, refreshToken, user } = response.data;

          localStorage.setItem('accessToken', accessToken);
          localStorage.setItem('refreshToken', refreshToken);
          localStorage.setItem('memeTokenHubUserId', user._id); // Assuming _id is the unique identifier from your backend

          setAuthStatusMessage('Authenticated successfully! Redirecting...');
          navigate('/dashboard');
        } catch (error: any) {
          console.error('Authentication error:', error);
          setAuthStatusMessage(`Error: ${error.response?.data?.message || error.message || 'Something went wrong'}`);
        }
      } else if (ready && !authenticated) {
        setAuthStatusMessage('');
      }
    };

    authenticateWithBackend();
    // Add getAccessToken to the dependency array
  }, [ready, authenticated, privyUser, navigate, getAccessToken]);

  const handleLogin = async () => {
    try {
      setAuthStatusMessage('Opening Privy login...');
      await login(); // Privy's login modal will appear
      // The useEffect above will handle post-login backend logic
    } catch (error) {
      console.error('Privy login error:', error);
      setAuthStatusMessage('Privy login failed. Please try again.');
    }
  };

  return (
    <AuthContainer theme={theme}>
      <AuthCard theme={theme}>
        <Title theme={theme}>Welcome to SocialSphere</Title>
        <p>Log in or create an account to start connecting.</p>
        <Button onClick={handleLogin} disabled={!ready} style={{ marginTop: theme.spacing.large }}>
          {ready ? 'Sign Up / Log In' : 'Loading...'}
        </Button>
        {authStatusMessage && <p style={{ marginTop: theme.spacing.medium, color: theme.colors.placeholder }}>{authStatusMessage}</p>}
      </AuthCard>
    </AuthContainer>
  );
};

export default AuthPage;