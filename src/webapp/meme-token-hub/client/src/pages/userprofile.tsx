import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import { useTheme } from '../context/ThemeContext';
import { usePrivy } from '@privy-io/react-auth';
import { User, UserProfile } from '../types';
import { useApi } from '../hooks/useApi';
import Button from '../components/common/Button';
import api from '../api/api';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ProfileOverview from '../components/profile/ProfileOverview';
import ProfileFollows from '../components/profile/ProfileFollows';
import ProfileHubSocials from '../components/profile/ProfileHubSocials';


const ProfileContainer = styled.div`
  max-width: 70%;
  margin: ${({ theme }) => theme.spacing.large} auto;
  padding: ${({ theme }) => theme.spacing.medium};
  background-color: ${({ theme }) => theme.colors.background};
  border-radius: ${({ theme }) => theme.borderRadius};
  box-shadow: ${({ theme }) => theme.boxShadow};
  color: ${({ theme }) => theme.colors.text};
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

const Bio = styled.p`
  font-size: 1em;
  color: ${({ theme }) => theme.colors.placeholder};
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
  &:hover {
    background-color: ${({ theme }) => theme.colors.secondary} darken(5%);
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


const UserProfilePage: React.FC = () => {
  const { profileId } = useParams<{ profileId: string }>();
  const theme = useTheme();
  const { user: privyUser, authenticated } = usePrivy();
  const [activeTab, setActiveTab] = useState<'overview' | 'follows' | 'links'>('overview');

  const { data: profileUser, loading, error, refetch } = useApi<UserProfile>(`/profile/${profileId}`);
  const { data: currentUser, refetch: refetchCurrentUser } = useApi<User>(`/users/${privyUser?.id}`,'get',null,null,!authenticated); // Fetch current user details if logged in

  const isCurrentUserProfile = authenticated && privyUser?.id === profileId;
  const isFollowing = authenticated && profileUser?.followers?.includes(currentUser?.privyId || '');

  const handleFollowToggle = async () => {
    if (!authenticated) {
      alert('You must be logged in to follow users.');
      return;
    }
    try {
      if (isFollowing) {
        await api.post(`/profile/${profileId}/unfollow`);
      } else {
        await api.post(`/profile/${profileId}/follow`);
      }
      refetch(); // Refresh profile user data
      refetchCurrentUser(); // Refresh current user's following list
    } catch (err) {
      console.error('Follow/Unfollow error:', err);
      alert('Failed to update follow status.');
    }
  };

  if (loading) return <ProfileContainer theme={theme}><LoadingSpinner /></ProfileContainer>;
  if (error) return <ProfileContainer theme={theme}><p>Error loading profile: {error}</p></ProfileContainer>;
  if (!profileUser) return <ProfileContainer theme={theme}><p>Profile not found.</p></ProfileContainer>;

  return (
    <ProfileContainer theme={theme}>
      <ProfileHeader theme={theme}>
        <ProfileImage
          src={profileUser.profileImage  || '/default-avatar.JPG'}
          alt={`${profileUser.username}'s profile`}
          theme={theme}
        />
        <Username theme={theme}>{profileUser.username}</Username>
        <Bio theme={theme}>{profileUser.description || 'No bio available.'}</Bio>

        <Stats theme={theme}>
          <StatItem theme={theme}>
            <span>{profileUser.followers.length}</span>
            <small>Followers</small>
          </StatItem>
          <StatItem theme={theme}>
            <span>{profileUser.following.length}</span>
            <small>Following</small>
          </StatItem>
        </Stats>

        {!isCurrentUserProfile && authenticated && (
          isFollowing ? (
            <UnfollowButton onClick={handleFollowToggle} theme={theme}>
              Following
            </UnfollowButton>
          ) : (
            <FollowButton onClick={handleFollowToggle} theme={theme}>
              Follow
            </FollowButton>
          )
        )}
      </ProfileHeader>

      <TabsContainer theme={theme}>
        <TabButton onClick={() => setActiveTab('overview')} active={activeTab === 'overview'} theme={theme}>
          Overview
        </TabButton>
        <TabButton onClick={() => setActiveTab('follows')} active={activeTab === 'follows'} theme={theme}>
          Follows
        </TabButton>
        <TabButton onClick={() => setActiveTab('links')} active={activeTab === 'links'} theme={theme}>
          Links
        </TabButton>
      </TabsContainer>

      <div>
        {activeTab === 'overview' && (
          <ProfileOverview user={profileUser} isCurrentUser={isCurrentUserProfile} />
        )}
        {activeTab === 'follows' && (
          <ProfileFollows userId={profileUser.id} isCurrentUser={isCurrentUserProfile} />
        )}
        {activeTab === 'links' && (
          <ProfileHubSocials user={profileUser} isCurrentUser={isCurrentUserProfile} header="Social Links" />
        )}
      </div>
    </ProfileContainer>
  );
};

export default UserProfilePage;