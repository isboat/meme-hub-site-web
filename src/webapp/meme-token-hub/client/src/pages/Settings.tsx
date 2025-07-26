import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useTheme } from '../context/ThemeContext';
import { usePrivy } from '@privy-io/react-auth';
import type { User } from '../types';
import { useApi } from '../hooks/useApi';
import api from '../api/api';
import LoadingSpinner from '../components/common/LoadingSpinner';
import Input from '../components/common/Input';
import Button from '../components/common/Button';

const SettingsContainer = styled.div`
  max-width: 600px;
  margin: ${({ theme }) => theme.spacing.large} auto;
  padding: ${({ theme }) => theme.spacing.medium};
  background-color: ${({ theme }) => theme.colors.cardBackground};
  border-radius: ${({ theme }) => theme.borderRadius};
  box-shadow: ${({ theme }) => theme.boxShadow};
  color: ${({ theme }) => theme.colors.text};
`;

const Title = styled.h2`
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: ${({ theme }) => theme.spacing.large};
  text-align: center;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.medium};
`;

const FormSection = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.large};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius};
  padding: ${({ theme }) => theme.spacing.medium};
`;

const SectionTitle = styled.h3`
  color: ${({ theme }) => theme.colors.secondary};
  margin-bottom: ${({ theme }) => theme.spacing.medium};
`;

const Label = styled.label`
  font-weight: bold;
  margin-bottom: ${({ theme }) => theme.spacing.small};
  display: block;
`;

const ErrorMessage = styled.p`
  color: ${({ theme }) => theme.colors.error};
  margin-top: ${({ theme }) => theme.spacing.small};
`;

const SuccessMessage = styled.p`
  color: ${({ theme }) => theme.colors.success};
  margin-top: ${({ theme }) => theme.spacing.small};
`;

const Settings: React.FC = () => {
  const theme = useTheme();
  const { user: privyUser, logout } = usePrivy();
  const { data: currentUser, loading, error, refetch } = useApi<User>(`/users/${privyUser?.id}`, 'get', null, null, !privyUser?.id);

  const [username, setUsername] = useState('');
  const [bio, setBio] = useState('');
  const [profileImage, setProfileImage] = useState('');
  const [facebookLink, setFacebookLink] = useState('');
  const [twitterLink, setTwitterLink] = useState('');

  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (currentUser) {
      setUsername(currentUser.username || '');
      setBio(currentUser.username || '');
      setProfileImage(currentUser.profileImage || '');
      setFacebookLink(currentUser.socialLinks?.facebook || '');
      setTwitterLink(currentUser.socialLinks?.twitter || '');
    }
  }, [currentUser]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveError(null);
    setSaveSuccess(null);

    const updatedData = {
      username,
      bio,
      profileImage,
      socialLinks: {
        facebook: facebookLink,
        twitter: twitterLink,
      },
    };

    try {
      await api.put(`/users/${privyUser?.id}`, updatedData);
      setSaveSuccess('Settings updated successfully!');
      refetch(); // Refetch user data to ensure UI is updated
    } catch (err: any) {
      setSaveError(err.response?.data?.message || 'Failed to update settings.');
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) return <SettingsContainer theme={theme}><LoadingSpinner /></SettingsContainer>;
  if (error) return <SettingsContainer theme={theme}><p>Error loading settings: {error}</p></SettingsContainer>;
  if (!currentUser) return <SettingsContainer theme={theme}><p>Please log in to view settings.</p></SettingsContainer>;

  return (
    <SettingsContainer theme={theme}>
      <Title theme={theme}>User Settings</Title>
      <Form onSubmit={handleSubmit}>
        <FormSection theme={theme}>
          <SectionTitle theme={theme}>Profile Details</SectionTitle>
          <Label htmlFor="username">Username:</Label>
          <Input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Your desired username"
          />

          <Label htmlFor="bio" style={{ marginTop: theme.spacing.medium }}>Bio:</Label>
          <Input
            id="bio"
            type="textarea"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Tell us about yourself..."
            rows={4}
          />

          <Label htmlFor="profileImage" style={{ marginTop: theme.spacing.medium }}>Profile Image URL:</Label>
          <Input
            id="profileImage"
            type="text"
            value={profileImage}
            onChange={(e) => setProfileImage(e.target.value)}
            placeholder="URL to your profile image"
          />
        </FormSection>

        <FormSection theme={theme}>
          <SectionTitle theme={theme}>Social Media Links</SectionTitle>
          <Label htmlFor="facebook">Facebook Profile URL:</Label>
          <Input
            id="facebook"
            type="text"
            value={facebookLink}
            onChange={(e) => setFacebookLink(e.target.value)}
            placeholder="e.g., https://facebook.com/yourprofile"
          />

          <Label htmlFor="twitter" style={{ marginTop: theme.spacing.medium }}>Twitter Profile URL:</Label>
          <Input
            id="twitter"
            type="text"
            value={twitterLink}
            onChange={(e) => setTwitterLink(e.target.value)}
            placeholder="e.g., https://twitter.com/yourhandle"
          />
        </FormSection>

        {saveError && <ErrorMessage theme={theme}>{saveError}</ErrorMessage>}
        {saveSuccess && <SuccessMessage theme={theme}>{saveSuccess}</SuccessMessage>}

        <Button type="submit" disabled={isSaving}>
          {isSaving ? 'Saving...' : 'Save Settings'}
        </Button>
      </Form>
      <div style={{ marginTop: theme.spacing.large, textAlign: 'center' }}>
        <Button onClick={logout} style={{ backgroundColor: theme.colors.error }}>
          Log Out
        </Button>
      </div>
    </SettingsContainer>
  );
};

export default Settings;