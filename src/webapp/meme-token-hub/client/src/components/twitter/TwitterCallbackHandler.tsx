import React, { useEffect, useContext } from 'react';
import { useSearchParams } from 'react-router-dom';
import { TwitterAuthContext } from './TwitterAuthContext';

const TwitterCallbackHandler: React.FC = () => {
  const [searchParams] = useSearchParams();
  const { setAccessToken } = useContext(TwitterAuthContext);

  useEffect(() => {
    const code = searchParams.get('code');
    //const state = searchParams.get('state');

    if (code) {
      fetch('https://api.twitter.com/2/oauth2/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization: `Basic ${btoa('YOUR_CLIENT_ID:YOUR_CLIENT_SECRET')}`,
        },
        body: new URLSearchParams({
          grant_type: 'authorization_code',
          code,
          redirect_uri: 'http://localhost:3000/twitter-callback',
          code_verifier: 'challenge',
        }),
      })
        .then(res => res.json())
        .then(data => {
          setAccessToken(data.access_token);
        });
    }
  }, [searchParams, setAccessToken]);

  return <div>Authenticating with Twitter...</div>;
};

export default TwitterCallbackHandler;
