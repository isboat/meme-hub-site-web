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

const TokenProfileCommunity: React.FC<TokenProfileProps> = ({ tokenProfile, tokenData }) => {
  const theme = useTheme();
  return (
    <OverviewCard theme={theme}>   
      <DetailItem theme={theme}>
        <span>Category:</span> {'Unknown'}
      </DetailItem>
      <DetailItem theme={theme}>
        <span>Location:</span> {tokenProfile?.location || tokenData?.id || 'Private'}
      </DetailItem>
      <DetailItem theme={theme}>
        <span>Total Mentions:</span> {tokenProfile?.totalMentions || 'Not provided'}
      </DetailItem>
      <DetailItem theme={theme}>
        <span>Active since:</span> {tokenProfile?.createdAt ? new Date(tokenProfile.createdAt).toLocaleString('en-US', { month: 'short', year: 'numeric' }) : 'Unknown'}
      </DetailItem>
      <DetailItem theme={theme}>
        <span>Language:</span> {tokenProfile?.language || 'Not provided'}
      </DetailItem>
      {/* Add more profile details as needed */}
    </OverviewCard>
  );
};

export default TokenProfileCommunity;