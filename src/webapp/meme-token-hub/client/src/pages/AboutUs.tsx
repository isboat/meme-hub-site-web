// client/src/pages/AboutUs.tsx
import React from 'react';
import styled from 'styled-components';
import { useTheme } from '../context/ThemeContext';

const PageContainer = styled.div`
  max-width: 900px;
  margin: ${({ theme }) => theme.spacing.large} auto;
  padding: ${({ theme }) => theme.spacing.medium};
  background-color: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.text};
  border-radius: ${({ theme }) => theme.borderRadius};
  box-shadow: ${({ theme }) => theme.boxShadow};
  min-height: calc(100vh - 120px); /* Adjust for header/footer */
`;

const Header = styled.h1`
  text-align: center;
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: ${({ theme }) => theme.spacing.large};
`;

const Section = styled.section`
  margin-bottom: ${({ theme }) => theme.spacing.extraLarge};
  line-height: 1.6;
`;

const SectionTitle = styled.h2`
  color: ${({ theme }) => theme.colors.text};
  font-size: 1.8em;
  margin-bottom: ${({ theme }) => theme.spacing.medium};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  padding-bottom: ${({ theme }) => theme.spacing.small};
`;

const Emphasis = styled.span`
  color: ${({ theme }) => theme.colors.primary};
  font-weight: bold;
`;

const ListItem = styled.li`
  margin-bottom: ${({ theme }) => theme.spacing.small};
  color: ${({ theme }) => theme.colors.text};
`;

const AboutUs: React.FC = () => {
  const theme = useTheme();

  return (
    <PageContainer theme={theme}>
      <Header theme={theme}>About MemeTokenHub</Header>

      <Section theme={theme}>
        <SectionTitle theme={theme}>Our Mission</SectionTitle>
        <p>
          Welcome to <Emphasis theme={theme}>MemeTokenHub</Emphasis> – the premier social platform dedicated exclusively to the vibrant and rapidly evolving world of meme tokens. Our mission is to provide a dedicated, secure, and engaging space for meme token enthusiasts, developers, and influencers to connect, share, and discover the next big thing in the decentralized finance (DeFi) meme ecosystem.
        </p>
        <p>
          We believe in the power of community and the unique culture that meme tokens foster. MemeTokenHub is built on the principle of bringing transparency, excitement, and legitimate social interaction to an often chaotic space.
        </p>
      </Section>

      <Section theme={theme}>
        <SectionTitle theme={theme}>How It Works</SectionTitle>
        <p>MemeTokenHub offers a streamlined experience tailored to your role in the meme token universe:</p>
        <ul>
          <ListItem theme={theme}>
            <Emphasis theme={theme}>For Meme Token Lovers 💖:</Emphasis> Discover trending tokens, engage with project communities, follow your favorite influencers, and vote on what's hot. Your passion drives the community!
          </ListItem>
          <ListItem theme={theme}>
            <Emphasis theme={theme}>For KOLs / Influencers 🎤:</Emphasis> Showcase your influence by connecting your social channels, share insights, and grow your following within a targeted audience. Monetize your content and gain access to early project insights.
          </ListItem>
          <ListItem theme={theme}>
            <Emphasis theme={theme}>For Meme Token Developers 🛠️:</Emphasis> Launch your projects with built-in community support, gain visibility for your token, and directly connect with a passionate user base. Access tools and resources to help your project thrive.
          </ListItem>
        </ul>
        <p>
          Our platform facilitates genuine connections and provides curated information, helping you navigate the exciting world of meme tokens with confidence.
        </p>
      </Section>

      <Section theme={theme}>
        <SectionTitle theme={theme}>Our Technology & Security</SectionTitle>
        <p>
          MemeTokenHub is built with modern, secure, and scalable technologies. We leverage cutting-edge web development frameworks for a smooth user experience and utilize robust backend systems to handle high traffic and data integrity.
        </p>
        <p>
          For user authentication, we've integrated with <Emphasis theme={theme}>Privy.IO</Emphasis>, a leading embedded wallet infrastructure provider. Privy allows you to log in seamlessly using your social accounts (Google, Discord, X, etc.) or directly with your crypto wallet (e.g., MetaMask, WalletConnect). This ensures a secure, user-friendly onboarding process without compromising on decentralized principles. Your privacy and security are paramount to us.
        </p>
      </Section>

      <Section theme={theme}>
        <SectionTitle theme={theme}>Join the Hub!</SectionTitle>
        <p>
          Whether you're here to discover, build, or influence, MemeTokenHub is your ultimate destination. Join our growing community today and be part of the future of meme tokens!
        </p>
      </Section>
    </PageContainer>
  );
};

export default AboutUs;