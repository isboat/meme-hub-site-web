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
import { UserTokenSocialsClaim } from '../types/token-components';

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

const ImageWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 120px;
  overflow: hidden;
  border-bottom-left-radius: 10px;
  border-bottom-right-radius: 0;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;

  @media (max-width: 480px) {
    height: 100%;
  }
`;

const StatusRibbon = styled.span<{ statusKey?: 'verified' | 'pending' | 'rejected' | '' }>`
  position: absolute;
  left: 8px;
  top: 8px;
  padding: 6px 10px;
  border-radius: 8px;
  font-weight: 800;
  font-size: 0.7rem;
  text-transform: uppercase;
  color: #07122a;
  box-shadow: 0 6px 18px rgba(2,6,23,0.12);
  z-index: 10;

  background: ${props =>
    props.statusKey === 'verified'
      ? 'linear-gradient(90deg,#a7f3d0,#34d399)'
      : props.statusKey === 'rejected'
      ? 'linear-gradient(90deg,#fecaca,#f97373)'
      : props.statusKey === 'pending'
      ? 'linear-gradient(90deg,#fef3c7,#f59e0b)'
      : 'linear-gradient(90deg,#e5e7eb,#cbd5e1)'};
`;

// Helper: map numeric status to a readable key+label.
// Adjust mapping here if backend uses different codes.
const mapStatus = (s?: number | string | null) : { key: 'verified'|'pending'|'rejected'|'', label: string } => {
  if (s == null) return { key: '', label: 'Unknown' };
  const n = Number(s);
  switch (n) {
    case 1: // backend: 2 => verified
      return { key: 'verified', label: 'Verified' };
    case 2: // backend: 3 => rejected
      return { key: 'rejected', label: 'Rejected' };
    case 0: // backend: 1 => pending
      return { key: 'pending', label: 'Pending' };
    default:
      return { key: '', label: String(s).toUpperCase() };
  }
};

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

  let { data: communityTokens, loading: communityLoading, error: communityError } = useApi<UserTokenSocialsClaim[]>('/token-profile/socials');

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
          <Header theme={theme}>The social layer for meme tokens</Header>
          <p style={{ marginBottom: theme.spacing.medium, color: theme.colors.dimmedWhite }}>
            Claim your token, prove it’s you, keep links and updates transparent. Discover real community activity by network.
          </p>

          <ControlsRow theme={theme}>
            <SearchInput
              type="search"
              placeholder="Paste contract (e.g., 0x... or Solana base58) or type Member ID (e.g., MT-123456)"
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
          {networkTokenData.map(c => {
            const statusInfo = mapStatus(c.status);
            return (
             <Card
               key={c.name}
               onClick={() => navigateToTokenPage(c)}
               role="link"
               tabIndex={0}
               onKeyDown={(e) => { if (e.key === 'Enter') navigateToTokenPage(c); }}
               theme={theme}
             >
               <ImageWrapper>
                 <CardImage src={c.logoURI} alt={`${c.name} Banner`} />
                {statusInfo.key && <StatusRibbon statusKey={statusInfo.key}>
                  {statusInfo.label}
                </StatusRibbon>}
               </ImageWrapper>

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
            );
          })}
        </Grid>
      </Inner>
      <div id="communityTokens" style={{ width: '100%', maxWidth: '1200px', margin: '0 auto' }}>
        <CommunitySection theme={theme}>
          <h3 style={{ marginTop: 0, marginBottom: 24, color: theme.colors.white }}>
            Activity right now
          </h3>

          {communityLoading && (
            <div style={{ textAlign: 'center', padding: '24px' }}>
              <LoadingSpinner />
              <p style={{ color: theme.colors.placeholder, marginTop: 12 }}>Loading community tokens...</p>
            </div>
          )}

          {!communityLoading && communityError && (
            <NoResults theme={theme}>Error loading community tokens.</NoResults>
          )}

          {!communityLoading && communityTokens && communityTokens.length === 0 && (
            <NoResults theme={theme}>No community tokens found.</NoResults>
          )}

          {!communityLoading && communityTokens && communityTokens.length > 0 && (
            <ActivityContainer theme={theme}>
              {/* Verified Column */}
              <Column>
                <SectionKicker theme={theme}>Verified Communities</SectionKicker>
                <List>
                  {communityTokens
                    .filter(c => mapStatus(c.status).key === 'verified')
                    .map(c => (
                      <ListItem
                        key={c.id}
                        theme={theme}
                        onClick={() => navigate(`/token/${c.tokenAddress}`, { state: { token: c } })}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') navigate(`/token/${c.tokenAddress}`, { state: { token: c } });
                        }}
                      >
                        <LogoImg
                          src={c.logoUrl || 'data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2248%22%20height%3D%2248%22%20viewBox%3D%220%200%2048%2048%22%3E%3Crect%20rx%3D%228%22%20ry%3D%228%22%20width%3D%2248%22%20height%3D%2248%22%20fill%3D%22%23e5e7eb%22%2F%3E%3C%2Fsvg%3E'}
                          alt={`${c.tokenName} logo`}
                        />
                        <ItemContent>
                          <ItemTitle>
                            <strong>{c.tokenName}</strong>
                          </ItemTitle>
                          <ItemMeta>
                            {c.chain} • {new Date(c.submittedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                          </ItemMeta>
                        </ItemContent>
                      </ListItem>
                    ))}
                  {communityTokens.filter(c => mapStatus(c.status).key === 'verified').length === 0 && (
                    <div style={{ textAlign: 'center', padding: '24px', color: theme.colors.placeholder }}>
                      No verified communities yet.
                    </div>
                  )}
                </List>
              </Column>

              {/* Pending Column */}
              <Column>
                <SectionKicker theme={theme}>Pending Communities</SectionKicker>
                <List>
                  {communityTokens
                    .filter(c => mapStatus(c.status).key === 'pending')
                    .map(c => (
                      <ListItem
                        key={c.id}
                        theme={theme}
                        onClick={() => navigate(`/token/${c.tokenAddress}`, { state: { token: c } })}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') navigate(`/token/${c.tokenAddress}`, { state: { token: c } });
                        }}
                      >
                        <LogoImg
                          src={c.logoUrl || 'data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2248%22%20height%3D%2248%22%20viewBox%3D%220%200%2048%2048%22%3E%3Crect%20rx%3D%228%22%20ry%3D%228%22%20width%3D%2248%22%20height%3D%2248%22%20fill%3D%22%23e5e7eb%22%2F%3E%3C%2Fsvg%3E'}
                          alt={`${c.tokenName} logo`}
                        />
                        <ItemContent>
                          <ItemTitle>
                            <strong>{c.tokenName}</strong>
                          </ItemTitle>
                          <ItemMeta>
                            {c.chain} • {new Date(c.submittedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                          </ItemMeta>
                        </ItemContent>
                      </ListItem>
                    ))}
                  {communityTokens.filter(c => mapStatus(c.status).key === 'pending').length === 0 && (
                    <div style={{ textAlign: 'center', padding: '24px', color: theme.colors.placeholder }}>
                      No pending communities.
                    </div>
                  )}
                </List>
              </Column>
            </ActivityContainer>
          )}
        </CommunitySection>
      </div>
    </PageContainer>
  );
};

export default TokensFeed;

const CommunitySection = styled.section`
  background: ${({ theme }) => theme.colors.cardBackground};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 12px;
  padding: 24px;
  margin-top: 24px;
`;

const ActivityContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 32px;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
    gap: 24px;
  }
`;

const Column = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const SectionKicker = styled.div`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.placeholder};
`;

const List = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const ListItem = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  border-radius: 8px;
  cursor: pointer;
  background: ${({ theme }) => theme.colors.background};
  border: 1px solid ${({ theme }) => theme.colors.border};
  transition: all 200ms ease;

  &:hover {
    background: ${({ theme }) => theme.colors.border};
    transform: translateX(4px);
  }

  @media (max-width: 600px) {
    padding: 10px;
    gap: 10px;
  }
`;

const LogoImg = styled.img`
  width: 48px;
  height: 48px;
  border-radius: 8px;
  flex-shrink: 0;
  object-fit: cover;

  @media (max-width: 600px) {
    width: 40px;
    height: 40px;
  }
`;

const ItemContent = styled.div`
  flex: 1;
  min-width: 0;
`;

const ItemTitle = styled.div`
  font-weight: 700;
  font-size: 0.95rem;
  color: #ffffff;
`;

const ItemMeta = styled.div`
  font-size: 0.8rem;
  color: #aaaaaa;
  margin-top: 4px;
`;