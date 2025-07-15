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


const ProfileHubSocials: React.FC<ProfileProps> = ({ user, isCurrentUser }) => {
  const navigate = useNavigate();
  const theme = useTheme();

  const handleGetStarted = () => {
    //navigate('/auth');
  };
  
  return (
    <OverviewCard theme={theme}>   
      <h2>HubSocials {user._id}</h2>
      <Button onClick={handleGetStarted} style={{ backgroundColor: theme.colors.primary }}>
          x.com
        </Button>
      <Button onClick={handleGetStarted} style={{ backgroundColor: theme.colors.primary }}>
          Telegram
        </Button>
      <Button onClick={handleGetStarted} style={{ backgroundColor: theme.colors.primary }}>
          Instagram
        </Button>
      <Button onClick={handleGetStarted} style={{ backgroundColor: theme.colors.primary }}>
          Youtube
        </Button>
    </OverviewCard>
  );
};

export default ProfileHubSocials;