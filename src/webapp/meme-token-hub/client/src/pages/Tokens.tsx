// client/src/pages/UnclaimedTokensFeed.tsx
import React, { useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import { useTheme } from '../context/ThemeContext';
import { NetworkData, NetworkTokenData } from '../types';
import LoadingSpinner from '../components/common/LoadingSpinner';
import axios from 'axios'; // For robust error handling
import { useApi } from '../hooks/useApi';
import api from '../api/api';
import { useNavigate } from 'react-router';
import CapsuleButton from '../components/common/CapsuleButton';
import CapsuleSelect from '../components/common/CapsuleSelect';

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

const TopSection = styled.div`
  text-align: center;
  margin-bottom: ${({ theme }) => theme.spacing.large};
`;

type SortType = "featured" | "az" | "since";

const CHAIN_FILTERS = [
  { label: "All", value: "all" }
];

function fmtCap(n: number | undefined) {
  if (n == null) return '—';
  if (n >= 1e12) return '$' + (n / 1e12).toFixed(2) + 'T';
  if (n >= 1e9) return '$' + (n / 1e9).toFixed(2) + 'B';
  if (n >= 1e6) return '$' + (n / 1e6).toFixed(2) + 'M';
  if (n >= 1e3) return '$' + (n / 1e3).toFixed(0) + 'K';
  return '$' + Math.round(n);
}

const TokensFeed: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [query, setQuery] = useState<string>("");
  const [sort, setSort] = useState<SortType>("featured");
  const [selected, setSelected] = useState('');
  const [isLoadingNetworkTokens, setIsLoadingNetworkTokens] = useState<boolean>(false);

  let { data: networkData, loading, error } = useApi<NetworkData[]>('/memetoken/networks');

  const [networkTokenData, setNetworkTokenData] = useState([] as NetworkTokenData[]);

  const loadNetworkTokens = async (event: React.MouseEvent<HTMLButtonElement>): Promise<void> => {
    event.preventDefault();
    const networkName = event.currentTarget.textContent?.trim().toLowerCase();
    if (!networkName) return;

    const network = networkData?.find(chain => chain.name.toLowerCase() === networkName);
    if (network) {
      setSelected(network.chainIdentifier);
      setIsLoadingNetworkTokens(true);
      // Reset the token data
      setNetworkTokenData([]);

      // load the tokens from api
      const response = await api.get<NetworkTokenData[]>(`/memetoken/${network.chainIdentifier}/tokens`);
      const tokensData = response.data;
      if (tokensData) {
        setNetworkTokenData(tokensData);
      }
      setIsLoadingNetworkTokens(false);
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

  const allowNetworks = ['solana', 'ethereum', 'bnb', 'polygon', 'base', 'tron', 'unichain'];

  if (!networkData) {
    return (
      <PageContainer theme={theme}>
        <Header theme={theme}>Tokens</Header>
        <p>No tokens found!</p>
      </PageContainer>
    );
  }
  else {
    if (networkData) {
      networkData = networkData.filter(chain => allowNetworks.includes(chain.chainIdentifier.toLowerCase()));
      networkData.forEach(chain => {
        if (!CHAIN_FILTERS.some(f => f.value === chain.chainIdentifier)) {
          CHAIN_FILTERS.push({ label: chain.name, value: chain.chainIdentifier });
        }
      });
    }
  }

  const addClassName = (platform: { label: string; value: string; }) => {
    var className = platform.value === selected ? 'selected' : '';
    return className;
  };

  return (
    <PageContainer theme={theme}>
      <div style={{ width: '100%', maxWidth: '1200px'}}>
        <TopSection theme={theme}>
          <div>
            <h1 style={{ marginBottom: theme.spacing.small }}>Trending Coins</h1>
            <p style={{ marginBottom: theme.spacing.medium, color: theme.colors.text }}>
              The original OG, authentic meme coins — artwork first. Click a card to view the full profile.
            </p>
            <div style={{ marginBottom: theme.spacing.medium }}>
              <input style={{ width: '75%', margin: '0 20px' }}
                type="search"
                placeholder="Search (doge, shib, pepe…)"
                value={query}
                onChange={e => setQuery(e.target.value)}
              />
              <CapsuleSelect
                value={sort}
                onChange={e => setSort(e.target.value as SortType)}
              >
                <option value="featured">Featured</option>
                <option value="az">A → Z</option>
                <option value="since">Newest</option>
              </CapsuleSelect>
            </div>
          </div>
          <div style={{ marginBottom: '16px' }} aria-label="Filter by chain">
            {CHAIN_FILTERS.map(f => (
              <CapsuleButton className={addClassName(f)} key={f.value} onClick={(event) => { loadNetworkTokens(event) }}>
                {f.label}
              </CapsuleButton>
            ))}
          </div>
        </TopSection>
        {isLoadingNetworkTokens && <LoadingSpinner />}
        {!isLoadingNetworkTokens && networkTokenData.length === 0 && (
          <p style={{ textAlign: 'center' }}>No tokens found.</p>
        )}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '16px' }}>

          {networkTokenData.map(c => {
            return (
              <div key={c.name} style={{ border: '1px solid #ccc', borderRadius: '8px', overflow: 'hidden' }}>
                <a href={`#/token/${c.symbol.toLowerCase()}`} className="block" aria-label={`View ${c.name} profile`}>
                  <div>
                    <img width="100%" src={c.logoURI} alt={`${c.name} Banner`} />
                  </div>
                </a>
                <div style={{ padding: '10px' }}>
                  <div>
                    <div style={{ fontWeight: 'bold', fontSize: 'small', textTransform: 'capitalize' }}>{c.name} <span>({c.symbol})</span></div>
                    <div style={{ fontSize: 'smaller', color: '#666', textTransform: 'capitalize' }}>Mkt Cap: {fmtCap(c.marketcap)}</div>
                    <div style={{ fontSize: 'smaller', color: '#666', textTransform: 'capitalize' }}>{selected} • since 2023</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </PageContainer>
  );
};

export default TokensFeed;