// ...existing code...
import React, { useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';
import { useTheme } from '../context/ThemeContext';
import { usePrivy } from '@privy-io/react-auth';
import { NetworkTokenData } from '../types';
import { useApi } from '../hooks/useApi';
import Button from '../components/common/Button';
import LoadingSpinner from '../components/common/LoadingSpinner';

import TokenProfileOverview from '../components/token/TokenProfileOverview';
import TokenProfileCommunity from '../components/token/TokenProfileCommunity';
import TokenProfileHubFollow from '../components/token/TokenProfileHubFollow';
import TokenProfileKolFollows from '../components/token/TokenProfileKolFollows';
import TokenProfileLinks from '../components/token/TokenProfileLinks';
import CapsuleButton from '../components/common/CapsuleButton';
import { UserTokenSocialsClaim } from '../types/token-components';

const ProfileContainer = styled.div`
  width: 100%;
  max-width: 960px;
  margin: ${({ theme }) => theme.spacing.large} auto;
  padding: ${({ theme }) => theme.spacing.medium};
  background-color: ${({ theme }) => theme.colors.background};
  border-radius: ${({ theme }) => theme.borderRadius};
  box-shadow: ${({ theme }) => theme.boxShadow};
  color: ${({ theme }) => theme.colors.text};
  box-sizing: border-box;

  @media (max-width: 720px) {
    padding: ${({ theme }) => theme.spacing.small};
    border-radius: 8px;
  }
`;

const TopRow = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.medium};
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${({ theme }) => theme.spacing.small};

  @media (max-width: 720px) {
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: ${({ theme }) => theme.spacing.small};
  }
`;

const ProfileHeader = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;

  @media (max-width: 720px) {
    align-items: center;
  }
`;

const Username = styled.h1`
  margin: 0 0 ${({ theme }) => theme.spacing.small} 0;
  color: ${({ theme }) => theme.colors.text};
  text-transform: capitalize;
  font-size: 1.6rem;

  @media (max-width: 480px) {
    font-size: 1.25rem;
  }
`;

const Verification = styled.p`
  margin: 0;
  font-size: 0.95rem;
  color: ${({ theme }) => theme.colors.success};
  max-width: 600px;

  @media (max-width: 480px) {
    font-size: 0.9rem;
    padding: 0 8px;
  }
`;

const EditProfileButton = styled(Button)`
  margin-top: ${({ theme }) => theme.spacing.small};
    background: #facc15;
    color: #0f172a;
    font-weight: bold;

  @media (max-width: 720px) {
    width: 100%;
    max-width: 280px;
  }
`;

const ProfileImage = styled.img`
  width: 110px;
  height: 110px;
  border-radius: 50%;
  object-fit: cover;
  margin-left: 12px;

  @media (max-width: 720px) {
    width: 96px;
    height: 96px;
    margin-left: 0;
  }
`;

const Banner = styled.div<{ url?: string }>`
  width: 100%;
  height: 200px;
  background-image: url(${props => props.url || '/token-default-banner.JPG'});
  background-size: cover;
  background-position: center;
  border-radius: 8px;
  margin: ${({ theme }) => theme.spacing.large} 0;

  @media (max-width: 720px) {
    height: 120px;
    margin: ${({ theme }) => theme.spacing.medium} 0;
  }
`;

const TabsRow = styled.div`
  display: flex;
  gap: 12px;
  justify-content: center;
  margin-bottom: 16px;

  /* allow horizontal scrolling on small screens */
  @media (max-width: 720px) {
    overflow-x: auto;
    width: 300px;
    padding: 6px 12px; /* extra side padding for touch */
    -webkit-overflow-scrolling: touch;
    scrollbar-width: thin; /* Firefox */
    flex-wrap: nowrap; /* keep items in a single row */
    justify-content: flex-start; /* align start so left-most item is visible */
    scroll-snap-type: x mandatory; /* optional: snap to items */
  }

  /* Ensure children do not shrink and participate in snap */
  & > * {
    flex: 0 0 auto;
    scroll-snap-align: start;
  }
`;

const Content = styled.div`
  width: 100%;

  @media (max-width: 720px) {
    width: 90vw;
  }
`;

const Ribbon = styled.div`
  background-color: #fbbf24;
  padding: 4px 12px;
  color: #000000;
  font-weight: bold;
  border-radius: 8px;
  display: inline-block;
  margin-bottom: ${({ theme }) => theme.spacing.medium};
  transform: rotate(-20deg);
  
`;

// ...existing code...
const tabs = [
  { label: "Community", value: "community" },
  { label: "Token", value: "token" },
  { label: "Hub Socials", value: "hubFollow" },
  { label: "Followers", value: "kolFollows" },
  { label: "Swaps", value: "links" }
];
// ...existing code...

const TokenProfilePage: React.FC = () => {
  const { tokenAddr } = useParams<{ tokenAddr: string }>();
  const theme = useTheme();
  const navigate = useNavigate();

  const location = useLocation();
  const tokenData = (location.state as { token?: NetworkTokenData })?.token;

  if (!tokenData) {
    console.error('Token data is not available in location state');
    return (
      <ProfileContainer theme={theme}>
        <p style={{ color: theme.colors.text }}>Token data is unavailable.</p>
      </ProfileContainer>
    );
  }

  const { authenticated } = usePrivy();
  const [activeTab, setActiveTab] = useState('token');

  const { data: tokenSocials, loading } = useApi<UserTokenSocialsClaim>(`/token-profile/socials/${tokenAddr}`);

  if (loading) {
    return (
      <ProfileContainer theme={theme}>
        <LoadingSpinner />
        <p style={{ marginTop: theme.spacing.small }}>Loading profile...</p>
      </ProfileContainer>
    );
  }

  const addClass = (f: typeof tabs[number]) => {
    var cls = activeTab === f.value ? 'selected' : '';
    if (f.value === 'community') {
      cls += ' glow';
    }
    return cls;
  };

  const showRibbon = tokenSocials && tokenSocials.status === 0;  // pending = 0, approved = 1, rejected = 2
  return (
    <ProfileContainer theme={theme}>
      <TopRow theme={theme}>
        <ProfileHeader theme={theme}>
          <Username theme={theme}>{(tokenSocials?.tokenName || tokenData?.name || '#Profilename')}</Username>
          <Verification theme={theme}>{tokenSocials?.description || '✔️ Verified by MemeTokenHub.'}</Verification>

          {!tokenSocials && authenticated && (
            <EditProfileButton
              onClick={() => navigate('/submit-socials-claim', { state: { token: tokenData } })}
              theme={theme}
            >
              Claim Community
            </EditProfileButton>
          )}
        </ProfileHeader>

        <ProfileImage
          src={tokenSocials?.logoUrl || tokenData?.logoURI || '/token-avatar.jpg'}
          alt={`${tokenSocials?.logoUrl || tokenData?.name}'s profile`}
          theme={theme}
        />
      </TopRow>
      
      <Banner url={tokenSocials?.bannerUrl || '/token-default-banner.JPG'} theme={theme}>
        {showRibbon && <Ribbon theme={theme}>PENDING REVIEW</Ribbon>}        
      </Banner>

      <TabsRow theme={theme} aria-label="Profile tabs">
        {tabs.map(f => (
          <CapsuleButton
            key={f.value}
            onClick={() => setActiveTab(f.value)}
            className={addClass(f)}
          >
            {f.label}
          </CapsuleButton>
        ))}
      </TabsRow>

      <Content>
        {activeTab === 'token' && (
          <TokenProfileOverview tokenSocials={tokenSocials} tokenData={tokenData} isCurrentUser={true} />
        )}
        {activeTab === 'community' && (
          <TokenProfileCommunity tokenSocials={tokenSocials} tokenData={tokenData} isCurrentUser={true} />
        )}
        {activeTab === 'hubFollow' && (
          <TokenProfileHubFollow tokenSocials={tokenSocials} tokenData={tokenData} isCurrentUser={true} />
        )}
        {activeTab === 'kolFollows' && (
          <TokenProfileKolFollows tokenSocials={tokenSocials} tokenData={tokenData} isCurrentUser={true} />
        )}
        {activeTab === 'links' && (
          <TokenProfileLinks tokenSocials={tokenSocials} tokenData={tokenData} isCurrentUser={true} />
        )}
      </Content>
    </ProfileContainer>
  );
};

export default TokenProfilePage;
// ...existing code...