// client/src/pages/UpdateProfile.tsx
import React from 'react'; // Import useRef
import styled from 'styled-components';
import { useTheme } from '../../context/ThemeContext';
import { usePrivy } from '@privy-io/react-auth';
import { useNavigate } from 'react-router-dom';
import { useApi } from '../../hooks/useApi';
import Button from '../../components/common/Button';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { UserTokenSocialsClaim } from '../../types/token-components';
import CapsuleButton from '../../components/common/CapsuleButton';

const PageContainer = styled.div`
  width: 80%;
  margin: ${({ theme }) => theme.spacing.large} auto;
  padding: ${({ theme }) => theme.spacing.medium};
  background-color: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.text};
  border-radius: ${({ theme }) => theme.borderRadius};
  box-shadow: ${({ theme }) => theme.boxShadow};
  min-height: calc(100vh - 120px); /* Adjust for header/footer */
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Header = styled.h1`
  text-align: center;
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: ${({ theme }) => theme.spacing.large};
`;

// Corrected MessageProps interface
interface MessageProps {
  type: 'success' | 'error' | '';
}

const Message = styled.p<MessageProps>`
  text-align: center;
  margin-top: ${({ theme }) => theme.spacing.medium};
  font-weight: bold;
  color: ${({ type, theme }) =>
    type === 'error' ? theme.colors.error : theme.colors.primary};
`;

const UserPendingSocialsClaim: React.FC = () => {

  const theme = useTheme();
  const navigate = useNavigate();

  const { user: privyUser, authenticated } = usePrivy();

  const { data: userTokenClaims, loading } = useApi<UserTokenSocialsClaim[]>(`/token-profile/user-pending-tokenclaims`, 'get', null, null, !authenticated);

  if (!authenticated || !privyUser) {
    return (
      <PageContainer theme={theme}>
        <Header theme={theme}>Submit Claim</Header>
        <Message theme={theme} type="error">
          You must be logged in to access this page.
        </Message>
        <Button onClick={() => navigate('/auth')} style={{ marginTop: theme.spacing.medium }}>
          Log In
        </Button>
      </PageContainer>
    );
  }

  if (!userTokenClaims) {
    return (
      <PageContainer theme={theme}>
        <Header theme={theme}>Submit Claim</Header>
        <Message theme={theme} type="error">
          You have no pending claims.
        </Message>
      </PageContainer>
    );
  }

  if (loading) {
    return (
      <PageContainer theme={theme}>
        <Header theme={theme}>Getting Pending Claims</Header>
        <LoadingSpinner />
        <p style={{ textAlign: 'center', color: theme.colors.placeholder }}>Loading data...</p>
      </PageContainer>
    );
  }

  const copyPendingLink = (event: React.MouseEvent<HTMLButtonElement>, claim: UserTokenSocialsClaim): void => {
    event.preventDefault();
    const pendingLink = `${window.location.origin}/approve-socials-claims/${claim.id}`;
    navigator.clipboard.writeText(pendingLink).then(() => {
      alert('Pending link copied to clipboard!');
    }).catch(err => {
      console.error('Failed to copy link: ', err);
      alert('Failed to copy link. Please try manually.');
    });
  };

  return (
    <PageContainer theme={theme}>
      <Header theme={theme}>Your Pending Token Claims</Header>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: theme.spacing.small, width: '100%', fontWeight: 'bold', borderBottom: `2px solid ${theme.colors.border}`, paddingBottom: theme.spacing.small, marginBottom: theme.spacing.medium }}>
        <div>Token</div>
        <div style={{ textAlign: 'center' }}>Total Approvers</div>
        <div style={{ textAlign: 'end' }}>Actions</div>
      </div>
      {userTokenClaims.length > 0 ? (
        userTokenClaims.map(claim => (
          <div key={claim.id} style={{ display: 'grid', width: '100%', gridTemplateColumns: '1fr 1fr 1fr', gap: theme.spacing.small, alignItems: 'center', borderBottom: `1px solid ${theme.colors.border}`, padding: theme.spacing.small }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: theme.spacing.small }}>
              <img src={claim.bannerUrl} alt={claim.tokenName} style={{ width: '50px', borderRadius: theme.borderRadius }} />
              <strong>{claim.tokenName}</strong>
              </div>
            <div style={{ textAlign: 'center' }}>
              {claim.approvers.length}/3
            </div>
            <div style={{ textAlign: 'end' }}>
              <CapsuleButton className="glow" key={claim.id} onClick={(event) => { copyPendingLink(event, claim) }}>
                Copy Pending Link
              </CapsuleButton>
            </div>
          </div>
        ))
      ) : (
        <div>
          <div style={{ textAlign: 'center', padding: theme.spacing.small }}>
            You have no pending claims.
          </div>
        </div>
      )}
    </PageContainer>
  );
};

export default UserPendingSocialsClaim;