import React, { useState }from 'react';
import { useLocation } from 'react-router-dom';
import api from '../../api/api';
import { TwitterCallbackProps } from './twitter-props';

const TwitterProfileVerification: React.FC = () => {
  // use state for verifying
    const [verified, setVerify] = useState(false);
    
  const location = useLocation();
  const callbackProps = (location.state as { callbackProps?: TwitterCallbackProps })?.callbackProps;

  api.put(`/profile/enable-verified`).then((response: any) => {
        if (response) {
          setVerify(true);
        }
      });


  if(!callbackProps) return <div>No callback properties provided.</div>;

  return (
    <>
    {verified && (
      <div>
        <h2>Profile verified</h2>
      </div>
    )}
    {!verified && (
      <div>
        <h2>Verifying profile...</h2>
      </div>
    )}
  </>
  );
};

export default TwitterProfileVerification;
