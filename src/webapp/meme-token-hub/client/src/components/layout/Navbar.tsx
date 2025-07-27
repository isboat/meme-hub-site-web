// client/src/components/layout/Navbar.tsx
import React from 'react';
import styled from 'styled-components';
import { Link, useNavigate } from 'react-router-dom';
import { usePrivy } from '@privy-io/react-auth';
import { useTheme } from '../../context/ThemeContext';
import Button from '../common/Button';

const Nav = styled.nav`
  background-color: ${({ theme }) => theme.colors.navBarBackground};
  padding: ${({ theme }) => theme.spacing.medium};
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: ${({ theme }) => theme.boxShadow};
`;

const Logo = styled(Link)`
  color: ${({ theme }) => theme.colors.white};
  font-size: 24px;
  font-weight: bold;
  text-decoration: none;
`;

const NavLinks = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.large};
  align-items: center;
`;

const NavLink = styled(Link)`
  color: ${({ theme }) => theme.colors.text};
  text-decoration: none;
  font-weight: 500;
  &:hover {
    color: ${({ theme }) => theme.colors.primary};
    text-decoration: none;
  }
`;

const Navbar: React.FC = () => {
  const { authenticated, logout, user } = usePrivy();
  const navigate = useNavigate();
  const theme = useTheme();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <Nav theme={theme}>
      <Logo to="/" theme={theme}>
        MEMETOKENHUB
      </Logo>
      <NavLinks theme={theme}>
        <NavLink to={`/faq`} theme={theme}>
          FAQs
        </NavLink>
        <NavLink to={`/about-us`} theme={theme}>
          About US
        </NavLink>
        {authenticated ? (
          <>
            <NavLink to={`/profile/${user?.id}`} theme={theme}>
              My Profile
            </NavLink>
            <NavLink to="/settings" theme={theme}>
              Settings
            </NavLink>
            <Button onClick={handleLogout}>Logout</Button>
          </>
        ) : (
          <>
            <NavLink to="/" theme={theme}>
              Home
            </NavLink>
            <NavLink to="/auth" theme={theme}>
              Login / Sign Up
            </NavLink>
          </>
        )}
      </NavLinks>
    </Nav>
  );
};

export default Navbar;