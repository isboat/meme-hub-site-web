// client/src/pages/UnclaimedTokensFeed.tsx
import React from 'react';
import styled from 'styled-components';
import { useTheme } from '../context/ThemeContext';
import { TrendingData } from '../types';
import LoadingSpinner from '../components/common/LoadingSpinner';
import axios from 'axios'; // For robust error handling
import { useApi } from '../hooks/useApi';

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: ${({ theme }) => theme.spacing.large};
  background-color: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.text};
  min-height: calc(100vh - 120px); /* Adjust based on navbar/ticker height */
`;

const Header = styled.h1`
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: ${({ theme }) => theme.spacing.large};
  font-size: 2.5em;
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.small};
`;

const ErrorMessage = styled.p`
  color: ${({ theme }) => theme.colors.error};
  text-align: center;
  margin-top: ${({ theme }) => theme.spacing.large};
`;

const TokensFeed: React.FC = () => {
  const theme = useTheme();

  const { data: trendingData, loading, error } = useApi<TrendingData>('/memetoken/trending');

  if (loading) {
    return (
      <PageContainer theme={theme}>
        <Header theme={theme}>Trending</Header>
        <LoadingSpinner />
        <p style={{ textAlign: 'center', color: theme.colors.placeholder }}>Loading profiles...</p>
      </PageContainer>
    );
  }

  if (error) {
    let errorMessage = 'An unexpected error occurred.';
    if (axios.isAxiosError(error)) {
      errorMessage = error.response?.data?.message || error.message;
    } else {
      errorMessage = String(error);
    }
    return (
      <PageContainer theme={theme}>
        <Header theme={theme}>Profiles</Header>
        <ErrorMessage theme={theme}>Error loading profiles: {errorMessage}</ErrorMessage>
      </PageContainer>
    );
  }

  if (!trendingData) {
    return (
      <PageContainer theme={theme}>
        <Header theme={theme}>Profiles</Header>
        <p>No profiles found. Start creating some!</p>
      </PageContainer>
    );
  }

  return (
    <PageContainer theme={theme}>
      <Header theme={theme}>Trending</Header>
      <div style={{ display: 'flex' }}>
      {Object.entries(trendingData.data).filter(([chainName, tokens]) => (chainName != 'undefined' && tokens != null)).map(([chainName, tokens]) => (
        <div key={chainName} style={{ marginRight: '2rem', display:'block' }}>
        <h2><img src={tokens[0].chain_logo} width={24} /> {chainName.toLocaleUpperCase()}</h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', border: '1px solid #ddd', borderRadius: '8px', }}>
          {tokens.map((token, index) => (
            <div
              key={index}
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '0.5rem',
                gap: '1rem',
              }}
            >
                <img src={token.logo} alt={token.name} width={50} />
                <div>
                  <strong>{token.name}</strong> ({token.symbol})
                </div>
                <div>{token.h24}%</div>
            </div>
          ))}
        </div>
      </div>
      ))}
      </div>
    </PageContainer>
  );
};

export default TokensFeed;