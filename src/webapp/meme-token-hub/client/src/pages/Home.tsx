import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import Button from '../components/common/Button';

// Modified HomeContainer to stack content vertically
const HomeContainer = styled.div`
  display: flex;
  flex-direction: column; /* Changed to column to stack main title/paragraph and content cards */
  align-items: center;
  justify-content: center; /* This might need adjustment if you want content at the top */
  min-height: 100vh;
  background-color: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.text};
  text-align: center;
  padding: ${({ theme }) => theme.spacing.large};
`;

const TopContent = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.large};
  text-align: center;
  max-width: 800px; /* Limit width for readability */
  padding: ${({ theme }) => theme.spacing.medium};
`;

const MainTitle = styled.h1`
  font-size: 3em; /* Larger font size for main title */
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: ${({ theme }) => theme.spacing.medium};
`;

const MainParagraph = styled.p`
  font-size: 1.2em;
  line-height: 1.8;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: ${({ theme }) => theme.spacing.large};
`;

const ContentCardsWrapper = styled.div`
  display: flex;
  flex-direction: row; /* Keep content cards in a row */
  gap: ${({ theme }) => theme.spacing.large}; /* Space between cards */
  flex-wrap: wrap; /* Allow cards to wrap on smaller screens */
  justify-content: center; /* Center cards if they don't fill the row */
  max-width: 1200px; /* Adjust as needed */
`;


const ContentCard = styled.div`
  background-color: ${({ theme }) => theme.colors.cardBackground};
  padding: ${({ theme }) => theme.spacing.large};
  border-radius: ${({ theme }) => theme.borderRadius};
  box-shadow: ${({ theme }) => theme.boxShadow};
  max-width: 400px; /* Smaller max-width for individual cards in a row */
  width: 100%;
  flex: 1; /* Allow cards to grow and shrink */
  min-width: 300px; /* Ensure cards don't get too small */
`;

const CardTitle = styled.h2` /* Changed to h2 for semantic hierarchy */
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: ${({ theme }) => theme.spacing.medium};
`;

const CardDescription = styled.p` /* Renamed for clarity */
  margin-bottom: ${({ theme }) => theme.spacing.large};
  line-height: 1.8;
  color: ${({ theme }) => theme.colors.placeholder};
`;

const Home: React.FC = () => {
  const navigate = useNavigate();
  const theme = useTheme();

  const handleGetStarted = () => {
    navigate('/auth');
  };

  const handleUnclaimed = () => {
    navigate('/unclaimed-tokens')
  }

  const handleProfile = () => {
    navigate('/kol-profiles')
  }

  return (
    <HomeContainer theme={theme}>
      <TopContent theme={theme}>
        <MainTitle theme={theme}>Welcome to MemeTokenHub</MainTitle>
        <MainParagraph theme={theme}>
          Your new hub for connecting, sharing, and discovering of meme token. Dive into a vibrant community where
          your voice matters, and every connection sparks new possibilities. Explore profiles, share your
          moments, and engage with memes from around the world.
        </MainParagraph>
      </TopContent>

      {/* Wrapper for the existing ContentCards to maintain their row layout */}
      <ContentCardsWrapper theme={theme}>
        <ContentCard theme={theme}>
          <CardTitle theme={theme}>⚡ Live Feed</CardTitle>
          <CardDescription theme={theme}>
            See unclaimed tokens appearing in real time.
          </CardDescription>
          <Button onClick={handleUnclaimed} style={{ backgroundColor: theme.colors.primary }}>
            Watch Now
          </Button>
          <Button onClick={handleProfile} style={{ backgroundColor: theme.colors.primary }}>
            View KOL Profiles
          </Button>
        </ContentCard>
        <ContentCard theme={theme}>
          <CardTitle theme={theme}>🔥 Connect & Share</CardTitle>
          <CardDescription theme={theme}>
            Create your unique profile, share what's on your mind, and connect with friends and new people.
            It's your space to express yourself freely.
          </CardDescription>
          <Button onClick={handleGetStarted} style={{ backgroundColor: theme.colors.primary }}>
            Join Now
          </Button>
        </ContentCard>

        <ContentCard theme={theme}>
          <CardTitle theme={theme}>Explore & Discover</CardTitle>
          <CardDescription theme={theme}>
            Browse public profiles, discover trending topics, and explore content even before you sign up.
            See what the community is talking about!
          </CardDescription>
          <Button onClick={handleGetStarted} style={{ backgroundColor: theme.colors.primary }}>
            Discover
          </Button>
        </ContentCard>

        <ContentCard theme={theme}>
          <CardTitle theme={theme}>🔥 Community Takeovers</CardTitle>
          <CardDescription theme={theme}>
          See which teams are reviving failed meme coins.
          </CardDescription>
          <Button onClick={handleGetStarted} style={{ backgroundColor: theme.colors.primary }}>
          View CTOs →
          </Button>
        </ContentCard>
      </ContentCardsWrapper>
    </HomeContainer>
  );
};

export default Home;