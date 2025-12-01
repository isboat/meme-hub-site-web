import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApi } from '../../hooks/useApi';
import { useTheme } from '../../context/ThemeContext';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import api from '../../api/api';

const SubmitSocialsTweet: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [text, setText] = useState('');
  const [isPosting, setIsPosting] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string>('');
  const { claimId } = useParams<{ claimId: string }>();

  const { data: submittedClaim, loading, error: apiError } = useApi<any>(`/token-profile/pending-tokenclaims/${claimId}`);

  const handlePost = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setError('');
    setResult(null);

    const token = localStorage.getItem('twitter_token');
    if (!token) {
      setError('Twitter not connected. Please authenticate first.');
      return;
    }

    if (!text.trim()) {
      setError('Tweet text is required.');
      return;
    }

    setIsPosting(true);
    try {
      // Calling backend endpoint to post tweet. Adjust path if your API differs.
      // Backend should perform the call to Twitter API using the stored token.
      const payload = { text };
      const resp = await api.post(`/twitter/tweets/${token}`, payload);
      setResult(resp.data || resp);
      setText('');

      setTimeout(() => navigate(`/user-pending-socials-claims/${claimId}`), 1500);

    } catch (err: any) {
      console.error('Post tweet error', err);
      setError(err?.response?.data?.message || err?.message || 'Failed to post tweet');
    } finally {
      setIsPosting(false);
    }
  };

  useEffect(() => {
    setText(`@memetokenhub.fun declaring official token details for ${submittedClaim?.tokenName || ''} Community Token on MemeTokenHub. Claim ID ${claimId}.`);

  }, [setText, claimId, submittedClaim?.tokenName]);

  if (loading) {
    <div
      className="w-full max-w-4xl mx-auto p-4 sm:p-6 min-h-[calc(100vh-120px)] flex flex-col items-center box-border"
      style={{ backgroundColor: theme.colors.background, color: theme.colors.text }}
    >
      <h1 className="text-xl font-semibold mb-4" style={{ color: theme.colors.primary }}>
        Getting Pending Claims
      </h1>
      <LoadingSpinner />
      <p className="mt-3" style={{ color: theme.colors.placeholder }}>
        Loading data...
      </p>
    </div>
  }

  return (
    <div>
      <h3>Post a Tweet</h3>
      <form onSubmit={handlePost}>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="What's happening?"
          rows={4}
          style={{ width: '100%', padding: 8, borderRadius: 8, border: '1px solid #ccc' }}
          disabled={isPosting}
        />
        <pre style={{ marginTop: 8, whiteSpace: 'pre-wrap' }}>Your tweet will start with @memetokenhub.fun so we can spot it fast.</pre>
        <div style={{ marginTop: 8, display: 'flex', gap: 8, alignItems: 'center' }}>
          <button
            type="submit"
            disabled={isPosting}
            style={{
              padding: '8px 14px',
              borderRadius: 8,
              background: 'linear-gradient(90deg,#34d399,#a3e635)',
              color: '#07122a',
              fontWeight: 800,
              border: 'none',
              cursor: isPosting ? 'not-allowed' : 'pointer'
            }}
          >
            {isPosting ? 'Posting…' : 'Post Tweet'}
          </button>

          {error && <div style={{ color: 'crimson' }}>{error}</div>}
        </div>
      </form>

      {result && (
        <div style={{ marginTop: 12, padding: 12, borderRadius: 8, background: '#0b122018' }}>
          <div>Posted successfully.</div>
          <pre style={{ marginTop: 8, whiteSpace: 'pre-wrap' }}>{JSON.stringify(result, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default SubmitSocialsTweet;