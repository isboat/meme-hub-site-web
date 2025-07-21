// client/src/pages/FAQ.tsx
import React, { useState } from 'react';
import styled from 'styled-components';
import { useTheme } from '../context/ThemeContext';

const PageContainer = styled.div`
  max-width: 800px;
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

const FAQItem = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.medium};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius};
  overflow: hidden; /* Ensures inner border-radius */
`;

const QuestionButton = styled.button`
  background-color: ${({ theme }) => theme.colors.cardBackground};
  color: ${({ theme }) => theme.colors.text};
  font-size: 1.1em;
  font-weight: bold;
  width: 100%;
  padding: ${({ theme }) => theme.spacing.medium};
  border: none;
  text-align: left;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: background-color 0.2s ease-in-out;

  &:hover {
    background-color: ${({ theme }) => theme.colors.border};
  }

  &::after {
    content: '+';
    font-size: 1.5em;
    margin-left: ${({ theme }) => theme.spacing.small};
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const AnswerContent = styled.div`
  padding: ${({ theme }) => theme.spacing.medium};
  background-color: ${({ theme }) => theme.colors.background};
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  color: ${({ theme }) => theme.colors.text};
  line-height: 1.6;
`;

interface FAQData {
  question: string;
  answer: string;
}

const faqs: FAQData[] = [
  {
    question: 'What is MemeTokenHub?',
    answer: 'MemeTokenHub is a social platform dedicated to meme tokens, connecting enthusiasts, developers, and influencers in a dedicated community space.',
  },
  {
    question: 'How do I create an account?',
    answer: 'You can create an account using our integrated Privy.IO authentication system, allowing you to sign up seamlessly with your social accounts (Google, X, Discord) or directly with your crypto wallet.',
  },
  {
    question: 'Is MemeTokenHub free to use?',
    answer: 'Yes, MemeTokenHub is currently free to use for all basic functionalities, allowing you to connect and explore the meme token ecosystem.',
  },
  {
    question: 'Can I launch my meme token project on MemeTokenHub?',
    answer: 'Yes! We encourage meme token developers to join. Our platform provides tools and community exposure to help launch and grow your project.',
  },
  {
    question: 'What benefits are there for KOLs/Influencers?',
    answer: 'KOLs and influencers can grow their audience, connect with relevant projects, and potentially monetize their influence within the meme token niche. We aim to provide early access to promising projects.',
  },
  {
    question: 'How do I ensure my profile is complete?',
    answer: 'After logging in, if you are a new user, you will be prompted to create your profile, selecting your role (Lover, KOL, or Dev) and providing relevant details.',
  },
  {
    question: 'Is my data secure with Privy.IO?',
    answer: 'Yes, Privy.IO is a robust and secure authentication solution for web3 applications. They handle cryptographic operations and user data with industry-standard security practices.',
  },
];

const FAQ: React.FC = () => {
  const theme = useTheme();
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <PageContainer theme={theme}>
      <Header theme={theme}>Frequently Asked Questions</Header>

      {faqs.map((faq, index) => (
        <FAQItem key={index} theme={theme}>
          <QuestionButton
            theme={theme}
            onClick={() => toggleFAQ(index)}
            aria-expanded={activeIndex === index}
          >
            {faq.question}
          </QuestionButton>
          {activeIndex === index && (
            <AnswerContent theme={theme}>
              <p>{faq.answer}</p>
            </AnswerContent>
          )}
        </FAQItem>
      ))}
    </PageContainer>
  );
};

export default FAQ;