// client/src/pages/UpdateProfile.tsx
import React, { useState, useEffect } from 'react'; // Import useRef
import styled from 'styled-components';
import { useTheme } from '../context/ThemeContext';
import { usePrivy } from '@privy-io/react-auth';
import { useNavigate } from 'react-router-dom';
import { User, UserProfile } from '../types';
import { useApi } from '../hooks/useApi';
import api from '../api/api';
import Button from '../components/common/Button';
import Input from '../components/common/Input'; // Keep Input for username
import LoadingSpinner from '../components/common/LoadingSpinner';
import axios from 'axios';

const PageContainer = styled.div`
  max-width: 700px;
  margin: ${({ theme }) => theme.spacing.large} auto;
  padding: ${({ theme }) => theme.spacing.medium};
  background-color: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.text};
  border-radius: ${({ theme }) => theme.borderRadius};
  box-shadow: ${({ theme }) => theme.boxShadow};
  min-height: calc(100vh - 120px); /* Adjust for header/footer */
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Header = styled.h1`
  text-align: center;
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: ${({ theme }) => theme.spacing.large};
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.medium};
  width: 100%;
  padding: ${({ theme }) => theme.spacing.medium};
  border-radius: ${({ theme }) => theme.borderRadius};
  background-color: ${({ theme }) => theme.colors.cardBackground};
  box-shadow: ${({ theme }) => theme.boxShadow};
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  label {
    margin-bottom: ${({ theme }) => theme.spacing.small};
    font-weight: bold;
    color: ${({ theme }) => theme.colors.text};
  }
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
    type === 'error' ? theme.colors.error : theme.colors.primary};
`;

const UpdateProfileSocials: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { user: privyUser, authenticated } = usePrivy();

  const [x, setX] = useState('');
  const [telegram, setTelegram] = useState('');
  const [youtube, setYoutube] = useState('');
  const [instagram, setInstagram] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error' | ''>('');

  const { data: currentUserProfile, loading, error, refetch } = useApi<UserProfile>(
    `/profile/${privyUser?.id}`,
    'get',
    null,
    null,
    !authenticated || !privyUser?.id
  );

  // Effect to populate form fields and initial image preview
  useEffect(() => {
    if (currentUserProfile) {
      setX(currentUserProfile?.metadata["x"] || '');
      setTelegram(currentUserProfile?.metadata["telegram"] || '');
      setInstagram(currentUserProfile?.metadata["instagram"] || '');
      setYoutube(currentUserProfile?.metadata["youtube"] || '');
      setStatusMessage(''); // Clear any previous status message
    }
  }, [currentUserProfile]);

  // Handle errors during initial fetch
  useEffect(() => {
    if (error) {
      if (axios.isAxiosError(error)) {
        if (error.response && error.response.status === 404) {
          setStatusMessage("It looks like you don't have a profile yet. Please create one first.");
          setMessageType('error');
        } else {
          setStatusMessage(`Failed to load profile: ${error.response?.data?.message || error.message || 'An unknown network error occurred.'}`);
          setMessageType('error');
        }
      } else if (typeof error === 'object' && error !== null) {
        setStatusMessage(`Failed to load profile: ${error}`);
        setMessageType('error');
      } else {
        setStatusMessage(`Failed to load profile: ${String(error)}`);
        setMessageType('error');
      }
    }
  }, [error, navigate]);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authenticated || !privyUser) {
      setStatusMessage('You must be logged in to update your socials.');
      setMessageType('error');
      return;
    }

    setIsSubmitting(true);
    setStatusMessage('');
    setMessageType('');

    try {
      const formData = new FormData();
      formData.append('x', x);
      formData.append('telegram', telegram);
      formData.append('youtube', youtube);
      formData.append('instagram', instagram);

      // We assume a new backend endpoint for multipart/form-data, e.g., PUT /users/update-socials
      const response = await api.put<User>('/profile/update-socials', formData, {
        headers: {
          'Content-Type': 'multipart/form-data', // Crucial for FormData
        },
      });

      setStatusMessage('Profile updated successfully!' + response.status);
      setMessageType('success');
      refetch(); // Refetch the latest profile data
      setTimeout(() => navigate(`/profile/${privyUser.id}`), 1500);
    } catch (err: unknown) {
      console.error('Profile update error:', err);
      let errorMessage = 'Failed to update profile.';
      setStatusMessage(`Error: ${errorMessage}`);
      setMessageType('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!authenticated || !privyUser) {
    return (
      <PageContainer theme={theme}>
        <Header theme={theme}>Update Socials</Header>
        <Message theme={theme} type="error">
          You must be logged in to access this page.
        </Message>
        <Button onClick={() => navigate('/auth')} style={{ marginTop: theme.spacing.medium }}>
          Log In
        </Button>
      </PageContainer>
    );
  }

  if (loading) {
    return (
      <PageContainer theme={theme}>
        <Header theme={theme}>Update Socials</Header>
        <LoadingSpinner />
        <p style={{ textAlign: 'center', color: theme.colors.placeholder }}>Loading your profile data...</p>
      </PageContainer>
    );
  }

  if (!currentUserProfile && messageType === 'error' && statusMessage.includes("don't have a profile yet")) {
    return (
      <PageContainer theme={theme}>
        <Header theme={theme}>Update Socials</Header>
        <Message theme={theme} type="error">{statusMessage}</Message>
        <Button onClick={() => navigate('/create-profile')} style={{ marginTop: theme.spacing.medium }}>
          Create Your Profile Now
        </Button>
      </PageContainer>
    );
  }

  return (
    <PageContainer theme={theme}>
      <Header theme={theme}>Update Your Socials</Header>

      <Form onSubmit={handleSubmit} theme={theme}>

        <FormGroup theme={theme}>
          <label htmlFor="x">X</label>
          <Input
            type="text"
            id="x"
            value={x}
            onChange={(e) => setX(e.target.value)}
            placeholder="Your X handle"
            required
            disabled={isSubmitting}
          />
        </FormGroup>      

        <FormGroup theme={theme}>
          <label htmlFor="telegram">Telegram</label>
          <Input
            type="text"
            id="telegram"
            value={telegram}
            onChange={(e) => setTelegram(e.target.value)}
            placeholder="Your Telegram handle"
            required
            disabled={isSubmitting}
          />
        </FormGroup>
        <FormGroup theme={theme}>
          <label htmlFor="youtube">YouTube</label>
          <Input
            type="text"
            id="youtube"
            value={youtube}
            onChange={(e) => setYoutube(e.target.value)}
            placeholder="Your YouTube channel link"
            required
            disabled={isSubmitting}
          />
        </FormGroup>
        <FormGroup theme={theme}>
          <label htmlFor="instagram">Instagram</label>
          <Input
            type="text"
            id="instagram"
            value={instagram}
            onChange={(e) => setInstagram(e.target.value)}
            placeholder="Your Instagram handle"
            required
            disabled={isSubmitting}
          />
        </FormGroup>

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? <LoadingSpinner size="small" /> : 'Update Socials'}
        </Button>

        {statusMessage && (
          <Message theme={theme} type={messageType}>
            {statusMessage}
          </Message>
        )}
      </Form>
    </PageContainer>
  );
};

export default UpdateProfileSocials;