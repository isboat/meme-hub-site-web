// client/src/components/layout/Layout.tsx
import React, { ReactNode } from 'react';
import styled from 'styled-components';
import Navbar from './Navbar';
import { useTheme } from '../../context/ThemeContext';
import WebsiteTicker from '../common/WebsiteTicker';

const AppWrapper = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: ${({ theme }) => theme.colors.background};
`;

const MainContent = styled.main`
  flex-grow: 1;
  padding: ${({ theme }) => theme.spacing.medium};
`;

interface LayoutProps {
  children: ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const theme = useTheme();
  return (
    <AppWrapper theme={theme}>
      <Navbar />
      <WebsiteTicker /> {/* <--- ADD THE TICKER HERE */}
      <MainContent theme={theme}>
        {children}
      </MainContent>
    </AppWrapper>
  );
};