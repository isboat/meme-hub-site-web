// ...existing code...
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
import TwitterLoginButton from '../../components/twitter/TwitterLoginButton';
import ProfileBanner from '../../components/common/ProfileBanner';

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
  box-sizing: border-box;

  @media (max-width: 900px) {
    width: calc(100% - 24px);
    margin: ${({ theme }) => theme.spacing.medium};
    padding: ${({ theme }) => theme.spacing.small};
  }
`;

const Header = styled.h1`
  text-align: center;
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: ${({ theme }) => theme.spacing.large};
  font-size: 1.5rem;

  @media (max-width: 480px) {
    font-size: 1.25rem;
  }
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
  box-sizing: border-box;

  @media (max-width: 480px) {
    padding: ${({ theme }) => theme.spacing.small};
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

  @media (max-width: 480px) {
    width: 100%;
  }
`;

const CHAINS = [
  "Ethereum", "Solana", "Base", "BNB Chain", "Polygon", "Arbitrum", "Others"
];

/* Responsive helpers used in place of inline style objects */
const SectionHeader = styled.div`
  margin-top: 30px;
  margin-bottom: 10px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  padding-bottom: 6px;
`;

const FormIntro = styled.div`
  border-radius: 12px;
  padding-left: 14px;
  padding-right: 14px;
  margin-bottom: 20px;
  display: flex;
  flex-direction: column;
  color: #a2a4a5ff;
  gap: 8px;
  font-size: 0.95rem;

  @media (max-width: 480px) {
    font-size: 0.9rem;
  }
`;

const SingleInput = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 6px 10px;
  color: #a2a4a5ff;
`;

const TwoColGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;

  @media (max-width: 720px) {
    grid-template-columns: 1fr;
  }
`;

const InputInner = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 6px 10px;
`;

const FileRow = styled.div`
  display: flex;
  gap: 12px;
  align-items: flex-start;
  width: 100%;
  flex-wrap: wrap;

  @media (max-width: 480px) {
    flex-direction: column;
  }
`;

const OrderSummary = styled.div`
  margin-top: 20px;
  margin-bottom: 10px;
  padding: 14px;
  background-color: ${({ theme }) => theme.colors.cardBackground};
  border-radius: 12px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  box-sizing: border-box;
`;

const OrderGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
  font-size: 14px;
  margin-bottom: ${({ theme }) => theme.spacing.extraLarge};
  padding-bottom: 10px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
    & > div:nth-child(2) { text-align: left; }
  }
`;

const OrderNote = styled.div`
  font-size: 12px;
`;

/* End of responsive helpers */

// ...existing code...
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
  const [selectedLogoFile, setSelectedLogoFile] = useState<File | null>(null);
  const [logoUrlPreview, setLogoUrlPreview] = useState<string | null>(null); // For local preview

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error' | ''>('');

  const fileInputRef = useRef<HTMLInputElement>(null); // Ref for triggering file input
  const logoInputRef = useRef<HTMLInputElement>(null); // Ref for triggering logo input

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
      setUserId(currentUser?._id || '');
      if (tokenData.logoURI) {
        setLogoUrlPreview(tokenData.logoURI);
      } else {
        setLogoUrlPreview('/default-avatar.png');
      }
      setImageUrlPreview('/token-default-banner.JPG');
    }
    setUserId(privyUser?.id || '');
  }, [tokenData, currentUser, privyUser]);

  // Clean up the object URL when component unmounts or new file is selected
  useEffect(() => {
    return () => {
      if (logoUrlPreview && logoUrlPreview.startsWith('blob:')) {
        URL.revokeObjectURL(logoUrlPreview);
      }
      if (imageUrlPreview && imageUrlPreview.startsWith('blob:')) {
        URL.revokeObjectURL(imageUrlPreview);
      }
    };
  }, [logoUrlPreview, imageUrlPreview]);

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

      if (imageUrlPreview && imageUrlPreview.startsWith('blob:')) {
        URL.revokeObjectURL(imageUrlPreview);
      }
      setImageUrlPreview(URL.createObjectURL(file));
    } else {
      setSelectedFile(null);
      setImageUrlPreview('/default-avatar.png');
      if (imageUrlPreview && imageUrlPreview.startsWith('blob:')) {
        URL.revokeObjectURL(imageUrlPreview);
      }
    }
  };
  // Handle file selection
  const handleLogoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setSelectedLogoFile(file);

      if (logoUrlPreview && logoUrlPreview.startsWith('blob:')) {
        URL.revokeObjectURL(logoUrlPreview);
      }
      setLogoUrlPreview(URL.createObjectURL(file));
    } else {
      setSelectedLogoFile(null);
      setLogoUrlPreview('/token-default-banner.JPG');
      if (logoUrlPreview && logoUrlPreview.startsWith('blob:')) {
        URL.revokeObjectURL(logoUrlPreview);
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
        formData.append('profileImageFile', selectedFile);
      }
      if (selectedLogoFile) {
        formData.append('profileLogoImageFile', selectedLogoFile);
      }

      const response = await api.post<User>('/token-profile/submit-socials', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.status !== 200) {
        setMessageType('error');
        setStatusMessage('Failed to submit claim. Please try again later.');
      } else {
        setMessageType('success');
        setStatusMessage('Token Claim submitted successfully!');
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
        <FormIntro theme={theme}>
          <div>Use this form to request a Community Takeover (updating the socials of a token to new ones).</div>
          <div>After submission, the request will be reviewed by MTH and you will be contacted via the provided admin/mod contact info.</div>
          <div>Make sure to fill out all the information truthfully and accurately. Incomplete or false information may lead to rejection of the request.</div>
        </FormIntro>

        <SectionHeader theme={theme}>
          <h2>Choose Audit Identity</h2>
        </SectionHeader>

        <TwoColGrid>
          <div style={{ border: '1px solid ' + theme.colors.border, borderRadius: theme.borderRadius, padding: 10 }}>
            <div style={{ justifyContent: 'space-between', display: 'flex', marginBottom: 10 }}>
              <div>MemeTokenHub Profile</div>
              <div style={{ border: '1px solid ' + theme.colors.border, borderRadius: theme.borderRadius, padding: 5, fontSize: '0.7em' }}>Default</div>
            </div>
            <div style={{ fontSize: '0.8em' }}>Recommended - shows as MTH holder</div>
          </div>

          <div style={{ border: '1px solid ' + theme.colors.border, borderRadius: theme.borderRadius, padding: 10 }}>
            <div>X (Twitter) Profile</div>
            <div style={{ fontSize: '0.8em', marginRight: 20, marginBottom: 20 }}>Sign in with your @handle (demo)</div>
            <TwitterLoginButton />
          </div>
        </TwoColGrid>

        <SectionHeader theme={theme}>
          <h2>Token Info</h2>
        </SectionHeader>

        <SingleInput>
          <label htmlFor='chain'>Chain</label>
          <select id="chain" name="chain" required value={chain} onChange={(e) => setChain(e.target.value)}>
            <option value="">Select chain</option>
            {CHAINS.map(c => <option key={c}>{c}</option>)}
          </select>
        </SingleInput>

        <SingleInput>
          <label htmlFor='tokenAddress'>Token Address</label>
          <input id='tokenAddress' name='tokenAddress' type="text" value={tokenAddress} onChange={(e) => setTokenAddress(e.target.value)} />
        </SingleInput>

        <SingleInput>
          <label htmlFor="bio">Token Description/Bio</label>
          <TextArea
            id="bio"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Tell us about the token..."
            rows={4}
            disabled={isSubmitting}
            theme={theme}
          />
        </SingleInput>

        <SectionHeader theme={theme}>
          <h2>Social Links</h2>
        </SectionHeader>

        <TwoColGrid>
          <InputInner>
            <label htmlFor='website'>Website</label>
            <input id='website' name='website' type="text" placeholder='https:// ' value={website} onChange={(e) => setWebsite(e.target.value)} />
          </InputInner>
          <InputInner>
            <label htmlFor='twitter'>Twitter</label>
            <input id='twitter' name='twitter' type="text" placeholder='@' value={twitter} onChange={(e) => setTwitter(e.target.value)} />
          </InputInner>
          <InputInner>
            <label htmlFor='discord'>Discord</label>
            <input id='discord' name='discord' type="text" placeholder='https:// ' value={discord} onChange={(e) => setDiscord(e.target.value)} />
          </InputInner>
          <InputInner>
            <label htmlFor='telegram'>Telegram</label>
            <input id='telegram' name='telegram' type="text" placeholder='@' value={telegram} onChange={(e) => setTelegram(e.target.value)} />
          </InputInner>
          <InputInner>
            <label htmlFor='reddit'>Reddit</label>
            <input id='reddit' name='reddit' type="text" placeholder='u/' value={reddit} onChange={(e) => setReddit(e.target.value)} />
          </InputInner>
          <InputInner>
            <label htmlFor='other'>Other</label>
            <input id='other' name='other' type="text" placeholder='Link or @' value={other} onChange={(e) => setOther(e.target.value)} />
          </InputInner>
        </TwoColGrid>

        <SectionHeader theme={theme}>
          <h2>Admin/Mod Contact Info</h2>
        </SectionHeader>

        <SingleInput>
          <label htmlFor='discordUsername'>Discord Username</label>
          <input id='discordUsername' name='discordUsername' type="text" placeholder=' ' value={discordUsername} onChange={(e) => setDiscordUsername(e.target.value)} />
        </SingleInput>

        <SingleInput>
          <label htmlFor='telegramUsername'>Telegram Username</label>
          <input id='telegramUsername' name='telegramUsername' type="text" placeholder=' ' value={telegramUsername} onChange={(e) => setTelegramUsername(e.target.value)} />
        </SingleInput>

        <SectionHeader theme={theme}>
          <h2>Profile Image</h2>
        </SectionHeader>

        <div>
          <ProfileBanner imgUrl={imageUrlPreview || '/token-default-banner.JPG'} logoUrl={logoUrlPreview || '/default-avatar.png'} />
        </div>

        <FileRow>
          <FileInputContainer theme={theme}>
            <StyledFileInput
              type="file"
              id="profileImageUpload"
              accept="image/*"
              onChange={handleFileChange}
              ref={fileInputRef}
              disabled={isSubmitting}
            />
            <CustomFileUploadButton
              type="button"
              onClick={() => fileInputRef.current?.click()}
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

          <FileInputContainer theme={theme}>
            <StyledFileInput
              type="file"
              id="profileLogoUpload"
              accept="image/*"
              onChange={handleLogoFileChange}
              ref={logoInputRef}
              disabled={isSubmitting}
            />
            <CustomFileUploadButton
              type="button"
              onClick={() => logoInputRef.current?.click()}
              disabled={isSubmitting}
              theme={theme}
            >
              {selectedLogoFile ? 'Change Logo Image' : 'Upload Logo Image'}
            </CustomFileUploadButton>
            {selectedLogoFile && (
              <p style={{ fontSize: '0.8em', color: theme.colors.placeholder }}>
                Selected: {selectedLogoFile.name}
              </p>
            )}
          </FileInputContainer>
        </FileRow>

        <SectionHeader theme={theme}>
          <h2>Agreements</h2>
        </SectionHeader>

        <SingleInput>
          <label style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
            <input name="verifiable" type="checkbox" checked={verifiable} onChange={(e) => setVerifiable((e.target as HTMLInputElement).checked)} />
            I understand that all supplied data must be verifiable through official channels such as website and socials.
          </label>
        </SingleInput>

        <SingleInput>
          <label style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
            <input name="norefund" type="checkbox" checked={noRefund} onChange={(e) => setNoRefund((e.target as HTMLInputElement).checked)} />
            I understand that no refund shall be granted in case my Community Takeover order does not get approved.
          </label>
        </SingleInput>

        <SingleInput>
          <label style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
            <input name="rightReserve" type="checkbox" checked={rightReserve} onChange={(e) => setRightReserve((e.target as HTMLInputElement).checked)} />
            I understand and accept that MTH reserves the right to reject or modify the provided information.
          </label>
        </SingleInput>

        <OrderSummary theme={theme}>
          <h2 style={{ marginBottom: 20 }}>Order Summary</h2>
          <OrderGrid theme={theme}>
            <div>Product</div>
            <div style={{ textAlign: "right" }}>Price</div>

            <div>Profile Claim price</div>
            <div style={{ textAlign: "right" }}>0.01 ETH</div>
          </OrderGrid>
          <OrderNote>ETA: Submission will be verified by MTH. Average processing time after receiving payment is less than 24H.</OrderNote>
        </OrderSummary>

        <div style={{ width: '100%' }}>
          <CoinbaseCheckout disabled={true} chargeCode="your_charge_code_here" />
        </div>

        {statusMessage && (
          <Message theme={theme} type={messageType}>
            {statusMessage}
          </Message>
        )}
      </Form>
    </PageContainer >
  );
};

// ...existing code...
export default SubmitSocialsClaim;