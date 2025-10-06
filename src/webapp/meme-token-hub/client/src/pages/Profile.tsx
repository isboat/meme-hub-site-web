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

const ProfileContainer = styled.div`
  max-width: 70%;
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

const EditProfileButton = styled(Button)`
  margin-top: ${({ theme }) => theme.spacing.medium};
  background-color: ${({ theme }) => theme.colors.primary};
  &:hover {
    background-color: ${({ theme }) => theme.colors.primary + 'E0'}; /* Slightly darker on hover */
  }
`;
const VerifyXButton = styled(Button)`
  margin-top: ${({ theme }) => theme.spacing.medium};
  background-color: ${({ theme }) => theme.colors.background};
  margin-left: ${({ theme }) => theme.spacing.large};

    &.glow {
    box-shadow: 0 0 12px #4ade80;
    border: 2px solid #4ade80;
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
          src={profileUser.profileImage  || '/default-avatar.JPG'}
          alt={`${profileUser.profileName}'s profile`}
          theme={theme}
        />
        <Username theme={theme}>{profileUser.profileName || '#Profilename'}</Username>
        <Verification theme={theme}>{profileUser.description || '✔️ Verified by MemeTokenHub.'}</Verification>
 
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
        <div>
          {profileUser && authenticated && (
            <EditProfileButton onClick={() => navigate('/update-profile')} theme={theme}>
              Edit Profile
            </EditProfileButton>
          )}

          {profileUser && !profileUser.verified && (
            <VerifyXButton className='glow' onClick={() => navigate('/update-profile')} theme={theme}>
              Verify Your X Account
            </VerifyXButton>
          )}
        </div>
      </ProfileHeader>

      <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', marginBottom: '16px' }} aria-label="Filter by chain">
        {tabs.map(f => (
          <CapsuleButton key={f.value} onClick={() => setActiveTab(f.value)} className={activeTab === f.value ? 'selected' : ''}>
            {f.label}
          </CapsuleButton>
        ))}
      </div>

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