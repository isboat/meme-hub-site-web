// client/src/components/profile/ProfileLinks.tsx
import React from 'react';
import styled from 'styled-components';
import { UserProfile } from '../../types';
import { useTheme } from '../../context/ThemeContext';
import { FaFacebook, FaTwitter } from 'react-icons/fa'; // Example icons
import ProfileHubSocials from './ProfileHubSocials';

const LinksCard = styled.div`
  background-color: ${({ theme }) => theme.colors.cardBackground};
  padding: ${({ theme }) => theme.spacing.medium};
  border-radius: ${({ theme }) => theme.borderRadius};
  box-shadow: ${({ theme }) => theme.boxShadow};
`;

const LinkItem = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.small};
  margin-bottom: ${({ theme }) => theme.spacing.small};
  color: ${({ theme }) => theme.colors.text};

  a {
    display: flex;
    align-items: center;
    gap: ${({ theme }) => theme.spacing.small};
    color: ${({ theme }) => theme.colors.primary};
    &:hover {
      text-decoration: none;
      color: ${({ theme }) => theme.colors.secondary};
    }
  }

  svg {
    font-size: 1.2em;
  }
`;

interface ProfileLinksProps {
  user: UserProfile;
  isCurrentUser: boolean; // Not strictly used here, but useful for edit mode
}

const ProfileLinks: React.FC<ProfileLinksProps> = ({ user, isCurrentUser }) => {
  const theme = useTheme();
  return (
    <ProfileHubSocials user={user} isCurrentUser={isCurrentUser} header="Social Links" />
  );
};

export default ProfileLinks;