// ...existing code...
import React, { useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';
import { useTheme } from '../context/ThemeContext';
import { usePrivy } from '@privy-io/react-auth';
import { NetworkTokenData } from '../types';
import { useApi } from '../hooks/useApi';
import Button from '../components/common/Button';
import LoadingSpinner from '../components/common/LoadingSpinner';

import TokenProfileOverview from '../components/token/TokenProfileOverview';
import TokenProfileCommunity from '../components/token/TokenProfileCommunity';
import TokenProfileHubFollow from '../components/token/TokenProfileHubFollow';
import TokenProfileKolFollows from '../components/token/TokenProfileKolFollows';
import TokenProfileLinks from '../components/token/TokenProfileLinks';
import CapsuleButton from '../components/common/CapsuleButton';
import { UserTokenSocialsClaim } from '../types/token-components';

const ProfileContainer = styled.div`
  width: 100%;
  max-width: 960px;
  margin: ${({ theme }) => theme.spacing.large} auto;
  padding: ${({ theme }) => theme.spacing.medium};
  background-color: ${({ theme }) => theme.colors.background};
  border-radius: ${({ theme }) => theme.borderRadius};
  box-shadow: ${({ theme }) => theme.boxShadow};
  color: ${({ theme }) => theme.colors.text};
  box-sizing: border-box;

  @media (max-width: 720px) {
    padding: ${({ theme }) => theme.spacing.small};
    border-radius: 8px;
  }
`;

const TopRow = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.medium};
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${({ theme }) => theme.spacing.small};

  @media (max-width: 720px) {
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: ${({ theme }) => theme.spacing.small};
  }
`;

const ProfileHeader = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;

  @media (max-width: 720px) {
    align-items: center;
  }
`;

const Username = styled.h1`
  margin: 0 0 ${({ theme }) => theme.spacing.small} 0;
  color: ${({ theme }) => theme.colors.text};
  text-transform: capitalize;
  font-size: 1.6rem;

  @media (max-width: 480px) {
    font-size: 1.25rem;
  }
`;

const Verification = styled.p`
  margin: 0;
  font-size: 0.95rem;
  color: ${({ theme }) => theme.colors.success};
  max-width: 600px;

  @media (max-width: 480px) {
    font-size: 0.9rem;
    padding: 0 8px;
  }
`;

const EditProfileButton = styled(Button)`
  margin-top: ${({ theme }) => theme.spacing.small};
  padding: 10px 14px;
  border-radius: 10px;
  border: 1px solid #4ade80;
  cursor: pointer;
  font-weight: 800;

  /* Green gradient, shadow and transitions from provided snippet */
  background: linear-gradient(90deg, #34d399, #a3e635);
  color: #ffffff;
  box-shadow: 0 0 10px rgba(52, 211, 153, 0.25);
  transition: transform .2s ease, box-shadow .2s ease;

  &:hover:not(:disabled) {
    transform: translateY(-3px);
    box-shadow: 0 12px 30px rgba(52, 211, 153, 0.28);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }

  @media (max-width: 720px) {
    width: 100%;
    max-width: 280px;
  }
`;

const ProfileImage = styled.img`
  width: 110px;
  height: 110px;
  border-radius: 50%;
  object-fit: cover;
  margin-left: 12px;

  @media (max-width: 720px) {
    width: 96px;
    height: 96px;
    margin-left: 0;
  }
`;

const Banner = styled.div<{ url?: string }>`
  width: 100%;
  height: 200px;
  background-image: url(${props => props.url || '/token-default-banner.JPG'});
  background-size: cover;
  background-position: center;
  border-radius: 8px;
  margin: ${({ theme }) => theme.spacing.large} 0;

  @media (max-width: 720px) {
    height: 120px;
    margin: ${({ theme }) => theme.spacing.medium} 0;
  }
`;

const TabsRow = styled.div`
  display: flex;
  gap: 12px;
  justify-content: center;
  margin-bottom: 16px;

  /* allow horizontal scrolling on small screens */
  @media (max-width: 720px) {
    overflow-x: auto;
    width: 300px;
    padding: 6px 12px; /* extra side padding for touch */
    -webkit-overflow-scrolling: touch;
    scrollbar-width: thin; /* Firefox */
    flex-wrap: nowrap; /* keep items in a single row */
    justify-content: flex-start; /* align start so left-most item is visible */
    scroll-snap-type: x mandatory; /* optional: snap to items */
  }

  /* Ensure children do not shrink and participate in snap */
  & > * {
    flex: 0 0 auto;
    scroll-snap-align: start;
  }
`;

const Content = styled.div`
  width: 100%;

  @media (max-width: 720px) {
  }
`;

const Ribbon = styled.div`
  background-color: #fbbf24;
  padding: 6px 14px;
  color: #0b1220;
  font-weight: 800;
  border-radius: 8px;
  display: inline-block;
  margin-bottom: ${({ theme }) => theme.spacing.medium};
  transform: rotate(-8deg);
  box-shadow: 0 6px 20px rgba(0,0,0,0.12);
`;

/* New styles for pending card layout */
const PendingCard = styled.div`
  position: relative;
  width: 100%;
  border-radius: 12px;
  overflow: hidden;
  background-color: ${({ theme }) => theme.colors.cardBackground};
  border: 1px solid ${({ theme }) => theme.colors.border};
  box-shadow: ${({ theme }) => theme.boxShadow};
  margin: ${({ theme }) => theme.spacing.medium} 0;
`;

const BannerImage = styled.div<{ url?: string }>`
  height: 180px;
  background-image: url(${props => props.url || '/token-default-banner.JPG'});
  background-size: cover;
  background-position: center;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};

  @media (max-width: 720px) {
    height: 120px;
  }
`;

const PendingMeta = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.medium};
  align-items: flex-end;
  padding: 12px;
  padding-top: 18px;
  position: relative;
  z-index: 2;

  @media (max-width: 720px) {
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: 8px;
  }
`;

const Logo = styled.img`
  width: 88px;
  height: 88px;
  border-radius: 999px;
  object-fit: cover;
  margin-left: 8px;
  margin-top: -44px;
  border: 3px solid ${({ theme }) => theme.colors.cardBackground};
  box-shadow: 0 6px 18px rgba(2,6,23,0.35);

  @media (max-width: 720px) {
    width: 72px;
    height: 72px;
    margin-top: -36px;
  }
`;

const TitleCol = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  min-width: 0;
  overflow: hidden;
`;

const Muted = styled.span`
  color: ${({ theme }) => theme.colors.placeholder};
  font-size: 0.9rem;
`;

const SmallCard = styled.div`
  background: transparent;
  border-radius: 10px;
  padding: 12px;
  border: 1px solid ${({ theme }) => theme.colors.border};
`;

const tabs = [
  { label: "Community", value: "community" },
  { label: "Token", value: "token" },
  { label: "Hub Socials", value: "hubFollow" },
  { label: "Followers", value: "kolFollows" },
  { label: "Swaps", value: "links" }
];

const TokenProfilePage: React.FC = () => {
  const { tokenAddr } = useParams<{ tokenAddr: string }>();
  const theme = useTheme();
  const navigate = useNavigate();

  const location = useLocation();
  const tokenData = (location.state as { token?: NetworkTokenData })?.token;

  if (!tokenData) {
    console.error('Token data is not available in location state');
    return (
      <ProfileContainer theme={theme}>
        <p style={{ color: theme.colors.text }}>Token data is unavailable.</p>
      </ProfileContainer>
    );
  }

  const { authenticated } = usePrivy();
  const [activeTab, setActiveTab] = useState('token');

  const { data: tokenSocials, loading } = useApi<UserTokenSocialsClaim>(`/token-profile/socials/${tokenAddr}`);

  if (loading) {
    return (
      <ProfileContainer theme={theme}>
        <LoadingSpinner />
        <p style={{ marginTop: theme.spacing.small }}>Loading profile...</p>
      </ProfileContainer>
    );
  }

  const addClass = (f: typeof tabs[number]) => {
    var cls = activeTab === f.value ? 'selected' : '';
    if (f.value === 'community') {
      cls += ' glow';
    }
    return cls;
  };

  const showRibbon = tokenSocials && tokenSocials.status === 0;  // pending = 0, approved = 1, rejected = 2
  return (
    <ProfileContainer theme={theme}>
      {/* If profile is pending, render a card-style banner with ribbon and overlapping avatar */}
      
        <div
          className="relative overflow-hidden rounded-lg"
          style={{
            backgroundColor: theme.colors.cardBackground,
            border: `1px solid ${theme.colors.border}`,
            boxShadow: theme.boxShadow,
          }}
        >
          {/* Banner */}
          <div
            id="ppBanner"
            className="h-40 w-full rounded-t-md bg-cover bg-center"
            style={{
              backgroundImage: `url('${tokenSocials?.bannerUrl || tokenData?.bannerUrl || '/token-default-banner.JPG'}')`,
            }}
            aria-hidden
          />

          {/* Ribbon */}
          {showRibbon && (
          <div
            className="absolute left-4 top-4 px-3 py-1 rounded-md font-extrabold text-sm"
            style={{
              transform: 'rotate(-8deg)',
              backgroundColor: theme.colors.yellow || '#fbbf24',
              color: '#0b1220',
              boxShadow: '0 6px 20px rgba(0,0,0,0.12)',
            }}
          >
            PENDING REVIEW
          </div>
          )}

          {/* Meta (logo + title) */}
          <div className="flex items-end gap-4 mt-6 px-4">
            <img
              id="ppLogo"
              src={tokenSocials?.logoUrl || tokenData?.logoURI || '/token-avatar.jpg'}
              alt={`${tokenSocials?.tokenName || tokenData?.name} logo`}
              className="w-20 h-20 rounded-full ring-2"
              style={{ boxShadow: '0 6px 18px rgba(2,6,23,0.35)', borderColor: theme.colors.border, marginTop: -28 }}
            />

            <div className="pb-1">
              <div
                id="ppTitle"
                className="text-2xl font-extrabold truncate"
                style={{ color: theme.colors.text }}
                title={tokenSocials?.tokenName || tokenData?.name}
              >
                {(tokenSocials?.tokenName || tokenData?.name)} {tokenSocials?.ticker ? `(${tokenSocials.ticker})` : ''}
              </div>
              <div className="text-sm" style={{ color: theme.colors.placeholder }}>
                Chain: <span id="ppChain">{tokenSocials?.addressDto?.chain?.name || tokenData?.addressDto?.chain?.name || 'Unknown'}</span>
                {' · '}
                Contract: <span id="ppContract" className="font-mono" style={{ fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace' }}>
                  {(tokenData?.address || tokenSocials?.tokenAddress)?.slice(0, 6) + '…' + (tokenData?.address || tokenSocials?.tokenAddress)?.slice(-6)}
                </span>
              </div>
            </div>
            {/* push the edit button to the right */}
            <div className="ml-auto flex items-center">
              {!tokenSocials && authenticated && (
                <EditProfileButton
                  onClick={() => navigate('/submit-socials-claim', { state: { token: tokenData } })}
                  theme={theme}
                >
                  Claim Community
                </EditProfileButton>
              )}
            </div>
          </div>

          {/* Cards */}
          <div className="mt-4 grid sm:grid-cols-2 gap-4 px-4 pb-4">
            {showRibbon && (
            <div
              className="rounded-md p-4"
              style={{
                backgroundColor: theme.colors.cardBackground,
                border: `1px solid ${theme.colors.border}`,
              }}
            >
              <div className="font-semibold mb-2" style={{ color: theme.colors.text }}>Official Links</div>
              <div className="text-sm space-y-1" style={{ color: theme.colors.text }}>
                <div>
                  Website:
                  {tokenSocials?.website ? (
                    <a id="ppWebsite" className="underline ml-1" href={tokenSocials.website} target="_blank" rel="noreferrer" style={{ color: theme.colors.success }}>
                      {tokenSocials.website}
                    </a>
                  ) : (
                    <span className="muted ml-1" style={{ color: theme.colors.placeholder }}>TBC</span>
                  )}
                </div>
                <div>
                  X Profile:
                  {tokenSocials?.twitter ? (
                    <a id="ppX" className="underline ml-1" href={tokenSocials.twitter} target="_blank" rel="noreferrer" style={{ color: theme.colors.success }}>
                      {tokenSocials.twitter}
                    </a>
                  ) : (
                    <span className="muted ml-1" style={{ color: theme.colors.placeholder }}>TBC</span>
                  )}
                </div>
                <div>Telegram: <span className="muted" style={{ color: theme.colors.placeholder }}>{tokenSocials?.telegram || 'TBC'}</span></div>
                <div>Discord: <span className="muted" style={{ color: theme.colors.placeholder }}>{tokenSocials?.discord || 'TBC'}</span></div>
              </div>
              
              <p className="text-xs mt-2" style={{ color: theme.colors.placeholder }}>Links are TBC and disabled until this profile is approved.</p>
              
            </div>
            )}
            {showRibbon && (
            <div
              className="rounded-md p-4 flex flex-col"
              style={{
                backgroundColor: theme.colors.cardBackground,
                border: `1px solid ${theme.colors.border}`,
              }}
            >
              <div className="font-semibold mb-2" style={{ color: theme.colors.text }}>Status</div>
              <div>
                <span
                  className="px-3 py-1 rounded-md font-semibold"
                  style={{
                    border: `1px solid ${theme.colors.warning}40`,
                    backgroundColor: `${theme.colors.warning}14`,
                    color: theme.colors.warning,
                  }}
                >
                  Pending — not yet verified
                </span>
              </div>
              <p className="text-xs mt-2" style={{ color: theme.colors.placeholder }}>Once verification completes, this profile will go live.</p>
            </div>
            )}
          </div>
          
          {/* Tabs + Content integrated into same card for cohesive styling */}
          <div className="mt-2 border-t" style={{ borderColor: theme.colors.border }}>
            <div className="px-4 pt-4 pb-6">
              <TabsRow theme={theme} aria-label="Profile tabs">
                {tabs.map(f => (
                  <CapsuleButton
                    key={f.value}
                    onClick={() => setActiveTab(f.value)}
                    className={addClass(f)}
                  >
                    {f.label}
                  </CapsuleButton>
                ))}
              </TabsRow>

              <Content theme={theme} className="mt-4">
                {activeTab === 'token' && (
                  <TokenProfileOverview tokenSocials={tokenSocials} tokenData={tokenData} isCurrentUser={true} />
                )}
                {activeTab === 'community' && (
                  <TokenProfileCommunity tokenSocials={tokenSocials} tokenData={tokenData} isCurrentUser={true} />
                )}
                {activeTab === 'hubFollow' && (
                  <TokenProfileHubFollow tokenSocials={tokenSocials} tokenData={tokenData} isCurrentUser={true} />
                )}
                {activeTab === 'kolFollows' && (
                  <TokenProfileKolFollows tokenSocials={tokenSocials} tokenData={tokenData} isCurrentUser={true} />
                )}
                {activeTab === 'links' && (
                  <TokenProfileLinks tokenSocials={tokenSocials} tokenData={tokenData} isCurrentUser={true} />
                )}
              </Content>
            </div>
          </div>
        </div>
      

    </ProfileContainer>
   );
 };
 
 export default TokenProfilePage;