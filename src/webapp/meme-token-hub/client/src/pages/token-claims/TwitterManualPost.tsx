import React, { useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { usePrivy } from '@privy-io/react-auth';
import { useLocation, useNavigate } from 'react-router-dom';
import Button from '../../components/common/Button';

const STORAGE_ITEM = "submitsocialtokendata";

const TwitterManualPost: React.FC = () => {
    const theme = useTheme();
    const navigate = useNavigate();
    const location = useLocation();
    const { user: privyUser, authenticated } = usePrivy();

    const tokenDataFromState = (location.state as { token?: any })?.token;
    const mthid = (location.state as { mthid?: any })?.mthid;
    const communityRoles = (location.state as { communityRoles?: any })?.communityRoles;
    const [tokenData, setTokenData] = useState<any>(tokenDataFromState || null);
    const [mthidState] = useState<any>(mthid || null);
    const [communityRolesState] = useState<any>(communityRoles || null);
    const [message, setMessage] = useState<string>('');
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        // load stored tokenData if not passed in state
        if (!tokenData) {
            const stored = localStorage.getItem(STORAGE_ITEM);
            if (stored) {
                try {
                    setTokenData(JSON.parse(stored));
                } catch {
                    // ignore
                }
            }
        }
    }, [tokenData]);

    const roleMap = {
        dev: 'Developer',
        teamrep: 'Team Representative',
        officialx: 'Official X Account',
        mod: 'Moderator',
        cm: 'Community Manager'
    };

    const getRoleNames = (roles: (keyof typeof roleMap)[] | undefined) => {
        if (!roles) return [];
        return roles.map(r => roleMap[r] || r);
    }

    useEffect(() => {
        const name = tokenData?.name || 'Your Token';
        const addr = tokenData?.address ? `CA: ${tokenData.address}` : '';
        const mthid = `MTH Claim ID: ${mthidState?.id || 'N/A'}`;
        const roles = `Role(s): ${communityRolesState?.length ? getRoleNames(communityRolesState).join(', ') : 'None'}`;
        const defaultMsg = `official profile claim submitted on @memeTokenHub fun\n Token: ${name}\n\n${addr}\n\n ${mthid}\n\nhttps://memeTokenHub.fun/tokens/${tokenData?.address} \n\n ${roles}\n #MemeTokenHub #CommunityToken`;
        setMessage(defaultMsg);
    }, [tokenData, mthidState, communityRolesState]);
    if (!authenticated || !privyUser) {
        return (
            <div
                className="w-full max-w-4xl mx-auto p-6 min-h-[calc(100vh-120px)] flex flex-col items-center"
                style={{ backgroundColor: theme.colors.background, color: theme.colors.text }}
            >
                <h1 className="text-2xl font-semibold mb-4" style={{ color: theme.colors.primary }}>Post Verification Tweet</h1>
                <p className="font-semibold" style={{ color: theme.colors.error }}>You must be logged in to access this page.</p>
                <Button onClick={() => navigate('/auth')} className="mt-4">Log In</Button>
            </div>
        );
    }

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(message);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch {
            // fallback for older browsers
            const ta = document.createElement('textarea');
            ta.value = message;
            document.body.appendChild(ta);
            ta.select();
            try { document.execCommand('copy'); setCopied(true); setTimeout(() => setCopied(false), 2000); } catch { }
            document.body.removeChild(ta);
        }
    };

    return (
        <div
            className="w-full max-w-4xl mx-auto p-4 sm:p-6 min-h-[calc(100vh-120px)]"
            style={{ backgroundColor: theme.colors.background, color: theme.colors.text }}
        >
            <header className="mb-4">
                <h1 className="text-2xl font-semibold" style={{ color: theme.colors.primary }}>Post Verification Tweet</h1>
                <p className="text-sm" style={{ color: theme.colors.placeholder }}>
                    Copy the message below and post it manually. This tweet will be used as proof to verify community ownership.
                </p>
            </header>

            <div
                className="w-full rounded-lg"
                style={{
                    backgroundColor: theme.colors.cardBackground,
                    boxShadow: theme.boxShadow,
                    borderRadius: theme.borderRadius,
                    padding: 12
                }}
            >
                <label className="block mb-2 text-sm" style={{ color: theme.colors.placeholder }}>Message to post</label>
                <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={6}
                    className="w-full p-3 rounded mb-3"
                    style={{ backgroundColor: theme.colors.background, border: `1px solid ${theme.colors.border}`, color: theme.colors.text }}
                />

                <div className="flex gap-3 items-center">
                    <button
                        onClick={handleCopy}
                        className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all duration-200 ${copied ? 'opacity-80' : 'hover:-translate-y-0.5'}`}
                        style={{
                            background: 'linear-gradient(90deg, #34d399, #a3e635)',
                            color: '#07122a',
                            border: `1px solid ${theme.colors.primary}`
                        }}
                    >
                        {copied ? 'Copied' : 'Copy'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TwitterManualPost;