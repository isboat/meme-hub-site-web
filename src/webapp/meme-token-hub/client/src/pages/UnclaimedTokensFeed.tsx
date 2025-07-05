// client/src/pages/UnclaimedTokensFeed.tsx
import React, { useState, useEffect, useRef, useCallback } from 'react';
import styled from 'styled-components';
import { useTheme } from '../context/ThemeContext';
import api from '../api/api'; // Import your Axios instance
import { UnclaimedToken } from '../types';
import LoadingSpinner from '../components/common/LoadingSpinner';
import Input from '../components/common/Input'; // Re-use common Input component
import { Link } from 'react-router-dom'; // For navigation to details/socials pages

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: ${({ theme }) => theme.spacing.large};
  background-color: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.text};
  min-height: calc(100vh - 120px); /* Adjust based on navbar/ticker height */
`;

const Header = styled.h1`
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: ${({ theme }) => theme.spacing.large};
  font-size: 2.5em;
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.small};
`;

const SearchBar = styled.div`
  width: 100%;
  max-width: 600px;
  margin-bottom: ${({ theme }) => theme.spacing.large};
`;

// UPDATED: TokenFeed now uses CSS Grid for 3 columns
const TokenFeed = styled.div`
  display: grid; /* Changed from flex */
  grid-template-columns: repeat(3, 1fr); /* 3 columns, each taking equal fraction of space */
  gap: ${({ theme }) => theme.spacing.medium}; /* Space between cards */
  width: 100%;
  max-width: 1200px; /* Increased max width to accommodate 3 columns */
  justify-items: center; /* Center items within their grid cells */

  /* Responsive adjustments for smaller screens */
  @media (max-width: ${({ theme }) => theme.breakpoints.large}) { /* Example: 992px */
    grid-template-columns: repeat(2, 1fr); /* 2 columns on medium screens */
    max-width: 800px; /* Adjust max width for 2 columns */
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.medium}) { /* Example: 768px */
    grid-template-columns: 1fr; /* 1 column on smaller screens */
    max-width: 400px; /* Adjust max width for 1 column */
  }
`;

const TokenCard = styled.div`
  display: flex;
  flex-direction: row; /* Changed to row so image is on the left of details */
  align-items: center; /* Center content horizontally within the card */
  gap: ${({ theme }) => theme.spacing.small}; /* Smaller gap inside the card */
  background-color: ${({ theme }) => theme.colors.cardBackground};
  padding: ${({ theme }) => theme.spacing.medium};
  border-radius: ${({ theme }) => theme.borderRadius};
  box-shadow: ${({ theme }) => theme.boxShadow};
  transition: transform 0.2s ease-in-out;
  width: 100%; /* Ensure card takes full width of its grid cell */
  text-align: center; /* Center text inside card details */

  &:hover {
    transform: translateY(-5px); /* Simple hover effect */
  }

  &.hidden {
    display: none; /* Used for filtering */
  }

  &:first-child {
    animation: fadeIn 0.5s ease-out; /* Simple animation for new tokens */
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(-20px); }
      to { opacity: 1; transform: translateY(0); }
    }
  }
`;

const CardImage = styled.img`
  width: 100px; /* Slightly larger image */
  height: 100px;
  border-radius: 8px;
  object-fit: cover;
  border: 2px solid ${({ theme }) => theme.colors.primary};
  margin-bottom: ${({ theme }) => theme.spacing.small}; /* Space between image and details */
`;

const CardDetails = styled.div`
  flex-grow: 1;
  text-align: center; /* Centered text for details within the card */
  strong {
    font-size: 1.2em;
    color: ${({ theme }) => theme.colors.primary};
  }
  span {
    color: ${({ theme }) => theme.colors.placeholder};
  }
  a {
    color: ${({ theme }) => theme.colors.secondary};
    text-decoration: none;
    font-weight: bold;
    &:hover {
      text-decoration: underline;
    }
    margin: 0 ${({ theme }) => theme.spacing.extraSmall}; /* Space between links */
  }
`;

const Footer = styled.footer`
  margin-top: ${({ theme }) => theme.spacing.large};
  padding: ${({ theme }) => theme.spacing.medium};
  color: ${({ theme }) => theme.colors.placeholder};
  font-size: 0.9em;
`;

const UnclaimedTokensFeed: React.FC = () => {
  const theme = useTheme();
  const [allUnclaimedTokens, setAllUnclaimedTokens] = useState<UnclaimedToken[]>([]);
  const [displayedTokens, setDisplayedTokens] = useState<UnclaimedToken[]>([]);
  const [searchInput, setSearchInput] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const tokenIndexRef = useRef(0);
  const maxDisplayedTokens = 15; // Number of tokens to keep in the feed

  const getUnclaimedTokens = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get<UnclaimedToken[]>('/memetoken/latestunclaimed');
      if (response.data && response.data.length > 0) {
        setAllUnclaimedTokens(response.data);
        // Initialize displayed tokens with a subset, reversing so the *latest* ones from the API
        // appear at the beginning of the `allUnclaimedTokens` array, making `addNewTokenToFeed`
        // consistently add the truly "newest" from the backend's perspective.
        // For initial display, we want to show the first few.
        // If the API returns them newest first, we slice from the beginning.
        // If it returns oldest first, we'd slice from the end and reverse.
        // Assuming API returns newest first, so we just take the first N.
        setDisplayedTokens(response.data.slice(0, maxDisplayedTokens));
        tokenIndexRef.current = maxDisplayedTokens; // Start adding from the next token
        if (response.data.length < maxDisplayedTokens) {
             tokenIndexRef.current = response.data.length; // Don't go out of bounds
        }
      } else {
        setAllUnclaimedTokens([]);
        setDisplayedTokens([]);
      }
    } catch (err: any) {
      console.error("Error fetching unclaimed tokens:", err);
      setError(err.response?.data?.message || "Failed to load unclaimed tokens.");
    } finally {
      setLoading(false);
    }
  }, []);

  const addNewTokenToFeed = useCallback(() => {
    if (allUnclaimedTokens.length === 0) return;

    // Loop through tokens
    if (tokenIndexRef.current >= allUnclaimedTokens.length) {
      tokenIndexRef.current = 0;
    }

    const nextToken = allUnclaimedTokens[tokenIndexRef.current];
    if (nextToken) {
      setDisplayedTokens(prevTokens => {
        // Only add if not already present (to avoid duplicates if interval runs fast)
        if (prevTokens.some(t => t.rawData.mint === nextToken.rawData.mint)) {
            return prevTokens;
        }
        const newTokens = [nextToken, ...prevTokens]; // Add new token to the beginning
        return newTokens.slice(0, maxDisplayedTokens); // Keep only the latest 15
      });
      tokenIndexRef.current++;
    }
  }, [allUnclaimedTokens]);

  useEffect(() => {
    getUnclaimedTokens();
  }, [getUnclaimedTokens]);

  useEffect(() => {
    if (allUnclaimedTokens.length > 0) {
      const intervalId = setInterval(addNewTokenToFeed, 2000); // Add a new token every 2 seconds
      return () => clearInterval(intervalId); // Cleanup on unmount
    }
  }, [allUnclaimedTokens, addNewTokenToFeed]);

  const filteredTokens = displayedTokens.filter(token =>
    token.rawData.mint.toUpperCase().includes(searchInput.toUpperCase()) ||
    token.name.toUpperCase().includes(searchInput.toUpperCase()) // Also allow searching by name
  );

  return (
    <>
      <PageContainer theme={theme}>
        <Header theme={theme}>
          <span role="img" aria-label="lightning bolt">⚡</span> Live Unclaimed Meme Tokens (Solana)
        </Header>
        <SearchBar theme={theme}>
          <Input
            type="text"
            placeholder="Search by token address or name..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
        </SearchBar>

        {loading && <LoadingSpinner />}
        {error && <p style={{ color: theme.colors.error }}>{error}</p>}

        {!loading && !error && filteredTokens.length === 0 && (
          <p style={{ color: theme.colors.text }}>No tokens found matching your search or no unclaimed tokens available.</p>
        )}

        <TokenFeed theme={theme}>
          {filteredTokens.map((token) => (
            <TokenCard key={token.rawData.mint} theme={theme} data-address={token.rawData.mint}>
              <CardImage src={token.image} alt={token.name} theme={theme} />
              <CardDetails theme={theme}>
                <strong>{token.name}</strong><br />
                <span>InitialBuy: ${token.rawData.initialBuy.toFixed(4)}</span><br />
                <span>MC: ${token.rawData.marketCapSol.toFixed(2)} SOL</span><br />
                <Link className="card-claim-now" to={`/token/${token.rawData.mint}`}>Details</Link>
                <span> | </span>
                <Link className="card-claim-now" to={`/submit-socials?token-addr=${token.rawData.mint}`}>Update Socials</Link>
              </CardDetails>
            </TokenCard>
          ))}
        </TokenFeed>
      </PageContainer>
      <Footer theme={theme}>&copy; 2025 MEMETOKENHUB</Footer>
    </>
  );
};

export default UnclaimedTokensFeed;