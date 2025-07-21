import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useApi } from '../hooks/useApi';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { UserProfile } from '../types'; // Assuming your User interface is defined here
import axios from 'axios'; // For robust error handling

// Styled Components
const PageContainer = styled.div`
  max-width: 1000px;
  margin: ${({ theme }) => theme.spacing.large} auto;
  padding: ${({ theme }) => theme.spacing.medium};
  background-color: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.text};
  min-height: calc(100vh - 120px); /* Adjust based on navbar/footer height */
`;

const Header = styled.h1`
  text-align: center;
  margin-bottom: ${({ theme }) => theme.spacing.large};
  color: ${({ theme }) => theme.colors.primary};
`;

const ProfileGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); /* Adjust minmax for card width */
  gap: ${({ theme }) => theme.spacing.medium};
  justify-items: center; /* Center items in the grid cells */

  @media (max-width: ${({ theme }) => theme.breakpoints.medium}) {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.small}) {
    grid-template-columns: 1fr; /* Stack on small screens */
    padding: 0 ${({ theme }) => theme.spacing.small}; /* Add some padding on very small screens */
  }
`;

const ProfileCard = styled(Link)`
  background-color: ${({ theme }) => theme.colors.cardBackground};
  padding: ${({ theme }) => theme.spacing.medium};
  border-radius: ${({ theme }) => theme.borderRadius};
  box-shadow: ${({ theme }) => theme.boxShadow};
  display: flex;
  flex-direction: column;
  align-items: center;
  text-decoration: none; /* Remove underline from Link */
  color: inherit; /* Inherit text color from parent */
  transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
  width: 100%; /* Ensure card takes full width of its grid cell */
  max-width: 250px; /* Max width to prevent overly wide cards on large screens */

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15); /* Slightly larger shadow on hover */
  }
`;

const ProfileImage = styled.img`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  object-fit: cover;
  margin-bottom: ${({ theme }) => theme.spacing.small};
  border: 2px solid ${({ theme }) => theme.colors.primary};
`;

const Username = styled.h2`
  font-size: 1.2em;
  color: ${({ theme }) => theme.colors.text};
  margin: 0;
  white-space: nowrap; /* Prevent username from wrapping */
  overflow: hidden; /* Hide overflow */
  text-overflow: ellipsis; /* Add ellipsis for overflow */
  max-width: 100%; /* Ensure it respects parent width */
  text-align: center;
`;

const ErrorMessage = styled.p`
  color: ${({ theme }) => theme.colors.error};
  text-align: center;
  margin-top: ${({ theme }) => theme.spacing.large};
`;

const NoProfilesMessage = styled.p`
  color: ${({ theme }) => theme.colors.placeholder};
  text-align: center;
  margin-top: ${({ theme }) => theme.spacing.large};
`;

const KolProfiles: React.FC = () => {
  const theme = useTheme();
  // Fetch a list of users/profiles from the backend
  // The endpoint is assumed to be /api/users (hence '/users' here)
  const { data: profiles, loading, error } = useApi<UserProfile[]>('/profile/kols');

  if (loading) {
    return (
      <PageContainer theme={theme}>
        <Header theme={theme}>Profiles</Header>
        <LoadingSpinner />
        <p style={{ textAlign: 'center', color: theme.colors.placeholder }}>Loading profiles...</p>
      </PageContainer>
    );
  }

  if (error) {
    let errorMessage = 'An unexpected error occurred.';
    if (axios.isAxiosError(error)) {
      errorMessage = error.response?.data?.message || error.message;
    } else {
      errorMessage = String(error);
    }
    return (
      <PageContainer theme={theme}>
        <Header theme={theme}>Profiles</Header>
        <ErrorMessage theme={theme}>Error loading profiles: {errorMessage}</ErrorMessage>
      </PageContainer>
    );
  }

  if (!profiles || profiles.length === 0) {
    return (
      <PageContainer theme={theme}>
        <Header theme={theme}>Profiles</Header>
        <NoProfilesMessage theme={theme}>No profiles found. Start creating some!</NoProfilesMessage>
      </PageContainer>
    );
  }

  return (
    <PageContainer theme={theme}>
      <Header theme={theme}>Key Opinion Leaders</Header>
      <ProfileGrid theme={theme}>
        {profiles.map((profile) => (
          <ProfileCard key={profile.id} to={`/user-profile/${profile.id}`} theme={theme}>
            <ProfileImage theme={theme}
              src={profile.profileImage || '/default-avatar.JPG'} // Use a default image if none
              alt={`${profile.username}'s profile`}
            />
            <Username theme={theme}>{profile.username}</Username>
          </ProfileCard>
        ))}
      </ProfileGrid>
    </PageContainer>
  );
};

export default KolProfiles;