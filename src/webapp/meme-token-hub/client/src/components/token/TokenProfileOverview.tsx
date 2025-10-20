// client/src/components/profile/ProfileOverview.tsx
import React from 'react';
import styled from 'styled-components';
import { TokenProfileProps } from '../../types';
import { useTheme } from '../../context/ThemeContext';


const ProfileImage = styled.img`
  width: 100%;
  height: 200px;
  object-fit: cover;
  margin-bottom: ${({ theme }) => theme.spacing.medium};
`;

const Row = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
`;

const Column = styled.div`
  text-align: left;
  background-color: ${({ theme }) => theme.colors.background};
  width: 48%;
`;

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

const TokenProfileOverview: React.FC<TokenProfileProps> = ({ tokenProfile, tokenData }) => {
  const theme = useTheme();
  return (
    <>
      <Row>
        <Column theme={theme}>
          <OverviewCard theme={theme}>
            <DetailItem theme={theme}>
              {tokenProfile?.description || 'Description Not provided'}
            </DetailItem>
            {/* Add more profile details as needed */}
          </OverviewCard>
        </Column>
      </Row>
      <Row>
        <Column theme={theme}>
            <DetailItem theme={theme}>
              <span>Price (USD): </span> {tokenData?.price || '$0.01116'}
            </DetailItem>
            <DetailItem theme={theme}>
              <span>Location:</span> {tokenProfile?.location || 'Private'}
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
        </Column>
        <Column theme={theme}>
            <h3>📢 Team Message</h3>
            <p>{tokenProfile?.description || '"We’re here to bring wholesome chaos to the meme world. Expect NFTs, games, and weekly community burns."'}</p>
        </Column>
      </Row>
    </>
  );
};

export default TokenProfileOverview;