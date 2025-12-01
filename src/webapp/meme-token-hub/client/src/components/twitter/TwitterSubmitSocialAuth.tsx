import React, { useState, useEffect }from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { TwitterCallbackProps } from './twitter-props';

const TwitterSubmitSocialAuth: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const callbackProps = (location.state as { callbackProps?: TwitterCallbackProps })?.callbackProps;

  if(!callbackProps) return <div>No callback properties provided.</div>;

  useEffect(()=>{
    navigate("/submit-socials-claim", { state: { twitterAuthSuccess: true } });

  }, [navigate]);

  return (
    <div>Redirecting to submit socials claim...</div>
  );
};

export default TwitterSubmitSocialAuth;
