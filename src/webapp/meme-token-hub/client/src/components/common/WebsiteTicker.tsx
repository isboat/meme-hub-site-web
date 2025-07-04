// client/src/components/common/WebsiteTicker.tsx
import React from 'react';
import styled, { keyframes } from 'styled-components';
import { useTheme } from '../../context/ThemeContext';
import { useApi } from '../../hooks/useApi';
import { TickerItem } from '../../types';
import LoadingSpinner from './LoadingSpinner';
import { Link } from 'react-router-dom';

// Define the scrolling animation
const scrollLeft = keyframes`
  0% { transform: translateX(100%); }
  100% { transform: translateX(-100%); }
`;

const TickerWrapper = styled.div`
  width: 100%;
  overflow: hidden; /* Hide content outside the wrapper */
  background-color: ${({ theme }) => theme.colors.cardBackground};
  color: ${({ theme }) => theme.colors.text};
  padding: ${({ theme }) => theme.spacing.small} 0;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  white-space: nowrap; /* Prevent text from wrapping */
  box-shadow: ${({ theme }) => theme.boxShadow};
  margin-top: ${({ theme }) => theme.spacing.medium}; /* Add some margin from top */
`;

const TickerContent = styled.div<{ duration: number }>`
  display: inline-block; /* Keep content in one line */
  padding-left: 100%; /* Start content off-screen to the right */
  animation: ${scrollLeft} ${({ duration }) => duration}s linear infinite;

  &:hover {
    animation-play-state: paused; /* Pause on hover */
  }
`;

const TickerItemStyled = styled.span`
  display: inline-block;
  margin-right: ${({ theme }) => theme.spacing.large}; /* Space between items */
  font-size: 0.9em;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.text};

  a {
    color: ${({ theme }) => theme.colors.primary};
    text-decoration: none;
    &:hover {
      text-decoration: underline;
    }
  }
`;

const ErrorMessage = styled.p`
  color: ${({ theme }) => theme.colors.error};
  text-align: center;
  padding: ${({ theme }) => theme.spacing.small};
`;

const WebsiteTicker: React.FC = () => {
  const theme = useTheme();
  // Fetch ticker data from the backend. Assuming an endpoint '/api/ticker'
  const { data: tickerItems, loading, error } = useApi<TickerItem[]>('/memetoken/ticker');

  // Calculate animation duration based on content length for smoother experience
  // This is a simple heuristic; you might need to fine-tune the multiplier
  const calculateDuration = (items: TickerItem[] | null) => {
    if (!items || items.length === 0) return 30; // Increased default duration for empty or very short content
    const totalLength = items.reduce((acc, item) => acc + item.text.length, 0);
    // Increase the multiplier (e.g., from 0.2 to 0.5 or 0.8) to make it slower
    // A higher value means more seconds per character, slowing it down.
    return Math.max(30, totalLength * 0.5); // Adjusted multiplier and minimum duration
  };

  const animationDuration = calculateDuration(tickerItems);

  if (loading) {
    return (
      <TickerWrapper theme={theme}>
        <LoadingSpinner />
      </TickerWrapper>
    );
  }

  if (error) {
    return (
      <TickerWrapper theme={theme}>
        <ErrorMessage theme={theme}>Failed to load ticker: {error}</ErrorMessage>
      </TickerWrapper>
    );
  }

  if (!tickerItems || tickerItems.length === 0) {
    return null; // Don't render ticker if no items
  }

  // Duplicate content to create a seamless loop.
  // We duplicate it a few times to ensure there's always content scrolling.
  const duplicatedItems = [...tickerItems, ...tickerItems, ...tickerItems];

  return (
    <TickerWrapper theme={theme}>
      <TickerContent duration={animationDuration}>
        {duplicatedItems.map((item, index) => (
          <TickerItemStyled key={`${item._id}-${index}`} theme={theme}>
            {item.link ? (
              <Link to={item.link}>{item.text}</Link>
            ) : (
              item.text
            )}
          </TickerItemStyled>
        ))}
      </TickerContent>
    </TickerWrapper>
  );
};

export default WebsiteTicker;