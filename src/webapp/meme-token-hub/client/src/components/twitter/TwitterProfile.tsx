import React, { useEffect, useState, useContext } from 'react';
import { TwitterAuthContext } from './TwitterAuthContext';

const TwitterProfile: React.FC = () => {
  const { accessToken } = useContext(TwitterAuthContext);
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    if (accessToken) {
      fetch('https://api.twitter.com/2/users/me', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
        .then(res => res.json())
        .then(data => setProfile(data));
    }
  }, [accessToken]);

  if (!profile) return <div>Loading profile...</div>;

  return (
    <div>
      <h2>{profile.data.name}</h2>
      <p>@{profile.data.username}</p>
      <p>ID: {profile.data.id}</p>
    </div>
  );
};

export default TwitterProfile;
