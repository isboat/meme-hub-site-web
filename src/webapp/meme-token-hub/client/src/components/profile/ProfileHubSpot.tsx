// client/src/components/profile/ProfileOverview.tsx
import React from 'react';
import styled from 'styled-components';
import { ProfileProps } from '../../types';
import { useTheme } from '../../context/ThemeContext';
//import api from '../../api/api';

const OverviewCard = styled.div`
  text-align: left;
  background-color: ${({ theme }) => theme.colors.cardBackground};
  padding: ${({ theme }) => theme.spacing.medium};
  border-radius: ${({ theme }) => theme.borderRadius};
  box-shadow: ${({ theme }) => theme.boxShadow};
  margin-bottom: ${({ theme }) => theme.spacing.extraLarge};
`;
const ProfileHubSpot: React.FC<ProfileProps> = ({ }) => {

  const theme = useTheme();
  return (
    <>
      <OverviewCard theme={theme} style={{display: 'block'}}>
        <h3 style={{ color: theme.colors.error }}>🔒 Verified KOL Feature</h3>
        <p>Only Verified MemeTokenHub KOLs ($8/month) can activate the project promotion feature.</p><br />
      </OverviewCard>
      <OverviewCard theme={theme}>
        <p>🎯 No Featured Project yet.</p>
      </OverviewCard>
    </>
  );
};

export default ProfileHubSpot;