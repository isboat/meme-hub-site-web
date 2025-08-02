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

const SocialCircleLinks = styled.div`
  display: flex;
  gap: 16px;
  justify-content: center;
  margin: 30px 0;
`;
const SocialCircleLinksAnchor = styled.a`
  width: 48px;
  height: 48px;
  background-color: #1e293b;
  color: #38bdf8;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  border: 2px solid #334155;
  font-size: 20px;
  transition: background 0.3s;
  &:hover {
    background-color: #334155;
  text-decoration: none;
  }
`;

const TokenProfileLinks: React.FC<TokenProfileProps> = ({ tokenProfile, tokenData }) => {
  const theme = useTheme();
  return (
    <OverviewCard theme={theme}> 
    <h3 style={{ color: theme.colors.primary }}>Connect With America Party</h3>
    <p>Official Social Channels {tokenProfile?.profileName}</p>
    <SocialCircleLinks>
      <SocialCircleLinksAnchor href="https://twitter.com/americapartytoken" target="_blank" title="Twitter">𝕏</SocialCircleLinksAnchor>
      <SocialCircleLinksAnchor href="https://t.me/americapartyportal" target="_blank" title="Telegram">💬</SocialCircleLinksAnchor>
      <SocialCircleLinksAnchor href="https://americaparty.io" target="_blank" title="Website">🌐</SocialCircleLinksAnchor>
      <SocialCircleLinksAnchor href="https://dexscreener.com/solana/AMERICAPT" target="_blank" title="Dexscreener">📊</SocialCircleLinksAnchor>
      <SocialCircleLinksAnchor href="https://www.dextools.io/app/en/solana/pair-explorer/AMERICAPT" target="_blank" title="DEXTools">📈</SocialCircleLinksAnchor>
      <SocialCircleLinksAnchor href="https://gmgn.ai/token/AMERICAPT" target="_blank" title="GMGN">🧬</SocialCircleLinksAnchor>
      <SocialCircleLinksAnchor href="https://pumpswap.xyz/swap/AMERICAPT" target="_blank" title="PumpSwap">🚀</SocialCircleLinksAnchor>
      <SocialCircleLinksAnchor href="https://bullx.xyz/token/AMERICAPT" target="_blank" title="BullX">🐂</SocialCircleLinksAnchor>
    </SocialCircleLinks>
    </OverviewCard>
  );
};

export default TokenProfileLinks;