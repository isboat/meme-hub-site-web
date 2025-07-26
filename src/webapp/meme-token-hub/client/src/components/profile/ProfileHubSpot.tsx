// client/src/components/profile/ProfileOverview.tsx
import React, { useState } from 'react';
import styled from 'styled-components';
import { ProfileProps, UserProfile } from '../../types';
import { useTheme } from '../../context/ThemeContext';
import Button from '../common/Button';
import api from '../../api/api';

const OverviewCard = styled.div`
  text-align: left;
  background-color: ${({ theme }) => theme.colors.cardBackground};
  padding: ${({ theme }) => theme.spacing.medium};
  border-radius: ${({ theme }) => theme.borderRadius};
  box-shadow: ${({ theme }) => theme.boxShadow};
  margin-bottom: ${({ theme }) => theme.spacing.extraLarge};
`;

// Corrected MessageProps interface
interface MessageProps {
  type: 'success' | 'error' | '';
}

const Message = styled.p<MessageProps>`
  text-align: center;
  margin-top: ${({ theme }) => theme.spacing.medium};
  font-weight: bold;
  color: ${({ type, theme }) =>
    type === 'error' ? theme.colors.error : theme.colors.success};
`;

const ProfileHubSpot: React.FC<ProfileProps> = ({ user, isCurrentUser }) => {

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [verified, setIsVerified] = useState(user.verified);
  const [statusMessage, setStatusMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error' | ''>('');
  
  const becomeVerified = async () => {

    if(!isCurrentUser) return;

    setIsSubmitting(true);
    setStatusMessage('');
    setMessageType('');

    try {
      //const response = await api.put<UserProfile>('/profile/enable-verified');
      await api.put<UserProfile>('/profile/enable-verified');

      setStatusMessage('Profile updated successfully!');
      setMessageType('success');
      setIsVerified(true);
    } catch (err: unknown) {
      console.error('Profile update error:', err);
      let errorMessage = 'Failed to verified profile.';
      setStatusMessage(`Error: ${errorMessage}`);
      setMessageType('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const theme = useTheme();
  return (
    <>
      <OverviewCard theme={theme} style={{display: verified? 'none': 'block'}}>
        <h3 style={{ color: theme.colors.error }}>🔒 Verified KOL Feature</h3>
        <p>Only Verified MemeTokenHub KOLs ($8/month) can activate the project promotion feature.</p><br />
        <Button onClick={becomeVerified} style={{ backgroundColor: theme.colors.success }} disabled={verified || isSubmitting}>
          Become Verified
          </Button>

          {statusMessage && (
          <Message theme={theme} type={messageType}>
            {statusMessage}
          </Message>
        )}
      </OverviewCard>
      <OverviewCard theme={theme}>
        <p>🎯 No Featured Project yet.</p>
      </OverviewCard>
    </>
  );
};

export default ProfileHubSpot;