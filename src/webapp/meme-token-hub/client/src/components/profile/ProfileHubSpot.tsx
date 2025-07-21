// client/src/components/profile/ProfileOverview.tsx
import React from 'react';
import styled from 'styled-components';
import { ProfileProps } from '../../types';
import { useTheme } from '../../context/ThemeContext';
import Button from '../common/Button';

const OverviewCard = styled.div`
  text-align: left;
  background-color: ${({ theme }) => theme.colors.cardBackground};
  padding: ${({ theme }) => theme.spacing.medium};
  border-radius: ${({ theme }) => theme.borderRadius};
  box-shadow: ${({ theme }) => theme.boxShadow};
  margin-bottom: ${({ theme }) => theme.spacing.medium};
`;


const ProfileHubSpot: React.FC<ProfileProps> = ({ user, isCurrentUser }) => {

  const becomeVerified = () => {
    console.log(isCurrentUser)
  }
  const theme = useTheme();
  return (
    <>
      <OverviewCard theme={theme}>
        <h3 style={{ color: theme.colors.error }}>🔒 Verified KOL Feature</h3>
        <p>Only Verified MemeTokenHub KOLs ($8/month) can activate the project promotion feature.</p><br />
        <Button onClick={becomeVerified} style={{ backgroundColor: theme.colors.success }}>
          Become Verified
          </Button>
      </OverviewCard>
      <OverviewCard theme={theme}>
        <p>🎯 No Featured Project yet. { user._id }</p>
      </OverviewCard>
    </>
  );
};

export default ProfileHubSpot;