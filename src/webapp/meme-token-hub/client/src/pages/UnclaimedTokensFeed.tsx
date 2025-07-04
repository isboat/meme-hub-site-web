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

const TokenFeed = styled.div`
  display: flex;
  flex-direction: column; /* Tokens appear stacked vertically, newest at top */
  gap: ${({ theme }) => theme.spacing.medium};
  width: 100%;
  max-width: 800px; /* Adjust max width for the feed */
`;

const TokenCard = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.medium};
  background-color: ${({ theme }) => theme.colors.cardBackground};
  padding: ${({ theme }) => theme.spacing.medium};
  border-radius: ${({ theme }) => theme.borderRadius};
  box-shadow: ${({ theme }) => theme.boxShadow};
  transition: transform 0.2s ease-in-out;

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
  width: 80px;
  height: 80px;
  border-radius: 8px;
  object-fit: cover;
  border: 2px solid ${({ theme }) => theme.colors.primary};
`;

const CardDetails = styled.div`
  flex-grow: 1;
  text-align: left;
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

  // useRef to keep track of the current index for adding tokens
  const tokenIndexRef = useRef(0);
  const maxDisplayedTokens = 15; // As per your original script

  // Function to fetch initial data
  const getUnclaimedTokens = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get<UnclaimedToken[]>('/memetoken/latestunclaimed');
      if (response.data && response.data.length > 0) {
        setAllUnclaimedTokens(response.data);
        // Initialize displayed tokens with the first few or all if less than maxDisplayedTokens
        setDisplayedTokens(response.data.slice(0, maxDisplayedTokens).reverse()); // Reverse to add oldest first, so new ones come to top
        tokenIndexRef.current = response.data.length < maxDisplayedTokens ? response.data.length : maxDisplayedTokens;
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

  // Function to add a new token to the displayed feed
  const addNewTokenToFeed = useCallback(() => {
    if (allUnclaimedTokens.length === 0) return;

    // Reset index if we've gone through all available tokens
    if (tokenIndexRef.current >= allUnclaimedTokens.length) {
      tokenIndexRef.current = 0; // Loop back to the start
    }

    const nextToken = allUnclaimedTokens[tokenIndexRef.current];
    if (nextToken) {
      setDisplayedTokens(prevTokens => {
        const newTokens = [nextToken, ...prevTokens]; // Add new token to the beginning
        return newTokens.slice(0, maxDisplayedTokens); // Keep only the latest 15
      });
      tokenIndexRef.current++;
    }
  }, [allUnclaimedTokens]);

  // Initial data fetch on component mount
  useEffect(() => {
    getUnclaimedTokens();
  }, [getUnclaimedTokens]);

  // Set up the interval for adding new tokens
  useEffect(() => {
    if (allUnclaimedTokens.length > 0) {
      const intervalId = setInterval(addNewTokenToFeed, 2000); // Add a new token every 2 seconds
      return () => clearInterval(intervalId); // Cleanup on unmount
    }
  }, [allUnclaimedTokens, addNewTokenToFeed]); // Depend on allUnclaimedTokens to ensure interval starts after data is loaded

  // Filter logic based on search input
  const filteredTokens = displayedTokens.filter(token =>
    token.rawData.mint.toUpperCase().includes(searchInput.toUpperCase())
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
            placeholder="Search by token address..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
        </SearchBar>

        {loading && <LoadingSpinner />}
        {error && <p style={{ color: theme.colors.error }}>{error}</p>}

        {!loading && !error && filteredTokens.length === 0 && (
          <p>No tokens found matching your search or no unclaimed tokens available.</p>
        )}

        <TokenFeed theme={theme}>
          {filteredTokens.map((token) => (
            <TokenCard key={token.rawData.mint} theme={theme} data-address={token.rawData.mint}>
              <CardImage src={token.image} alt={token.name} theme={theme} />
              <CardDetails theme={theme}>
                <strong>{token.name}</strong><br />
                InitialBuy: {token.rawData.initialBuy}<br />
                MC: ${token.rawData.marketCapSol}<br />
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