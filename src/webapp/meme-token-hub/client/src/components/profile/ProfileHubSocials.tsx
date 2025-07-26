// client/src/components/profile/ProfileOverview.tsx
import React from 'react';
import styled from 'styled-components';
import { ProfileProps } from '../../types';
import { useTheme } from '../../context/ThemeContext';
import Button from '../common/Button';
import { useNavigate } from 'react-router-dom';

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


const ProfileHubSocials: React.FC<ProfileProps> = ({ user, isCurrentUser }) => {
  const navigate = useNavigate();
  const theme = useTheme();

  const handleClickedSocials = (social: string) => {
    console.log(isCurrentUser)
    const url = user.metadata[social];
    if(url) window.open(url, '_blank', 'noopener,noreferrer');
  };
  const updateSocials = () => {
    console.log(isCurrentUser)
    navigate('/update-socials');
  };

  return (
    <>
      <OverviewCard theme={theme}>
        <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Hub Socials</h2>
        <SocialBtn theme={theme}>
          <Button onClick={() => {
            handleClickedSocials('x');
          }} style={{ backgroundColor: theme.colors.primary, width: theme.button.size.medium }}>
            X
          </Button>
        </SocialBtn>
        <SocialBtn theme={theme}> <Button onClick={() => {
            handleClickedSocials('telegram');
          }} style={{ backgroundColor: theme.colors.primary, width: theme.button.size.medium }}>
          Telegram
        </Button>
        </SocialBtn>
        <SocialBtn theme={theme}>
          <Button onClick={() => {
            handleClickedSocials('instagram');
          }} style={{ backgroundColor: theme.colors.primary, width: theme.button.size.medium }}>
            Instagram
          </Button>
        </SocialBtn>
        <SocialBtn theme={theme}>
          <Button onClick={() => {
            handleClickedSocials('youtube');
          }} style={{ backgroundColor: theme.colors.primary, width: theme.button.size.medium }}>
            Youtube
          </Button>
        </SocialBtn>

      </OverviewCard>
      <OverviewCard theme={theme}>
        <p>Click button below to update these social links for FREE.</p><br />
        <Button onClick={updateSocials} style={{ backgroundColor: theme.colors.success }}>
          Update Socials
        </Button>
      </OverviewCard>
    </>
  );
};

export default ProfileHubSocials;