import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useTheme } from '../context/ThemeContext';
import { usePrivy } from '@privy-io/react-auth';
import { UserProfile } from '../types';
import { useApi } from '../hooks/useApi';
import Button from '../components/common/Button';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ProfileOverview from '../components/profile/ProfileOverview';
import ProfileActivity from '../components/profile/ProfileActivity';
import ProfileHubSpot from '../components/profile/ProfileHubSpot';
import ProfileHubSocials from '../components/profile/ProfileHubSocials';
import CapsuleButton from '../components/common/CapsuleButton';
import TwitterLoginButton from '../components/twitter/TwitterLoginButton';

const ProfileContainer = styled.div`
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
  relative overflow-hidden rounded-lg;
  background-color: ${({ theme }) => theme.colors.cardBackground};
  border: 1px solid ${({ theme }) => theme.colors.border};
  box-shadow: ${({ theme }) => theme.boxShadow};
  margin-bottom: ${({ theme }) => theme.spacing.large};
`;

const BannerImage = styled.div`
  height: 160px;
  width: 100%;
  background-color: ${({ theme }) => theme.colors.border};
  background-size: cover;
  background-position: center;
  border-bottom-left-radius: 0;
  border-bottom-right-radius: 0;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;

  @media (max-width: 480px) {
    height: 120px;
  }
`;

const ProfileHeader = styled.div`
  display: flex;
  flex-direction: column;
  sm:flex-direction: row;
  sm:items-end;
  gap: ${({ theme }) => theme.spacing.medium};
  margin-top: ${({ theme }) => theme.spacing.large};
  padding: 0 ${({ theme }) => theme.spacing.medium} ${({ theme }) => theme.spacing.medium};

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
  ring: 2px;
  border: 2px solid ${({ theme }) => theme.colors.border};
  box-shadow: 0 6px 18px rgba(2, 6, 23, 0.35);
  margin-top: -28px;
  order: 1;
  margin-left: auto;
  margin-right: auto;

  @media (max-width: 640px) {
    margin-left: auto;
    margin-right: auto;
  }
`;

const ProfileInfo = styled.div`
  flex: 1;
  min-width: 0;
  order: 2;
  text-align: left;

  @media (max-width: 640px) {
    text-align: center;
  }
`;

const ProfileTitle = styled.h1`
  font-size: 1.875rem;
  font-weight: 800;
  margin: 0 0 ${({ theme }) => theme.spacing.small} 0;
  color: ${({ theme }) => theme.colors.text};
  word-break: break-word;
`;

const ProfileDescription = styled.p`
  font-size: 0.9rem;
  color: ${({ theme }) => theme.colors.placeholder};
  margin: 0 0 ${({ theme }) => theme.spacing.small} 0;
`;

const ProfileMeta = styled.div`
  font-size: 0.85rem;
  color: ${({ theme }) => theme.colors.placeholder};
  margin-top: ${({ theme }) => theme.spacing.small};
`;

const ProfileActions = styled.div`
  order: 3;
  width: 100%;
  sm:width: auto;
  sm:ml-4;
  mt-3;
  sm:mt-0;
  flex-shrink: 0;
  display: flex;
  gap: ${({ theme }) => theme.spacing.small};
  flex-wrap: wrap;

  @media (max-width: 640px) {
    flex-direction: column;
    margin-top: ${({ theme }) => theme.spacing.medium};

    button {
      width: 100%;
    }
  }
`;

const Stats = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: ${({ theme }) => theme.spacing.medium};
  margin-top: ${({ theme }) => theme.spacing.large};
  margin-bottom: ${({ theme }) => theme.spacing.large};

  @media (max-width: 640px) {
    grid-template-columns: 1fr 1fr;
  }
`;

const StatItem = styled.div`
  text-align: center;
  padding: ${({ theme }) => theme.spacing.medium};
  background-color: ${({ theme }) => theme.colors.background};
  border-radius: ${({ theme }) => theme.borderRadius};
  border: 1px solid ${({ theme }) => theme.colors.border};

  span {
    display: block;
    font-weight: 800;
    font-size: 1.5rem;
    color: ${({ theme }) => theme.colors.primary};
    margin-bottom: ${({ theme }) => theme.spacing.small};
  }

  small {
    color: ${({ theme }) => theme.colors.placeholder};
    font-size: 0.85rem;
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

const tabs = [
  { label: "Overview", value: "overview" },
  { label: "Activity", value: "activity" },
  { label: "HubSpot", value: "hubSpot" },
  { label: "HubSocials", value: "hubSocials" },
  { label: "Polls", value: "polls" }
];

const Profile: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { user: privyUser, authenticated } = usePrivy();
  const [activeTab, setActiveTab] = useState('overview');

  const { data: profileUser, loading, error } = useApi<UserProfile>(`/profile/${privyUser?.id}`);

  if (loading) {
    return (
      <ProfileContainer theme={theme}>
        <Inner>
          <LoadingSpinner />
          <p style={{ marginTop: theme.spacing.medium }}>Loading profile...</p>
        </Inner>
      </ProfileContainer>
    );
  }

  if (error != null && error.indexOf("status code 404") > -1) {
    return (
      <ProfileContainer theme={theme}>
        <Inner style={{ textAlign: 'center' }}>
          <p style={{ color: theme.colors.text, marginBottom: theme.spacing.medium }}>
            It looks like you haven't set up your profile yet.
          </p>
          <Button onClick={() => navigate('/create-profile')}>
            Create Your Profile
          </Button>
        </Inner>
      </ProfileContainer>
    );
  }

  if (!profileUser) {
    return (
      <ProfileContainer theme={theme}>
        <Inner style={{ textAlign: 'center' }}>
          <p style={{ color: theme.colors.text }}>Profile data is unavailable.</p>
        </Inner>
      </ProfileContainer>
    );
  }

  return (
    <ProfileContainer theme={theme}>
      <Inner>
        <ProfileCard theme={theme}>
          <BannerImage theme={theme} />

          <ProfileHeader theme={theme}>
            <ProfileImage
              src={profileUser.profileImage || '/default-avatar.JPG'}
              alt={`${profileUser.profileName}'s profile`}
              theme={theme}
            />

            <ProfileInfo theme={theme}>
              <ProfileTitle theme={theme}>{profileUser.profileName || '#Profilename'}</ProfileTitle>
              <ProfileDescription theme={theme}>{profileUser.description}</ProfileDescription>

              {profileUser && authenticated && profileUser.verified && (
                <div style={{ color: theme.colors.success, fontSize: '0.9rem', fontWeight: 600 }}>
                  ✔️ Verified by MTH
                </div>
              )}

              <ProfileMeta theme={theme}>
                <div style={{ marginTop: theme.spacing.small }}>
                  {profileUser.followers.length} Followers • {profileUser.following.length} Following
                </div>
              </ProfileMeta>
            </ProfileInfo>

            <ProfileActions theme={theme}>
              {profileUser && authenticated && !profileUser.verified && (
                <TwitterLoginButton callbackType="profileVerification" buttonText="Verify" />
              )}
              {profileUser && authenticated && (
                <Button onClick={() => navigate('/update-profile')} variant="primary">
                  Edit Profile
                </Button>
              )}
            </ProfileActions>
          </ProfileHeader>

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
        </ProfileCard>

        <TabsContainer theme={theme}>
          {tabs.map(f => (
            <CapsuleButton
              key={f.value}
              onClick={() => setActiveTab(f.value)}
              className={activeTab === f.value ? 'selected' : ''}
              theme={theme}
            >
              {f.label}
            </CapsuleButton>
          ))}
        </TabsContainer>

        <div>
          {activeTab === 'overview' && <ProfileOverview user={profileUser} />}
          {activeTab === 'activity' && <ProfileActivity user={profileUser} />}
          {activeTab === 'hubSpot' && <ProfileHubSpot user={profileUser} />}
          {activeTab === 'hubSocials' && <ProfileHubSocials user={profileUser} />}
          {activeTab === 'polls' && <ProfileActivity user={profileUser} />}
        </div>
      </Inner>
    </ProfileContainer>
  );
};

export default Profile;