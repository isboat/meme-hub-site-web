import React, { createContext, useState } from 'react';

interface AuthContextType {
  accessToken: string | null;
  setAccessToken: (token: string) => void;
}

export const TwitterAuthContext = createContext<AuthContextType>({
  accessToken: null,
  setAccessToken: () => {},
});

export const TwitterAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [accessToken, setAccessToken] = useState<string | null>(null);

  return (
    <TwitterAuthContext.Provider value={{ accessToken, setAccessToken }}>
      {children}
    </TwitterAuthContext.Provider>
  );
};
