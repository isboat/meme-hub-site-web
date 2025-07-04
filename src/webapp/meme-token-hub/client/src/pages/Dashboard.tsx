import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useTheme } from '../context/ThemeContext';
import { usePrivy } from '@privy-io/react-auth';
import { Post, User } from '../types'; // Assuming you have Post and User types defined
import { useApi } from '../hooks/useApi';
import PostCard from '../components/common/PostCard';
import api from '../api/api';
import Input from '../components/common/Input';
import Button from '../components/common/Button';

const DashboardContainer = styled.div`
  max-width: 800px;
  margin: ${({ theme }) => theme.spacing.large} auto;
  padding: ${({ theme }) => theme.spacing.medium};
  background-color: ${({ theme }) => theme.colors.background};
  border-radius: ${({ theme }) => theme.borderRadius};
  box-shadow: ${({ theme }) => theme.boxShadow};
  color: ${({ theme }) => theme.colors.text};
`;

const WelcomeMessage = styled.h2`
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: ${({ theme }) => theme.spacing.medium};
`;

const PostCreationForm = styled.div`
  background-color: ${({ theme }) => theme.colors.cardBackground};
  padding: ${({ theme }) => theme.spacing.medium};
  border-radius: ${({ theme }) => theme.borderRadius};
  margin-bottom: ${({ theme }) => theme.spacing.large};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.medium};
`;

const PostList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.medium};
`;

const Dashboard: React.FC = () => {
  const { user } = usePrivy();
  const theme = useTheme();
  const { data: posts, loading: postsLoading, error: postsError, refetch: refetchPosts } = useApi<Post[]>('/posts/feed');
  const { data: currentUserDetails, refetch: refetchUserDetails } = useApi<User>(`/users/${user?.id}`, 'get', null, null, !user?.id); // Fetch current user's details for username etc.

  const [newPostContent, setNewPostContent] = useState<string>('');
  const [postCreating, setPostCreating] = useState<boolean>(false);
  const [postError, setPostError] = useState<string | null>(null);

  const handleCreatePost = async () => {
    if (!newPostContent.trim()) {
      setPostError('Post content cannot be empty.');
      return;
    }
    setPostCreating(true);
    setPostError(null);
    try {
      await api.post('/posts', { content: newPostContent });
      setNewPostContent('');
      refetchPosts(); // Refresh posts after creation
    } catch (err: any) {
      setPostError(err.response?.data?.message || 'Failed to create post.');
    } finally {
      setPostCreating(false);
    }
  };

  useEffect(() => {
    if (user?.id) {
      refetchUserDetails();
    }
  }, [user?.id, refetchUserDetails]);

  if (postsLoading) return <DashboardContainer theme={theme}>Loading feed...</DashboardContainer>;
  if (postsError) return <DashboardContainer theme={theme}>Error: {postsError}</DashboardContainer>;

  return (
    <DashboardContainer theme={theme}>
      <WelcomeMessage theme={theme}>Hello, {currentUserDetails?.username || user?.email?.address || 'User'}!</WelcomeMessage>

      <PostCreationForm theme={theme}>
        <Input
          type="textarea"
          placeholder="What's on your mind?"
          value={newPostContent}
          onChange={(e) => setNewPostContent(e.target.value)}
          rows={3}
        />
        <Button onClick={handleCreatePost} disabled={postCreating}>
          {postCreating ? 'Posting...' : 'Create Post'}
        </Button>
        {postError && <p style={{ color: theme.colors.error }}>{postError}</p>}
      </PostCreationForm>

      <PostList theme={theme}>
        {posts && posts.length > 0 ? (
          posts.map((post) => (
            <PostCard key={post._id} post={post} refetchPosts={refetchPosts} />
          ))
        ) : (
          <p>No posts yet. Start following users or create your first post!</p>
        )}
      </PostList>
    </DashboardContainer>
  );
};

export default Dashboard;