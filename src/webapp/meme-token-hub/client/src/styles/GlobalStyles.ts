// client/src/styles/GlobalStyles.ts
import { createGlobalStyle } from 'styled-components';
import { Theme } from './themes';

export const GlobalStyles = createGlobalStyle<{ theme: Theme }>`
  *, *::before, *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  body {
    font-family: 'Inter', sans-serif; /* Or your preferred font */
    background-color: ${({ theme }) => theme.colors.background};
    color: ${({ theme }) => theme.colors.text};
    line-height: 1.6;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  a {
    color: ${({ theme }) => theme.colors.primary};
    text-decoration: none;
    &:hover {
      text-decoration: underline;
    }
  }

  button {
    cursor: pointer;
    border: none;
    background: none;
    color: inherit;
    font-family: inherit;
  }

  input, textarea, select {
    font-family: inherit;
    color: ${({ theme }) => theme.colors.text};
    background-color: ${({ theme }) => theme.colors.cardBackground};
    border: 1px solid ${({ theme }) => theme.colors.border};
    border-radius: ${({ theme }) => theme.borderRadius};
    padding: ${({ theme }) => theme.spacing.small};
    &:focus {
      outline: none;
      border-color: ${({ theme }) => theme.colors.primary};
    }
    &::placeholder {
      color: ${({ theme }) => theme.colors.placeholder};
    }
  }

  #root {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
  }
`;