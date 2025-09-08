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

  const { data: userTokenClaims, loading } = useApi<UserTokenSocialsClaim[]>(`/token-profile/user-pending-tokenclaims`,'get',null,null,!authenticated);

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
    const pendingLink = `${window.location.origin}/claims-form?claimId=${claim.id}`;
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

      {userTokenClaims.length > 0 ? (
        <div style={{display: 'flex', flexDirection: 'column', gap: theme.spacing.small}}>
          {userTokenClaims.map(claim => (
            <div key={claim.id} style={{ display: 'flex', flexDirection: 'row', padding: theme.spacing.small, borderBottom: `1px solid ${theme.colors.border}` }}>
              <img src={claim.bannerUrl} alt={claim.tokenName} style={{ width: '100px', borderRadius: theme.borderRadius }} />
              <div style={{ display: 'flex', flexDirection: 'column', padding: theme.spacing.small }}>
                <strong>{claim.tokenName}</strong>
                <div>Total approvers: {claim.approvers.length}</div>
                <CapsuleButton className="glow" key={claim.id} onClick={(event) => { copyPendingLink(event, claim) }}>
                  Copy Pending Link
              </CapsuleButton>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <Message theme={theme} type="error">
          You have no pending claims.
        </Message>
      )}
    </PageContainer >
  );
};

export default UserPendingSocialsClaim;