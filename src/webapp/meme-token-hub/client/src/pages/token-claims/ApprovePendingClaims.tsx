// client/src/pages/UpdateProfile.tsx
import React from 'react'; // Import useRef
import styled from 'styled-components';
import { useTheme } from '../../context/ThemeContext';
import { usePrivy } from '@privy-io/react-auth';
import { useNavigate, useParams } from 'react-router-dom';
import { useApi } from '../../hooks/useApi';
import Button from '../../components/common/Button';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { UserTokenSocialsClaim } from '../../types/token-components';
import CapsuleButton from '../../components/common/CapsuleButton';
import api from '../../api/api';

const PageContainer = styled.div`
  width: 100%;
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

const ApprovePendingSocialsClaim: React.FC = () => {

  const theme = useTheme();
  const navigate = useNavigate();
  const { tokenClaimId } = useParams<{ tokenClaimId: string }>();

  const { user: privyUser, authenticated } = usePrivy();

  const { data: pendingTokenClaim, loading } = useApi<UserTokenSocialsClaim>(`/token-profile/pending-tokenclaims/${tokenClaimId}`, 'get', null, null, !authenticated);

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

  if (!pendingTokenClaim) {
    return (
      <PageContainer theme={theme}>
        <Header theme={theme}>Pending Token Claim</Header>
        <Message theme={theme} type="error">
          There is no pending claim with ID {tokenClaimId}.
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

  const reject = async (event: React.MouseEvent<HTMLButtonElement>, claim: UserTokenSocialsClaim): Promise<void> => {
    event.preventDefault();
    // Call your API to reject the claim
    try {
      await api.post(`/token-profile/reject-tokensocialsclaim`, { claimId: claim.id });
      alert('Claim rejected successfully!');
    } catch (error) {
      console.error('Error rejecting claim: ', error);
      alert('Failed to reject claim. Please try again later.');
    }
  };

  const approve = async (event: React.MouseEvent<HTMLButtonElement>, claim: UserTokenSocialsClaim): Promise<void> => {
    event.preventDefault();
    // Call your API to approve the claim
    try {
      await api.post(`/token-profile/approve-tokensocialsclaim`, { claimId: claim.id });
      alert('Claim approved successfully!');
    } catch (error) {
      console.error('Error approving claim: ', error);
      alert('Failed to approve claim. Please try again later.');
    }
  };

  return (
    <PageContainer theme={theme}>
      <Header theme={theme}>Your awaiting approval Token Claims</Header>
      <div>
        <p>These are the token claims that are currently awaiting your approval.</p>
        <p>Once approved, the token claims will be processed accordingly.</p>
        <p>If you do not recognize a claim, you can reject it.</p>
        <p>Please review each claim carefully before making a decision.</p>
        <p>Once a claim is approved or rejected, you will be notified.</p>
        <p>If you have any questions about a claim, please contact support.</p>
        <p>Thank you for your attention to these matters.</p>
      </div>
      <div style={{ marginTop: theme.spacing.medium, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: theme.spacing.small, width: '50%', fontWeight: 'bold', borderBottom: `2px solid ${theme.colors.border}`, paddingBottom: theme.spacing.small, marginBottom: theme.spacing.medium }}>
        <div>Token</div>
        <div style={{ textAlign: 'end' }}>Actions</div>
      </div>

      {pendingTokenClaim != null ? (
        <div key={pendingTokenClaim.id} style={{ display: 'grid', width: '50%', gridTemplateColumns: '1fr 1fr', gap: theme.spacing.small, alignItems: 'center', borderBottom: `1px solid ${theme.colors.border}`, padding: theme.spacing.small }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: theme.spacing.small }}>
            <img src={pendingTokenClaim.bannerUrl} alt={pendingTokenClaim.tokenName} style={{ width: '50px', borderRadius: theme.borderRadius }} />
            <strong>{pendingTokenClaim.tokenName}</strong>
          </div>
          <div style={{ textAlign: 'end' }}>
            <CapsuleButton className="glow" key={pendingTokenClaim.id} onClick={(event) => { approve(event, pendingTokenClaim) }}>
              Approve Claim
            </CapsuleButton>
            <CapsuleButton className='selected' onClick={(event) => { reject(event, pendingTokenClaim) }}>
              Reject Claim
            </CapsuleButton>
          </div>
        </div>
      ) : (
        <Message theme={theme} type="error">
          There is no pending claim with ID {tokenClaimId}.
        </Message>
      )}
    </PageContainer >
  );
};

export default ApprovePendingSocialsClaim;