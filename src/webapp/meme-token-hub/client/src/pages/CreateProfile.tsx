import React, { useState, useEffect, useCallback, FormEvent } from 'react';
import styled from 'styled-components';
import { useTheme } from '../context/ThemeContext';
import Input from '../components/common/Input'; // Re-using your common Input
import Button from '../components/common/Button'; // Assuming you have a common Button component
import { usePrivy } from '@privy-io/react-auth'; // For Privy integration
import { useNavigate } from 'react-router-dom'; // For navigation
import api from '../api/api'; // Your configured Axios instance

// Styled Components (reusing your existing styles where appropriate)
const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center; /* Center vertically */
  min-height: calc(100vh - 120px); /* Adjust based on navbar/ticker height */
  padding: ${({ theme }) => theme.spacing.large};
  background-color: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.text};
`;

const ContentCard = styled.div`
  background-color: ${({ theme }) => theme.colors.cardBackground};
  padding: ${({ theme }) => theme.spacing.large};
  border-radius: ${({ theme }) => theme.borderRadius};
  box-shadow: ${({ theme }) => theme.boxShadow};
  width: 100%;
  max-width: 500px; /* Max width for the form container */
  text-align: center;
`;

const Header = styled.h2`
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: ${({ theme }) => theme.spacing.medium};
`;

const SubText = styled.p`
  font-size: 0.9em;
  color: ${({ theme }) => theme.colors.placeholder};
  margin-top: -${({ theme }) => theme.spacing.extraSmall}; /* Adjust spacing */
  margin-bottom: ${({ theme }) => theme.spacing.large};
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.medium};
  margin-top: ${({ theme }) => theme.spacing.large};

  label {
    align-self: flex-start; /* Align labels to the left */
    margin-bottom: ${({ theme }) => theme.spacing.extraSmall};
    font-weight: bold;
    color: ${({ theme }) => theme.colors.text};
  }

  select {
    width: 100%;
    padding: ${({ theme }) => theme.spacing.small};
    border-radius: ${({ theme }) => theme.borderRadius};
    border: 1px solid ${({ theme }) => theme.colors.placeholder};
    background-color: ${({ theme }) => theme.colors.background}; /* Use background color from theme */
    color: ${({ theme }) => theme.colors.text};
    appearance: none; /* Remove default arrow */
    background-image: url("data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22%23${({ theme }) => theme.colors.text.substring(1)}%22%3E%3Cpath%20d%3D%22M7%2010l5%205%205-5z%22%2F%3E%3C%2Fsvg%3E"); /* Custom arrow */
    background-repeat: no-repeat;
    background-position: right 8px top 50%;
    background-size: 16px;

    &:focus {
      outline: none;
      border-color: ${({ theme }) => theme.colors.primary};
      box-shadow: 0 0 0 2px ${({ theme }) => theme.colors.primary}40; /* Light primary shadow */
    }
  }

  /* Specific styles for Input component for consistency */
  input {
    width: 100%;
    padding: ${({ theme }) => theme.spacing.small};
    border-radius: ${({ theme }) => theme.borderRadius};
    border: 1px solid ${({ theme }) => theme.colors.placeholder};
    background-color: ${({ theme }) => theme.colors.background};
    color: ${({ theme }) => theme.colors.text};

    &:focus {
      outline: none;
      border-color: ${({ theme }) => theme.colors.primary};
      box-shadow: 0 0 0 2px ${({ theme }) => theme.colors.primary}40;
    }
  }
`;


const FieldGroup = styled.div<{ $isHidden: boolean }>`
  display: ${({ $isHidden }) => ($isHidden ? 'none' : 'flex')};
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.medium}; /* Gap between fields within a group */
  width: 100%;
  margin-top: ${({ theme }) => theme.spacing.medium}; /* Space above group */
`;

const LoverMessage = styled.p<{ $isHidden: boolean }>`
  display: ${({ $isHidden }) => ($isHidden ? 'none' : 'block')};
  text-align: center;
  font-size: 0.95em;
  color: ${({ theme }) => theme.colors.placeholder};
  margin-top: ${({ theme }) => theme.spacing.large};
  margin-bottom: ${({ theme }) => theme.spacing.large};
`;

const FooterText = styled.div`
  text-align: center;
  font-size: 0.75em;
  color: ${({ theme }) => theme.colors.text}; /* Use text color */
  margin-top: ${({ theme }) => theme.spacing.large};
`;


// Component
const CreateProfile: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { login, authenticated, user: privyUser } = usePrivy(); // Get Privy state and login function

  const [profileType, setProfileType] = useState<string>('');
  const [socialHandle, setSocialHandle] = useState<string>('');
  const [xFollowers, setXFollowers] = useState<string>('');
  const [tgMembers, setTgMembers] = useState<string>('');
  const [devReason, setDevReason] = useState<string>('');
  const [showProfileForm, setShowProfileForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState(''); // For displaying success/error messages

  // Effect to show the form if already authenticated via Privy
  useEffect(() => {
    if (authenticated) {
      setShowProfileForm(true);
      setMessage('Please complete your profile.');
    }
  }, [authenticated]);

  const handleProfileTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setProfileType(e.target.value);
    // Reset fields when profile type changes
    setSocialHandle('');
    setXFollowers('');
    setTgMembers('');
    setDevReason('');
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');

    if (!privyUser || !privyUser.id) {
      setMessage('Authentication required. Please log in first.');
      setIsLoading(false);
      return;
    }

    const userId = localStorage.getItem('memeTokenHubUserId'); // Get your internal user ID
    if (!userId) {
        setMessage('User ID not found. Please re-authenticate.');
        setIsLoading(false);
        return;
    }

    try {
      const payload: any = {
        id: '',
        userId: userId,
        profileType: 0,
        metadata: {}
      };

      if (profileType === 'Kol') {
        payload.profileType = 1
        payload.metadata['socialHandle'] = socialHandle
        payload.metadata['xFollowers'] = xFollowers
        payload.metadata['tgMembers'] = tgMembers

      } else if (profileType === 'dev') {
        payload.profileType = 2
        payload.metadata['devReason'] = devReason
      }
      // No extra fields needed for 'lover'

      const response = await api.post('/profile/create', payload); // Adjust endpoint if different

      if (response.status === 200) {
        setMessage('🎉 Profile submitted successfully! Redirecting...');
        // Optionally store profile data in local storage or context if needed
        // localStorage.setItem('userProfile', JSON.stringify(response.data.profile));
        setTimeout(() => navigate('/dashboard'), 1500); // Redirect to dashboard
      } else {
        setMessage(`Error: ${response.data.message || 'Something went wrong.'}`);
      }
    } catch (error: any) {
      console.error("Profile submission error:", error);
      setMessage(`Error: ${error.response?.data?.message || error.message || 'An unexpected error occurred.'}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PageContainer theme={theme}>
      <ContentCard theme={theme}>
        <Header theme={theme}>MemeTokenHub</Header>
        <SubText theme={theme}>The community has spoken!</SubText>

        {!showProfileForm ? (
          <>
            <Button
              onClick={() => login()} // Use Privy's login function
              style={{ marginBottom: theme.spacing.medium }}
            >
              Sign up with Social / Wallet
            </Button>
            <Button
              onClick={() => navigate('/auth')} // Assuming '/auth' is your main login page
              variant="secondary" // Use a secondary variant if you have one
            >
              Already a member? Log In
            </Button>
          </>
        ) : (
          <Form onSubmit={handleSubmit} theme={theme}>
            <label htmlFor="profile">Which best describes your profile?</label>
            <select
              id="profile"
              name="profile"
              value={profileType}
              onChange={handleProfileTypeChange}
              required
            >
              <option value="">-- Select --</option>
              <option value="lover">💖 Meme Token Lover</option>
              <option value="Kol">🎤 Kol / Influencer</option>
              <option value="dev">🛠️ Meme Token Dev</option>
            </select>

            <FieldGroup $isHidden={profileType !== 'Kol'} theme={theme}>
              <label htmlFor="socials">Main Social Handle (X, Telegram, etc)</label>
              <Input
                type="text"
                id="socials"
                name="socials"
                value={socialHandle}
                onChange={(e) => setSocialHandle(e.target.value)}
                required={profileType === 'Kol'} // Make required only if Kol
              />

              <label htmlFor="xFollowers">How many X (Twitter) followers do you have?</label>
              <select
                id="xFollowers"
                name="xFollowers"
                value={xFollowers}
                onChange={(e) => setXFollowers(e.target.value)}
                required={profileType === 'Kol'}
              >
                <option value="">-- Select --</option>
                <option>None</option>
                <option>1-500</option>
                <option>501-1500</option>
                <option>1501-5000</option>
                <option>5001-20000</option>
                <option>20001-100000</option>
                <option>100001-500000</option>
                <option>500001-2000000</option>
                <option>2M+</option>
              </select>

              <label htmlFor="tgMembers">How many Telegram group members do you have?</label>
              <select
                id="tgMembers"
                name="tgMembers"
                value={tgMembers}
                onChange={(e) => setTgMembers(e.target.value)}
                required={profileType === 'Kol'}
              >
                <option value="">-- Select --</option>
                <option>None</option>
                <option>1-500</option>
                <option>501-1500</option>
                <option>1501-5000</option>
                <option>5001-20000</option>
                <option>20001-100000</option>
                <option>100001-500000</option>
                <option>500001-2000000</option>
                <option>2M+</option>
              </select>
            </FieldGroup>

            <FieldGroup $isHidden={profileType !== 'dev'} theme={theme}>
              <label htmlFor="devReason">Why do you want to join MemeTokenHub?</label>
              <select
                id="devReason"
                name="devReason"
                value={devReason}
                onChange={(e) => setDevReason(e.target.value)}
                required={profileType === 'dev'}
              >
                <option value="">-- Select Reason --</option>
                <option>Provide my tokens with a community space upon launch</option>
                <option>Allow my community a space to show love upon launch</option>
                <option>Give my meme token a social standing even before I launch the token</option>
              </select>
            </FieldGroup>

            <LoverMessage $isHidden={profileType !== 'lover'} theme={theme}>
              💫 The MemeTokenHub community awaits your arrival!
            </LoverMessage>

            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Submitting...' : 'Sign Up'}
            </Button>
            {message && (
              <p style={{ color: message.startsWith('Error') ? theme.colors.error : theme.colors.primary, marginTop: theme.spacing.medium }}>
                {message}
              </p>
            )}
          </Form>
        )}
      </ContentCard>

      <FooterText theme={theme}>
        Powered by Privy.IO
      </FooterText>
    </PageContainer>
  );
};

export default CreateProfile;