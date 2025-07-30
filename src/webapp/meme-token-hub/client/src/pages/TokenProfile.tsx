import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';
import { useTheme } from '../context/ThemeContext';
import { usePrivy } from '@privy-io/react-auth';
import { UserProfile } from '../types';
import { useApi } from '../hooks/useApi';
import Button from '../components/common/Button';
import LoadingSpinner from '../components/common/LoadingSpinner';

import TokenProfileOverview from '../components/token/TokenProfileOverview';
import TokenProfileCommunity from '../components/token/TokenProfileCommunity';
import TokenProfileHubFollow from '../components/token/TokenProfileHubFollow';
import TokenProfileKolFollows from '../components/token/TokenProfileKolFollows';
import TokenProfileLinks from '../components/token/TokenProfileLinks';

const ProfileContainer = styled.div`
  max-width: 800px;
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
  font-size: 2.5em;
  margin-bottom: ${({ theme }) => theme.spacing.small};
  color: ${({ theme }) => theme.colors.text};
`;

const Verification = styled.p`
  font-size: 1em;
  color: ${({ theme }) => theme.colors.success};
  text-align: center;
  max-width: 600px;
  margin-bottom: ${({ theme }) => theme.spacing.medium};
`;

const TabsContainer = styled.div`
  display: flex;
  margin-bottom: ${({ theme }) => theme.spacing.large};
`;

const TabButton = styled(Button)<{ active: boolean }>`
  flex: 1;
  padding: ${({ theme }) => theme.spacing.small} ${({ theme }) => theme.spacing.medium};
  border-bottom: 3px solid
    ${({ active, theme }) => (active ? theme.colors.primary : 'transparent')};
  color: ${({ active, theme }) => (active ? theme.colors.primary : theme.colors.text)};
  font-weight: ${({ active }) => (active ? 'bold' : 'normal')};
  border-radius: 0px;
  background-color: ${({ theme }) => theme.colors.background} !important;
  transition: all 0.2s ease-in-out;
  &:hover {
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const EditProfileButton = styled(Button)`
  margin-top: ${({ theme }) => theme.spacing.medium};
  background-color: ${({ theme }) => theme.colors.primary};
  &:hover {
    background-color: ${({ theme }) => theme.colors.primary + 'E0'}; /* Slightly darker on hover */
  }
`;

const TokenProfile: React.FC = () => {
  const { tokenAddr } = useParams<{ tokenAddr: string }>();
  const theme = useTheme();
  const navigate = useNavigate();
  const { authenticated } = usePrivy();
  const [activeTab, setActiveTab] = useState<'token' | 'community' | 'hubFollow' | 'kolFollows' | 'links' | 'token-chart'>('token');

  const { data: profileUser, loading, error } = useApi<UserProfile>(`/token/${tokenAddr}`);

  if (loading) {
    return (
      <ProfileContainer theme={theme}>
        <LoadingSpinner />
        <p>Loading profile... {authenticated}</p>
      </ProfileContainer>
    );
  }

  // Handle error (including 404 specifically)
  if (error != null && error.indexOf("status code 404") > -1) {    
    return (
      <ProfileContainer theme={theme}>
        <p style={{ color: theme.colors.text }}>
          It looks like the token does not exist yet.
        </p>
        <Button onClick={() => navigate('/create-token')} style={{ marginTop: theme.spacing.medium }}>
          Create Your Token
        </Button>
      </ProfileContainer>
    );
  }

  // If profileUser is null/undefined after loading and no specific error, it means profile not found
  if (!profileUser) {
    return (
      <ProfileContainer theme={theme}>
        <p style={{ color: theme.colors.text }}>Token data is unavailable.</p>
      </ProfileContainer>
    );
  }

  return (
    <ProfileContainer theme={theme}>
      <ProfileHeader theme={theme}>
        <Username theme={theme}>{profileUser.profileName || '#Profilename'}</Username>
        <Verification theme={theme}>{profileUser.description || '✔️ Verified by MemeTokenHub.'}</Verification>

        {profileUser && authenticated && (
          <EditProfileButton onClick={() => navigate('/update-profile')} theme={theme}>
            Edit Profile
          </EditProfileButton>
        )}
      </ProfileHeader>

      <TabsContainer theme={theme}>
        <TabButton onClick={() => setActiveTab('token')} active={activeTab === 'token'} theme={theme}>
          Token
        </TabButton>
        <TabButton onClick={() => setActiveTab('community')} active={activeTab === 'community'} theme={theme}>
        Community
        </TabButton>
        <TabButton onClick={() => setActiveTab('hubFollow')} active={activeTab === 'hubFollow'} theme={theme}>
        HubFollow
        </TabButton>
        <TabButton onClick={() => setActiveTab('kolFollows')} active={activeTab === 'kolFollows'} theme={theme}>
        KolFollows
        </TabButton>
        <TabButton onClick={() => setActiveTab('links')} active={activeTab === 'links'} theme={theme}>
        Links
        </TabButton>
        <TabButton onClick={() => setActiveTab('token-chart')} active={activeTab === 'token-chart'} theme={theme}>
        Token Chart
        </TabButton>
      </TabsContainer>

      <div>
        {activeTab === 'token' && (
          <TokenProfileOverview user={profileUser} isCurrentUser={true} />
        )}
        {activeTab === 'community' && (
          <TokenProfileCommunity user={profileUser} isCurrentUser={true} />
        )}
        {activeTab === 'hubFollow' && (
          <TokenProfileHubFollow user={profileUser} isCurrentUser={true} />
        )}
        {activeTab === 'kolFollows' && (
          <TokenProfileKolFollows user={profileUser} isCurrentUser={true} />
        )}
        {activeTab === 'links' && (
          <TokenProfileLinks user={profileUser} isCurrentUser={true} />
        )}
        {activeTab === 'token-chart' && (
          <TokenProfileCommunity user={profileUser} isCurrentUser={true} />
        )}
      </div>
    </ProfileContainer>
  );
};

export default TokenProfile;