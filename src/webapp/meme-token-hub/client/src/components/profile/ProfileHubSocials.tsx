// client/src/components/profile/ProfileOverview.tsx
import React from 'react';
import styled from 'styled-components';
import { ProfileProps } from '../../types';
import { useTheme } from '../../context/ThemeContext';
import Button from '../common/Button';
import { useNavigate } from 'react-router-dom';
import AnchorButton from '../common/AnchorButton';

const OverviewCard = styled.div`
  text-align: left;
  background-color: ${({ theme }) => theme.colors.cardBackground};
  padding: ${({ theme }) => theme.spacing.medium};
  border-radius: ${({ theme }) => theme.borderRadius};
  box-shadow: ${({ theme }) => theme.boxShadow};
  margin-bottom: ${({ theme }) => theme.spacing.extraLarge};
`;
const SocialBtn = styled.div`
  text-align: center;
  margin-bottom: ${({ theme }) => theme.spacing.medium};
`;


const ProfileHubSocials: React.FC<ProfileProps> = ({ user, isCurrentUser, header }) => {
  const navigate = useNavigate();
  const theme = useTheme();

  const updateSocials = () => {
    console.log(isCurrentUser)
    navigate('/update-socials');
  };

  const hasSocials = user.metadata['x'] || user.metadata['twitch'] || user.metadata['telegram'] || user.metadata['instagram'] || user.metadata['youtube'];
  if (!hasSocials) {
    return (
      <OverviewCard theme={theme}>
        <p>No social links available.</p>
        {isCurrentUser && (
          <Button onClick={updateSocials} style={{ backgroundColor: theme.colors.success }}>
            Add Social Links
          </Button>
        )}
      </OverviewCard>
    );
  }
  
  const generateSocialLink = (url: string) => {
    const httpPrefix = "https://";
    if(!url.startsWith(httpPrefix)) {
      return httpPrefix + url;
    }
    // If the URL already has the prefix, return it as is
    // This ensures that the URL is always valid when used in the AnchorButton
    return url;
  };

  return (
    <>
      <OverviewCard theme={theme}>
        <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>{header ? header : 'Hub Socials'}</h2>
        {user.metadata['x'] && (
          <SocialBtn theme={theme}>
            <AnchorButton size='medium' variant='x' href={generateSocialLink(user.metadata['x'])} target="_blank" rel="noopener noreferrer">
              X
            </AnchorButton>
          </SocialBtn>
        )}
        {user.metadata['twitch'] && (
          <SocialBtn theme={theme}>
            <AnchorButton size='medium' variant='twitch' href={generateSocialLink(user.metadata['twitch'])} target="_blank" rel="noopener noreferrer">
              Twitch
            </AnchorButton>
          </SocialBtn>
        )}
        {user.metadata['telegram'] && (
          <SocialBtn theme={theme}>
            <AnchorButton size='medium' variant='telegram' href={generateSocialLink(user.metadata['telegram'])} target="_blank" rel="noopener noreferrer">
              Telegram
            </AnchorButton>
          </SocialBtn>
        )}
        {user.metadata['instagram'] && (
          <SocialBtn theme={theme}>
            <AnchorButton size='medium' variant='instagram' href={generateSocialLink(user.metadata['instagram'])} target="_blank" rel="noopener noreferrer">
              Instagram
            </AnchorButton>
          </SocialBtn>
        )}
        {user.metadata['youtube'] && (
          <SocialBtn theme={theme}>
            <AnchorButton size='medium' variant='youtube' href={generateSocialLink(user.metadata['youtube'])} target="_blank" rel="noopener noreferrer">
              Youtube
            </AnchorButton>
          </SocialBtn>
        )}
      </OverviewCard>
      { isCurrentUser && (
        <OverviewCard theme={theme}>
          <p>Click button below to update these social links for FREE.</p><br />
          <Button onClick={updateSocials} style={{ backgroundColor: theme.colors.success }}>
            Update Socials
          </Button>
        </OverviewCard>
      )}
    </>
  );
};

export default ProfileHubSocials;