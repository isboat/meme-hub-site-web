// client/src/pages/UpdateProfile.tsx
import React, { useState, useEffect, useRef } from 'react'; // Import useRef
import styled from 'styled-components';
import { useTheme } from '../../context/ThemeContext';
import { usePrivy } from '@privy-io/react-auth';
import { useLocation, useNavigate } from 'react-router-dom';
import { NetworkTokenData, User } from '../../types';
import { useApi } from '../../hooks/useApi';
import api from '../../api/api';
import Button from '../../components/common/Button';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import axios from 'axios';
import CoinbaseCheckout from '../../components/common/CoinbaseCheckout';

const PageContainer = styled.div`
  width: 80%;
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
  width: 100%;
  height: 200px;
  object-fit: cover;
  margin: ${({ theme }) => theme.spacing.medium} auto;
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

const CHAINS = [
  "Ethereum", "Solana", "Base", "BNB Chain", "Polygon", "Arbitrum", "Others"
];

const SubmitSocialsClaim: React.FC = () => {

  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();



  const [tokenName, setTokenName] = useState('');
  const [bio, setBio] = useState('');
  const [userId, setUserId] = useState('');
  const [chain, setChain] = useState('');
  const [tokenAddress, setTokenAddress] = useState('');
  const [website, setWebsite] = useState('');
  const [twitter, setTwitter] = useState('');
  const [discord, setDiscord] = useState('');
  const [telegram, setTelegram] = useState('');
  const [reddit, setReddit] = useState('');
  const [other, setOther] = useState('');
  const [discordUsername, setDiscordUsername] = useState('');
  const [telegramUsername, setTelegramUsername] = useState('');
  const [verifiable, setVerifiable] = useState(false);
  const [noRefund, setNoRefund] = useState(false);
  const [rightReserve, setRightReserve] = useState(false);

  // New state for selected file and its preview URL
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imageUrlPreview, setImageUrlPreview] = useState<string | null>(null); // For local preview

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error' | ''>('');

  const fileInputRef = useRef<HTMLInputElement>(null); // Ref for triggering file input

  const { user: privyUser, authenticated } = usePrivy();

  const { data: currentUser, loading } = useApi<User>(
    `/users/${privyUser?.id}`,
    'get',
    null,
    null,
    !authenticated
  );

  const tokenData = (location.state as { token?: NetworkTokenData })?.token;

  // Effect to populate form fields and initial image preview
  useEffect(() => {
    if (tokenData) {
      setTokenName(tokenData.name || '');
      setTokenAddress(tokenData.address || '');
      if (tokenData.addressDto) {
        setChain(tokenData.addressDto.chain?.name || '');
      }
      //setBio('add/update description');
      setUserId(currentUser?._id || '');
      // Set the initial image preview to the user's current profile image
      if (tokenData.logoURI) {
        setImageUrlPreview(tokenData.logoURI);
      } else {
        setImageUrlPreview('/default-avatar.png'); // Default if no image
      }
    }
    setUserId(privyUser?.id || '');
  }, [tokenData]);

  // Clean up the object URL when component unmounts or new file is selected
  useEffect(() => {
    return () => {
      if (imageUrlPreview && imageUrlPreview.startsWith('blob:')) {
        URL.revokeObjectURL(imageUrlPreview);
      }
    };
  }, [imageUrlPreview]);

  if (!authenticated || !privyUser) {
    return (
      <PageContainer theme={theme}>
        <Header theme={theme}>Submit Claim</Header>
        <Message theme={theme} type="error">
          You must be logged in to access this page.
        </Message>
        <Button onClick={() => navigate('/auth')} style={{ marginTop: theme.spacing.medium }}>
          Log In
        </Button>
      </PageContainer>
    );
  }

  if (!currentUser) {
    return (
      <PageContainer theme={theme}>
        <Header theme={theme}>Submit Claim</Header>
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
        <Header theme={theme}>Submit Claim</Header>
        <LoadingSpinner />
        <p style={{ textAlign: 'center', color: theme.colors.placeholder }}>Loading data...</p>
      </PageContainer>
    );
  }


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
      setImageUrlPreview('/default-avatar.png'); // Revert to existing or default
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
      formData.append('tokenName', tokenName);
      formData.append('description', bio);
      formData.append('userId', userId);
      formData.append('chain', chain);
      formData.append('tokenAddress', tokenAddress);
      formData.append('website', website);
      formData.append('twitter', twitter);
      formData.append('discord', discord);
      formData.append('telegram', telegram);
      formData.append('reddit', reddit);
      formData.append('other', other);
      formData.append('discordUsername', discordUsername);
      formData.append('telegramUsername', telegramUsername);      

      if (selectedFile) {
        formData.append('profileImageFile', selectedFile); // Append the file
      }
      // If no new file is selected, the 'profileImageFile' will simply not be in FormData.
      // Your backend should handle this by either keeping the existing image or a default.

      const response = await api.post<User>('/token-profile/submit-socials', formData, {
        headers: {
          'Content-Type': 'multipart/form-data', // Crucial for FormData
        },
      });

      if (response.status !== 200) {
        setMessageType('error');
        setStatusMessage('Failed to submit claim. Please try again later.');
      } else {
        setMessageType('success');
        setStatusMessage('Token Claim submitted successfully!');
        // Redirect to profile page after a short delay to show success message
        setTimeout(() => navigate(`/user-pending-socials-claims`), 1500);
      }

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

  return (
    <PageContainer theme={theme}>
      <Header theme={theme}>Submit Your Claim</Header>

      <Form onSubmit={handleSubmit} theme={theme}>
        <div style={formIntroStyle}>
          <div>Use this form to request a Community Takeover (updating the socials of a token to new ones).</div>
          <div>After submission, the request will be reviewed by MTH and you will be contacted via the provided admin/mod contact info.</div>
          <div>Make sure to fill out all the information truthfully and accurately. Incomplete or false information may lead to rejection of the request.</div>
        </div>
        <div style={sectionHeaderStyle}>
          <h2>Token Info</h2>
        </div>

        <div style={inputStyle}>
          <label htmlFor='chain'>Chain</label>
          <select id="chain" name="chain" required value={chain} onChange={(e) => setChain(e.target.value)}>
            <option value="">Select chain</option>
            {CHAINS.map(c => <option key={c}>{c}</option>)}
          </select>
        </div>
        <div style={inputStyle}>
          <label htmlFor='tokenAddress'>Token Address</label>
          <input id='tokenAddress' name='tokenAddress' type="text" value={tokenAddress} onChange={(e) => setTokenAddress(e.target.value)} />
        </div>

        <div style={inputStyle}>
          <label htmlFor="bio">Token Description/Bio</label>
          <TextArea theme={theme}
            id="bio"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Tell us about the token..."
            rows={4}
            disabled={isSubmitting}
          />
        </div>
        <div style={sectionHeaderStyle}>
          <h2>Social Links</h2>
        </div>
        <div style={gridInputStyle}>
          <div style={innerInputStyle}>
            <label htmlFor='website'>Website</label>
            <input id='website' name='website' type="text" placeholder='https:// ' value={website} onChange={(e) => setWebsite(e.target.value)} />
          </div>
          <div style={innerInputStyle}>
            <label htmlFor='twitter'>Twitter</label>
            <input id='twitter' name='twitter' type="text" placeholder='@' value={twitter} onChange={(e) => setTwitter(e.target.value)} />
          </div>
        </div>
        <div style={gridInputStyle}>
          <div style={innerInputStyle}>
            <label htmlFor='discord'>Discord</label>
            <input id='discord' name='discord' type="text" placeholder='https:// ' value={discord} onChange={(e) => setDiscord(e.target.value)} />
          </div>
          <div style={innerInputStyle}>
            <label htmlFor='telegram'>Telegram</label>
            <input id='telegram' name='telegram' type="text" placeholder='@' value={telegram} onChange={(e) => setTelegram(e.target.value)} />
          </div>
        </div>
        <div style={gridInputStyle}>
          <div style={innerInputStyle}>
            <label htmlFor='reddit'>Reddit</label>
            <input id='reddit' name='reddit' type="text" placeholder='u/' value={reddit} onChange={(e) => setReddit(e.target.value)} />
          </div>
          <div style={innerInputStyle}>
            <label htmlFor='other'>Other</label>
            <input id='other' name='other' type="text" placeholder='Link or @' value={other} onChange={(e) => setOther(e.target.value)} />
          </div>
        </div>
        <div style={sectionHeaderStyle}>
          <h2>Admin/Mod Contact Info</h2>
        </div>
        <div style={inputStyle}>
          <label htmlFor='discordUsername'>Discord Username</label>
          <input id='discordUsername' name='discordUsername' type="text" placeholder=' ' value={discordUsername} onChange={(e) => setDiscordUsername(e.target.value)} />
        </div>
        <div style={inputStyle}>
          <label htmlFor='telegramUsername'>Telegram Username</label>
          <input id='telegramUsername' name='telegramUsername' type="text" placeholder=' ' value={telegramUsername} onChange={(e) => setTelegramUsername(e.target.value)} />
        </div>
        <div style={sectionHeaderStyle}>
          <h2>Profile Image</h2>
        </div>
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
        <div style={sectionHeaderStyle}>
          <h2>Agreements</h2>
        </div>
        <div style={inputStyle}>
          <label style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
            <input name="verifiable" type="checkbox" checked={verifiable} onChange={(e) => setVerifiable((e.target as HTMLInputElement).checked)} />
            I understand that all supplied data must be verifiable through official channels such as website and socials.
          </label>
        </div>
        <div style={inputStyle}>
          <label style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
            <input name="norefund" type="checkbox" checked={noRefund} onChange={(e) => setNoRefund((e.target as HTMLInputElement).checked)} />
            I understand that no refund shall be granted in case my Community Takeover order does not get approved.
          </label>
        </div>
        <div style={inputStyle}>
          <label style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
            <input name="rightReserve" type="checkbox" checked={rightReserve} onChange={(e) => setRightReserve((e.target as HTMLInputElement).checked)} />
            I understand and accept that MTH reserves the right to reject or modify the provided information.
          </label>
        </div>
        <div style={{ marginTop: 20, marginBottom: 10, padding: 14, backgroundColor: theme.colors.cardBackground, borderRadius: 12, border: `1px solid ${theme.colors.border}` }}>
          <h2 style={{ marginBottom: 20 }}>Order Summary</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, fontSize: 14, marginBottom: 10, paddingBottom: 10, borderBottom: `1px solid ${theme.colors.border}` }}>
            <div>Product</div>
            <div style={{ textAlign: "right" }}>Price</div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, fontSize: 14, marginBottom: theme.spacing.extraLarge }}>
            <div>Profile Claim price</div>
            <div style={{ textAlign: "right" }}>0.01 ETH</div>
          </div>
          <div style={{ fontSize: 12 }}>ETA: Submission will be verified by MTH. Average processing time after receiving payment is less than 24H.</div>
        </div>

        {/* <FormGroup theme={theme}>
          <label htmlFor="username">Username</label>
          <Input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Token display name"
            required
            disabled={isSubmitting}
          />
        </FormGroup> */}
        <CoinbaseCheckout disabled={true} chargeCode="your_charge_code_here" />

        {statusMessage && (
          <Message theme={theme} type={messageType}>
            {statusMessage}
          </Message>
        )}
      </Form>
    </PageContainer >
  );
};

const sectionHeaderStyle: React.CSSProperties = {
  marginTop: 30,
  marginBottom: 10,
  borderBottom: '1px solid #ccc',
  paddingBottom: 6
};
const formIntroStyle: React.CSSProperties = {
  borderRadius: 12,
  paddingLeft: 14,
  paddingRight: 14,
  marginBottom: 20,
  display: "flex",
  flexDirection: "column",
  color: '#a2a4a5ff',
  gap: 8
};
const inputStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: 8,
  padding: "6px 10px",
  color: '#a2a4a5ff',
};
const gridInputStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: 8,
}
const innerInputStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: 8,
  padding: "6px 10px",
};
export default SubmitSocialsClaim;