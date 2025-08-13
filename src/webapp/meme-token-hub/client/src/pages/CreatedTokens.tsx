// client/src/pages/UnclaimedTokensFeed.tsx
import React, { useState } from 'react';
import styled from 'styled-components';
import { useTheme } from '../context/ThemeContext';
import LoadingSpinner from '../components/common/LoadingSpinner';
import api from '../api/api';
import { useNavigate } from 'react-router';
import { TokenDataModel } from '../types/token-components';
import CapsuleButton from '../components/common/CapsuleButton';
import PageContainer from '../components/common/PageContainer';

const Header = styled.h1`
  color: ${({ theme }) => theme.colors.white};
  font-size: 2.5em;
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.small};
`;

const TokenCardsWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 1.5rem;
  justify-content: center;
`;

const TokenCard = styled.div`
      background: ${({ theme }) => theme.colors.navBarBackground};
      border: 1px solid ${({ theme }) => theme.colors.border};
      padding: 1rem;
      border-radius: 1rem;
      box-shadow: 0 4px 12px rgba(0,0,0,0.3);
      transition: transform 0.3s;
      position: relative;

      &:hover {
        transform: scale(1.03);
      cursor: pointer;
      }
      width: 200px;
      max-width: 300px;
`;
const TokenImage = styled.div`
  img {
    width: 32px;
      height: 32px;
      border-radius: 50%;
      margin-bottom: 0.5rem;
  }
`;
const TokenName = styled.div`
  text-transform: capitalize;
`;
const TokenDetails = styled.div`
      font-size: 0.8rem;
      color: #94a3b8;
`;

const SearchField = styled.div`
  width: 100%;
  max-width: 640px;
  input {
    padding: 1rem 2.25rem;
    border-radius: 9999px;
    color: ${({ theme }) => theme.colors.text};
    background: ${({ theme }) => theme.colors.navBarBackground};

    width: 100%;
    max-width: 640px;
    margin: 2rem auto;
    display: block;
    padding: 0.75rem 1rem;
    height: 50px;
  }
`;

const CreatedTokensFeed: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  // const [searchTerm, setSearchTerm] = useState('');
  const [selected, setSelected] = useState('');

  const launchPlatforms = [
    { name: 'Pump.Fun', slug: 'pumpfun' }, 
    { name: 'FourMeme', slug: 'fourmeme' },
    { name: 'Bags', slug: 'bags' },
    { name: 'LetsBonk.fun', slug: 'letsbonk' },
    { name: 'Jupiter Launchpad', slug: 'jupiterlaunchpad' },
    { name: 'Socials Updated', slug: 'socialsupdated' }
  ];

  const [networkTokenData, setNetworkTokenData] = useState([] as TokenDataModel[]);
  let isLoadingTokens = false;

  const loadNetworkTokens = async (event: React.MouseEvent<HTMLButtonElement>): Promise<void> => {

    event.preventDefault();
    const networkName = event.currentTarget.textContent?.trim().toLowerCase();
    if (!networkName) return;

    const platform = launchPlatforms.find(chain => chain.name.toLowerCase() === networkName);
    if (platform) {
      setSelected(platform.slug);
      isLoadingTokens = true;
      // load the tokens from api
      const response = await api.get<TokenDataModel[]>(`/token/latestcreated/${platform.slug}`);
      const tokensData = response.data;
      if (tokensData) {
        setNetworkTokenData(tokensData);
      }
      isLoadingTokens = false;
    }
  }

  const filterTokens = (searchTerm: string): void => {
    if (!searchTerm) {
      // Reset to original data if search term is empty
      setNetworkTokenData(networkTokenData);
      return;
    }
    const filteredTokens = networkTokenData.filter(token =>
      token.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setNetworkTokenData(filteredTokens);
  };

  const navigateToTokenPage = (token: TokenDataModel): void => {
    if (!token || !token.id) return;
    // Navigate to the token profile page
    // pass the token object to the token profile page
    navigate(`/token/${token.id}`, { state: { token } });
  };

  const addClassName = (platform: { name: string; slug: string }) => {
    var className = platform.slug === selected ? 'selected' : '';
    // if it's socialsupdated
    if (platform.slug === 'socialsupdated') {
      className += ' socials-updated';
    }

    return className;
  };

  return (
    <PageContainer theme={theme}>
      <Header theme={theme}>New Created Tokens</Header>
      <p style={{ color: theme.colors.dimmedWhite }}>Explore new tokens with verified intent, community support, and cross-platform tracking.</p>
      <SearchField theme={theme}>
        <input className="search-bar" onInput={(e) => filterTokens(e.currentTarget.value)} placeholder="Search token name..." type="text" />
      </SearchField>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', justifyContent: 'center', marginBottom: theme.spacing.large }}>
        {launchPlatforms.map((platform) => (
          <div key={platform.slug} style={{ display: 'block' }}>
            <CapsuleButton className={addClassName(platform)} onClick={(event) => { loadNetworkTokens(event) }}>
              {platform.name}
            </CapsuleButton>
          </div>
        ))}
      </div>
      <div>        
        {!isLoadingTokens && networkTokenData.length === 0 && <p>No tokens found for the selected launch platform.</p>}
      </div>
      <TokenCardsWrapper theme={theme}>
        {isLoadingTokens && <LoadingSpinner />}
        {networkTokenData.map(token => (
          <TokenCard theme={theme} key={token.id} onClick={() => navigateToTokenPage(token)}>
            <div style={{display: 'flex'}}>
              {token.image && <TokenImage>
                <img src={token.image} alt={token.name} />
              </TokenImage>}
              <TokenName>💠 {token.name}</TokenName>
            </div>
            <TokenDetails>Market Cap: ${token.rawData.marketCapSol.toFixed(4)}</TokenDetails>
          </TokenCard>
        ))}
      </TokenCardsWrapper>
    </PageContainer>
  );
};

export default CreatedTokensFeed;