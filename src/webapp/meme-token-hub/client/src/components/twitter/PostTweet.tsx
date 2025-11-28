import React, { useState } from 'react';
import api from '../../api/api';

const PostTweet: React.FC = () => {
  const [text, setText] = useState('');
  const [isPosting, setIsPosting] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string>('');

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
    } catch (err: any) {
      console.error('Post tweet error', err);
      setError(err?.response?.data?.message || err?.message || 'Failed to post tweet');
    } finally {
      setIsPosting(false);
    }
  };

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

export default PostTweet;