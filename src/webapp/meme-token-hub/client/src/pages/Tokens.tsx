// client/src/pages/UnclaimedTokensFeed.tsx
import React, { useState } from 'react';
import styled from 'styled-components';
import { useTheme } from '../context/ThemeContext';
import { NetworkData, NetworkTokenData } from '../types';
import LoadingSpinner from '../components/common/LoadingSpinner';
import axios from 'axios'; // For robust error handling
import { useApi } from '../hooks/useApi';
import api from '../api/api';
import { useNavigate } from 'react-router';

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
  const navigate = useNavigate();

  const { data: networkData, loading, error } = useApi<NetworkData[]>('/memetoken/networks');
  
  const [networkTokenData, setNetworkTokenData] = useState([] as NetworkTokenData[]);
  let isLoadingNetworkTokens = false;

  const loadNetworkTokens = async (event: React.MouseEvent<HTMLAnchorElement>): Promise<void> => {
    event.preventDefault();
    const networkName = event.currentTarget.textContent?.trim().toLowerCase();
    if (!networkName) return;

    const network = networkData?.find(chain => chain.name.toLowerCase() === networkName);
    if (network) {
      isLoadingNetworkTokens = true;
      // load the tokens from api
      const response = await api.get<NetworkTokenData[]>(`/memetoken/${network.slug}/tokens`);
      const tokensData = response.data;
      if (tokensData) {
        setNetworkTokenData(tokensData);
      }
      isLoadingNetworkTokens = false;
    }
  }

  const navigateToTokenPage = (token: NetworkTokenData): void => {
    if (!token || !token.id) return;
    // Navigate to the token profile page
    // pass the token object to the token profile page
    navigate(`/token/${token.addresses[0].tokenAddress}`, { state: { token } });
  };

  if (loading) {
    return (
      <PageContainer theme={theme}>
        <Header theme={theme}>Trending</Header>
        <LoadingSpinner />
        <p style={{ textAlign: 'center', color: theme.colors.placeholder }}>Loading data...</p>
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
        <Header theme={theme}>Tokens</Header>
        <ErrorMessage theme={theme}>Error loading tokens: {errorMessage}</ErrorMessage>
      </PageContainer>
    );
  }

  if (!networkData) {
    return (
      <PageContainer theme={theme}>
        <Header theme={theme}>Tokens</Header>
        <p>No tokens found!</p>
      </PageContainer>
    );
  }

  return (
    <PageContainer theme={theme}>
      <Header theme={theme}>Trending Network Tokens</Header>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', justifyContent: 'center' }}>
        {networkData.filter(chain => chain.name != 'undefined').map((chain) => (
          <div key={chain.slug} style={{ display:'block' }}>
          <a onClick={loadNetworkTokens}><img src={chain.logoUrl} width={24} /> {chain.name.toLocaleUpperCase()}</a>
      </div>
      ))}
      </div>
      <div>
        {isLoadingNetworkTokens && <LoadingSpinner />}
        {!isLoadingNetworkTokens && networkTokenData.length === 0 && <p>No tokens found for the selected network.</p>}
        {networkTokenData.map(token => (
          <div key={token.id} onClick={() =>navigateToTokenPage(token)} style={{ cursor: 'pointer', margin: '10px', padding: '10px', border: '1px solid #ddd', borderRadius: '8px' }}>
            <h3>{token.name}</h3>
            <p>Price: ${token.price}</p>
          </div>
        ))}
      </div>
    </PageContainer>
  );
};

export default TokensFeed;