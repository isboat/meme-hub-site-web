import React, { useState } from 'react';
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
  min-height: calc(100vh - 120px);
  box-sizing: border-box;

  @media (max-width: 600px) {
    padding: ${({ theme }) => theme.spacing.medium};
  }
`;

const Inner = styled.div`
  width: 100%;
  max-width: 1200px;
`;

const Header = styled.h1`
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: ${({ theme }) => theme.spacing.large};
  font-size: 2.2rem;
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.small};

  @media (max-width: 480px) {
    font-size: 1.6rem;
  }
`;

const TopSection = styled.div`
  text-align: left;
  margin-bottom: ${({ theme }) => theme.spacing.large};
`;

const ControlsRow = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;
  margin-top: ${({ theme }) => theme.spacing.small};
  flex-wrap: wrap;

  @media (max-width: 600px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

const SearchInput = styled.input`
  flex: 1 1 300px;
  min-width: 0;
  padding: 10px 12px;
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.background || 'transparent'};
  color: ${({ theme }) => theme.colors.text};
  outline: none;
  box-sizing: border-box;

  &::placeholder { color: ${({ theme }) => theme.colors.placeholder}; }

  @media (max-width: 600px) {
    width: 100%;
    flex: none;
  }
`;

const FiltersRow = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
  margin-top: ${({ theme }) => theme.spacing.medium};
  flex-wrap: wrap;

  @media (max-width: 600px) {
    width: 100%;
    justify-content: flex-start;
  }
`;

const ChainWrapper = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
`;

const Grid = styled.div`
  display: grid;
  gap: 16px;
  margin-top: ${({ theme }) => theme.spacing.large};
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));

  @media (max-width: 900px) {
    grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  }

  @media (max-width: 480px) {
    grid-template-columns: repeat(1, 1fr);
  }
`;

const Card = styled.a`
  display: block;
  text-decoration: none;
  cursor: pointer;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 10px;
  overflow: hidden;
  background: '#fff'
  transition: transform 120ms ease, box-shadow 120ms ease;
  color: inherit;

  &:hover {
    transform: translateY(-4px);
    box-shadow: ${({ theme }) => theme.boxShadow};
  }

  @media (max-width: 700px) {
    display: flex;
  }
`;

const CardImage = styled.img`
  width: 100%;
  height: 120px;
  object-fit: cover;
  display: block;
  background: #eee;

  @media (max-width: 480px) {
    width: auto;
  }
`;

const CardBody = styled.div`
  padding: 10px;
  font-size: 0.9rem;
  color: ${({ theme }) => theme.colors.text};
`;

const MetaRow = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 8px;
  align-items: center;
  margin-top: 6px;
  color: ${({ theme }) => theme.colors.dimmedWhite || '#666'};
  font-size: 0.85rem;
`;

const MetaRowSince = styled.div`
  text-transform: capitalize;
  @media (max-width: 700px) {
    display: none;
  }
`;

const NoResults = styled.p`
  text-align: center;
  margin-top: ${({ theme }) => theme.spacing.large};
  color: ${({ theme }) => theme.colors.placeholder};
`;

// ...existing code...
//type SortType = "featured" | "az" | "since";

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
  //const [sort, setSort] = useState<SortType>("featured");
  const [selected, setSelected] = useState('');
  const [isLoadingNetworkTokens, setIsLoadingNetworkTokens] = useState<boolean>(false);

  let { data: networkData, loading, error } = useApi<NetworkData[]>('/memetoken/networks');

  const [networkTokenData, setNetworkTokenData] = useState([] as NetworkTokenData[]);

  const loadNetworkTokens = async (event: React.MouseEvent<HTMLButtonElement>) : Promise<void> => {
    event.preventDefault();
    const networkName = event.currentTarget.textContent?.trim().toLowerCase();
    if (!networkName) return;

    const network = networkData?.find(chain => chain.name.toLowerCase() === networkName);
    if (network) {
      setSelected(network.chainIdentifier);
      setIsLoadingNetworkTokens(true);
      setNetworkTokenData([]);

      const response = await api.get<NetworkTokenData[]>(`/memetoken/${network.chainIdentifier}/tokens`);
      const tokensData = response.data;
      if (tokensData) {
        setNetworkTokenData(tokensData);
      }
      setIsLoadingNetworkTokens(false);
    }
  }
  
  const searchToken = async (event: React.ChangeEvent<HTMLInputElement>) : Promise<void> => {
    event.preventDefault();
    
    const searchInputValue = event.currentTarget.value;
    setQuery(searchInputValue);

    const trimmed = searchInputValue.trim();
    if (trimmed === "") {
      setNetworkTokenData([]);
      return;
    }
    // more than 4 characters to search
    if (trimmed.length < 4) {
      setNetworkTokenData([]);
      return;
    }
    if (trimmed.length >= 4) {
      setSelected("all");
      setIsLoadingNetworkTokens(true);
      setNetworkTokenData([]);

      const response = await api.get<NetworkTokenData[]>(`/memetoken/search/${trimmed}`);
      const tokensData = response.data;
      if (tokensData) {
        setNetworkTokenData(tokensData);
      }
      setIsLoadingNetworkTokens(false);
    }
  }

  const navigateToTokenPage = (token: NetworkTokenData): void => {
    if (!token || !token.address) return;
    navigate(`/token/${token.address}`, { state: { token } });
  };

  if (loading) {
    return (
      <PageContainer theme={theme}>
        <Inner>
          <Header theme={theme}>Trending</Header>
          <LoadingSpinner />
          <p style={{ textAlign: 'center', color: theme.colors.placeholder }}>Loading data...</p>
        </Inner>
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
        <Inner>
          <Header theme={theme}>Tokens</Header>
          <NoResults theme={theme}>Error loading tokens: {errorMessage}</NoResults>
        </Inner>
      </PageContainer>
    );
  }

  const allowNetworks = ['solana', 'ethereum', 'bnb', 'polygon', 'base', 'tron', 'unichain'];

  if (!networkData) {
    return (
      <PageContainer theme={theme}>
        <Inner>
          <Header theme={theme}>Tokens</Header>
          <NoResults theme={theme}>No tokens found!</NoResults>
        </Inner>
      </PageContainer>
    );
  } else {
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
      <Inner>
        <TopSection theme={theme}>
          <Header theme={theme}>Trending Coins</Header>
          <p style={{ marginBottom: theme.spacing.medium, color: theme.colors.dimmedWhite }}>
            The original OG, authentic meme coins — artwork first. Tap a card to view the full profile.
          </p>

          <ControlsRow theme={theme}>
            <SearchInput
              type="search"
              placeholder="Search (doge, shib, pepe…)"
              value={query}
              onChange={e => { searchToken(e); }}
              aria-label="Search tokens"
              theme={theme}
            />

            {/* <CapsuleSelect
              value={sort}
              onChange={e => setSort(e.target.value as SortType)}
              aria-label="Sort tokens"
            >
              <option value="featured">Featured</option>
              <option value="az">A → Z</option>
              <option value="since">Newest</option>
            </CapsuleSelect> */}
          </ControlsRow>

          <FiltersRow aria-label="Filter by chain" theme={theme}>
            <ChainWrapper>
              {CHAIN_FILTERS.map(f => (
                <CapsuleButton
                  className={addClassName(f)}
                  key={f.value}
                  onClick={(event) => { loadNetworkTokens(event) }}
                  aria-pressed={selected === f.value}
                >
                  {f.label}
                </CapsuleButton>
              ))}
            </ChainWrapper>
          </FiltersRow>
        </TopSection>

        {isLoadingNetworkTokens && <LoadingSpinner />}
        {!isLoadingNetworkTokens && networkTokenData.length === 0 && (
          <NoResults theme={theme}>No tokens found.</NoResults>
        )}

        <Grid theme={theme}>
          {networkTokenData.map(c => (
            <Card
              key={c.name}
              onClick={() => navigateToTokenPage(c)}
              role="link"
              tabIndex={0}
              onKeyDown={(e) => { if (e.key === 'Enter') navigateToTokenPage(c); }}
              theme={theme}
            >
              <CardImage src={c.logoURI} alt={`${c.name} Banner`} />
              <CardBody theme={theme}>
                <div style={{ fontWeight: 700, fontSize: '0.95rem', textTransform: 'capitalize' }}>
                  {c.name} <span style={{ fontWeight: 500, fontSize: '0.85rem' }}>({c.symbol})</span>
                </div>
                <MetaRow theme={theme}>
                  <div>Mkt Cap: {fmtCap(c.marketcap)}</div>
                  <MetaRowSince>{selected} • since 2023</MetaRowSince>
                </MetaRow>
              </CardBody>
            </Card>
          ))}
        </Grid>
      </Inner>
    </PageContainer>
  );
};

export default TokensFeed;
// ...existing code...