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

const ProfileContainer = styled.div`
  max-width: 80%;
  margin: ${({ theme }) => theme.spacing.large} auto;
  padding: ${({ theme }) => theme.spacing.medium};
  background-color: ${({ theme }) => theme.colors.background};
  border-radius: ${({ theme }) => theme.borderRadius};
  box-shadow: ${({ theme }) => theme.boxShadow};
  color: ${({ theme }) => theme.colors.text};
  text-align: center; /* Center content for error/loading states */
`;

const ProfileHeader = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.large};
`;

const Username = styled.h1`
  margin-bottom: ${({ theme }) => theme.spacing.small};
  color: ${({ theme }) => theme.colors.text};
  text-transform: capitalize;
`;

const Verification = styled.p`
  font-size: 1em;
  color: ${({ theme }) => theme.colors.success};
  text-align: center;
  max-width: 600px;
  margin-bottom: ${({ theme }) => theme.spacing.medium};
`;

const EditProfileButton = styled(Button)`
  margin-top: ${({ theme }) => theme.spacing.medium};
  background-color: ${({ theme }) => theme.colors.primary};
  &:hover {
    background-color: ${({ theme }) => theme.colors.primary + 'E0'}; /* Slightly darker on hover */
  }
`;

const tabs = [
  { label: "Token", value: "token" },
  { label: "Community", value: "community" },
  { label: "Hub Follow", value: "hubFollow" },
  { label: "KOL Follows", value: "kolFollows" },
  { label: "Links", value: "links" },
  { label: "Token Chart", value: "token-chart" }
];

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
        <p>Loading profile... {authenticated}</p>
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
      <ProfileBanner imgUrl={profileUser?.bannerImageUrl} />
      <ProfileHeader theme={theme}>
        <Username theme={theme}>{(profileUser?.profileName || tokenData?.name || '#Profilename')}</Username>
        <Verification theme={theme}>{profileUser?.description || '✔️ Verified by MemeTokenHub.'}</Verification>

        {!profileUser && authenticated && (
          <EditProfileButton onClick={() => navigate('/submit-socials-claim', { state: { token: tokenData } })} theme={theme}>
            Claim Profile
          </EditProfileButton>
        )}
      </ProfileHeader>

      <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', marginBottom: '16px' }} aria-label="Filter by chain">
        {tabs.map(f => (
          <CapsuleButton key={f.value} onClick={() => setActiveTab(f.value)} className={addClass(f)}>
            {f.label}
          </CapsuleButton>
        ))}
      </div>
      <div>
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
      </div>
    </ProfileContainer>
  );
};

export default TokenProfilePage;