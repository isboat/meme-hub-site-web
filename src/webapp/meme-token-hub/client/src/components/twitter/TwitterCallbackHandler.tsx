import React, { useEffect, useContext, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import { useNavigate } from 'react-router';
import api from '../../api/api';
import { TwitterCallbackProps } from 'twitter-props';


const TwitterCallbackHandler: React.FC = () => {

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [token, setToken] = useState<any>(null);

  useEffect(() => {
    const code = searchParams.get('code');

    if (code) {
      const verifier = localStorage.getItem("pkce_verifier") || "";

      const body = new URLSearchParams({
        code,
        RedirectUri: `${window.location.origin}/twitter-callback`,
        codeVerifier: verifier,
      });
      api.post('/twitter/oauth2/token', body, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }).then((response: any) => {
        if (response?.data?.access_token) {
          setToken(response.data.access_token);
          // Save access token for later use
          localStorage.setItem("twitter_token", response.data.access_token);

          const callbackProps = localStorage.getItem("twitter_callback_props");
          let callbackType = '';
          if (callbackProps) {
            try {
              const parsedProps = JSON.parse(callbackProps);
              callbackType = parsedProps.callbackType || '';

              if (callbackType === 'profileVerification') {
                
                navigate('/twitter-verification', { state: { callbackProps: parsedProps } });
                return;
              }
              
              navigate('/twitter-tweets');
            } catch (error) {
              console.error("Failed to parse twitter_callback_props:", error);
            }
          }
        }
      });
    }
  }, [searchParams, setToken]);
  return <div>Authenticating with Twitter...</div>;
};

export default TwitterCallbackHandler;
