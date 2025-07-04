// client/src/components/profile/ProfileOverview.tsx
import React from 'react';
import styled from 'styled-components';
import { User } from '../../types';
import { useTheme } from '../../context/ThemeContext';

const OverviewCard = styled.div`
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

interface ProfileOverviewProps {
  user: User;
  isCurrentUser: boolean;
}

const ProfileOverview: React.FC<ProfileOverviewProps> = ({ user, isCurrentUser }) => {
  const theme = useTheme();
  return (
    <OverviewCard theme={theme}>
      <h3 style={{ marginBottom: theme.spacing.medium, color: theme.colors.secondary }}>Profile Details</h3>
      <DetailItem theme={theme}>
        <span>Username:</span> {user.username}
      </DetailItem>
      <DetailItem theme={theme}>
        <span>Email:</span> {isCurrentUser ? user.email : 'Private'}
      </DetailItem>
      <DetailItem theme={theme}>
        <span>Bio:</span> {user.bio || 'Not provided'}
      </DetailItem>
      {/* Add more profile details as needed */}
    </OverviewCard>
  );
};

export default ProfileOverview;