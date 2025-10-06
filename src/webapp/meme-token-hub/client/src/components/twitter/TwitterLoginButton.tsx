import React from 'react';

const TwitterLoginButton: React.FC = () => {
  const handleLogin = () => {
    const clientId = 'YOUR_TWITTER_CLIENT_ID';
    const redirectUri = encodeURIComponent('http://localhost:3000/twitter-callback');
    const scope = encodeURIComponent('tweet.read users.read offline.access');
    const state = 'secure_random_state';

    const authUrl = `https://twitter.com/i/oauth2/authorize?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}&state=${state}&code_challenge=challenge&code_challenge_method=plain`;

    window.location.href = authUrl;
  };

  return <button onClick={handleLogin}>Login with Twitter</button>;
};

export default TwitterLoginButton;
