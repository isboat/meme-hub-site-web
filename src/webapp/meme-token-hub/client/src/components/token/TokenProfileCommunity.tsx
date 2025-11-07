// client/src/components/profile/ProfileOverview.tsx
import React from 'react';
import styled from 'styled-components';
import { TokenProfileProps } from '../../types';
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

const TokenProfileCommunity: React.FC<TokenProfileProps> = ({ tokenSocials, tokenData }) => {
  const theme = useTheme();
  
  const pending = tokenSocials && tokenSocials.status === 0;  // pending = 0, approved = 1, rejected = 2
  return (
    <>
     {pending && 
     <OverviewCard theme={theme} style={{ marginBottom: theme.spacing.medium }}>
        <div style={{ border: '1px solid #fbbf24', padding: '8px', borderRadius: '4px', marginBottom: '8px' }}>⚠️ Pending — not yet verified</div>
        <div style={{ color: '#92400e', margin: 0 }}>Once verification completes, this profile will go live.</div>
      </OverviewCard>}

      {!pending && <OverviewCard theme={theme}>
        <DetailItem theme={theme}>
          <span>Category:</span> {'Unknown'}
        </DetailItem>
        <DetailItem theme={theme}>
          <span>Location:</span> {tokenSocials?.location || tokenData?.id || 'Private'}
        </DetailItem>
        <DetailItem theme={theme}>
          <span>Total Mentions:</span> {tokenSocials?.totalMentions || 'Not provided'}
        </DetailItem>
        <DetailItem theme={theme}>
          <span>Active since:</span> {tokenSocials?.createdAt ? new Date(tokenSocials.createdAt).toLocaleString('en-US', { month: 'short', year: 'numeric' }) : 'Unknown'}
        </DetailItem>
        <DetailItem theme={theme}>
          <span>Language:</span> {tokenSocials?.language || 'Not provided'}
        </DetailItem>
        {/* Add more profile details as needed */}
      </OverviewCard>}
    </>
  );
};

export default TokenProfileCommunity;