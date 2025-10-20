// ...existing code...
import React, { ReactNode } from 'react';
import styled from 'styled-components';
import Navbar from './Navbar';
import { useTheme } from '../../context/ThemeContext';
import WebsiteTicker from '../common/WebsiteTicker';
import SiteFooter from './Footer';
// ...existing code...

const AppWrapper = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: ${({ theme }) => theme.colors.background};
`;

/* layout that contains the nav + main content
   Desktop: horizontal with fixed nav width
   Mobile: stack with nav on top and main content full width */
const SiteLayout = styled.div`
  display: flex;
  flex-direction: row;
  flex-grow: 1;
  align-items: flex-start;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

/* wrapper for the nav to provide a fixed width on larger screens
   and full width on mobile */
const NavWrapper = styled.div`
  width: 260px;
  flex-shrink: 0;

  @media (max-width: 1024px) {
    width: 220px;
  }

  @media (max-width: 768px) {
    width: 100%;
    position: relative; /* allows Navbar overlay/modal to position correctly */
  }
`;

const MainContent = styled.main`
  flex-grow: 1;
  padding: ${({ theme }) => theme.spacing.medium};
  box-sizing: border-box;

  @media (max-width: 1024px) {
    padding: ${({ theme }) => theme.spacing.small};
  }

  @media (max-width: 420px) {
    padding: ${({ theme }) => theme.spacing.small} 12px;
  }
`;

interface LayoutProps {
  children: ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const theme = useTheme();
  return (
    <AppWrapper theme={theme}>
      <WebsiteTicker />
      <SiteLayout>
        <NavWrapper>
          <Navbar />
        </NavWrapper>

        <MainContent theme={theme}>
          {children}
        </MainContent>
      </SiteLayout>
      <SiteFooter />
    </AppWrapper>
  );
};
// ...existing code...