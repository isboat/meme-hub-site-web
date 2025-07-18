import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useTheme } from '../context/ThemeContext';
import { usePrivy } from '@privy-io/react-auth';
import { User } from '../types';
import { useApi } from '../hooks/useApi';
import Button from '../components/common/Button';
import api from '../api/api';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ProfileOverview from '../components/profile/ProfileOverview';
import axios, { AxiosError } from 'axios'; // Import axios and AxiosError
import ProfileActivity from '../components/profile/ProfileActivity';
import ProfileHubSpot from '../components/profile/ProfileHubSpot';
import ProfileHubSocials from '../components/profile/ProfileHubSocials';

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

const ProfileImage = styled.img`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  object-fit: cover;
  margin-bottom: ${({ theme }) => theme.spacing.medium};
  border: 3px solid ${({ theme }) => theme.colors.primary};
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

const Stats = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.large};
  margin-top: ${({ theme }) => theme.spacing.medium};
`;

const StatItem = styled.div`
  text-align: center;
  span {
    display: block;
    font-weight: bold;
    color: ${({ theme }) => theme.colors.primary};
  }
  small {
    color: ${({ theme }) => theme.colors.placeholder};
  }
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

const FollowButton = styled(Button)`
  margin-top: ${({ theme }) => theme.spacing.medium};
  background-color: ${({ theme }) => theme.colors.secondary};
  /* Note: darken(5%) is SASS syntax. For pure CSS, you'd calculate this manually or use CSS variables */
  /* Example for hover with hex color manipulation (concept, not actual CSS fn) */
  &:hover {
    background-color: ${({ theme }) => theme.colors.secondary + 'E0'}; /* Slightly darker if secondary is a hex */
  }
`;

const UnfollowButton = styled(Button)`
  margin-top: ${({ theme }) => theme.spacing.medium};
  background-color: ${({ theme }) => theme.colors.cardBackground};
  border: 1px solid ${({ theme }) => theme.colors.border};
  color: ${({ theme }) => theme.colors.text};
  &:hover {
    background-color: ${({ theme }) => theme.colors.error};
    color: white;
  }
`;


const Profile: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { user: privyUser, authenticated } = usePrivy();
  const [activeTab, setActiveTab] = useState<'overview' | 'activity' | 'hubSpot' | 'hubSocials' | 'polls'>('overview');

  const { data: profileUser, loading, error, refetch } = useApi<User>(`/profile/${privyUser?.id}`);

  if (loading) {
    return (
      <ProfileContainer theme={theme}>
        <LoadingSpinner />
        <p>Loading profile...</p>
      </ProfileContainer>
    );
  }

  // Handle error (including 404 specifically)
  if (error != null && error.indexOf("status code 404") > -1) {    
    return (
      <ProfileContainer theme={theme}>
        <p style={{ color: theme.colors.text }}>
          It looks like you haven't set up your profile yet.
        </p>
        <Button onClick={() => navigate('/create-profile')} style={{ marginTop: theme.spacing.medium }}>
          Create Your Profile
        </Button>
      </ProfileContainer>
    );
  }

  // If profileUser is null/undefined after loading and no specific error, it means profile not found
  if (!profileUser) {
    return (
      <ProfileContainer theme={theme}>
        <p style={{ color: theme.colors.text }}>Profile data is unavailable.</p>
      </ProfileContainer>
    );
  }

  return (
    <ProfileContainer theme={theme}>
      <ProfileHeader theme={theme}>
        <ProfileImage
          src={profileUser.profileImage || '/default-avatar.png'}
          alt={`${profileUser.username}'s profile`}
          theme={theme}
        />
        <Username theme={theme}>{profileUser.username || '#Username'}</Username>
        <Verification theme={theme}>{profileUser.bio || '✔️ Verified by MemeTokenHub.'}</Verification>
 
        {/*<Stats theme={theme}>
          <StatItem theme={theme}>
            <span>{profileUser.followers.length}</span>
            <small>Followers</small>
          </StatItem>
          <StatItem theme={theme}>
            <span>{profileUser.following.length}</span>
            <small>Following</small>
          </StatItem>
        </Stats> */}
      </ProfileHeader>

      <TabsContainer theme={theme}>
        <TabButton onClick={() => setActiveTab('overview')} active={activeTab === 'overview'} theme={theme}>
          Overview
        </TabButton>
        <TabButton onClick={() => setActiveTab('activity')} active={activeTab === 'activity'} theme={theme}>
        activity
        </TabButton>
        <TabButton onClick={() => setActiveTab('hubSpot')} active={activeTab === 'hubSpot'} theme={theme}>
        hubSpot
        </TabButton>
        <TabButton onClick={() => setActiveTab('hubSocials')} active={activeTab === 'hubSocials'} theme={theme}>
        hubSocials
        </TabButton>
        <TabButton onClick={() => setActiveTab('polls')} active={activeTab === 'polls'} theme={theme}>
        polls
        </TabButton>
      </TabsContainer>

      <div>
        {activeTab === 'overview' && (
          <ProfileOverview user={profileUser} isCurrentUser={true} />
        )}
        {activeTab === 'activity' && (
          <ProfileActivity user={profileUser} isCurrentUser={true} />
        )}
        {activeTab === 'hubSpot' && (
          <ProfileHubSpot user={profileUser} isCurrentUser={true} />
        )}
        {activeTab === 'hubSocials' && (
          <ProfileHubSocials user={profileUser} isCurrentUser={true} />
        )}
        {activeTab === 'polls' && (
          <ProfileActivity user={profileUser} isCurrentUser={true} />
        )}
      </div>
    </ProfileContainer>
  );
};

export default Profile;