// client/src/components/profile/ProfileOverview.tsx
import React from 'react';
import styled from 'styled-components';
import { TokenProfileProps } from '../../types';
import { useTheme } from '../../context/ThemeContext';
import TradingViewChart from '../common/TradingViewChart';

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
const ProfileImage = styled.img`
  width: 100%;
  height: 200px;
  object-fit: cover;
  margin-bottom: ${({ theme }) => theme.spacing.medium};
`;

const DexScreenerEmbed = styled.div`
  position: relative;
  width: 100%;
  padding-bottom: 125%; /* 4:5 aspect ratio */
  @media (min-width: 1400px) {
    padding-bottom: 65%; /* Adjust for larger screens */
    #dexscreener-embed {
      padding-bottom: 65%;
    }
  }
  iframe {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    border: 0;
  }
`

const TokenProfileChart: React.FC<TokenProfileProps> = ({ tokenSocials, tokenData }) => {
  const theme = useTheme();
  return (
    <OverviewCard theme={theme}>
      <DetailItem theme={theme}>
        <ProfileImage
              src={tokenSocials?.profileImage || tokenData?.logoURI || '/token-avatar.jpg'}
              alt={`${tokenSocials?.profileName || tokenData?.name}'s profile`}
              theme={theme}
            />
      </DetailItem>
      <DexScreenerEmbed>
        <TradingViewChart symbol={tokenData?.symbol} />
      </DexScreenerEmbed>
    </OverviewCard>
  );
};

export default TokenProfileChart;