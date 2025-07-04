// client/src/pages/NotFound.tsx
import React from 'react';
import styled from 'styled-components';
import { useTheme } from '../context/ThemeContext';
import { Link } from 'react-router-dom';

const NotFoundContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: calc(100vh - 100px); /* Adjust based on navbar height */
  background-color: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.text};
  text-align: center;
  padding: ${({ theme }) => theme.spacing.large};
`;

const Title = styled.h1`
  font-size: 4em;
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: ${({ theme }) => theme.spacing.medium};
`;

const Message = styled.p`
  font-size: 1.2em;
  margin-bottom: ${({ theme }) => theme.spacing.large};
`;

const StyledLink = styled(Link)`
  color: ${({ theme }) => theme.colors.secondary};
  text-decoration: underline;
  &:hover {
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const NotFound: React.FC = () => {
  const theme = useTheme();
  return (
    <NotFoundContainer theme={theme}>
      <Title theme={theme}>404</Title>
      <Message theme={theme}>Oops! The page you're looking for doesn't exist.</Message>
      <StyledLink to="/">Go to Home</StyledLink>
    </NotFoundContainer>
  );
};

export default NotFound;