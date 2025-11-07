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

const TokenProfileLinks: React.FC<TokenProfileProps> = ({ tokenSocials, tokenData }) => {
  const theme = useTheme();
  return (
    <OverviewCard theme={theme}>
      <h3 style={{ color: theme.colors.primary }}>Connect With {tokenSocials?.profileName || tokenData?.name || '#Profilename'}</h3>
      <p>Official Social Channels</p>
      <SocialCircleLinks>
        {tokenData?.links?.map((link) => (
            <React.Fragment key={link.url}>
              {(() => {
                switch (link.type.title.toLowerCase()) {
                  case 'twitter':
                    return <SocialCircleLinksAnchor key={link.url} href={link.url} target="_blank">𝕏</SocialCircleLinksAnchor>;
                  case 'english_telegram':
                    return <SocialCircleLinksAnchor key={link.url} href={link.url} target="_blank">💬</SocialCircleLinksAnchor>;
                case 'website':
                  return <SocialCircleLinksAnchor key={link.url} href={link.url} target="_blank">🌐</SocialCircleLinksAnchor>;
                default:
                  return <SocialCircleLinksAnchor key={link.url} href={link.url} target="_blank">{link.type.title.charAt(0).toUpperCase()}</SocialCircleLinksAnchor>;
              }
            })()}
        </React.Fragment>
        ))}
      </SocialCircleLinks>
    </OverviewCard>
  );
};

export default TokenProfileLinks;