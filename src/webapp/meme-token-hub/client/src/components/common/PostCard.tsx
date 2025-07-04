// client/src/components/PostCard.tsx
import React from 'react';
import styled from 'styled-components';
import { usePrivy } from '@privy-io/react-auth';
import { FaHeart, FaRegHeart, FaComment } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { Post, User } from '../../types';
import { useTheme } from '../../context/ThemeContext';
import { useApi } from '../../hooks/useApi';
import api from '../../api/api';

const Card = styled.div`
  background-color: ${({ theme }) => theme.colors.cardBackground};
  padding: ${({ theme }) => theme.spacing.medium};
  border-radius: ${({ theme }) => theme.borderRadius};
  box-shadow: ${({ theme }) => theme.boxShadow};
  margin-bottom: ${({ theme }) => theme.spacing.medium};
`;

const PostHeader = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.small};
  margin-bottom: ${({ theme }) => theme.spacing.small};
`;

const UserAvatar = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
  border: 1px solid ${({ theme }) => theme.colors.primary};
`;

const UsernameLink = styled(Link)`
  font-weight: bold;
  color: ${({ theme }) => theme.colors.text};
  &:hover {
    color: ${({ theme }) => theme.colors.primary};
    text-decoration: underline;
  }
`;

const PostContent = styled.p`
  margin-bottom: ${({ theme }) => theme.spacing.medium};
  color: ${({ theme }) => theme.colors.text};
`;

const PostActions = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.medium};
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  padding-top: ${({ theme }) => theme.spacing.small};
  margin-top: ${({ theme }) => theme.spacing.small};
`;

const ActionButton = styled.button`
  display: flex;
  align-items: center;
  gap: 5px;
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.placeholder};
  cursor: pointer;
  font-size: 1em;

  &:hover {
    color: ${({ theme }) => theme.colors.primary};
  }

  svg {
    font-size: 1.2em;
  }
`;

interface PostCardProps {
  post: Post;
  refetchPosts: () => void; // Callback to refresh posts after interaction
}

const PostCard: React.FC<PostCardProps> = ({ post, refetchPosts }) => {
  const theme = useTheme();
  const { user: privyUser, authenticated } = usePrivy();
  const { data: postUser, loading: userLoading, error: userError } = useApi<User>(`/users/${post.userId}`);

  const isLiked = authenticated && post.likes.includes(privyUser?.id || '');

  const handleLikeToggle = async () => {
    if (!authenticated) {
      alert('You must be logged in to like posts.');
      return;
    }
    try {
      if (isLiked) {
        await api.post(`/posts/${post._id}/unlike`);
      } else {
        await api.post(`/posts/${post._id}/like`);
      }
      refetchPosts(); // Refresh posts to show updated like count
    } catch (err) {
      console.error('Like/Unlike error:', err);
      alert('Failed to update like status.');
    }
  };

  if (userLoading) return <Card theme={theme}>Loading post...</Card>;
  if (userError) return <Card theme={theme}><p>Error loading post user: {userError}</p></Card>;
  if (!postUser) return <Card theme={theme}><p>Post user not found.</p></Card>;

  return (
    <Card theme={theme}>
      <PostHeader theme={theme}>
        <UserAvatar src={postUser.profileImage || '/default-avatar.png'} alt={postUser.username} theme={theme} />
        <UsernameLink to={`/profile/${postUser._id}`} theme={theme}>{postUser.username}</UsernameLink>
        <span style={{ fontSize: '0.8em', color: theme.colors.placeholder }}>
          {new Date(post.createdAt).toLocaleDateString()}
        </span>
      </PostHeader>
      <PostContent theme={theme}>{post.content}</PostContent>
      <PostActions theme={theme}>
        <ActionButton onClick={handleLikeToggle} theme={theme}>
          {isLiked ? <FaHeart color={theme.colors.error} /> : <FaRegHeart />}
          {post.likes.length}
        </ActionButton>
        <ActionButton theme={theme}>
          <FaComment />
          {post.comments.length}
        </ActionButton>
      </PostActions>
      {/* Comments section can be added here, with an input for new comments */}
    </Card>
  );
};

export default PostCard;