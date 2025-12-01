import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useNavigate } from 'react-router';
import api from '../../api/api';


const TwitterCallbackHandler: React.FC = () => {

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [error, setError] = useState("");
  useEffect(() => {
    const code = searchParams.get('code');
    setError(searchParams.get('error') || "");

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
              
              if (callbackType === 'submitSocialAuth') {
                
                navigate('/twitter-submit-social-auth', { state: { callbackProps: parsedProps } });
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
  }, [searchParams]);

  if (error) {
      return <div>
        <h2>Twitter Authentication Failed</h2>
        <p>{error}</p>
        <button className="btn btn-primary inline-flex items-center justify-center px-4 py-2 rounded-lg font-semibold text-sm transition-all duration-200 bg-gradient-to-r from-emerald-400 to-lime-400 text-gray-900 hover:opacity-90 hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0 disabled:opacity-60 disabled:cursor-not-allowed disabled:shadow-none disabled:translate-y-0" 
          onClick={() => navigate('/')}>Go Home</button>
      </div>;
  }
  return <div>Authenticating with Twitter...</div>;
};

export default TwitterCallbackHandler;
