// client/src/components/profile/ProfileOverview.tsx
import React from 'react';
import styled from 'styled-components';
import { useTheme } from '../../context/ThemeContext';
import { ProfileProps } from '../../types';

const OverviewCard = styled.div`
  text-align: left;
  background-color: ${({ theme }) => theme.colors.cardBackground};
  padding: ${({ theme }) => theme.spacing.medium};
  border-radius: ${({ theme }) => theme.borderRadius};
  box-shadow: ${({ theme }) => theme.boxShadow};
`;


const ProfilePolls: React.FC<ProfileProps> = ({ user, isCurrentUser }) => {
  const theme = useTheme();
  return (
    <OverviewCard theme={theme}>   
      <h2>🗳️ {isCurrentUser} MemeTokenHub Community Polls {user.username }</h2>
    </OverviewCard>
  );
};

export default ProfilePolls;