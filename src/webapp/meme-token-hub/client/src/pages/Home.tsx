// ...existing code...
import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import Button from '../components/common/Button';

// Modified HomeContainer to stack content vertically and be touch-friendly
const HomeContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  min-height: 100vh;
  background-color: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.text};
  text-align: center;
  padding: ${({ theme }) => theme.spacing.large};
  box-sizing: border-box;

  @media (max-width: 480px) {
    padding: ${({ theme }) => theme.spacing.medium};
  }
`;

const TopContent = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.large};
  text-align: center;
  max-width: 860px;
  padding: ${({ theme }) => theme.spacing.medium};
`;

const MainTitle = styled.h1`
  font-size: 3em;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: ${({ theme }) => theme.spacing.medium};

  @media (max-width: 900px) {
    font-size: 2.3rem;
  }

  @media (max-width: 480px) {
    font-size: 1.6rem;
  }
`;

const MainParagraph = styled.p`
  color: ${({ theme }) => theme.colors.text};
  line-height: 1.5;
  margin: 0 auto;
  max-width: 760px;

  @media (max-width: 480px) {
    font-size: 0.95rem;
    max-width: 100%;
  }
`;

/* Cards layout:
   - Desktop: up to 3/4 cards per row depending on width
   - Tablet: 2 columns
   - Mobile: stacked column
*/
const ContentCardsWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(220px, 1fr));
  gap: ${({ theme }) => theme.spacing.large};
  justify-items: stretch;
  width: 100%;
  max-width: 1200px;
  box-sizing: border-box;

  @media (max-width: 1100px) {
    grid-template-columns: repeat(2, minmax(220px, 1fr));
  }

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
    gap: ${({ theme }) => theme.spacing.medium};
  }
`;

const ContentCard = styled.div`
  background-color: ${({ theme }) => theme.colors.cardBackground};
  padding: ${({ theme }) => theme.spacing.large};
  border-radius: ${({ theme }) => theme.borderRadius};
  box-shadow: ${({ theme }) => theme.boxShadow};
  width: 100%;
  box-sizing: border-box;
  transition: transform 120ms ease, box-shadow 120ms ease;

  &:hover {
    transform: translateY(-4px);
    box-shadow: ${({ theme }) => theme.boxShadow};
  }

  @media (max-width: 480px) {
    padding: ${({ theme }) => theme.spacing.medium};
  }
`;

const CardTitle = styled.h2`
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: ${({ theme }) => theme.spacing.medium};
  font-size: 1.25rem;

  @media (max-width: 480px) {
    font-size: 1.05rem;
  }
`;

const CardDescription = styled.p`
  margin-bottom: ${({ theme }) => theme.spacing.large};
  line-height: 1.6;
  color: ${({ theme }) => theme.colors.placeholder};
  font-size: 0.98rem;

  @media (max-width: 480px) {
    font-size: 0.95rem;
  }
`;

/* Buttons row inside each card - stacks on small screens */
const CardButtonRow = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
  flex-wrap: wrap;

  button {
    min-width: 120px;
  }

  @media (max-width: 480px) {
    flex-direction: column;
    align-items: stretch;

    button {
      width: 100%;
      min-width: auto;
    }
  }
`;

// small utility to keep consistent spacing on very narrow screens
const Spacer = styled.div`
  height: ${({ theme }) => theme.spacing.small};
`;

// ...existing code...
const Home: React.FC = () => {
  const navigate = useNavigate();
  const theme = useTheme();

  const handleGetStarted = () => {
    navigate('/auth');
  };

  const handleTrending = () => {
    navigate('/tokens')
  }
  const handleUnclaimed = () => {
    navigate('/unclaimed-tokens')
  }

  const handleProfile = () => {
    navigate('/kol-profiles')
  }

  const handleCreatedTokens = () => {
    navigate('/created-tokens')
  }

  return (
    <HomeContainer theme={theme}>
      <TopContent theme={theme}>
        <MainTitle theme={theme}>Welcome to MemeTokenHub</MainTitle>
        <MainParagraph theme={theme}>
          Your new hub for connecting, sharing, and discovering meme tokens. Dive into a vibrant community where
          your voice matters, and every connection sparks new possibilities. Explore profiles, share moments, and
          engage with memes from around the world.
        </MainParagraph>
      </TopContent>

      <ContentCardsWrapper theme={theme}>
        <ContentCard theme={theme}>
          <CardTitle theme={theme}>⚡ Live Feed</CardTitle>
          <CardDescription theme={theme}>
            See unclaimed tokens appearing in real time.
          </CardDescription>
          <CardButtonRow>
            <Button onClick={handleUnclaimed} style={{ backgroundColor: theme.colors.primary }}>
              Watch Now
            </Button>
            <Button onClick={handleTrending} style={{ backgroundColor: theme.colors.success }}>
              Trending
            </Button>
          </CardButtonRow>
        </ContentCard>

        <ContentCard theme={theme}>
          <CardTitle theme={theme}>⚡ Created Tokens</CardTitle>
          <CardDescription theme={theme}>
            See newly created tokens appearing in real time.
          </CardDescription>
          <CardButtonRow>
            <Button onClick={handleCreatedTokens} style={{ backgroundColor: theme.colors.primary }}>
              Created Tokens
            </Button>
          </CardButtonRow>
        </ContentCard>

        <ContentCard theme={theme}>
          <CardTitle theme={theme}>🔥 Connect & Share</CardTitle>
          <CardDescription theme={theme}>
            Create your unique profile, share what's on your mind, and connect with friends and new people.
            It's your space to express yourself.
          </CardDescription>
          <CardButtonRow>
            <Button onClick={handleGetStarted} style={{ backgroundColor: theme.colors.primary }}>
              Join Now
            </Button>
          </CardButtonRow>
        </ContentCard>

        <ContentCard theme={theme}>
          <CardTitle theme={theme}>Explore & Discover</CardTitle>
          <CardDescription theme={theme}>
            Browse public profiles, and explore content even before you sign up. See what the community is talking about!
          </CardDescription>
          <CardButtonRow>
            <Button onClick={handleProfile} style={{ backgroundColor: theme.colors.warning, color: theme.colors.white }}>
              View KOL Profiles
            </Button>
          </CardButtonRow>
        </ContentCard>

        <ContentCard theme={theme}>
          <CardTitle theme={theme}>🔥 Community Takeovers</CardTitle>
          <CardDescription theme={theme}>
            See which teams are reviving failed meme coins.
          </CardDescription>
          <CardButtonRow>
            <Button onClick={handleGetStarted} style={{ backgroundColor: theme.colors.primary }}>
              View CTOs →
            </Button>
          </CardButtonRow>
        </ContentCard>
      </ContentCardsWrapper>

      <Spacer theme={theme} />
    </HomeContainer>
  );
};

export default Home;
// ...existing code...