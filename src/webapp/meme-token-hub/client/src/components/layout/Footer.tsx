import React from 'react';
import styled from 'styled-components';
import { useTheme } from '../../context/ThemeContext';

const FooterContainer = styled.div`
  padding: ${({ theme }) => theme.spacing.medium};
  background-color: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.footer};
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;

  a {
    color: ${({ theme }) => theme.colors.footer};
    font-size: 12px;
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }

`;

const Column = styled.div`
  flex: 1;
  padding: ${({ theme }) => theme.spacing.small};
`;

const SiteFooter: React.FC = () => {
  const theme = useTheme();

  return (
    <FooterContainer theme={theme}>
      <Column theme={theme}>
        <div><h2>MemeTokenHub</h2></div>
        <p>Community-driven token discovery</p>
      </Column>
      <Column theme={theme}>
        <div>Quick Links</div>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          <li><a href="/trending">Trending</a></li>
          <li><a href="/created-tokens">Created Tokens</a></li>
        </ul>
      </Column>
      <Column theme={theme}>
        <div>Contact</div>
        <p>Email: support@memetokenhub.com</p>
        <p>© 2023 MemeTokenHub. All rights reserved.</p>
      </Column>
    </FooterContainer>
  );
};

export default SiteFooter;