import React, { useEffect } from 'react';
import { usePrivy } from '@privy-io/react-auth';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useTheme } from '../context/ThemeContext';
import Button from '../components/common/Button';

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
  const { ready, authenticated, login } = usePrivy();
  const navigate = useNavigate();
  const theme = useTheme();

  useEffect(() => {
    if (ready && authenticated) {
      navigate('/dashboard'); // Redirect to dashboard if authenticated
    }
  }, [ready, authenticated, navigate]);

  const handleLogin = async () => {
    try {
      await login(); // Privy's login modal will appear
    } catch (error) {
      console.error('Privy login error:', error);
      // Handle login error, e.g., show a toast message
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
      </AuthCard>
    </AuthContainer>
  );
};

export default AuthPage;