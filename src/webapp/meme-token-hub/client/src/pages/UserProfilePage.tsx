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
import CapsuleButton from '../components/common/CapsuleButton';


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

const tabs = [
  { label: "Overview", value: "overview" },
  { label: "Follows", value: "follows" },
  { label: "Links", value: "links" }
];

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
        {profileUser && profileUser.verified && (
        <div>✔️ Verified by MTH</div>
        )}

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

      <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', marginBottom: '16px' }} aria-label="Filter by chain">
        {tabs.map(f => (
          <CapsuleButton key={f.value} onClick={() => setActiveTab(f.value as 'overview' | 'follows' | 'links')} className={activeTab === f.value ? 'selected' : ''}>
            {f.label}
          </CapsuleButton>
        ))}
      </div>

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