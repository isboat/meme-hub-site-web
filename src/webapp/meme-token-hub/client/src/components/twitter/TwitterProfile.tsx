import React, { useEffect, useState } from 'react';
import api from '../../api/api';

const TwitterProfile: React.FC = () => {
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    const token = localStorage.getItem("twitter_token");
    if (token) {
      api.get(`/twitter/users/me/${token}`)
        .then(data => setProfile(data.data));
    }
  }, []);

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
