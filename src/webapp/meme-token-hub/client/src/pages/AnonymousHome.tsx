import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import Button from '../components/common/Button';

const AnonymousHomeContainer = styled.div`
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

const ContentCard = styled.div`
  background-color: ${({ theme }) => theme.colors.cardBackground};
  padding: ${({ theme }) => theme.spacing.large};
  border-radius: ${({ theme }) => theme.borderRadius};
  box-shadow: ${({ theme }) => theme.boxShadow};
  max-width: 600px;
  width: 100%;
`;

const Title = styled.h1`
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: ${({ theme }) => theme.spacing.medium};
`;

const Description = styled.p`
  margin-bottom: ${({ theme }) => theme.spacing.large};
  line-height: 1.8;
  color: ${({ theme }) => theme.colors.placeholder};
`;

const AnonymousHome: React.FC = () => {
  const navigate = useNavigate();
  const theme = useTheme();

  const handleGetStarted = () => {
    navigate('/auth');
  };

  return (
    <AnonymousHomeContainer theme={theme}>
      <ContentCard theme={theme}>
        <Title theme={theme}>Discover and Connect on SocialSphere</Title>
        <Description theme={theme}>
          Welcome to SocialSphere, a vibrant community where you can connect with friends,
          share your thoughts, and explore diverse profiles.
          Join us to create your own space, share your moments, and interact with others.
          Browse public profiles even without an account!
        </Description>
        <Button onClick={handleGetStarted} style={{ backgroundColor: theme.colors.primary }}>
          Get Started
        </Button>
      </ContentCard>
    </AnonymousHomeContainer>
  );
};

export default AnonymousHome;