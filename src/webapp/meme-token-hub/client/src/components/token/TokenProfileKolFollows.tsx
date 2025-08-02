// client/src/components/profile/ProfileOverview.tsx
import React from 'react';
import styled from 'styled-components';
import { TokenProfileProps } from '../../types';
import { useTheme } from '../../context/ThemeContext';

const OverviewCard = styled.div`
  text-align: center;
  background-color: ${({ theme }) => theme.colors.cardBackground};
  padding: ${({ theme }) => theme.spacing.medium};
  border-radius: ${({ theme }) => theme.borderRadius};
  box-shadow: ${({ theme }) => theme.boxShadow};
`;

const TokenProfileKolFollows: React.FC<TokenProfileProps> = ({ tokenProfile, tokenData }) => {
  const theme = useTheme();
  return (
    <OverviewCard theme={theme}> 
    <h3>🤝 KOL Mentions</h3>
    <p>@memealpha – "Watching this one closely" {tokenProfile?.profileName}</p>
    <p>@solshiller – Featured $AMERICAPT in latest Space</p>
    </OverviewCard>
  );
};

export default TokenProfileKolFollows;