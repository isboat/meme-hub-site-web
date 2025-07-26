// client/src/components/profile/ProfileOverview.tsx
import React from 'react';
import styled from 'styled-components';
import { ProfileProps } from '../../types';
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
const ProfileImageDiv = styled.div`
  display: flex;
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


const ProfileOverview: React.FC<ProfileProps> = ({ user }) => {
  const theme = useTheme();
  return (
    <OverviewCard theme={theme}>   
      <h2>About {user.profileName || '#Username' }</h2> 
      <ProfileImageDiv>
        <ProfileImage src={user.profileImage  || '/default-avatar.JPG'} alt={`${user.username}'s profile`} theme={theme} />
      </ProfileImageDiv>
      <Bio theme={theme}>{user.description || 'No bio available.'}</Bio>
      <Username theme={theme}>{user.profileName}</Username>
      <DetailItem theme={theme}>
        <span>Category:</span> {user.username}
      </DetailItem>
      <DetailItem theme={theme}>
        <span>Location:</span> {user.location || 'Private'}
      </DetailItem>
      <DetailItem theme={theme}>
        <span>Total Mentions:</span> {user.totalMentions || 'Not provided'}
      </DetailItem>
      <DetailItem theme={theme}>
        <span>Active since:</span> {user.createdAt}
      </DetailItem>
      <DetailItem theme={theme}>
        <span>Language:</span> {user.language || 'Not provided'}
      </DetailItem>
      {/* Add more profile details as needed */}
    </OverviewCard>
  );
};

export default ProfileOverview;