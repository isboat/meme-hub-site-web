// client/src/pages/UpdateProfile.tsx
import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import { usePrivy } from '@privy-io/react-auth';
import { useNavigate } from 'react-router-dom';
import { useApi } from '../../hooks/useApi';
import Button from '../../components/common/Button';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { UserTokenSocialsClaim } from '../../types/token-components';

const UserPendingSocialsClaim: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();

  const { user: privyUser, authenticated } = usePrivy();

  const { data: userTokenClaims, loading } = useApi<UserTokenSocialsClaim[]>
    (`/token-profile/user-pending-tokenclaims`, 'get', null, null, !authenticated);

  if (!authenticated || !privyUser) {
    return (
      <div
        className="w-full max-w-4xl mx-auto p-4 sm:p-6 min-h-[calc(100vh-120px)] flex flex-col items-center box-border"
        style={{ backgroundColor: theme.colors.background, color: theme.colors.text }}
      >
        <h1 className="text-2xl font-semibold mb-4" style={{ color: theme.colors.primary }}>
          Submit Claim
        </h1>
        <p className="font-semibold" style={{ color: theme.colors.error }}>
          You must be logged in to access this page.
        </p>
        <Button onClick={() => navigate('/auth')} className="mt-4">
          Log In
        </Button>
      </div>
    );
  }

  if (loading) {
    return (
      <div
        className="w-full max-w-4xl mx-auto p-4 sm:p-6 min-h-[calc(100vh-120px)] flex flex-col items-center box-border"
        style={{ backgroundColor: theme.colors.background, color: theme.colors.text }}
      >
        <h1 className="text-xl font-semibold mb-4" style={{ color: theme.colors.primary }}>
          Getting Pending Claims
        </h1>
        <LoadingSpinner />
        <p className="mt-3" style={{ color: theme.colors.placeholder }}>
          Loading data...
        </p>
      </div>
    );
  }

  if (!userTokenClaims || userTokenClaims.length === 0) {
    return (
      <div
        className="w-full max-w-4xl mx-auto p-4 sm:p-6 min-h-[calc(100vh-120px)] box-border"
        style={{ backgroundColor: theme.colors.background, color: theme.colors.text }}
      >
        <h1 className="text-2xl font-semibold mb-4" style={{ color: theme.colors.primary }}>
          Your Pending Token Claims
        </h1>
        <div
          className="rounded-md p-4 text-center"
          style={{ border: `1px solid ${theme.colors.border}`, backgroundColor: theme.colors.cardBackground }}
        >
          <p style={{ color: theme.colors.placeholder }}>You have no pending claims.</p>
        </div>
      </div>
    );
  }

  const copyPendingLink = (event: React.MouseEvent<HTMLButtonElement>, claim: UserTokenSocialsClaim): void => {
    event.stopPropagation();
    event.preventDefault();
    const pendingLink = `${window.location.origin}/approve-socials-claims/${claim.id}`;
    navigator.clipboard
      .writeText(pendingLink)
      .then(() => {
        alert('Pending link copied to clipboard!');
      })
      .catch(err => {
        console.error('Failed to copy link: ', err);
        alert('Failed to copy link. Please try manually.');
      });
  };

  return (
    <div
      className="w-full max-w-6xl mx-auto p-4 sm:p-6 min-h-[calc(100vh-120px)] box-border"
      style={{ backgroundColor: theme.colors.background, color: theme.colors.text }}
    >
      <header className="mb-6">
        <h1 className="text-2xl font-bold" style={{ color: theme.colors.primary }}>
          Your Pending Token Claims
        </h1>
        <p className="mt-1 text-sm" style={{ color: theme.colors.placeholder }}>
          Manage and share links for tokens awaiting approval.
        </p>
      </header>

      {/* Responsive grid of cards */}
      <div id="pendingGrid" className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {userTokenClaims.map((claim) => {
          const banner = claim.bannerUrl || '/token-default-banner.JPG';
          const logo = claim.logoUrl || claim.bannerUrl || '/default-avatar.png';
          return (
            <article
              key={claim.id}
              role="button"
              tabIndex={0}
              onClick={() => navigate(`/approve-socials-claims/${claim.id}`)}
              className="card bg-transparent rounded-lg border transition cursor-pointer hover:shadow-lg hover:-translate-y-1"
              style={{
                border: `1px solid ${theme.colors.border}`,
                overflow: 'hidden',
                backgroundColor: theme.colors.cardBackground,
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') navigate(`/approve-socials-claims/${claim.id}`);
              }}
              aria-label={`${claim.tokenName} pending claim`}
            >
              <div
                className="h-28 w-full bg-cover bg-center"
                style={{
                  backgroundImage: `url('${banner}')`,
                  borderBottom: `1px solid ${theme.colors.border}`,
                }}
                aria-hidden
              />

              <div className="p-4 flex items-start gap-3">
                <img
                  src={logo}
                  alt={`${claim.tokenName} logo`}
                  className="w-12 h-12 rounded-full object-cover ring-1 flex-shrink-0"
                  style={{ borderColor: theme.colors.border, boxShadow: 'rgba(0,0,0,0.06) 0px 1px 2px' }}
                />

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3
                      className="text-sm font-semibold truncate"
                      style={{ color: theme.colors.text }}
                      title={claim.tokenName}
                    >
                      {claim.tokenName}
                    </h3>
                  </div>

                  <div className="mt-1 text-xs" style={{ color: theme.colors.placeholder }}>
                    Chain: {claim.chain ?? 'Unknown'}
                  </div>
                </div>

                <div className="ml-3 flex flex-col items-end gap-2">
                  <span
                    className="badge px-2 py-1 text-xs rounded-md"
                    style={{
                      border: `1px solid ${theme.colors.warning}40`,
                      backgroundColor: `${theme.colors.warning}14` || 'rgba(245, 158, 11, 0.08)',
                      color: theme.colors.warning,
                    }}
                  >
                    Pending
                  </span>

                  <button
                    onClick={(e) => copyPendingLink(e as any, claim)}
                    className="text-xs px-3 py-1 rounded-md font-medium transition-colors"
                    style={{
                      border: `1px solid ${theme.colors.border}`,
                      backgroundColor: theme.colors.background,
                      color: theme.colors.text,
                    }}
                    aria-label={`Copy pending link for ${claim.tokenName}`}
                  >
                    Copy
                  </button>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
};

export default UserPendingSocialsClaim;