import React from 'react';
import styled from 'styled-components';
import { useTheme } from '../../context/ThemeContext';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  // Allow passing className for external styling if needed (though styled-components handles most)
  className?: string;
}

const StyledButton = styled.button<ButtonProps>`
  /* Base styles for all buttons */
  padding: ${({ theme }) => theme.spacing.medium};
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius};
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s ease-in-out, transform 0.1s ease-in-out, opacity 0.2s ease-in-out;
  font-size: 1em;
  width: auto; /* Default to auto width, can be overridden by parent styles */
  display: inline-flex; /* Allows content to be centered if needed */
  align-items: center;
  justify-content: center;
  text-decoration: none; /* Ensure no underline for links styled as buttons */

  /* Variant-specific styles */
  background-color: ${({ theme }) => theme.colors.twitter };
  color: ${({ theme }) => theme.colors.text};
  border: none;

  /* Hover effect */
  &:hover:not(:disabled) {
    opacity: 0.9;
    transform: translateY(-2px);
    box-shadow: ${({ theme }) => theme.boxShadow}; /* Add subtle shadow on hover */
  }

  /* Disabled state */
  &:disabled {
    background-color: ${({ theme }) => theme.colors.placeholder};
    color: ${({ theme }) => theme.colors.text};
    cursor: not-allowed;
    opacity: 0.6;
    transform: none; /* Remove hover transform when disabled */
    box-shadow: none; /* Remove hover shadow when disabled */
  }
`;

const TwitterLoginButton: React.FC = () => {
  const theme = useTheme(); // Access the theme
  
  const handleLogin = () => {
    const clientId = 'YOUR_TWITTER_CLIENT_ID';
    const redirectUri = encodeURIComponent('http://localhost:3000/twitter-callback');
    const scope = encodeURIComponent('tweet.read users.read offline.access');
    const state = 'secure_random_state';

    const authUrl = `https://twitter.com/i/oauth2/authorize?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}&state=${state}&code_challenge=challenge&code_challenge_method=plain`;

    window.location.href = authUrl;
  };

  return <StyledButton theme={theme} onClick={handleLogin}>Login with Twitter</StyledButton>;
};

export default TwitterLoginButton;
