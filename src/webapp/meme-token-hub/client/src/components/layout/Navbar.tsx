// ...existing code...
import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { Link, useNavigate } from 'react-router-dom';
import { usePrivy } from '@privy-io/react-auth';
import { useTheme } from '../../context/ThemeContext';
import Button from '../common/Button';
// ...existing code...

const Nav = styled.nav`
  background-color: ${({ theme }) => theme.colors.navBarBackground};
  padding: ${({ theme }) => theme.spacing.medium};
  align-items: center;
  box-shadow: ${({ theme }) => theme.boxShadow};
  min-width: 15%;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.small};

  @media (max-width: 768px) {
    flex-direction: row;
    justify-content: space-between;
    align-items: flex-start;
    padding: ${({ theme }) => theme.spacing.small};
    min-width: auto;
    position: relative;
    z-index: 60;
  }
`;

const Logo = styled(Link)`
  color: ${({ theme }) => theme.colors.white};
  font-size: 24px;
  font-weight: bold;
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.small};

  img { max-height: 40px; }

  @media (max-width: 768px) {
    img { max-height: 36px; }
  }
`;

const ToggleButton = styled.button`
  display: none;
  background: transparent;
  border: none;
  color: ${({ theme }) => theme.colors.text};
  cursor: pointer;
  padding: 6px;
  margin-left: auto;

  @media (max-width: 768px) {
    display: block;
    z-index: 70;
  }
`;

/* Overlay that appears on mobile when menu is open.
   On desktop NavLinks remain inline as before. */
const NavLinks = styled.div<{ open: boolean }>`
  display: flex;
  flex-direction: column;
  width: 100%;

  @media (max-width: 768px) {
    /* full-screen overlay */
    position: fixed;
    inset: 0;
    display: ${props => (props.open ? 'flex' : 'none')};
    justify-content: flex-start;
    align-items: center;
    background: rgba(0, 0, 0, 0.45);
    padding-top: 72px; /* leave space for top nav */
    z-index: 65;
  }
`;

/* Inner panel inside overlay that contains the actual nav links */
const NavPanel = styled.div`
  width: 100%;
  max-width: 480px;
  background: ${({ theme }) => theme.colors.navBarBackground};
  border-radius: 10px;
  box-shadow: ${({ theme }) => theme.boxShadow};
  padding: ${({ theme }) => theme.spacing.small};
  margin: 0 16px;

  @media (min-width: 769px) {
    background: transparent;
    box-shadow: none;
    border-radius: 0;
    padding: 0;
    margin: 0;
    max-width: none;
    width: 100%;
  }
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

  @media (max-width: 768px) {
    margin: ${({ theme }) => theme.spacing.small} 0;
    padding: 12px 16px;
    border-radius: 6px;
  }
`;

// ...existing code...
const Navbar: React.FC = () => {
  const { authenticated, logout, user } = usePrivy();
  const navigate = useNavigate();
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement | null>(null);

  // lock body scroll when menu is open on mobile
  useEffect(() => {
    if (open) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = prev;
      };
    }
    return;
  }, [open]);

  // close on escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    if (open) document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleNavClick = (path?: string) => {
    setOpen(false);
    if (path) navigate(path);
  };

  // close overlay when clicking outside the panel
  const onOverlayClick = (e: React.MouseEvent) => {
    if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
      setOpen(false);
    }
  };

  return (
    <Nav theme={theme}>
      <Logo to="/" theme={theme} onClick={() => setOpen(false)}>
        <img src="/logo.jpg" alt="Logo" />
      </Logo>

      <ToggleButton
        aria-expanded={open}
        aria-label={open ? 'Close menu' : 'Open menu'}
        onClick={() => setOpen(s => !s)}
        theme={theme}
      >
        {open ? (
          // X icon
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M18 6L6 18M6 6l12 12" />
          </svg>
        ) : (
          // Hamburger icon
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M3 12h18M3 6h18M3 18h18" />
          </svg>
        )}
      </ToggleButton>

      <NavLinks theme={theme} open={open} onClick={onOverlayClick}>
        <NavPanel ref={panelRef} theme={theme} onClick={(e) => e.stopPropagation()}>
          <div>
            <h2 style={{ margin: 0 }}>Menu</h2>
          </div>
          <NavLink to="/" theme={theme} onClick={() => handleNavClick('/')}>
            🏠 Home
          </NavLink>
          <NavLink to={`/faq`} theme={theme} onClick={() => handleNavClick('/faq')}>
            ❓ FAQs
          </NavLink>
          <NavLink to={`/about-us`} theme={theme} onClick={() => handleNavClick('/about-us')}>
            ℹ️ About us
          </NavLink>
          {authenticated ? (
            <>
              <NavLink to={`/profile/${user?.id}`} theme={theme} onClick={() => handleNavClick(`/profile/${user?.id}`)}>
                👤 My Profile
              </NavLink>
              <NavLink to={`/user-pending-socials-claims`} theme={theme} onClick={() => handleNavClick('/user-pending-socials-claims')}>
                👤 Submitted Token Claims
              </NavLink>
              <div style={{ marginTop: theme.spacing.small }}>
                <Button onClick={handleLogout}>Logout</Button>
              </div>
            </>
          ) : (
            <>
              <NavLink to="/auth" theme={theme} onClick={() => handleNavClick('/auth')}>
                🔐 Login / Sign Up
              </NavLink>
            </>
          )}
        </NavPanel>
      </NavLinks>
    </Nav>
  );
};

export default Navbar;
// ...existing code...