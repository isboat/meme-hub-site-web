import React, { useState, useEffect, useRef } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { usePrivy } from '@privy-io/react-auth';
import { useLocation, useNavigate } from 'react-router-dom';
import { NetworkTokenData, User } from '../../types';
import { useApi } from '../../hooks/useApi';
import api from '../../api/api';
import Button from '../../components/common/Button';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import axios from 'axios';
import TwitterLoginButton from '../../components/twitter/TwitterLoginButton';
import ProfileBanner from '../../components/common/ProfileBanner';

const CHAINS = [
  "Ethereum", "Solana", "Base", "BNB Chain", "Polygon", "Arbitrum", "Others"
];

const STORAGE_ITEM = "submitsocialtokendata";

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

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imageUrlPreview, setImageUrlPreview] = useState<string | null>(null);
  const [selectedLogoFile, setSelectedLogoFile] = useState<File | null>(null);
  const [logoUrlPreview, setLogoUrlPreview] = useState<string | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error' | ''>('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const fileInputRef = useRef<HTMLInputElement>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);

  const { user: privyUser, authenticated } = usePrivy();

  const { data: currentUser, loading } = useApi<User>(
    `/users/${privyUser?.id}`,
    'get',
    null,
    null,
    !authenticated
  );

  let tokenData = (location.state as { token?: NetworkTokenData })?.token;
  const twitterAuthSuccess = (location.state as { twitterAuthSuccess?: boolean })?.twitterAuthSuccess;
  
  // save tokenData to local storage
  if(tokenData) 
  {
    localStorage.setItem(STORAGE_ITEM, JSON.stringify(tokenData));
  }
  // load tokenData from local storage if not in location state
  else {
    const storedData = localStorage.getItem(STORAGE_ITEM);
    if(storedData) {
      try {
        const parsedData: NetworkTokenData = JSON.parse(storedData);
        tokenData = parsedData;
      } catch(err) {
        console.error('Failed to parse stored token data:', err);
      }
      localStorage.removeItem(STORAGE_ITEM);
    }
  }

  let noTokenData = "";
  useEffect(() => {
    if (tokenData) {
      setTokenName(tokenData.name || '');
      setTokenAddress(tokenData.address || '');
      if (tokenData.addressDto) {
        setChain(tokenData.addressDto.chain?.name || '');
      }
      setUserId(currentUser?._id || '');
      setLogoUrlPreview(tokenData.logoURI || '/default-avatar.png');
      setImageUrlPreview('/token-default-banner.JPG');
    }
    else 
    {
      noTokenData = "No token data provided. Please start the claim process again.";
    }
    setUserId(privyUser?.id || '');
  }, [tokenData, currentUser, privyUser]);

  useEffect(() => {
    return () => {
      if (logoUrlPreview && logoUrlPreview.startsWith('blob:')) URL.revokeObjectURL(logoUrlPreview);
      if (imageUrlPreview && imageUrlPreview.startsWith('blob:')) URL.revokeObjectURL(imageUrlPreview);
    };
  }, [logoUrlPreview, imageUrlPreview]);

  if (!authenticated || !privyUser) {
    return (
      <div
        className="w-full max-w-4xl mx-auto p-6 min-h-[calc(100vh-120px)] flex flex-col items-center"
        style={{ backgroundColor: theme.colors.background, color: theme.colors.text }}
      >
        <h1 className="text-2xl font-semibold mb-4" style={{ color: theme.colors.primary }}>Submit Claim</h1>
        <p className="font-semibold" style={{ color: theme.colors.error }}>You must be logged in to access this page.</p>
        <Button onClick={() => navigate('/auth')} className="mt-4">Log In</Button>
      </div>
    );
  }

  if(noTokenData) {
    return (
      <div
        className="w-full max-w-4xl mx-auto p-6 min-h-[calc(100vh-120px)] flex flex-col items-center"
        style={{ backgroundColor: theme.colors.background, color: theme.colors.text }}
      >
        <h1 className="text-2xl font-semibold mb-4" style={{ color: theme.colors.primary }}>Submit Claim</h1>
        <p className="font-semibold" style={{ color: theme.colors.error }}>{noTokenData}</p>
        <Button onClick={() => navigate('/')} className="mt-4">Start Claim Process</Button>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div
        className="w-full max-w-4xl mx-auto p-6 min-h-[calc(100vh-120px)] flex flex-col items-center"
        style={{ backgroundColor: theme.colors.background, color: theme.colors.text }}
      >
        <h1 className="text-2xl font-semibold mb-4" style={{ color: theme.colors.primary }}>Submit Claim</h1>
        <p className="font-semibold" style={{ color: theme.colors.error }}>You must be logged in to access this page.</p>
        <Button onClick={() => navigate('/auth')} className="mt-4">Log In</Button>
      </div>
    );
  }

  if (loading) {
    return (
      <div
        className="w-full max-w-4xl mx-auto p-6 min-h-[calc(100vh-120px)] flex flex-col items-center"
        style={{ backgroundColor: theme.colors.background, color: theme.colors.text }}
      >
        <h1 className="text-xl font-semibold mb-4" style={{ color: theme.colors.primary }}>Submit Claim</h1>
        <LoadingSpinner />
        <p className="mt-3" style={{ color: theme.colors.placeholder }}>Loading data...</p>
      </div>
    );
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setSelectedFile(file);
      if (imageUrlPreview && imageUrlPreview.startsWith('blob:')) URL.revokeObjectURL(imageUrlPreview);
      setImageUrlPreview(URL.createObjectURL(file));
    } else {
      setSelectedFile(null);
      setImageUrlPreview('/default-avatar.png');
    }
  };

  const handleLogoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setSelectedLogoFile(file);
      if (logoUrlPreview && logoUrlPreview.startsWith('blob:')) URL.revokeObjectURL(logoUrlPreview);
      setLogoUrlPreview(URL.createObjectURL(file));
    } else {
      setSelectedLogoFile(null);
      setLogoUrlPreview('/token-default-banner.JPG');
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!tokenName.trim()) newErrors.tokenName = 'Token name is required';
    if (!chain.trim()) newErrors.chain = 'Chain is required';
    if (!tokenAddress.trim()) newErrors.tokenAddress = 'Token address is required';
    if (!bio.trim()) newErrors.bio = 'Description is required';
    if (!website.trim()) newErrors.website = 'Website is required';
    if (!twitter.trim()) newErrors.twitter = 'Twitter is required';
    if (!discord.trim()) newErrors.discord = 'Discord is required';
    if (!telegram.trim()) newErrors.telegram = 'Telegram is required';
    if (!reddit.trim()) newErrors.reddit = 'Reddit is required';
    if (!other.trim()) newErrors.other = 'Other contact is required';
    if (!discordUsername.trim()) newErrors.discordUsername = 'Discord username is required';
    if (!telegramUsername.trim()) newErrors.telegramUsername = 'Telegram username is required';
    if (!selectedFile) newErrors.profileImage = 'Profile/banner image is required';
    if (!selectedLogoFile) newErrors.profileLogo = 'Logo image is required';
    if (!verifiable) newErrors.verifiable = 'You must confirm data is verifiable';
    if (!noRefund) newErrors.noRefund = 'You must acknowledge no refund';
    if (!rightReserve) newErrors.rightReserve = 'You must accept MTH rights reservation';

    // basic URL check for website
    if (website && !/^https?:\/\//i.test(website)) newErrors.website = 'Website must start with http:// or https://';

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      setStatusMessage('Please correct the highlighted fields.');
      setMessageType('error');
      return false;
    }
    setStatusMessage('');
    setMessageType('');
    return true;
  };

  const handleSubmit = async (e?: React.FormEvent | React.MouseEvent) => {
    if (e && typeof (e as any).preventDefault === 'function') (e as any).preventDefault();

    if (!authenticated || !privyUser) {
      setStatusMessage('You must be logged in to update your profile.');
      setMessageType('error');
      return;
    }

    setIsSubmitting(true);
    setStatusMessage('');
    setMessageType('');

    try {
      // validate all fields and if invalid prevent form submission
      if (!validateForm()) {
        setIsSubmitting(false);
        return;
      }
       
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
      formData.append('twitterAuthSuccess', twitterAuthSuccess);

      if (selectedFile) formData.append('profileImageFile', selectedFile);
      if (selectedLogoFile) formData.append('profileLogoImageFile', selectedLogoFile);

      const response = await api.post<User>('/token-profile/submit-socials', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (response.status !== 200) {
        setMessageType('error');
        setStatusMessage('Failed to submit claim. Please try again later.');
      } else {
        var claimId = response?.data?.claimId;
        setMessageType('success');
        setStatusMessage('Token Claim submitted successfully!');

        setTimeout(() => navigate(`/user-pending-socials-claims/${claimId}`), 1500);
      }
    } catch (err: unknown) {
      console.error('Profile update error:', err);
      let errorMessage = 'Failed to update profile.';
      if (axios.isAxiosError(err)) errorMessage = err.response?.data?.message || err.message;
      else if (err instanceof Error) errorMessage = err.message;
      else errorMessage = String(err);
      setStatusMessage(`Error: ${errorMessage}`);
      setMessageType('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="w-full max-w-4xl mx-auto p-4 sm:p-6 min-h-[calc(100vh-120px)]"
      style={{ backgroundColor: theme.colors.background, color: theme.colors.text }}
    >
      <header className="mb-4">
        <h1 className="text-2xl font-semibold" style={{ color: theme.colors.primary }}>Submit Your Claim</h1>
      </header>

      <form
        onSubmit={handleSubmit as any}
        className="w-full rounded-lg"
        style={{
          backgroundColor: theme.colors.cardBackground,
          boxShadow: theme.boxShadow,
          borderRadius: theme.borderRadius,
          padding: 12
        }}
      >
        <div className="mb-4 text-sm" style={{ color: theme.colors.placeholder }}>
          <p className="mb-1">Use this form to request a Community Takeover (updating the socials of a token to new ones).</p>
          <p className="mb-1">After submission, the request will be reviewed by MTH and you will be contacted via the provided contact info.</p>
        </div>

        <section className="mb-3 pb-2" style={{ borderBottom: `1px solid ${theme.colors.border}` }}>
          <h2 className="text-lg font-semibold" style={{ color: theme.colors.yellow }}>Choose Audit Identity</h2>
        </section>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
          <div className="border rounded-md p-3" style={{ border: `2px solid ${ !twitterAuthSuccess ? theme.colors.success : theme.colors.border}` }}>
            <div className="flex justify-between mb-2">
              <div className="font-medium">MemeTokenHub Profile</div>
              {!twitterAuthSuccess &&
              <div className="text-xs px-2 py-1 rounded" style={{ border: `1px solid ${theme.colors.border}` }}>Default</div>
              }
            </div>
            <div className="text-sm">Recommended - shows as MTH holder</div>
          </div>

          <div className="border rounded-md p-3" style={{ border: `1px solid ${ twitterAuthSuccess ? theme.colors.success : theme.colors.border}` }}>
            <div className="font-medium mb-2">X (Twitter) Profile</div>
            <div className="text-sm mb-3">Sign in with your @handle</div>
            {twitterAuthSuccess && <div className="text-green-600 mb-2">Twitter authentication successful!</div>}
            {!twitterAuthSuccess &&
            <TwitterLoginButton callbackType="submitSocialAuth" buttonText="Sign in with Twitter" />
            }
          </div>
        </div>

        <section className="mb-3 pb-2" style={{ borderBottom: `1px solid ${theme.colors.border}` }}>
          <h3 className="text-lg font-semibold">Token Info</h3>
        </section>

        <div className="flex flex-col gap-3 mb-4">
          <label className="flex flex-col">
            <span className="text-sm mb-1" style={{ color: theme.colors.text }}>Chain</span>
            <select
              id="chain"
              name="chain"
              required
              value={chain}
              onChange={(e) => { setChain(e.target.value); setErrors(prev => { const p = { ...prev }; delete p.chain; return p; }); }}
              className="p-2 rounded"
              style={{
                backgroundColor: theme.colors.background,
                border: `1px solid ${theme.colors.border}`,
                color: theme.colors.text
              }}
            >
              <option value="">Select chain</option>
              {CHAINS.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            {errors.chain && <div className="text-xs mt-1" style={{ color: theme.colors.error }}>{errors.chain}</div>}
          </label>

          <label className="flex flex-col">
            <span className="text-sm mb-1" style={{ color: theme.colors.text }}>Token Address</span>
            <input
              id="tokenAddress"
              name="tokenAddress"
              type="text"
              value={tokenAddress}
              onChange={(e) => { setTokenAddress(e.target.value); setErrors(prev => { const p = { ...prev }; delete p.tokenAddress; return p; }); }}
              className="p-2 rounded"
              style={{
                backgroundColor: theme.colors.background,
                border: `1px solid ${theme.colors.border}`,
                color: theme.colors.text
              }}
            />
            {errors.tokenAddress && <div className="text-xs mt-1" style={{ color: theme.colors.error }}>{errors.tokenAddress}</div>}
          </label>

          <label className="flex flex-col">
            <span className="text-sm mb-1" style={{ color: theme.colors.text }}>Token Description/Bio</span>
            <textarea
              id="bio"
              value={bio}
              onChange={(e) => { setBio(e.target.value); setErrors(prev => { const p = { ...prev }; delete p.bio; return p; }); }}
              placeholder="Tell us about the token..."
              rows={4}
              disabled={isSubmitting}
              className="p-2 rounded min-h-[100px]"
              style={{
                backgroundColor: theme.colors.background,
                border: `1px solid ${theme.colors.border}`,
                color: theme.colors.text
              }}
            />
            {errors.bio && <div className="text-xs mt-1" style={{ color: theme.colors.error }}>{errors.bio}</div>}
          </label>
        </div>

        <section className="mb-3 pb-2" style={{ borderBottom: `1px solid ${theme.colors.border}` }}>
          <h3 className="text-lg font-semibold">Official Links</h3>
        </section>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
          <label className="flex flex-col">
            <span className="text-sm mb-1" style={{ color: theme.colors.text }}>Website</span>
            <input
              id="website"
              name="website"
              type="text"
              placeholder="https://"
              value={website}
              onChange={(e) => { setWebsite(e.target.value); setErrors(prev => { const p = { ...prev }; delete p.website; return p; }); }}
              className="p-2 rounded"
              style={{
                backgroundColor: theme.colors.background,
                border: `1px solid ${theme.colors.border}`,
                color: theme.colors.text
              }}
            />
            {errors.website && <div className="text-xs mt-1" style={{ color: theme.colors.error }}>{errors.website}</div>}
          </label>

          <label className="flex flex-col">
            <span className="text-sm mb-1" style={{ color: theme.colors.text }}>Twitter</span>
            <input
              id="twitter"
              name="twitter"
              type="text"
              placeholder="@"
              value={twitter}
              onChange={(e) => { setTwitter(e.target.value); setErrors(prev => { const p = { ...prev }; delete p.twitter; return p; }); }}
              className="p-2 rounded"
              style={{
                backgroundColor: theme.colors.background,
                border: `1px solid ${theme.colors.border}`,
                color: theme.colors.text
              }}
            />
            {errors.twitter && <div className="text-xs mt-1" style={{ color: theme.colors.error }}>{errors.twitter}</div>}
          </label>

          <label className="flex flex-col">
            <span className="text-sm mb-1" style={{ color: theme.colors.text }}>Discord</span>
            <input
              id="discord"
              name="discord"
              type="text"
              placeholder="https://"
              value={discord}
              onChange={(e) => { setDiscord(e.target.value); setErrors(prev => { const p = { ...prev }; delete p.discord; return p; }); }}
              className="p-2 rounded"
              style={{
                backgroundColor: theme.colors.background,
                border: `1px solid ${theme.colors.border}`,
                color: theme.colors.text
              }}
            />
            {errors.discord && <div className="text-xs mt-1" style={{ color: theme.colors.error }}>{errors.discord}</div>}
          </label>

          <label className="flex flex-col">
            <span className="text-sm mb-1" style={{ color: theme.colors.text }}>Telegram</span>
            <input
              id="telegram"
              name="telegram"
              type="text"
              placeholder="@"
              value={telegram}
              onChange={(e) => { setTelegram(e.target.value); setErrors(prev => { const p = { ...prev }; delete p.telegram; return p; }); }}
              className="p-2 rounded"
              style={{
                backgroundColor: theme.colors.background,
                border: `1px solid ${theme.colors.border}`,
                color: theme.colors.text
              }}
            />
            {errors.telegram && <div className="text-xs mt-1" style={{ color: theme.colors.error }}>{errors.telegram}</div>}
          </label>

          <label className="flex flex-col">
            <span className="text-sm mb-1" style={{ color: theme.colors.text }}>Reddit</span>
            <input
              id="reddit"
              name="reddit"
              type="text"
              placeholder="u/"
              value={reddit}
              onChange={(e) => { setReddit(e.target.value); setErrors(prev => { const p = { ...prev }; delete p.reddit; return p; }); }}
              className="p-2 rounded"
              style={{
                backgroundColor: theme.colors.background,
                border: `1px solid ${theme.colors.border}`,
                color: theme.colors.text
              }}
            />
            {errors.reddit && <div className="text-xs mt-1" style={{ color: theme.colors.error }}>{errors.reddit}</div>}
          </label>

          <label className="flex flex-col">
            <span className="text-sm mb-1" style={{ color: theme.colors.text }}>Other</span>
            <input
              id="other"
              name="other"
              type="text"
              placeholder="Link or @"
              value={other}
              onChange={(e) => { setOther(e.target.value); setErrors(prev => { const p = { ...prev }; delete p.other; return p; }); }}
              className="p-2 rounded"
              style={{
                backgroundColor: theme.colors.background,
                border: `1px solid ${theme.colors.border}`,
                color: theme.colors.text
              }}
            />
            {errors.other && <div className="text-xs mt-1" style={{ color: theme.colors.error }}>{errors.other}</div>}
          </label>

          <label className="flex flex-col">
            <span className="text-sm mb-1" style={{ color: theme.colors.text }}>Discord Username</span>
            <input
              id="discordUsername"
              name="discordUsername"
              type="text"
              placeholder="Link or @"
              value={discordUsername}
              onChange={(e) => { setDiscordUsername(e.target.value); setErrors(prev => { const p = { ...prev }; delete p.discordUsername; return p; }); }}
              className="p-2 rounded"
              style={{
                backgroundColor: theme.colors.background,
                border: `1px solid ${theme.colors.border}`,
                color: theme.colors.text
              }}
            />
            {errors.discordUsername && <div className="text-xs mt-1" style={{ color: theme.colors.error }}>{errors.discordUsername}</div>}
          </label>

          <label className="flex flex-col">
            <span className="text-sm mb-1" style={{ color: theme.colors.text }}>Telegram Username</span>
            <input
              id="telegramUsername"
              name="telegramUsername"
              type="text"
              placeholder="Link or @"
              value={telegramUsername}
              onChange={(e) => { setTelegramUsername(e.target.value); setErrors(prev => { const p = { ...prev }; delete p.telegramUsername; return p; }); }}
              className="p-2 rounded"
              style={{
                backgroundColor: theme.colors.background,
                border: `1px solid ${theme.colors.border}`,
                color: theme.colors.text
              }}
            />
            {errors.telegramUsername && <div className="text-xs mt-1" style={{ color: theme.colors.error }}>{errors.telegramUsername}</div>}
          </label>
        </div>

        <section className="mb-3 pb-2" style={{ borderBottom: `1px solid ${theme.colors.border}` }}>
          <h3 className="text-lg font-semibold">Profile Image</h3>
        </section>

        <div className="mb-4">
          <ProfileBanner imgUrl={imageUrlPreview || '/token-default-banner.JPG'} logoUrl={logoUrlPreview || '/default-avatar.png'} />
        </div>

        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <div className="flex-1">
            <input
              ref={fileInputRef}
              type="file"
              id="profileImageUpload"
              accept="image/*"
              onChange={(e) => { handleFileChange(e); setErrors(prev => { const p = { ...prev }; delete p.profileImage; return p; }); }}
              className="hidden"
              disabled={isSubmitting}
            />
            <Button type="button" onClick={() => fileInputRef.current?.click()} disabled={isSubmitting}>
              {selectedFile ? 'Change Image' : 'Upload Image'}
            </Button>
            {errors.profileImage && <div className="text-xs mt-1" style={{ color: theme.colors.error }}>{errors.profileImage}</div>}
            {selectedFile && <div className="text-xs mt-1" style={{ color: theme.colors.placeholder }}>Selected: {selectedFile.name}</div>}
          </div>

          <div className="flex-1">
            <input
              ref={logoInputRef}
              type="file"
              id="profileLogoUpload"
              accept="image/*"
              onChange={(e) => { handleLogoFileChange(e); setErrors(prev => { const p = { ...prev }; delete p.profileLogo; return p; }); }}
              className="hidden"
              disabled={isSubmitting}
            />
            <Button type="button" onClick={() => logoInputRef.current?.click()} disabled={isSubmitting}>
              {selectedLogoFile ? 'Change Logo' : 'Upload Logo'}
            </Button>
            {errors.profileLogo && <div className="text-xs mt-1" style={{ color: theme.colors.error }}>{errors.profileLogo}</div>}
            {selectedLogoFile && <div className="text-xs mt-1" style={{ color: theme.colors.placeholder }}>Selected: {selectedLogoFile.name}</div>}
          </div>
        </div>

        <section className="mb-3 pb-2" style={{ borderBottom: `1px solid ${theme.colors.border}` }}>
          <h3 className="text-lg font-semibold">Agreements</h3>
        </section>

        <div className="flex flex-col gap-2 mb-4">
          <label className="flex items-start gap-2">
            <input name="verifiable" type="checkbox" checked={verifiable} onChange={(e) => { setVerifiable(e.target.checked); setErrors(prev => { const p = { ...prev }; delete p.verifiable; return p; }); }} />
            <span className="text-sm">I understand that all supplied data must be verifiable through official channels such as website and socials.</span>
          </label>
          {errors.verifiable && <div className="text-xs mt-1" style={{ color: theme.colors.error }}>{errors.verifiable}</div>}

          <label className="flex items-start gap-2">
            <input name="norefund" type="checkbox" checked={noRefund} onChange={(e) => { setNoRefund(e.target.checked); setErrors(prev => { const p = { ...prev }; delete p.noRefund; return p; }); }} />
            <span className="text-sm">I understand that no refund shall be granted in case my Community Takeover order does not get approved.</span>
          </label>
          {errors.noRefund && <div className="text-xs mt-1" style={{ color: theme.colors.error }}>{errors.noRefund}</div>}

          <label className="flex items-start gap-2">
            <input name="rightReserve" type="checkbox" checked={rightReserve} onChange={(e) => { setRightReserve(e.target.checked); setErrors(prev => { const p = { ...prev }; delete p.rightReserve; return p; }); }} />
            <span className="text-sm">I understand and accept that MTH reserves the right to reject or modify the provided information.</span>
          </label>
          {errors.rightReserve && <div className="text-xs mt-1" style={{ color: theme.colors.error }}>{errors.rightReserve}</div>}
        </div>

        <div className="mb-4" style={{ backgroundColor: theme.colors.cardBackground, border: `1px solid ${theme.colors.border}`, padding: 12, borderRadius: theme.borderRadius }}>
          <h3 className="font-semibold mb-2">Order Summary</h3>
          <div className="grid grid-cols-2 gap-2 text-sm mb-3">
            <div>Product</div>
            <div className="text-right">Price</div>
            <div>Profile Claim price</div>
            <div className="text-right">0.01 ETH</div>
          </div>
          <div className="text-xs" style={{ color: theme.colors.placeholder }}>
            ETA: Submission will be verified by MTH. Average processing time after receiving payment is less than 24H.
          </div>
        </div>

        <div className="mb-4">
          <button
            type="button"
            onClick={(e) => handleSubmit(e)}
            disabled={isSubmitting}
            aria-busy={isSubmitting}
            className={`w-full md:w-auto inline-flex items-center justify-center gap-3 px-6 py-3 rounded-[10px] font-extrabold text-white transition-transform duration-200 ${
              isSubmitting ? 'opacity-60 cursor-not-allowed' : 'hover:-translate-y-0.5'
            }`}
            style={{
              // Tailwind-like gradient + border color from provided CSS
              background: 'linear-gradient(90deg, #34d399, #a3e635)',
              border: '1px solid #4ade80',
              boxShadow: '0 0 10px rgba(52, 211, 153, 0.25)',
              color: theme.colors.white,
            }}
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin -ml-1 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" aria-hidden>
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                </svg>
                <span>Processing...</span>
              </>
            ) : (
              <span>Pay via Helio</span>
            )}
          </button>
        </div>

        {statusMessage && (
          <div className="text-center font-semibold" style={{ color: messageType === 'error' ? theme.colors.error : theme.colors.primary }}>
            {statusMessage}
          </div>
        )}
      </form>
    </div>
  );
};

export default SubmitSocialsClaim;