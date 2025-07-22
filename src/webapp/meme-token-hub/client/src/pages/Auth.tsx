// client/src/pages/Auth.tsx
import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { usePrivy } from '@privy-io/react-auth';
import { useNavigate } from 'react-router-dom';
import api from '../api/api';
import { User } from '../types'; // Assuming User type is defined
import { useTheme } from '../context/ThemeContext';

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: calc(100vh - 120px); /* Adjust based on navbar/ticker height */
  padding: ${({ theme }) => theme.spacing.large};
  background-color: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.text};
`;

const ContentCard = styled.div`
  background-color: ${({ theme }) => theme.colors.cardBackground};
  padding: ${({ theme }) => theme.spacing.large};
  border-radius: ${({ theme }) => theme.borderRadius};
  box-shadow: ${({ theme }) => theme.boxShadow};
  width: 100%;
  max-width: 400px;
  text-align: center;
`;

const Header = styled.h1`
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: ${({ theme }) => theme.spacing.medium};
`;

const StatusMessage = styled.p`
  margin-top: ${({ theme }) => theme.spacing.medium};
  color: ${({ theme }) => theme.colors.placeholder};
`;

// Interface for the backend authentication response
interface AuthBackendResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
  isNewUser: boolean;
}

const AuthPage: React.FC = () => {
  const theme = useTheme(); // Now useTheme is recognized
  const navigate = useNavigate();
  const { ready, authenticated, user: privyUser, login, getAccessToken } = usePrivy();

  const [authStatusMessage, setAuthStatusMessage] = useState('');

  const authenticateWithBackend = useCallback(async () => {
    if (ready && authenticated && privyUser) {
      try {
        setAuthStatusMessage('Contacting backend to authenticate...');

        const privyAccessToken = await getAccessToken();

        if (!privyAccessToken) {
          throw new Error('Privy access token not available. Please try logging in again.');
        }

        const payload = {
          privyId: privyUser.id,
          email: privyUser.email?.address || `${privyUser.id}@privy.io`,
          username: privyUser.email?.address?.split('@')[0] || privyUser.id.substring(0, 8),
          privyAccessToken,
          walletAddress: privyUser.wallet?.address || null,
          privyUser: privyUser
        };

        const response = await api.post<AuthBackendResponse>('/auth/gettoken', payload);

        const { accessToken, refreshToken, user, isNewUser } = response.data;

        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);
        localStorage.setItem('memeTokenHubUserId', user._id);

        if (isNewUser) {
          setAuthStatusMessage('Welcome! Please complete your profile...');
          setTimeout(() => navigate('/create-profile'), 1500);
        } else {
          setAuthStatusMessage('Authenticated successfully! Redirecting...');
          setTimeout(() => navigate('/'), 1500);
        }
      } catch (error: any) {
        console.error('Authentication error:', error);
        setAuthStatusMessage(`Error: ${error.response?.data?.message || error.message || 'Something went wrong'}`);
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('memeTokenHubUserId');
      }
    } else if (ready && !authenticated) {
      setAuthStatusMessage('');
    }
  }, [ready, authenticated, privyUser, navigate, getAccessToken]);

  useEffect(() => {
    if (ready && authenticated && !authStatusMessage) {
        authenticateWithBackend();
    }
  }, [ready, authenticated, authStatusMessage, authenticateWithBackend]);

  if (!ready || (ready && !authenticated)) {
    return (
      <PageContainer theme={theme}>
        <ContentCard theme={theme}>
          <Header theme={theme}>Welcome to MemeTokenHub</Header>
          <StatusMessage theme={theme}>
            Please log in to continue.
          </StatusMessage>
          <button
            onClick={login}
            style={{
              background: theme.colors.primary,
              color: theme.colors.cardBackground,
              padding: theme.spacing.small + ' ' + theme.spacing.medium,
              border: 'none',
              borderRadius: theme.borderRadius,
              fontWeight: 600,
              cursor: 'pointer',
              marginTop: theme.spacing.large,
              width: '100%',
              fontSize: '1.1em'
            }}
          >
            Log In with Privy
          </button>
        </ContentCard>
      </PageContainer>
    );
  }

  return (
    <PageContainer theme={theme}>
      <ContentCard theme={theme}>
        <Header theme={theme}>Authentication</Header>
        <StatusMessage theme={theme}>
          {authStatusMessage || 'Authenticating...'}
        </StatusMessage>
      </ContentCard>
    </PageContainer>
  );
};

export default AuthPage;