// client/src/pages/UpdateProfile.tsx
import React, { useState, useEffect, useRef } from 'react'; // Import useRef
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

const TextArea = styled.textarea`
  width: 100%;
  padding: ${({ theme }) => theme.spacing.small};
  border-radius: ${({ theme }) => theme.borderRadius};
  border: 1px solid ${({ theme }) => theme.colors.border};
  background-color: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.text};
  font-size: 1em;
  line-height: 1.5;
  min-height: 100px;
  resize: vertical;

  &::placeholder {
    color: ${({ theme }) => theme.colors.placeholder};
  }

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 2px ${({ theme }) => theme.colors.primary}40;
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

const ProfileImagePreview = styled.img`
  width: 100px;
  height: 100px;
  border-radius: 50%;
  object-fit: cover;
  margin: ${({ theme }) => theme.spacing.medium} auto;
  border: 3px solid ${({ theme }) => theme.colors.primary};
`;

const FileInputContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.small};
`;

const StyledFileInput = styled.input`
  display: none; /* Hide the default file input */
`;

const CustomFileUploadButton = styled(Button)`
  margin-top: ${({ theme }) => theme.spacing.small};
  background-color: ${({ theme }) => theme.colors.secondary};
  &:hover {
    background-color: ${({ theme }) => theme.colors.secondary + 'E0'};
  }
`;


const UpdateProfile: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { user: privyUser, authenticated } = usePrivy();

  const [username, setUsername] = useState('');
  const [bio, setBio] = useState('');
  const [location, setLocation] = useState('');
  const [language, setLanguage] = useState('');

  // New state for selected file and its preview URL
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imageUrlPreview, setImageUrlPreview] = useState<string | null>(null); // For local preview

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error' | ''>('');

  const fileInputRef = useRef<HTMLInputElement>(null); // Ref for triggering file input

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
      setUsername(currentUserProfile.profileName || '');
      setBio(currentUserProfile.description || '');
      setLocation(currentUserProfile.location || '');
      setLanguage(currentUserProfile.language || '');
      // Set the initial image preview to the user's current profile image
      if (currentUserProfile.profileImage) {
        setImageUrlPreview(currentUserProfile.profileImage);
      } else {
        setImageUrlPreview('/default-avatar.png'); // Default if no image
      }
    }
  }, [currentUserProfile]);

  // Clean up the object URL when component unmounts or new file is selected
  useEffect(() => {
    return () => {
      if (imageUrlPreview && imageUrlPreview.startsWith('blob:')) {
        URL.revokeObjectURL(imageUrlPreview);
      }
    };
  }, [imageUrlPreview]);

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


  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setSelectedFile(file);

      // Create a URL for image preview
      if (imageUrlPreview && imageUrlPreview.startsWith('blob:')) {
        URL.revokeObjectURL(imageUrlPreview); // Clean up previous blob URL
      }
      setImageUrlPreview(URL.createObjectURL(file));
    } else {
      setSelectedFile(null);
      // If no file selected, revert to current profile image or default
      setImageUrlPreview(currentUserProfile?.profileImage || '/default-avatar.png'); // Revert to existing or default
      if (imageUrlPreview && imageUrlPreview.startsWith('blob:')) {
          URL.revokeObjectURL(imageUrlPreview); // Clean up old blob if it exists
      }
    }
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authenticated || !privyUser) {
      setStatusMessage('You must be logged in to update your profile.');
      setMessageType('error');
      return;
    }

    setIsSubmitting(true);
    setStatusMessage('');
    setMessageType('');

    try {
      const formData = new FormData();
      formData.append('username', username);
      formData.append('bio', bio);
      formData.append('language', language);
      formData.append('location', location);

      if (selectedFile) {
        formData.append('profileImageFile', selectedFile); // Append the file
      }
      // If no new file is selected, the 'profileImageFile' will simply not be in FormData.
      // Your backend should handle this by either keeping the existing image or a default.

      // We assume a new backend endpoint for multipart/form-data, e.g., PUT /users/update-with-image
      const response = await api.put<User>('/profile/update-with-image', formData, {
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
      if (axios.isAxiosError(err)) {
        errorMessage = err.response?.data?.message || err.message;
      } else if (typeof err === 'object' && err !== null && err instanceof Error) {
        errorMessage = err.message;
      } else {
        errorMessage = String(err);
      }
      setStatusMessage(`Error: ${errorMessage}`);
      setMessageType('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!authenticated || !privyUser) {
    return (
      <PageContainer theme={theme}>
        <Header theme={theme}>Update Profile</Header>
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
        <Header theme={theme}>Update Profile</Header>
        <LoadingSpinner />
        <p style={{ textAlign: 'center', color: theme.colors.placeholder }}>Loading your profile data...</p>
      </PageContainer>
    );
  }

  if (!currentUserProfile && messageType === 'error' && statusMessage.includes("don't have a profile yet")) {
    return (
      <PageContainer theme={theme}>
        <Header theme={theme}>Update Profile</Header>
        <Message theme={theme} type="error">{statusMessage}</Message>
        <Button onClick={() => navigate('/create-profile')} style={{ marginTop: theme.spacing.medium }}>
          Create Your Profile Now
        </Button>
      </PageContainer>
    );
  }

  return (
    <PageContainer theme={theme}>
      <Header theme={theme}>Update Your Profile</Header>

      <Form onSubmit={handleSubmit} theme={theme}>
        <FileInputContainer theme={theme}>
          <ProfileImagePreview
            src={imageUrlPreview || '/default-avatar.png'} // Use imageUrlPreview for display
            alt="Profile Preview"
            theme={theme}
          />
          <StyledFileInput
            type="file"
            id="profileImageUpload"
            accept="image/*" // Accept only image files
            onChange={handleFileChange}
            ref={fileInputRef} // Connect ref to the hidden input
            disabled={isSubmitting}
          />
          <CustomFileUploadButton
            type="button" // Important: Prevent this button from submitting the form
            onClick={() => fileInputRef.current?.click()} // Trigger the hidden file input
            disabled={isSubmitting}
            theme={theme}
          >
            {selectedFile ? 'Change Image' : 'Upload Image'}
          </CustomFileUploadButton>
          {selectedFile && (
            <p style={{ fontSize: '0.8em', color: theme.colors.placeholder }}>
              Selected: {selectedFile.name}
            </p>
          )}
        </FileInputContainer>

        <FormGroup theme={theme}>
          <label htmlFor="username">Username</label>
          <Input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Your display name"
            required
            disabled={isSubmitting}
          />
        </FormGroup>

        <FormGroup theme={theme}>
          <label htmlFor="bio">Bio</label>
          <TextArea theme={theme}
            id="bio"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Tell us about yourself..."
            rows={4}
            disabled={isSubmitting}
          />
        </FormGroup>
        

        <FormGroup theme={theme}>
          <label htmlFor="location">Location</label>
          <Input
            type="text"
            id="location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="e.g. US New York, London UK"
            required
            disabled={isSubmitting}
          />
        </FormGroup>
        <FormGroup theme={theme}>
          <label htmlFor="language">Language</label>
          <Input
            type="text"
            id="language"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            placeholder="e.g. English, French"
            required
            disabled={isSubmitting}
          />
        </FormGroup>

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? <LoadingSpinner size="small" /> : 'Update Profile'}
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

export default UpdateProfile;