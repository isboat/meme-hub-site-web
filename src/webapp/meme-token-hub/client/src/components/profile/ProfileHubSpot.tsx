// client/src/components/profile/ProfileOverview.tsx
import React from 'react';
import styled from 'styled-components';
import { ProfileProps, User } from '../../types';
import { useTheme } from '../../context/ThemeContext';

const OverviewCard = styled.div`
  text-align: left;
  background-color: ${({ theme }) => theme.colors.cardBackground};
  padding: ${({ theme }) => theme.spacing.medium};
  border-radius: ${({ theme }) => theme.borderRadius};
  box-shadow: ${({ theme }) => theme.boxShadow};
`;


const ProfileHubSpot: React.FC<ProfileProps> = ({ user, isCurrentUser }) => {
  const theme = useTheme();
  return (
    <>
      <OverviewCard theme={theme}>
        <h2>Verified KOL Feature {user.username}</h2>
        <p>Only Verified MemeTokenHub KOLs ($8/month) can activate the project promotion feature.</p>
      </OverviewCard>
      <OverviewCard theme={theme}>
        <h2>About: Claim Your Profile with GENESIS Code {user.username}</h2>
        <p>🧬 Origin Story: Born during a lunar eclipse in the memeverse, $MOONPEPE combines the cosmic energy of Doge and Pepe into one unstoppable force.</p>
        <p>👨‍👩‍👧‍👦 Team: 3 devs, 1 community manager, 1 Pepe enthusiast. Fully doxxed on X.</p>
        <p>🎯 Ambitions: Meme conquest of CEX listings and NFT drops by Q4 2025.</p>
      </OverviewCard>
    </>
  );
};

export default ProfileHubSpot;