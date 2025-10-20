// ...existing code...
import React, { useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';
import { useTheme } from '../context/ThemeContext';
import { usePrivy } from '@privy-io/react-auth';
import { NetworkTokenData, TokenProfile } from '../types';
import { useApi } from '../hooks/useApi';
import Button from '../components/common/Button';
import LoadingSpinner from '../components/common/LoadingSpinner';

import TokenProfileOverview from '../components/token/TokenProfileOverview';
import TokenProfileCommunity from '../components/token/TokenProfileCommunity';
import TokenProfileHubFollow from '../components/token/TokenProfileHubFollow';
import TokenProfileKolFollows from '../components/token/TokenProfileKolFollows';
import TokenProfileLinks from '../components/token/TokenProfileLinks';
import TokenProfileChart from '../components/token/TokenProfileChart';
import CapsuleButton from '../components/common/CapsuleButton';
import ProfileBanner from '../components/common/ProfileBanner';
// ...existing code...

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
    margin: ${({ theme }) => theme.spacing.medium} 12px;
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
  background-color: ${({ theme }) => theme.colors.primary};
  &:hover {
    background-color: ${({ theme }) => theme.colors.primary}E0;
  }

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
    width: 100%;
    padding: 6px 2px;
    -webkit-overflow-scrolling: touch;
    scrollbar-width: none; /* Firefox */
  }
  &::-webkit-scrollbar { display: none; }
`;

const Content = styled.div`
  width: 100%;
`;

// ...existing code...
const tabs = [
  { label: "Token", value: "token" },
  { label: "Community", value: "community" },
  { label: "Hub Follow", value: "hubFollow" },
  { label: "KOL Follows", value: "kolFollows" },
  { label: "Links", value: "links" },
  { label: "Token Chart", value: "token-chart" }
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

  const { data: profileUser, loading } = useApi<TokenProfile>(`/token-profile/${tokenAddr}`);

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
  return (
    <ProfileContainer theme={theme}>
      <TopRow theme={theme}>
        <ProfileHeader theme={theme}>
          <Username theme={theme}>{(profileUser?.profileName || tokenData?.name || '#Profilename')}</Username>
          <Verification theme={theme}>{profileUser?.description || '✔️ Verified by MemeTokenHub.'}</Verification>

          {!profileUser && authenticated && (
            <EditProfileButton
              onClick={() => navigate('/submit-socials-claim', { state: { token: tokenData } })}
              theme={theme}
            >
              Claim Profile
            </EditProfileButton>
          )}
        </ProfileHeader>

        <ProfileImage
          src={profileUser?.profileImage || tokenData?.logoURI || '/token-avatar.jpg'}
          alt={`${profileUser?.profileName || tokenData?.name}'s profile`}
          theme={theme}
        />
      </TopRow>

      <Banner url={profileUser?.bannerImageUrl || '/token-default-banner.JPG'} theme={theme} />

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
          <TokenProfileOverview tokenProfile={profileUser} tokenData={tokenData} isCurrentUser={true} />
        )}
        {activeTab === 'community' && (
          <TokenProfileCommunity tokenProfile={profileUser} tokenData={tokenData} isCurrentUser={true} />
        )}
        {activeTab === 'hubFollow' && (
          <TokenProfileHubFollow tokenProfile={profileUser} tokenData={tokenData} isCurrentUser={true} />
        )}
        {activeTab === 'kolFollows' && (
          <TokenProfileKolFollows tokenProfile={profileUser} tokenData={tokenData} isCurrentUser={true} />
        )}
        {activeTab === 'links' && (
          <TokenProfileLinks tokenProfile={profileUser} tokenData={tokenData} isCurrentUser={true} />
        )}
        {activeTab === 'token-chart' && (
          <TokenProfileChart tokenProfile={profileUser} tokenData={tokenData} isCurrentUser={true} />
        )}
      </Content>
    </ProfileContainer>
  );
};

export default TokenProfilePage;
// ...existing code...