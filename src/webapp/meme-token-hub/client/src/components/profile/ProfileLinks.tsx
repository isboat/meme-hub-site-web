// client/src/components/profile/ProfileLinks.tsx
import React from 'react';
import styled from 'styled-components';
import { User } from '../../types';
import { useTheme } from '../../context/ThemeContext';
import { FaFacebook, FaTwitter, FaLink } from 'react-icons/fa'; // Example icons

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
  user: User;
  isCurrentUser: boolean; // Not strictly used here, but useful for edit mode
}

const ProfileLinks: React.FC<ProfileLinksProps> = ({ user }) => {
  const theme = useTheme();

  const hasLinks = user.socialLinks && (user.socialLinks.facebook || user.socialLinks.twitter);

  return (
    <LinksCard theme={theme}>
      <h3 style={{ marginBottom: theme.spacing.medium, color: theme.colors.secondary }}>External Links</h3>
      {hasLinks ? (
        <>
          {user.socialLinks?.facebook && (
            <LinkItem theme={theme}>
              <FaFacebook />
              <a href={user.socialLinks.facebook} target="_blank" rel="noopener noreferrer">
                Facebook
              </a>
            </LinkItem>
          )}
          {user.socialLinks?.twitter && (
            <LinkItem theme={theme}>
              <FaTwitter />
              <a href={user.socialLinks.twitter} target="_blank" rel="noopener noreferrer">
                Twitter
              </a>
            </LinkItem>
          )}
          {/* Add more links as needed */}
        </>
      ) : (
        <p>No social media links provided.</p>
      )}
    </LinksCard>
  );
};

export default ProfileLinks;