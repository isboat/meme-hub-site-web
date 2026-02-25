import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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

const ProfileCard = styled.div`
  position: relative;
  overflow: hidden;
  border-radius: 12px;
  background-color: ${({ theme }) => theme.colors.cardBackground};
  border: 1px solid ${({ theme }) => theme.colors.border};
  box-shadow: ${({ theme }) => theme.boxShadow};
  margin-bottom: ${({ theme }) => theme.spacing.large};
`;

const BannerImage = styled.div`
  height: 160px;
  width: 100%;
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.primary}30, ${({ theme }) => theme.colors.secondary}30);
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};

  @media (max-width: 480px) {
    height: 120px;
  }
`;

const ProfileHeader = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-end;
  gap: ${({ theme }) => theme.spacing.medium};
  padding: ${({ theme }) => theme.spacing.medium};
  position: relative;

  @media (max-width: 640px) {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
`;

const ProfileImage = styled.img`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid ${({ theme }) => theme.colors.border};
  box-shadow: 0 6px 18px rgba(2, 6, 23, 0.35);
  margin-top: -60px;
  flex-shrink: 0;

  @media (max-width: 640px) {
    margin-top: -40px;
  }
`;

const ProfileInfo = styled.div`
  flex: 1;
  min-width: 0;

  @media (max-width: 640px) {
    text-align: center;
  }
`;

const Username = styled.h1`
  font-size: 1.875rem;
  font-weight: 800;
  margin: 0 0 ${({ theme }) => theme.spacing.small} 0;
  color: ${({ theme }) => theme.colors.text};
  word-break: break-word;

  @media (max-width: 640px) {
    font-size: 1.5rem;
  }
`;

const Bio = styled.p`
  font-size: 0.95rem;
  color: ${({ theme }) => theme.colors.placeholder};
  margin: 0 0 ${({ theme }) => theme.spacing.small} 0;
  line-height: 1.5;

  @media (max-width: 640px) {
    font-size: 0.9rem;
  }
`;

const VerifiedBadge = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.small};
  font-size: 0.85rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.success};
  margin: ${({ theme }) => theme.spacing.small} 0;
`;

const Stats = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.medium};
  margin-top: ${({ theme }) => theme.spacing.small};

  @media (max-width: 640px) {
    justify-content: center;
  }
`;

const StatItem = styled.div`
  text-align: center;

  span {
    display: block;
    font-weight: 800;
    font-size: 1.125rem;
    color: ${({ theme }) => theme.colors.primary};
  }

  small {
    display: block;
    color: ${({ theme }) => theme.colors.placeholder};
    font-size: 0.8rem;
    margin-top: 4px;
  }
`;

const ProfileActions = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.small};
  flex-wrap: wrap;
  margin-left: auto;

  @media (max-width: 640px) {
    margin-left: 0;
    width: 100%;
    flex-direction: column;
    margin-top: ${({ theme }) => theme.spacing.medium};

    button {
      width: 100%;
    }
  }
`;

const FollowButton = styled(Button)`
  background: linear-gradient(90deg, #34d399, #a3e635);
  color: #07122a;
  font-weight: 800;
  border: none;

  &:hover:not(:disabled) {
    opacity: 0.9;
    transform: translateY(-2px);
    box-shadow: 0 6px 18px rgba(52, 211, 153, 0.3);
  }
`;

const UnfollowButton = styled(Button)`
  background: ${({ theme }) => theme.colors.cardBackground};
  color: ${({ theme }) => theme.colors.text};
  border: 1px solid ${({ theme }) => theme.colors.border};
  font-weight: 600;
  transition: all 200ms ease;

  &:hover:not(:disabled) {
    background: ${({ theme }) => theme.colors.error};
    color: white;
    border-color: ${({ theme }) => theme.colors.error};
    transform: translateY(-2px);
  }
`;

const TabsContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.small};
  margin: ${({ theme }) => theme.spacing.large} 0;
  flex-wrap: wrap;

  @media (max-width: 640px) {
    margin: ${({ theme }) => theme.spacing.medium} 0;
  }
`;

const ContentContainer = styled.div`
  animation: fadeIn 200ms ease-in;

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
`;

const tabs = [
  { label: "Overview", value: "overview" },
  { label: "Follows", value: "follows" },
  { label: "Links", value: "links" }
];

const UserProfilePage: React.FC = () => {
  const { profileId } = useParams<{ profileId: string }>();
  const navigate = useNavigate();
  const theme = useTheme();
  const { user: privyUser, authenticated } = usePrivy();
  const [activeTab, setActiveTab] = useState<'overview' | 'follows' | 'links'>('overview');

  const { data: profileUser, loading, error, refetch } = useApi<UserProfile>(`/profile/${profileId}`);
  const { data: currentUser, refetch: refetchCurrentUser } = useApi<User>(
    `/users/${privyUser?.id}`,
    'get',
    null,
    null,
    !authenticated
  );

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
      refetch();
      refetchCurrentUser();
    } catch (err) {
      console.error('Follow/Unfollow error:', err);
      alert('Failed to update follow status.');
    }
  };

  if (loading) {
    return (
      <PageContainer theme={theme}>
        <Inner>
          <LoadingSpinner />
          <p style={{ marginTop: theme.spacing.medium, textAlign: 'center' }}>Loading profile...</p>
        </Inner>
      </PageContainer>
    );
  }

  if (error) {
    return (
      <PageContainer theme={theme}>
        <Inner style={{ textAlign: 'center' }}>
          <p style={{ color: theme.colors.error }}>Error loading profile: {error}</p>
          <Button onClick={() => navigate(-1)} style={{ marginTop: theme.spacing.medium }}>Go Back</Button>
        </Inner>
      </PageContainer>
    );
  }

  if (!profileUser) {
    return (
      <PageContainer theme={theme}>
        <Inner style={{ textAlign: 'center' }}>
          <p style={{ color: theme.colors.placeholder }}>Profile not found.</p>
          <Button onClick={() => navigate(-1)} style={{ marginTop: theme.spacing.medium }}>Go Back</Button>
        </Inner>
      </PageContainer>
    );
  }

  return (
    <PageContainer theme={theme}>
      <Inner>
        <ProfileCard theme={theme}>
          <BannerImage theme={theme} />

          <ProfileHeader theme={theme}>
            <ProfileImage
              src={profileUser.profileImage || '/default-avatar.JPG'}
              alt={`${profileUser.username}'s profile`}
              theme={theme}
            />

            <ProfileInfo theme={theme}>
              <Username theme={theme}>{profileUser.username}</Username>
              <Bio theme={theme}>{profileUser.description || 'No bio available.'}</Bio>

              {profileUser.verified && (
                <VerifiedBadge theme={theme}>
                  <span>✔️</span>
                  <span>Verified by MTH</span>
                </VerifiedBadge>
              )}

              <Stats theme={theme}>
                <StatItem theme={theme}>
                  <span>{profileUser.followers?.length || 0}</span>
                  <small>Followers</small>
                </StatItem>
                <StatItem theme={theme}>
                  <span>{profileUser.following?.length || 0}</span>
                  <small>Following</small>
                </StatItem>
              </Stats>
            </ProfileInfo>

            <ProfileActions theme={theme}>
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
              {isCurrentUserProfile && (
                <Button onClick={() => navigate('/update-profile')}>
                  Edit Profile
                </Button>
              )}
            </ProfileActions>
          </ProfileHeader>
        </ProfileCard>

        <TabsContainer theme={theme}>
          {tabs.map(f => (
            <CapsuleButton
              key={f.value}
              onClick={() => setActiveTab(f.value as 'overview' | 'follows' | 'links')}
              className={activeTab === f.value ? 'selected' : ''}
            >
              {f.label}
            </CapsuleButton>
          ))}
        </TabsContainer>

        <ContentContainer theme={theme}>
          {activeTab === 'overview' && (
            <ProfileOverview user={profileUser} isCurrentUser={isCurrentUserProfile} />
          )}
          {activeTab === 'follows' && (
            <ProfileFollows userId={profileUser.id} isCurrentUser={isCurrentUserProfile} />
          )}
          {activeTab === 'links' && (
            <ProfileHubSocials 
              user={profileUser} 
              header="Social Links"
              isCurrentUser={isCurrentUserProfile}
            />
          )}
        </ContentContainer>
      </Inner>
    </PageContainer>
  );
};

export default UserProfilePage;