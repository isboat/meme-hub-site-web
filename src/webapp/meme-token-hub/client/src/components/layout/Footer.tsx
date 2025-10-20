// ...existing code...
import React from 'react';
import styled from 'styled-components';
import { useTheme } from '../../context/ThemeContext';

const FooterContainer = styled.footer`
  padding: ${({ theme }) => theme.spacing.medium};
  background-color: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.footer};
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.medium};

  a {
    color: ${({ theme }) => theme.colors.footer};
    font-size: 12px;
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
    text-align: center;
    padding: ${({ theme }) => theme.spacing.small};
  }
`;

const Columns = styled.div`
  display: flex;
  width: 100%;
  gap: ${({ theme }) => theme.spacing.medium};
  align-items: flex-start;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
    gap: ${({ theme }) => theme.spacing.small};
  }
`;

const Column = styled.div`
  flex: 1;
  padding: ${({ theme }) => theme.spacing.small};

  h2 {
    margin: 0 0 8px 0;
    font-size: 1rem;
  }

  p, li, a {
    font-size: 13px;
  }

  ul {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  @media (max-width: 768px) {
    width: 100%;
    padding: 6px 0;
  }
`;

const Small = styled.div`
  width: 100%;
  text-align: center;
  margin-top: ${({ theme }) => theme.spacing.small};
  color: ${({ theme }) => theme.colors.placeholder};
  font-size: 12px;
`;

const QuickLinks = styled.ul`
  display: flex;
  gap: 12px;

  @media (max-width: 480px) {
    flex-direction: column;
    gap: 6px;
  }

  li a {
    display: inline-block;
  }
`;

// ...existing code...
const SiteFooter: React.FC = () => {
  const theme = useTheme();

  return (
    <FooterContainer theme={theme}>
      <Columns theme={theme}>
        <Column theme={theme}>
          <h2>MemeTokenHub</h2>
          <p style={{ margin: 0 }}>Community-driven token discovery</p>
        </Column>

        <Column theme={theme} aria-label="Quick links">
          <h2>Quick Links</h2>
          <QuickLinks>
            <li><a href="/trending">Trending</a></li>
            <li><a href="/created-tokens">Created Tokens</a></li>
            <li><a href="/about-us">About</a></li>
          </QuickLinks>
        </Column>

        <Column theme={theme} aria-label="Contact information">
          <h2>Contact</h2>
          <p style={{ margin: 0 }}>Email: <a href="mailto:support@memetokenhub.com">support@memetokenhub.com</a></p>
          <p style={{ marginTop: theme.spacing.small }}>Follow us on <a href="/community">Community</a></p>
        </Column>
      </Columns>

      <Small theme={theme}>
        © {new Date().getFullYear()} MemeTokenHub. All rights reserved.
      </Small>
    </FooterContainer>
  );
};

export default SiteFooter;
// ...existing code...