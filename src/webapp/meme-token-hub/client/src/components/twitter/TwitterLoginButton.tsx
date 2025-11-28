import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import { TwitterCallbackProps } from 'twitter-props';

const TwitterLoginButton: React.FC<TwitterCallbackProps> = ({ callbackType, buttonText }) => {
  const theme = useTheme();

  const handleLogin = async () => {
    const clientId = (import.meta.env as any).VITE_TWITTER_CLIENT_ID || '';
    if (!clientId) {
      alert('Twitter Client ID not configured. Please set VITE_TWITTER_CLIENT_ID in .env');
      return;
    }
    const redirectUri = `${window.location.origin}/twitter-callback`;
    const scope = 'tweet.read tweet.write users.read offline.access';
    const state = 'secure_random_state';

    const verifier = generateCodeVerifier();
    const challenge = await generateCodeChallenge(verifier);

    localStorage.setItem("pkce_verifier", verifier);
    localStorage.setItem("twitter_callback_props", JSON.stringify({ callbackType }));

    const params = new URLSearchParams({
      response_type: "code",
      client_id: clientId,
      redirect_uri: redirectUri,
      scope,
      state,
      code_challenge: challenge,
      code_challenge_method: "S256"
    });

    const authUrl = `https://twitter.com/i/oauth2/authorize?${params.toString()}`;
    window.location.href = authUrl;
  };

  const base64UrlEncode = (buffer: ArrayBuffer): string => {
    return Buffer.from(buffer)
      .toString("base64")
      .replace(/=/g, "")
      .replace(/\+/g, "-")
      .replace(/\//g, "_");
  }

  const generateCodeVerifier = (): string => {
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    return base64UrlEncode(array.buffer);
  }

  const generateCodeChallenge = async (verifier: string): Promise<string> => {
    const encoder = new TextEncoder();
    const data = encoder.encode(verifier);
    const digest = await crypto.subtle.digest("SHA-256", data);
    return base64UrlEncode(digest);
  }

  return (
    <button
      onClick={handleLogin}
      className="inline-flex items-center justify-center px-4 py-2 rounded-lg font-semibold text-sm transition-all duration-200 bg-gradient-to-r from-emerald-400 to-lime-400 text-gray-900 hover:opacity-90 hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0 disabled:opacity-60 disabled:cursor-not-allowed disabled:shadow-none disabled:translate-y-0"
    >
       {buttonText || 'Login with Twitter'}
    </button>
  );
};

export default TwitterLoginButton;
