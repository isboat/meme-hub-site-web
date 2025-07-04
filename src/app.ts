import React, { useState, useEffect, createContext, useContext } from 'react';
import { createRoot } from 'react-dom/client';
// Ensure @privy-io/react-auth is installed: npm install @privy-io/react-auth
import { PrivyProvider, usePrivy, useLogin, useLogout } from '@privy-io/react-auth';

// --- Context for User Data and API Mocking ---
const AppContext = createContext(null);

const AppProvider = ({ children }) => {
  const [currentUserProfile, setCurrentUserProfile] = useState(null);
  const [allUsers, setAllUsers] = useState([]);
  const [posts, setPosts] = useState([]);
  const [message, setMessage] = useState('');
  const [showMessageModal, setShowMessageModal] = useState(false);

  // Mock API calls
  const mockFetchUsers = async () => {
    // Simulate fetching users from a backend
    return [
      { id: 'user1', name: 'Alice Smith', bio: 'Passionate developer and avid reader.', profileImage: 'https://placehold.co/100x100/000000/FFFFFF?text=A', follows: ['user2'], links: { facebook: 'alicefb', twitter: 'alicetw' } },
      { id: 'user2', name: 'Bob Johnson', bio: 'Digital artist and tech enthusiast.', profileImage: 'https://placehold.co/100x100/000000/FFFFFF?text=B', follows: ['user1', 'user3'], links: { twitter: 'bobtw' } },
      { id: 'user3', name: 'Charlie Brown', bio: 'Content creator and gamer.', profileImage: 'https://placehold.co/100x100/000000/FFFFFF?text=C', follows: [], links: { facebook: 'charliefb' } },
    ];
  };

  const mockFetchPosts = async () => {
    // Simulate fetching posts from a backend
    return [
      { id: 'post1', userId: 'user1', content: 'Enjoying the new dark theme!', likes: ['user2'], timestamp: new Date().toISOString() },
      { id: 'post2', userId: 'user2', content: 'Just finished a new art piece. Check it out!', likes: [], timestamp: new Date().toISOString() },
      { id: 'post3', userId: 'user1', content: 'Learning about React hooks today.', likes: ['user3'], timestamp: new Date().toISOString() },
    ];
  };

  const mockUpdateUserProfile = async (userId, updates) => {
    // Simulate updating user profile on backend
    setAllUsers(prevUsers => prevUsers.map(user => user.id === userId ? { ...user, ...updates } : user));
    setCurrentUserProfile(prevProfile => prevProfile ? { ...prevProfile, ...updates } : null);
    return { success: true };
  };

  const mockToggleFollow = async (followerId, followeeId) => {
    setAllUsers(prevUsers => prevUsers.map(user => {
      if (user.id === followerId) {
        const isFollowing = user.follows.includes(followeeId);
        return {
          ...user,
          follows: isFollowing
            ? user.follows.filter(id => id !== followeeId)
            : [...user.follows, followeeId]
        };
      }
      return user;
    }));
    return { success: true };
  };

  const mockToggleLike = async (postId, userId) => {
    setPosts(prevPosts => prevPosts.map(post => {
      if (post.id === postId) {
        const isLiked = post.likes.includes(userId);
        return {
          ...post,
          likes: isLiked
            ? post.likes.filter(id => id !== userId)
            : [...post.likes, userId]
        };
      }
      return post;
    }));
    return { success: true };
  };

  useEffect(() => {
    const fetchData = async () => {
      const users = await mockFetchUsers();
      const postsData = await mockFetchPosts();
      setAllUsers(users);
      setPosts(postsData);
    };
    fetchData();
  }, []);

  const showModal = (msg) => {
    setMessage(msg);
    setShowMessageModal(true);
  };

  const hideModal = () => {
    setShowMessageModal(false);
    setMessage('');
  };

  return (
    <AppContext.Provider value={{
      currentUserProfile, setCurrentUserProfile,
      allUsers, setAllUsers,
      posts, setPosts,
      mockFetchUsers, mockFetchPosts, mockUpdateUserProfile, mockToggleFollow, mockToggleLike,
      showModal, hideModal, message, showMessageModal
    }}>
      {children}
    </AppContext.Provider>
  );
};

// --- Message Modal Component ---
const MessageModal = () => {
  const { message, showMessageModal, hideModal } = useContext(AppContext);

  if (!showMessageModal) return null;

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-gray-800 p-6 rounded-lg shadow-xl max-w-sm w-full text-white">
        <h3 className="text-lg font-semibold mb-4">Notification</h3>
        <p className="text-gray-300 mb-6">{message}</p>
        <button
          onClick={hideModal}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md transition duration-300"
        >
          Close
        </button>
      </div>
    </div>
  );
};

// --- Header Component ---
const Header = ({ onNavigate }) => {
  const { authenticated, user, logout } = usePrivy();
  const { showModal } = useContext(AppContext);

  const handleLogout = async () => {
    try {
      await logout();
      onNavigate('dashboard'); // Redirect to dashboard after logout
      showModal('Successfully logged out.');
    } catch (error) {
      console.error('Logout failed:', error);
      showModal('Logout failed. Please try again.');
    }
  };

  return (
    <header className="bg-gray-900 text-white p-4 shadow-md flex justify-between items-center fixed top-0 left-0 w-full z-10">
      <h1 className="text-2xl font-bold text-blue-400 cursor-pointer" onClick={() => onNavigate('dashboard')}>SocialApp</h1>
      <nav className="flex space-x-4">
        <button onClick={() => onNavigate('dashboard')} className="hover:text-blue-400 transition duration-200">Dashboard</button>
        {authenticated && (
          <>
            <button onClick={() => onNavigate('profile')} className="hover:text-blue-400 transition duration-200">My Profile</button>
            <button onClick={() => onNavigate('settings')} className="hover:text-blue-400 transition duration-200">Settings</button>
            <button onClick={handleLogout} className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-md transition duration-200">Logout</button>
          </>
        )}
        {!authenticated && (
          <button onClick={() => onNavigate('login')} className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-md transition duration-200">Login / Sign Up</button>
        )}
      </nav>
    </header>
  );
};

// --- Footer Component ---
const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-400 p-4 text-center text-sm mt-8 fixed bottom-0 left-0 w-full z-10">
      &copy; {new Date().getFullYear()} SocialApp. All rights reserved.
    </footer>
  );
};

// --- Post Card Component ---
const PostCard = ({ post, author, currentUserId }) => {
  const { mockToggleLike, showModal } = useContext(AppContext);
  const { authenticated } = usePrivy();

  const handleLike = async () => {
    if (!authenticated) {
      showModal('You must be logged in to like posts.');
      return;
    }
    await mockToggleLike(post.id, currentUserId);
  };

  const isLiked = post.likes.includes(currentUserId);

  return (
    <div className="bg-gray-800 p-4 rounded-lg shadow-md mb-4 border border-gray-700">
      <div className="flex items-center mb-3">
        <img src={author.profileImage} alt={author.name} className="w-10 h-10 rounded-full mr-3 border border-blue-400" />
        <div>
          <p className="font-semibold text-white">{author.name}</p>
          <p className="text-gray-400 text-sm">{new Date(post.timestamp).toLocaleString()}</p>
        </div>
      </div>
      <p className="text-gray-300 mb-4">{post.content}</p>
      <div className="flex items-center space-x-4">
        <button
          onClick={handleLike}
          className={`flex items-center text-sm px-3 py-1 rounded-full transition duration-300 ${isLiked ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-blue-500 hover:text-white'}`}
        >
          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
          </svg>
          {post.likes.length} Likes
        </button>
      </div>
    </div>
  );
};

// --- User Card Component ---
const UserCard = ({ user, currentUserId, onNavigate }) => {
  const { mockToggleFollow, showModal } = useContext(AppContext);
  const { authenticated } = usePrivy();

  const isFollowing = currentUserId && user.follows.includes(currentUserId); // Simplified check for demonstration

  const handleFollow = async () => {
    if (!authenticated) {
      showModal('You must be logged in to follow users.');
      return;
    }
    await mockToggleFollow(currentUserId, user.id);
  };

  return (
    <div className="bg-gray-800 p-4 rounded-lg shadow-md mb-4 flex items-center justify-between border border-gray-700">
      <div className="flex items-center">
        <img src={user.profileImage} alt={user.name} className="w-12 h-12 rounded-full mr-4 border border-blue-400" />
        <div>
          <p className="font-semibold text-white text-lg">{user.name}</p>
          <p className="text-gray-400 text-sm">{user.bio}</p>
        </div>
      </div>
      <div className="flex space-x-2">
        <button
          onClick={() => onNavigate('profile', user.id)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition duration-300"
        >
          View Profile
        </button>
        {currentUserId && currentUserId !== user.id && (
          <button
            onClick={handleFollow}
            className={`px-4 py-2 rounded-md transition duration-300 ${isFollowing ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'} text-white`}
          >
            {isFollowing ? 'Unfollow' : 'Follow'}
          </button>
        )}
      </div>
    </div>
  );
};

// --- Dashboard Component ---
const Dashboard = ({ onNavigate }) => {
  const { authenticated, user } = usePrivy();
  const { allUsers, posts } = useContext(AppContext);

  const currentUserId = user?.id || null; // Use Privy user ID for current user

  const getAuthor = (userId) => allUsers.find(u => u.id === userId) || { name: 'Unknown', profileImage: 'https://placehold.co/100x100/000000/FFFFFF?text=?' };

  return (
    <div className="min-h-screen bg-gray-900 text-white pt-20 pb-16">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-6 text-center text-blue-400">
          {authenticated ? `Welcome, ${user?.email || user?.phone_number || 'User'}!` : 'Welcome to SocialApp!'}
        </h2>

        {authenticated ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              <h3 className="text-2xl font-semibold mb-4 text-white">Recent Posts</h3>
              {posts.length > 0 ? (
                posts.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)).map(post => (
                  <PostCard key={post.id} post={post} author={getAuthor(post.userId)} currentUserId={currentUserId} />
                ))
              ) : (
                <p className="text-gray-400">No posts available.</p>
              )}
            </div>
            <div className="md:col-span-1">
              <h3 className="text-2xl font-semibold mb-4 text-white">Discover Users</h3>
              {allUsers.filter(u => u.id !== currentUserId).map(user => (
                <UserCard key={user.id} user={user} currentUserId={currentUserId} onNavigate={onNavigate} />
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-12 bg-gray-800 rounded-lg shadow-lg border border-gray-700">
            <p className="text-xl text-gray-300 mb-6">Explore profiles or log in to join the community!</p>
            <button
              onClick={() => onNavigate('login')}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-full text-lg shadow-lg transition duration-300 transform hover:scale-105"
            >
              Login / Sign Up
            </button>
            <div className="mt-8">
              <h3 className="text-2xl font-semibold mb-4 text-white">Browse Profiles (Anonymous)</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {allUsers.map(user => (
                  <UserCard key={user.id} user={user} currentUserId={currentUserId} onNavigate={onNavigate} />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// --- Profile Page Tabs ---
const OverviewTab = ({ userProfile }) => (
  <div className="p-6 bg-gray-800 rounded-lg shadow-lg border border-gray-700">
    <div className="flex items-center mb-6">
      <img src={userProfile.profileImage} alt={userProfile.name} className="w-24 h-24 rounded-full mr-6 border-4 border-blue-500 shadow-md" />
      <div>
        <h3 className="text-3xl font-bold text-white mb-2">{userProfile.name}</h3>
        <p className="text-gray-400 text-lg">{userProfile.bio}</p>
      </div>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-300">
      <p><span className="font-semibold text-blue-400">Followers:</span> {userProfile.followersCount || 0}</p>
      <p><span className="font-semibold text-blue-400">Following:</span> {userProfile.follows.length}</p>
      {/* Add more profile details here */}
    </div>
  </div>
);

const FollowsTab = ({ userProfile, allUsers, onNavigate }) => {
  const { authenticated, user } = usePrivy();
  const currentUserId = user?.id || null;

  const followedUsers = userProfile.follows.map(id => allUsers.find(u => u.id === id)).filter(Boolean);

  return (
    <div className="p-6 bg-gray-800 rounded-lg shadow-lg border border-gray-700">
      <h3 className="text-2xl font-semibold text-white mb-4">Following ({followedUsers.length})</h3>
      {followedUsers.length > 0 ? (
        followedUsers.map(followedUser => (
          <UserCard key={followedUser.id} user={followedUser} currentUserId={currentUserId} onNavigate={onNavigate} />
        ))
      ) : (
        <p className="text-gray-400">Not following anyone yet.</p>
      )}
    </div>
  );
};

const LinksTab = ({ userProfile }) => (
  <div className="p-6 bg-gray-800 rounded-lg shadow-lg border border-gray-700">
    <h3 className="text-2xl font-semibold text-white mb-4">Social Links</h3>
    {userProfile.links && Object.keys(userProfile.links).length > 0 ? (
      <ul className="space-y-3">
        {userProfile.links.facebook && (
          <li>
            <a href={`https://facebook.com/${userProfile.links.facebook}`} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline flex items-center">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24"><path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.262c-1.225 0-1.628.75-1.628 1.542V12h2.77l-.443 2.89h-2.327v6.987C18.343 21.128 22 16.991 22 12z"/></svg>
              Facebook: {userProfile.links.facebook}
            </a>
          </li>
        )}
        {userProfile.links.twitter && (
          <li>
            <a href={`https://twitter.com/${userProfile.links.twitter}`} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline flex items-center">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.594 0-6.494 2.902-6.494 6.495 0 .509.058 1.006.173 1.49-5.418-.273-10.213-2.863-13.428-6.817-.56.96-.883 2.077-.883 3.255 0 2.254 1.144 4.248 2.873 5.424-.847-.026-1.649-.26-2.35-.644v.08c0 3.159 2.243 5.797 5.216 6.402-.547.148-1.12.225-1.702.225-.418 0-.823-.041-1.22-.116.834 2.57 3.254 4.474 6.133 4.529-2.232 1.758-5.033 2.81-8.093 2.81-1.042 0-2.07-.061-3.085-.188C.893 20.25 3.327 21 6.096 21.002c7.32 0 11.304-6.07 11.304-11.306 0-.172-.004-.345-.012-.518C22.316 6.784 23.32 5.732 24 4.557z"/></svg>
              Twitter: {userProfile.links.twitter}
            </a>
          </li>
        )}
        {/* Add more social links as needed */}
      </ul>
    ) : (
      <p className="text-gray-400">No social links provided.</p>
    )}
  </div>
);

// --- Profile Page Component ---
const ProfilePage = ({ userId: propUserId, onNavigate }) => {
  const { authenticated, user } = usePrivy();
  const { allUsers, showModal } = useContext(AppContext);
  const [activeTab, setActiveTab] = useState('overview');
  const [userProfile, setUserProfile] = useState(null);
  const currentUserId = user?.id || null; // Privy user ID

  const targetUserId = propUserId || currentUserId; // If no propUserId, use current logged-in user

  useEffect(() => {
    if (targetUserId) {
      const foundUser = allUsers.find(u => u.id === targetUserId);
      if (foundUser) {
        setUserProfile(foundUser);
      } else {
        showModal('User not found.');
        onNavigate('dashboard'); // Redirect if user not found
      }
    } else if (!authenticated) {
      showModal('Please log in to view your profile.');
      onNavigate('login');
    } else {
      showModal('No user ID provided.');
      onNavigate('dashboard');
    }
  }, [targetUserId, allUsers, authenticated, onNavigate, showModal]);

  if (!userProfile) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center pt-20 pb-16">
        <p className="text-xl text-gray-400">Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white pt-20 pb-16">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center text-blue-400 mb-8">
          {userProfile.id === currentUserId ? 'My Profile' : `${userProfile.name}'s Profile`}
        </h2>

        <div className="bg-gray-800 rounded-lg shadow-xl p-6 mb-8 border border-gray-700">
          <div className="flex justify-center space-x-4 mb-6">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-6 py-3 rounded-full text-lg font-semibold transition duration-300 ${activeTab === 'overview' ? 'bg-blue-600 text-white shadow-lg' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('follows')}
              className={`px-6 py-3 rounded-full text-lg font-semibold transition duration-300 ${activeTab === 'follows' ? 'bg-blue-600 text-white shadow-lg' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
            >
              Follows
            </button>
            <button
              onClick={() => setActiveTab('links')}
              className={`px-6 py-3 rounded-full text-lg font-semibold transition duration-300 ${activeTab === 'links' ? 'bg-blue-600 text-white shadow-lg' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
            >
              Links
            </button>
          </div>

          <div>
            {activeTab === 'overview' && <OverviewTab userProfile={userProfile} />}
            {activeTab === 'follows' && <FollowsTab userProfile={userProfile} allUsers={allUsers} onNavigate={onNavigate} />}
            {activeTab === 'links' && <LinksTab userProfile={userProfile} />}
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Settings Page Component ---
const SettingsPage = ({ onNavigate }) => {
  const { authenticated, user } = usePrivy();
  const { currentUserProfile, setCurrentUserProfile, mockUpdateUserProfile, showModal } = useContext(AppContext);

  const [name, setName] = useState(currentUserProfile?.name || '');
  const [bio, setBio] = useState(currentUserProfile?.bio || '');
  const [profileImage, setProfileImage] = useState(currentUserProfile?.profileImage || 'https://placehold.co/100x100/000000/FFFFFF?text=P');
  const [facebookLink, setFacebookLink] = useState(currentUserProfile?.links?.facebook || '');
  const [twitterLink, setTwitterLink] = useState(currentUserProfile?.links?.twitter || '');

  useEffect(() => {
    if (!authenticated) {
      showModal('You must be logged in to access settings.');
      onNavigate('login');
      return;
    }
    // Update local state when currentUserProfile changes
    if (currentUserProfile) {
      setName(currentUserProfile.name || '');
      setBio(currentUserProfile.bio || '');
      setProfileImage(currentUserProfile.profileImage || 'https://placehold.co/100x100/000000/FFFFFF?text=P');
      setFacebookLink(currentUserProfile.links?.facebook || '');
      setTwitterLink(currentUserProfile.links?.twitter || '');
    } else if (user) {
      // If currentUserProfile is not set but Privy user exists, create a mock profile
      const defaultProfile = {
        id: user.id,
        name: user.email || user.phone_number || 'New User',
        bio: 'Hello, I am a new user!',
        profileImage: `https://placehold.co/100x100/000000/FFFFFF?text=${(user.email || 'N').charAt(0).toUpperCase()}`,
        follows: [],
        links: {}
      };
      setCurrentUserProfile(defaultProfile);
      setName(defaultProfile.name);
      setBio(defaultProfile.bio);
      setProfileImage(defaultProfile.profileImage);
      // Also add this new user to allUsers for other components to see
      // In a real app, this would be handled by backend user creation
      // setAllUsers(prev => [...prev, defaultProfile]); // This would be done by backend
    }
  }, [authenticated, user, currentUserProfile, onNavigate, showModal, setCurrentUserProfile]);


  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      showModal('You must be logged in to update settings.');
      return;
    }

    const updatedProfile = {
      name,
      bio,
      profileImage,
      links: {
        facebook: facebookLink,
        twitter: twitterLink,
      },
    };

    const result = await mockUpdateUserProfile(user.id, updatedProfile);
    if (result.success) {
      showModal('Profile updated successfully!');
    } else {
      showModal('Failed to update profile. Please try again.');
    }
  };

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center pt-20 pb-16">
        <p className="text-xl text-gray-400">Redirecting to login...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white pt-20 pb-16">
      <div className="container mx-auto px-4 max-w-2xl">
        <h2 className="text-4xl font-bold text-center text-blue-400 mb-8">Account Settings</h2>

        <form onSubmit={handleSubmit} className="bg-gray-800 p-8 rounded-lg shadow-xl border border-gray-700 space-y-6">
          <div>
            <label htmlFor="name" className="block text-gray-300 text-sm font-bold mb-2">Name</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="shadow appearance-none border border-gray-700 rounded-md w-full py-3 px-4 text-gray-200 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-700"
              placeholder="Your Name"
              required
            />
          </div>
          <div>
            <label htmlFor="bio" className="block text-gray-300 text-sm font-bold mb-2">Bio</label>
            <textarea
              id="bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows="4"
              className="shadow appearance-none border border-gray-700 rounded-md w-full py-3 px-4 text-gray-200 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-700"
              placeholder="Tell us about yourself..."
            ></textarea>
          </div>
          <div>
            <label htmlFor="profileImage" className="block text-gray-300 text-sm font-bold mb-2">Profile Image URL</label>
            <input
              type="url"
              id="profileImage"
              value={profileImage}
              onChange={(e) => setProfileImage(e.target.value)}
              className="shadow appearance-none border border-gray-700 rounded-md w-full py-3 px-4 text-gray-200 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-700"
              placeholder="https://example.com/your-image.jpg"
            />
            {profileImage && (
              <img src={profileImage} alt="Profile Preview" className="mt-4 w-24 h-24 rounded-full object-cover border-2 border-blue-500" />
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="facebookLink" className="block text-gray-300 text-sm font-bold mb-2">Facebook Link (username)</label>
              <input
                type="text"
                id="facebookLink"
                value={facebookLink}
                onChange={(e) => setFacebookLink(e.target.value)}
                className="shadow appearance-none border border-gray-700 rounded-md w-full py-3 px-4 text-gray-200 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-700"
                placeholder="facebook_username"
              />
            </div>
            <div>
              <label htmlFor="twitterLink" className="block text-gray-300 text-sm font-bold mb-2">Twitter Link (username)</label>
              <input
                type="text"
                id="twitterLink"
                value={twitterLink}
                onChange={(e) => setTwitterLink(e.target.value)}
                className="shadow appearance-none border border-gray-700 rounded-md w-full py-3 px-4 text-gray-200 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-700"
                placeholder="twitter_username"
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-md focus:outline-none focus:shadow-outline transition duration-300 transform hover:scale-105"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// --- Login Page Component ---
const LoginPage = ({ onNavigate }) => {
  const { loginWithEmail, loginWithPhone, authenticated } = usePrivy();
  const { showModal } = useContext(AppContext);

  useEffect(() => {
    if (authenticated) {
      onNavigate('dashboard'); // Redirect if already authenticated
    }
  }, [authenticated, onNavigate]);

  const handleLoginSuccess = () => {
    showModal('Login successful!');
    onNavigate('dashboard');
  };

  const handleLoginError = (error) => {
    console.error('Login error:', error);
    showModal(`Login failed: ${error.message || 'Unknown error'}`);
  };

  const { login } = useLogin({
    onSuccess: handleLoginSuccess,
    onError: handleLoginError,
  });

  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center pt-20 pb-16">
      <div className="bg-gray-800 p-8 rounded-lg shadow-xl max-w-md w-full border border-gray-700">
        <h2 className="text-3xl font-bold text-center text-blue-400 mb-6">Login / Sign Up</h2>
        <p className="text-gray-300 text-center mb-8">
          Sign in or create an account to unlock full features.
        </p>
        <div className="space-y-4">
          <button
            onClick={() => login()} // Privy's default login UI
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-md transition duration-300 transform hover:scale-105 shadow-lg"
          >
            Continue with Email / Phone
          </button>
          {/* You can add more specific login methods if Privy supports them directly and you want custom buttons */}
        </div>
      </div>
    </div>
  );
};


// --- Main App Component ---
const App = () => {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [profileViewId, setProfileViewId] = useState(null); // For viewing other profiles

  const handleNavigate = (page, userId = null) => {
    setCurrentPage(page);
    setProfileViewId(userId);
  };

  // Tailwind CSS dark theme setup
  useEffect(() => {
    document.documentElement.classList.add('dark');
    document.body.style.fontFamily = '"Inter", sans-serif';
  }, []);

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard onNavigate={handleNavigate} />;
      case 'profile':
        return <ProfilePage userId={profileViewId} onNavigate={handleNavigate} />;
      case 'settings':
        return <SettingsPage onNavigate={handleNavigate} />;
      case 'login':
        return <LoginPage onNavigate={handleNavigate} />;
      default:
        return <Dashboard onNavigate={handleNavigate} />;
    }
  };

  // Privy.io configuration
  const privyAppId = 'YOUR_PRIVY_APP_ID'; // Replace with your actual Privy App ID

  return (
    <PrivyProvider
      appId={privyAppId}
      config={{
        loginMethods: ['email', 'phone'],
        appearance: {
          theme: 'dark', // Ensures Privy's UI also matches dark theme
          accentColor: '#60A5FA', // Blue-400
          showWalletLoginFirst: false,
          logo: 'https://placehold.co/60x60/000000/FFFFFF?text=SA', // Optional: your app logo
        },
        // Add more configuration as needed
      }}
    >
      <AppProvider>
        <div className="min-h-screen bg-gray-900 text-white font-inter">
          <Header onNavigate={handleNavigate} />
          <main className="pt-16 pb-16"> {/* Adjust padding to account for fixed header/footer */}
            {renderPage()}
          </main>
          <Footer />
          <MessageModal />
        </div>
      </AppProvider>
    </PrivyProvider>
  );
};

export default App;

// Ensure Tailwind CSS is loaded
// This script tag needs to be in the HTML file where your React app is mounted.
// <script src="https://cdn.tailwindcss.com"></script>
