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

const ProfileOverview: React.FC<ProfileProps> = ({ user }) => {
  const theme = useTheme();
  return (
    <OverviewCard theme={theme}>   
      <DetailItem theme={theme}>
        <span>Category:</span> {user.username || 'Unknown'}
      </DetailItem>
      <DetailItem theme={theme}>
        <span>Location:</span> {user.location || 'Private'}
      </DetailItem>
      <DetailItem theme={theme}>
        <span>Total Mentions:</span> {user.totalMentions || 'Not provided'}
      </DetailItem>
      <DetailItem theme={theme}>
        <span>Active since:</span> {user.createdAt ? new Date(user.createdAt).toLocaleString('en-US', { month: 'short', year: 'numeric' }) : 'Unknown'}
      </DetailItem>
      <DetailItem theme={theme}>
        <span>Language:</span> {user.language || 'Not provided'}
      </DetailItem>
      {/* Add more profile details as needed */}
    </OverviewCard>
  );
};

export default ProfileOverview;