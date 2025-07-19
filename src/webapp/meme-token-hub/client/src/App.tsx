import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { usePrivy } from '@privy-io/react-auth';
import AuthPage from './pages/AuthOld';
import { Layout } from './components/layout/Layout';
import Profile from './pages/Profile';
import Dashboard from './pages/Dashboard';
import AnonymousHome from './pages/AnonymousHome';
import Settings from './pages/Settings';
import NotFound from './pages/NotFound';
import Home from './pages/Home';
import UnclaimedTokensFeed from './pages/UnclaimedTokensFeed';
import CreateProfile from './pages/CreateProfile';
import UserProfile from './pages/userprofile';
import KolProfiles from './pages/Kols';
import TokensFeed from './pages/Tokens';

const App: React.FC = () => {
  const { ready, authenticated } = usePrivy();

  if (!ready) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
          backgroundColor: '#1a202c', // Dark background
          color: '#cbd5e0', // Light text for loading
        }}
      >
        Loading Meme Token Hub...
      </div>
    );
  }

  return (
    <Routes>
      {/* Public Routes (accessible to all) */}
      <Route path="/auth" element={<AuthPage />} />
      <Route path="/profile/:userId" element={<Layout><Profile /></Layout>} /> {/* Anonymous can view profiles */}
      <Route path="/user-profile/:profileId" element={<Layout><UserProfile /></Layout>} /> {/* Anonymous can view profiles */}
      <Route path="/kol-profiles" element={<Layout><KolProfiles /></Layout>} /> {/* Anonymous can view profiles */}
      <Route path="/tokens" element={<Layout><TokensFeed /></Layout>} /> {/* Anonymous can view profiles */}
      <Route path="/" element={<Layout><Home /></Layout>} />
      <Route path="/unclaimed-tokens" element={<Layout><UnclaimedTokensFeed /></Layout>} /> {/* <--- ADD NEW ROUTE */}
      <Route path="/token/:tokenAddr" element={<Layout><div>Token Details Page (Coming Soon) for {":tokenAddr"}</div></Layout>} />
      {/* Route for submitting socials - adjust as per your backend route */}
      <Route path="/submit-socials" element={<Layout><div>Submit Socials Page (Coming Soon)</div></Layout>} />
      

      {authenticated ? (
        <>
          <Route path="/dashboard" element={<Layout><Dashboard /></Layout>} />
          <Route path="/create-profile" element={<Layout><CreateProfile /></Layout>} />
          <Route path="/settings" element={<Layout><Settings /></Layout>} />
          {/* Add more authenticated routes here */}
        </>
      ) : (
        // Redirect non-authenticated users from protected routes
        <Route path="*" element={<Layout><Home /></Layout> } />
      )}
      
      {/* Catch-all for 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default App;