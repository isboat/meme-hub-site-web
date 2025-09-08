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
  align-items: center;
  box-shadow: ${({ theme }) => theme.boxShadow};
  min-width: 15%;
`;

const Logo = styled(Link)`
  color: ${({ theme }) => theme.colors.white};
  font-size: 24px;
  font-weight: bold;
  text-decoration: none;
`;

const NavLinks = styled.div`
`;

const NavLink = styled(Link)`
  color: ${({ theme }) => theme.colors.text};
  text-decoration: none;
  display: block;
  font-weight: 500;
  margin: ${({ theme }) => theme.spacing.medium} 0;
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
      <div>
      <Logo to="/" theme={theme}>
        <img src="/logo.jpg" alt="Logo" style={{ maxHeight: '40px' }} />
      </Logo>
      </div>
      <NavLinks theme={theme}>
        <div>
          <h2>Menu</h2>
        </div>
        <NavLink to="/" theme={theme}>
          🏠 Home
        </NavLink>
        <NavLink to={`/faq`} theme={theme}>
          ❓ FAQs
        </NavLink>
        <NavLink to={`/about-us`} theme={theme}>
          ℹ️ About us
        </NavLink>
        {authenticated ? (
          <>
            <NavLink to={`/profile/${user?.id}`} theme={theme}>
              👤 My Profile
            </NavLink>
            <NavLink to={`/user-pending-socials-claims`} theme={theme}>
              👤 Submitted Token Claims
            </NavLink>
            {/* <NavLink to="/settings" theme={theme}>
              ⚙️ Settings
            </NavLink> */}
            <Button onClick={handleLogout}>Logout</Button>
          </>
        ) : (
          <>
            <NavLink to="/auth" theme={theme}>
              🔐 Login / Sign Up
            </NavLink>
          </>
        )}
      </NavLinks>
    </Nav>
  );
};

export default Navbar;