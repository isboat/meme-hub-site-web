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
  const [showCap, setShowCap] = useState<boolean>(false);

  let { data: networkData, loading, error } = useApi<NetworkData[]>('/memetoken/networks');

  const [networkTokenData, setNetworkTokenData] = useState([] as NetworkTokenData[]);
  let isLoadingNetworkTokens = false;

  const loadNetworkTokens = async (event: React.MouseEvent<HTMLButtonElement>): Promise<void> => {
    event.preventDefault();
    const networkName = event.currentTarget.textContent?.trim().toLowerCase();
    if (!networkName) return;

    const network = networkData?.find(chain => chain.name.toLowerCase() === networkName);
    if (network) {
      isLoadingNetworkTokens = true;
      // load the tokens from api
      const response = await api.get<NetworkTokenData[]>(`/memetoken/${network.chainIdentifier}/tokens`);
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

  return (
    <PageContainer theme={theme}>
      <Header theme={theme}>Trending Network Tokens</Header>

      <div>
        <div>
          <div>
            <div>
              <h1>Trending Coins</h1>
              <p>
                The original OG, authentic meme coins — artwork first. Click a card to view the full profile.
              </p>
              <div>
                <label>
                  <input
                    type="checkbox"
                    checked={showCap}
                    onChange={e => setShowCap(e.target.checked)}
                  />
                  <span>Show Market Caps</span>
                </label>
                <span className="text-slate-600">•</span>
                <input
                  type="search"
                  placeholder="Search (doge, shib, pepe…)"
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                />
                <span className="text-slate-600 hidden sm:inline">•</span>
                <select
                  value={sort}
                  onChange={e => setSort(e.target.value as SortType)}
                >
                  <option value="featured">Featured</option>
                  <option value="az">A → Z</option>
                  <option value="since">Newest</option>
                </select>
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '16px' }} aria-label="Filter by chain">
            {CHAIN_FILTERS.map(f => (
              <CapsuleButton key={f.value} onClick={(event) => { loadNetworkTokens(event) }}>
                {f.label}
              </CapsuleButton>
            ))}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px' }}>
            {networkTokenData.map(c => {
              return (
                <div key={c.name} style={{ border: '1px solid #ccc', borderRadius: '8px', overflow: 'hidden' }}>
                  <a href={`#/token/${c.symbol.toLowerCase()}`} className="block" aria-label={`View ${c.name} profile`}>
                    <div className="relative">
                      <img width="100%" src={c.logoURI} alt={`${c.name} Banner`} />
                    </div>
                  </a>
                  <div className="p-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <h3 className="title font-semibold truncate">{c.name} <span className="text-xs text-slate-400">({c.symbol})</span></h3>
                        <div>{c.name} • since 2023</div>
                      </div>
                      {showCap && (
                        <span className="ml-2 inline-flex items-center rounded-full bg-slate-900/70 border border-slate-700 px-2 py-0.5 text-[10px]">
                          MC {fmtCap(c.marketcap)}
                        </span>
                      )}
                    </div>
                    <div className="mt-2">
                      <a href={`#/token/${c.symbol.toLowerCase()}`} className="inline-flex items-center gap-2 rounded-md bg-amber-400 text-slate-900 px-3 py-1.5 text-xs font-semibold hover:bg-amber-300">
                        View Profile
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </PageContainer>
  );
};

export default TokensFeed;