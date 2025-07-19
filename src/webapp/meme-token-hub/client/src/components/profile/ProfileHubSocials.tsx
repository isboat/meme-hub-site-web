// client/src/components/profile/ProfileOverview.tsx
import React from 'react';
import styled from 'styled-components';
import { ProfileProps, User } from '../../types';
import { useTheme } from '../../context/ThemeContext';
import Button from '../common/Button';
import { useNavigate } from 'react-router-dom';

const OverviewCard = styled.div`
  text-align: left;
  background-color: ${({ theme }) => theme.colors.cardBackground};
  padding: ${({ theme }) => theme.spacing.medium};
  border-radius: ${({ theme }) => theme.borderRadius};
  box-shadow: ${({ theme }) => theme.boxShadow};
`;
const SocialBtn = styled.div`
  text-align: center;
  margin-bottom: ${({ theme }) => theme.spacing.medium};
`;


const ProfileHubSocials: React.FC<ProfileProps> = ({ user, isCurrentUser }) => {
  const navigate = useNavigate();
  const theme = useTheme();

  const handleGetStarted = () => {
    console.log(isCurrentUser)
    //navigate('/auth');
  };

  return (
    <OverviewCard theme={theme}>
      <SocialBtn theme={theme}>
        <Button onClick={handleGetStarted} style={{ backgroundColor: theme.colors.primary, width: theme.button.size.medium }}>
          x.com
        </Button>
      </SocialBtn>
      <SocialBtn theme={theme}> <Button onClick={handleGetStarted} style={{ backgroundColor: theme.colors.primary, width: theme.button.size.medium }}>
        Telegram
      </Button>
      </SocialBtn>
      <SocialBtn theme={theme}>
        <Button onClick={handleGetStarted} style={{ backgroundColor: theme.colors.primary, width: theme.button.size.medium }}>
          Instagram
        </Button>
      </SocialBtn>
      <SocialBtn theme={theme}>
        <Button onClick={handleGetStarted} style={{ backgroundColor: theme.colors.primary, width: theme.button.size.medium }}>
          Youtube
        </Button>
      </SocialBtn>

    </OverviewCard>
  );
};

export default ProfileHubSocials;