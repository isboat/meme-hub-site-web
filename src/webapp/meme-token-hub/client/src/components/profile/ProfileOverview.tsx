// client/src/components/profile/ProfileOverview.tsx
import React from 'react';
import styled from 'styled-components';
import { User } from '../../types';
import { useTheme } from '../../context/ThemeContext';

const OverviewCard = styled.div`
  text-align: left;
  background-color: ${({ theme }) => theme.colors.cardBackground};
  padding: ${({ theme }) => theme.spacing.medium};
  border-radius: ${({ theme }) => theme.borderRadius};
  box-shadow: ${({ theme }) => theme.boxShadow};
`;

const DetailItem = styled.p`
  margin-bottom: ${({ theme }) => theme.spacing.small};
  span {
    font-weight: bold;
    color: ${({ theme }) => theme.colors.primary};
  }
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
  max-width: 600px;
  margin-bottom: ${({ theme }) => theme.spacing.medium};
`;


interface ProfileOverviewProps {
  user: User;
  isCurrentUser: boolean;
}

const ProfileOverview: React.FC<ProfileOverviewProps> = ({ user, isCurrentUser }) => {
  const theme = useTheme();
  return (
    <OverviewCard theme={theme}>   
      <h2>About: {user.username }</h2> 
      <ProfileImage src={user.profileImage || '/default-avatar.png'} alt={`${user.username}'s profile`} theme={theme} />
      <Bio theme={theme}>{user.bio || 'No bio available.'}</Bio>
      <Username theme={theme}>{user.username}</Username>
      <DetailItem theme={theme}>
        <span>Category:</span> {user.username}
      </DetailItem>
      <DetailItem theme={theme}>
        <span>Location:</span> {isCurrentUser ? user.email : 'Private'}
      </DetailItem>
      <DetailItem theme={theme}>
        <span>Total Mentions:</span> {user.bio || 'Not provided'}
      </DetailItem>
      <DetailItem theme={theme}>
        <span>Active since:</span> {user.createdAt}
      </DetailItem>
      <DetailItem theme={theme}>
        <span>Language:</span> {user.bio || 'Not provided'}
      </DetailItem>
      {/* Add more profile details as needed */}
    </OverviewCard>
  );
};

export default ProfileOverview;