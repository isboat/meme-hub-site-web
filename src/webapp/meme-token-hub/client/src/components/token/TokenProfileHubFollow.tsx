// client/src/components/profile/ProfileOverview.tsx
import React from 'react';
import styled from 'styled-components';
import { TokenProfileProps } from '../../types';
import { useTheme } from '../../context/ThemeContext';
import { useNavigate } from 'react-router-dom';

const OverviewCard = styled.div`
  text-align: center;
  background-color: ${({ theme }) => theme.colors.cardBackground};
  padding: ${({ theme }) => theme.spacing.medium};
  border-radius: ${({ theme }) => theme.borderRadius};
  box-shadow: ${({ theme }) => theme.boxShadow};
`;

const TokenProfileHubFollow: React.FC<TokenProfileProps> = ({ tokenSocials, tokenData }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  return (
    <OverviewCard theme={theme}> 
    <h3>🚀 Want to Own & Expand This Project?</h3>
    <p>Get full control of the dashboard, add your features, and manage it like your own. {tokenData?.name} {tokenSocials?.profileName}</p>
    <h1>Only $49.99</h1>
    <button onClick={() => navigate('/submit-socials-claim', { state: { token: tokenData } })} style={{ padding: '10px 20px', backgroundColor: theme.colors.primary, color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
      Claim Now
    </button>
    <p style={{ color: theme.colors.warning }}>⚠️ Claimed by 14 devs this week – act fast!</p>
    </OverviewCard>
  );
};

export default TokenProfileHubFollow;