import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { usePrivy } from '@privy-io/react-auth';
import { Layout } from './components/layout/Layout';
import Profile from './pages/Profile';
import Dashboard from './pages/Dashboard';
import Settings from './pages/Settings';
import NotFound from './pages/NotFound';
import Home from './pages/Home';
import UnclaimedTokensFeed from './pages/UnclaimedTokensFeed';
import CreateProfile from './pages/CreateProfile';
import KolProfiles from './pages/Kols';
import TokensFeed from './pages/Tokens';
import FAQ from './pages/FAQ';
import AboutUs from './pages/AboutUs';
import UpdateProfile from './pages/UpdateProfile';
import UpdateProfileSocials from './pages/UpdateProfileSocials';
import AuthPage from './pages/Auth';
import UserProfile from './pages/UserProfile';
import TokenProfilePage from './pages/TokenProfile';
import CreatedTokensFeed from './pages/CreatedTokens';
import SubmitSocialsClaim from './pages/SubmitSocialsClaim';

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
      <Route path="/faq" element={<Layout><FAQ /></Layout>} /> {/* ADD THIS LINE */}
      <Route path="/about-us" element={<Layout><AboutUs /></Layout>} />
      <Route path="/auth" element={<Layout><AuthPage /></Layout>} />
      <Route path="/profile/:userId" element={<Layout><Profile /></Layout>} /> {/* Anonymous can view profiles */}
      <Route path="/user-profile/:profileId" element={<Layout><UserProfile /></Layout>} /> {/* Anonymous can view profiles */}
      <Route path="/kol-profiles" element={<Layout><KolProfiles /></Layout>} /> {/* Anonymous can view profiles */}
      <Route path="/tokens" element={<Layout><TokensFeed /></Layout>} /> {/* Anonymous can view profiles */}
      <Route path="/" element={<Layout><Home /></Layout>} />
      <Route path="/unclaimed-tokens" element={<Layout><UnclaimedTokensFeed /></Layout>} /> {/* <--- ADD NEW ROUTE */}
      <Route path="/token/:tokenAddr" element={<Layout><TokenProfilePage /></Layout>} />
      <Route path="/created-tokens" element={<Layout><CreatedTokensFeed /></Layout>} />
      
      {/* Authenticated Routes */}
      {/* Route for submitting socials - adjust as per your backend route */}
      <Route path="/submit-socials-claim" element={<Layout><SubmitSocialsClaim /></Layout>} />


      {authenticated ? (
        <>
          <Route path="/dashboard" element={<Layout><Dashboard /></Layout>} />
          <Route path="/create-profile" element={<Layout><CreateProfile /></Layout>} />
          <Route path="/settings" element={<Layout><Settings /></Layout>} />
          <Route path="/update-profile" element={<Layout><UpdateProfile /></Layout>} />
          <Route path="/update-socials" element={<Layout><UpdateProfileSocials /></Layout>} />
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