// client/src/components/profile/ProfileFollows.tsx
import React, { useState } from 'react';
import styled from 'styled-components';
import { useTheme } from '../../context/ThemeContext';
import { User } from '../../types';
import { useApi } from '../../hooks/useApi';
import { Link } from 'react-router-dom';
import LoadingSpinner from '../common/LoadingSpinner';

const FollowsContainer = styled.div`
  background-color: ${({ theme }) => theme.colors.cardBackground};
  padding: ${({ theme }) => theme.spacing.medium};
  border-radius: ${({ theme }) => theme.borderRadius};
  box-shadow: ${({ theme }) => theme.boxShadow};
`;

const TabNav = styled.div`
  display: flex;
  margin-bottom: ${({ theme }) => theme.spacing.medium};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

const TabNavLink = styled.button<{ active: boolean }>`
  flex: 1;
  padding: ${({ theme }) => theme.spacing.small} 0;
  background: none;
  border: none;
  border-bottom: 2px solid ${({ active, theme }) => (active ? theme.colors.primary : 'transparent')};
  color: ${({ active, theme }) => (active ? theme.colors.primary : theme.colors.text)};
  cursor: pointer;
  font-weight: ${({ active }) => (active ? 'bold' : 'normal')};
  transition: all 0.2s ease-in-out;
  &:hover {
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const UserList = styled.ul`
  list-style: none;
  padding: 0;
`;

const UserListItem = styled.li`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.medium};
  padding: ${({ theme }) => theme.spacing.small} 0;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  &:last-child {
    border-bottom: none;
  }
`;

const UserAvatar = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
  border: 1px solid ${({ theme }) => theme.colors.primary};
`;

const UsernameLink = styled(Link)`
  color: ${({ theme }) => theme.colors.text};
  font-weight: bold;
  &:hover {
    color: ${({ theme }) => theme.colors.primary};
  }
`;

interface ProfileFollowsProps {
  userId: string;
  isCurrentUser: boolean;
}

const ProfileFollows: React.FC<ProfileFollowsProps> = ({ userId }) => {
  const theme = useTheme();
  const [activeSubTab, setActiveSubTab] = useState<'followers' | 'following'>('followers');

  const { data: followers, loading: followersLoading, error: followersError } = useApi<User[]>(`/users/${userId}/followers`);
  const { data: following, loading: followingLoading, error: followingError } = useApi<User[]>(`/users/${userId}/following`);

  const displayUsers = activeSubTab === 'followers' ? followers : following;
  const loading = activeSubTab === 'followers' ? followersLoading : followingLoading;
  const error = activeSubTab === 'followers' ? followersError : followingError;

  if (loading) return <FollowsContainer theme={theme}><LoadingSpinner /></FollowsContainer>;
  if (error) return <FollowsContainer theme={theme}><p>Error loading {activeSubTab}: {error}</p></FollowsContainer>;

  return (
    <FollowsContainer theme={theme}>
      <TabNav theme={theme}>
        <TabNavLink
          onClick={() => setActiveSubTab('followers')}
          active={activeSubTab === 'followers'}
          theme={theme}
        >
          Followers ({followers?.length || 0})
        </TabNavLink>
        <TabNavLink
          onClick={() => setActiveSubTab('following')}
          active={activeSubTab === 'following'}
          theme={theme}
        >
          Following ({following?.length || 0})
        </TabNavLink>
      </TabNav>

      {displayUsers && displayUsers.length > 0 ? (
        <UserList theme={theme}>
          {displayUsers.map((user) => (
            <UserListItem key={user._id} theme={theme}>
              <UserAvatar src={user.profileImage || '/default-avatar.png'} alt={user.username} theme={theme} />
              <UsernameLink to={`/profile/${user._id}`} theme={theme}>
                {user.username}
              </UsernameLink>
            </UserListItem>
          ))}
        </UserList>
      ) : (
        <p>No {activeSubTab} to display.</p>
      )}
    </FollowsContainer>
  );
};

export default ProfileFollows;