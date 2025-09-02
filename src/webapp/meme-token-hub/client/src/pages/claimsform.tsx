import React, { useState, useRef, ChangeEvent, FormEvent, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styled from 'styled-components';
import { useTheme } from '../context/ThemeContext';
import { NetworkTokenData, User } from "../types";
import { useApi } from "../hooks/useApi";
import { usePrivy } from "@privy-io/react-auth";
import Button from "../components/common/Button";
import LoadingSpinner from "../components/common/LoadingSpinner";
import axios from "axios";
import api from "../api/api";
import CapsuleButton from "../components/common/CapsuleButton";

type Step = 1 | 2 | 3 | 4 | 5 | 6;

const CHAINS = [
    "Ethereum", "Solana", "Base", "BNB Chain", "Polygon", "Arbitrum", "Others"
];

const ClaimTokenProfile: React.FC = () => {
    const theme = useTheme();
    const navigate = useNavigate();
    const location = useLocation();

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [statusMessage, setStatusMessage] = useState('');
    const [messageType, setMessageType] = useState<'success' | 'error' | ''>('');

    console.log(isSubmitting, statusMessage, messageType);

    const [step, setStep] = useState<Step>(1);
    const [descCount, setDescCount] = useState(0);
    const [showError, setShowError] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [review, setReview] = useState<string>("");
    const [msg, setMsg] = useState<string>("Message: (click “Generate Message”)");
    const [dnsVal, setDnsVal] = useState<string>("mth-verify=XXXX");
    const formRef = useRef<HTMLFormElement>(null);

    // Form state
    const [form, setForm] = useState<Record<string, any>>({
        allowMemes: true,
        allowPolls: true,
    });

    const { user: privyUser, authenticated } = usePrivy();

    const { data: currentUser, loading } = useApi<User>(
        `/users/${privyUser?.id}`,
        'get',
        null,
        null,
        !authenticated
    );

    const tokenData = (location.state as { token?: NetworkTokenData })?.token;

    // Effect to populate form fields and initial image preview
    useEffect(() => {
        if (tokenData) {
            //setUsername(tokenData.name || '');
            //setBio('add/update description');
            //setUserId(currentUser?._id || '');
        }
    }, [tokenData]);

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

    if (!currentUser) {
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

    if (loading) {
        return (
            <PageContainer theme={theme}>
                <Header theme={theme}>Submit Claim</Header>
                <LoadingSpinner />
                <p style={{ textAlign: 'center', color: theme.colors.placeholder }}>Loading data...</p>
            </PageContainer>
        );
    }

    // Handle input changes
    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        setForm(f => ({
            ...f,
            [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value
        }));
        if (name === "description") setDescCount(value.length);
    };

    // Step navigation
    const nextStep = () => {
        const next = Math.min(step + 1, 6) as Step;
        if (validateStep(step)) setStep(next);
    };
    const prevStep = () => {
        const previous = Math.max(step - 1, 1) as Step;
        setStep(previous);
    };

    // Validators
    const ethRegex = /^0x[a-fA-F0-9]{40}$/;
    const solRegex = /^[1-9A-HJ-NP-Za-km-z]{32,44}$/;
    function validateAddress(chain: string, addr: string) {
        if (!addr) return false;
        if (chain === "Solana") return solRegex.test(addr);
        return ethRegex.test(addr);
    }
    function validateStep(n: Step) {
        let ok = true;
        if (n === 1) {
            const req = ["projectName", "symbol", "chain", "contract", "email", "description"];
            req.forEach(id => {
                if (!form[id] || !String(form[id]).trim()) {
                    ok = false;
                    alert(`Please fill out the ${id} field.`);
                }
            });
            if (!validateAddress(form.chain, form.contract || "")) {
                //ok = false;
                //alert("Please enter a valid contract/mint address for the selected chain.");
            }
        }
        if (n === 2) {
            const req = ["website", "twitter"];
            req.forEach(id => {
                if (!form[id] || !String(form[id]).trim()) {
                    ok = false;
                    alert(`Please fill out the ${id} field.`);
                }
            });
        }
        if (n === 4) {
            if (!form.teamName || !String(form.teamName).trim()) {
                ok = false;
                alert(`Please fill out the team name field.`);
            }
        }
        return ok;
    }

    // Message generator for wallet-sign
    const handleGenMsg = () => {
        const contract = (form.contract || "").trim();
        const name = (form.projectName || "").trim();
        const ts = new Date().toISOString();
        const message = `MemeTokenHub claim for ${name || "(unnamed)"} — ${contract || "(no contract)"} @ ${ts}`;
        setMsg("Message: " + message);
        setDnsVal("mth-verify=" + Math.random().toString(36).slice(2, 10));
    };

    // Review generator
    const handleGenReview = () => {
        const lines = [];
        lines.push(`Project: ${form.projectName || "-"} (${form.symbol || "-"})`);
        lines.push(`Chain: ${form.chain || "-"}`);
        lines.push(`Contract: ${form.contract || "-"}`);
        lines.push(`Email: ${form.email || "-"}`);
        lines.push(`Description: ${form.description || "-"}`);
        lines.push(`Website: ${form.website || "-"}`);
        lines.push(`Twitter: ${form.twitter || "-"}`);
        if (form.telegram) lines.push(`Telegram: ${form.telegram}`);
        if (form.discord) lines.push(`Discord: ${form.discord}`);
        if (form.whitepaper) lines.push(`Docs: ${form.whitepaper}`);
        if (form.verifyPost) lines.push(`Verification Post: ${form.verifyPost}`);
        if (form.domain) lines.push(`DNS Domain: ${form.domain}`);
        lines.push(`Team: ${form.teamName || "-"}${form.contactTel ? " — " + form.contactTel : ""}`);
        if (form.teamTwitter) lines.push(`Team Twitter: ${form.teamTwitter}`);
        if (form.github) lines.push(`GitHub: ${form.github}`);
        if (form.dune) lines.push(`Analytics: ${form.dune}`);
        if (form.transparency) lines.push(`Transparency Wallets: ${form.transparency}`);
        lines.push(`Branding: ${form.tagline || "(no tagline)"}`);
        if (form.ctaBuy) lines.push(`DEX CTA: ${form.ctaBuy}`);
        if (form.ctaDocs) lines.push(`Docs CTA: ${form.ctaDocs}`);
        lines.push(`Allow Memes: ${form.allowMemes ? "Yes" : "No"}`);
        lines.push(`Enable Polls: ${form.allowPolls ? "Yes" : "No"}`);
        setReview(lines.join("\n"));
    };

    // Submit
    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (!authenticated || !privyUser) {
            setStatusMessage('You must be logged in to update your profile.');
            setMessageType('error');
            return;
        }

        setIsSubmitting(true);
        setStatusMessage('');
        setMessageType('');

        const requiredSteps: Step[] = [1, 2, 4];
        let ok = requiredSteps.every(s => validateStep(s));
        if (!form.tos) ok = false;
        setShowError(!ok);
        setShowSuccess(ok);

        try {
            const response = await api.put<User>('/token-profile/submit-socials', form, {
                headers: {
                    'Content-Type': 'multipart/form-data', // Crucial for FormData
                },
            });

            setStatusMessage('Profile updated successfully!' + response.status);
            setMessageType('success');
            // Redirect to profile page after a short delay to show success message
            setTimeout(() => navigate(`/profile/${privyUser.id}`), 1500);

        } catch (err: unknown) {
            console.error('Profile update error:', err);
            let errorMessage = 'Failed to update profile.';
            if (axios.isAxiosError(err)) {
                errorMessage = err.response?.data?.message || err.message;
            } else if (typeof err === 'object' && err !== null && err instanceof Error) {
                errorMessage = err.message;
            } else {
                errorMessage = String(err);
            }
            setStatusMessage(`Error: ${errorMessage}`);
            setMessageType('error');
        } finally {
            setIsSubmitting(false);
        }
    };

    // Progress dots
    const dots = Array.from({ length: 6 }, (_, i) => (
        <div key={i} className={`dot${i < step ? " active" : ""}`} style={{
            height: 6, borderRadius: 6, background: i < step ? "linear-gradient(90deg,#6cf,#9ee1ff)" : "#203446",
            border: "1px solid #1d2733"
        }} />
    ));

    return (
        <PageContainer theme={theme}>
            <Header theme={theme}>Claim Your Token</Header>
            <FormDiv theme={theme}>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(6,1fr)", gap: 8, margin: "14px 0" }} aria-hidden="true">
                    {dots}
                </div>
                <form ref={formRef} onSubmit={handleSubmit} noValidate>
                    {/* 1. Project basics */}
                    <section className={`section${step === 1 ? " active" : ""}`}  style={{ display: step === 1 ? "block" : "none", margin: "18px 0" }}>
                        <FormSectionHeader theme={theme}>Project Basics</FormSectionHeader>
                        <FormGroup theme={theme} style={{ gridTemplateColumns: "1fr 1fr" }}>
                            <FormField theme={theme}>
                                <FormLabel htmlFor="projectName" theme={theme}>Project / Token Name *</FormLabel>
                                <FormInput theme={theme} id="projectName" name="projectName" type="text" required placeholder="Infinite Money Glitch" value={form.projectName || ""} onChange={handleChange} />
                            </FormField>
                            <FormField theme={theme}>
                                <FormLabel theme={theme} htmlFor="symbol">Symbol / Ticker *</FormLabel>
                                <FormInput theme={theme} id="symbol" name="symbol" type="text" required placeholder="GLITCH" value={form.symbol || ""} onChange={handleChange} />
                            </FormField>
                        </FormGroup>
                        <FormGroup theme={theme} style={{ gridTemplateColumns: "1fr 1fr 1fr" }}>
                            <FormField theme={theme}>
                                <FormLabel htmlFor="chain" theme={theme}>Blockchain *</FormLabel>
                                <select id="chain" name="chain" required value={form.chain || ""} onChange={handleChange}>
                                    <option value="">Select chain</option>
                                    {CHAINS.map(c => <option key={c}>{c}</option>)}
                                </select>
                            </FormField>
                            <FormField theme={theme}>
                                <FormLabel htmlFor="contract" theme={theme}>Contract Address *</FormLabel>
                                <FormInput theme={theme} id="contract" name="contract" type="text" required placeholder="0x..." value={form.contract || ""} onChange={handleChange} />
                                <div style={{ fontSize: 12, color: "#8aa0b5" }}>For Solana, paste the mint address.</div>
                            </FormField>
                            <FormField theme={theme}>
                                <FormLabel htmlFor="email" theme={theme}>Contact Email *</FormLabel>
                                <FormInput theme={theme} id="email" name="email" type="email" required placeholder="team@yourproject.xyz" value={form.email || ""} onChange={handleChange} />
                            </FormField>
                        </FormGroup>
                        <FormGroup theme={theme}>
                            <FormField theme={theme}>
                                <FormLabel htmlFor="description" theme={theme}>Short Description *</FormLabel>
                                <textarea name="description" id="description" style={{ height: 100 }} maxLength={280} required placeholder="One or two sentences about the project." value={form.description || ""} onChange={handleChange} />
                                <div style={{ fontSize: 12, color: "#8aa0b5" }}>{descCount}/280 characters</div>
                            </FormField>
                        </FormGroup>
                        <div style={{ height: 1, background: "#1d2733", margin: "12px 0" }} />
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                            <div style={{ border: "1px dashed #29455f", padding: "12px 14px", borderRadius: 12, background: "#0f1a26" }}>
                                <label htmlFor="logo">Logo (PNG/SVG)</label>
                                <input name="logo" id="logo" type="file" accept=".png,.svg,.jpg,.jpeg" />
                                <div style={{ fontSize: 12, color: "#8aa0b5" }}>Square preferred. Max 2MB.</div>
                            </div>
                            <div style={{ border: "1px dashed #29455f", padding: "12px 14px", borderRadius: 12, background: "#0f1a26" }}>
                                <label htmlFor="banner">Banner (JPG/PNG)</label>
                                <input name="banner" id="banner" type="file" accept=".png,.jpg,.jpeg" />
                                <div style={{ fontSize: 12, color: "#8aa0b5" }}>1600 × 400 recommended. Max 4MB.</div>
                            </div>
                        </div>
                        <p style={{ fontSize: 12, color: "#8aa0b5" }}>Media uploads are illustrative in this demo and are not transmitted.</p>
                        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 12 }}>
                            <span />
                            <CapsuleButton className="glow" onClick={nextStep}>Next</CapsuleButton>
                        </div>
                    </section>
                    {/* 2. Official links */}
                    <section className={`section${step === 2 ? " active" : ""}`}  style={{ display: step === 2 ? "block" : "none", margin: "18px 0" }}>
                        <FormSectionHeader theme={theme}>Official Links</FormSectionHeader>
                        <FormGroup theme={theme} style={{ gridTemplateColumns: "1fr 1fr" }}>
                            <FormField theme={theme}>
                                <FormLabel htmlFor="website" theme={theme}>Website *</FormLabel>
                                <FormInput theme={theme} id="website" name="website" type="url" required placeholder="https://yourproject.xyz" value={form.website || ""} onChange={handleChange} />
                            </FormField>
                            <FormField theme={theme}>
                                <FormLabel theme={theme} htmlFor="whitepaper">Litepaper / Docs</FormLabel>
                                <FormInput theme={theme} name="whitepaper" id="whitepaper" type="url" placeholder="https://docs.yourproject.xyz" value={form.whitepaper || ""} onChange={handleChange} />
                            </FormField>
                        </FormGroup>
                        <FormGroup theme={theme} style={{ gridTemplateColumns: "1fr 1fr 1fr" }}>
                            <FormField theme={theme}>
                                <FormLabel theme={theme} htmlFor="twitter">Twitter / X *</FormLabel>
                                <FormInput theme={theme} name="twitter" id="twitter" type="url" required placeholder="https://x.com/yourhandle" value={form.twitter || ""} onChange={handleChange} />
                            </FormField>
                            <FormField theme={theme}>
                                <FormLabel theme={theme} htmlFor="telegram">Telegram</FormLabel>
                                <FormInput theme={theme} name="telegram" id="telegram" type="url" placeholder="https://t.me/yourgroup" value={form.telegram || ""} onChange={handleChange} />
                            </FormField>
                            <FormField theme={theme}>
                                <FormLabel theme={theme} htmlFor="discord">Discord</FormLabel>
                                <FormInput theme={theme} name="discord" id="discord" type="url" placeholder="https://discord.gg/yourserver" value={form.discord || ""} onChange={handleChange} />
                            </FormField>
                        </FormGroup>
                        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 12 }}>
                            <CapsuleButton onClick={prevStep}>Back</CapsuleButton>
                            <CapsuleButton className="glow" onClick={nextStep}>Next</CapsuleButton>
                        </div>
                    </section>
                    {/* 3. Ownership verification */}
                    <section className={`section${step === 3 ? " active" : ""}`}  style={{ display: step === 3 ? "block" : "none", margin: "18px 0" }}>
                        <FormSectionHeader theme={theme}>Ownership Verification</FormSectionHeader>
                        <p style={{ fontSize: 12, color: "#8aa0b5" }}>Complete <em>one</em> of the options below (more = stronger trust).</p>
                        <div style={{ background: "linear-gradient(180deg,#13293a,#112232)", border: "1px solid #234b69", borderRadius: 12, padding: 12, margin: "10px 0" }}>
                            <div style={optionStyle}>
                                <span style={pillStyle}>Option A</span><strong> Sign a message</strong>
                            </div>
                            <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 10, alignItems: "center" }}>
                                <div style={{ fontSize: 12, color: "#8aa0b5" }}>Use the deployer wallet or multisig to sign this message and paste signature.</div>
                                <button type="button" className="btn" style={btnStyle} onClick={handleGenMsg}>Generate Message</button>
                            </div>
                            <FormGroup theme={theme}>
                                <FormLabel htmlFor="sig" theme={theme}>Signature (hex/base64)</FormLabel>
                                <textarea name="sig" id="sig" placeholder="0x..." value={form.sig || ""} onChange={handleChange} />
                                <div style={{ fontSize: 12, color: "#8aa0b5" }}>{msg}</div>
                            </FormGroup>
                        </div>
                        <div style={{ background: "linear-gradient(180deg,#13293a,#112232)", border: "1px solid #234b69", borderRadius: 12, padding: 12, margin: "10px 0" }}>
                            <div style={optionStyle}>
                                <span style={pillStyle}>Option B</span><strong> DNS TXT record</strong>
                            </div>
                            <FormGroup theme={theme}>
                                <FormLabel theme={theme} htmlFor="domain">Domain</FormLabel>
                                <FormInput theme={theme} name="domain" id="domain" type="text" placeholder="yourproject.xyz" value={form.domain || ""} onChange={handleChange} />
                            </FormGroup>
                            <div style={{ background: "#0f1a26", border: "1px solid #234b69", borderRadius: 12, padding: 12, color: "#7fa7c6" }}>
                                Create a TXT record on <code>_mth-claim.yourproject.xyz</code> with value: <code>{dnsVal}</code>
                            </div>
                        </div>
                        <div style={{ background: "linear-gradient(180deg,#13293a,#112232)", border: "1px solid #234b69", borderRadius: 12, padding: 12, margin: "10px 0" }}>
                            <div style={optionStyle}>
                                <span style={pillStyle}>Option C</span><strong> Social post</strong>
                            </div>
                            <FormGroup theme={theme}>
                                <FormLabel theme={theme} htmlFor="verifyPost">Verification Post URL</FormLabel>
                                <FormInput theme={theme} name="verifyPost" id="verifyPost" type="url" placeholder="https://x.com/yourhandle/status/..." value={form.verifyPost || ""} onChange={handleChange} />
                            </FormGroup>
                            <div style={{ fontSize: 12, color: "#8aa0b5" }}>Post must state you’re claiming the MemeTokenHub profile for this contract.</div>
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 12 }}>
                            <CapsuleButton onClick={prevStep}>Back</CapsuleButton>
                            <CapsuleButton className="glow" onClick={nextStep}>Next</CapsuleButton>
                        </div>
                    </section>
                    {/* 4. Team details */}
                    <section className={`section${step === 4 ? " active" : ""}`}  style={{ display: step === 4 ? "block" : "none", margin: "18px 0" }}>
                        <FormSectionHeader theme={theme}>Team & Transparency</FormSectionHeader>
                        <FormGroup theme={theme} style={{ gridTemplateColumns: "1fr 1fr" }}>
                            <FormField theme={theme}>
                                <FormLabel theme={theme} htmlFor="teamName">Team / Entity Name *</FormLabel>
                                <FormInput theme={theme} name="teamName" id="teamName" type="text" required placeholder="Glitch Labs LLC" value={form.teamName || ""} onChange={handleChange} />
                            </FormField>
                            <FormField theme={theme}>
                                <FormLabel theme={theme} htmlFor="contractTel">Contact Phone</FormLabel>
                                <FormInput theme={theme} name="contactTel" id="contractTel" type="tel" placeholder="+1 555 000 0000" value={form.contactTel || ""} onChange={handleChange} />
                            </FormField>
                        </FormGroup>
                        <FormGroup theme={theme} style={{ gridTemplateColumns: "1fr 1fr 1fr" }}>
                            <FormField theme={theme}>
                                <FormLabel theme={theme} htmlFor="teamTwitter">Team Twitter</FormLabel>
                                <FormInput theme={theme} name="teamTwitter" id="teamTwitter" type="url" placeholder="https://x.com/glitchlabs" value={form.teamTwitter || ""} onChange={handleChange} />
                            </FormField>
                            <FormField theme={theme}>
                                <FormLabel theme={theme} htmlFor="github">GitHub</FormLabel>
                                <FormInput theme={theme} name="github" id="github" type="url" placeholder="https://github.com/yourorg" value={form.github || ""} onChange={handleChange} />
                            </FormField>
                            <FormField theme={theme}>
                                <FormLabel theme={theme} htmlFor="dune">Analytics (Dune/Nansen)</FormLabel>
                                <FormInput theme={theme} name="dune" id="dune" type="url" placeholder="https://dune.com/..." value={form.dune || ""} onChange={handleChange} />
                            </FormField>
                        </FormGroup>
                        <FormGroup theme={theme}>
                            <FormLabel theme={theme} htmlFor="transparency">Wallets for Transparency (comma-separated)</FormLabel>
                            <textarea name="transparency" id="transparency" placeholder="0xabc..., 0xdef..., 3xSolanaMint..." value={form.transparency || ""} onChange={handleChange} />
                            <div style={{ fontSize: 12, color: "#8aa0b5" }}>Public team / treasury wallets, if any.</div>
                        </FormGroup>
                        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 12 }}>
                            <CapsuleButton onClick={prevStep}>Back</CapsuleButton>
                            <CapsuleButton className="glow" onClick={nextStep}>Next</CapsuleButton>
                        </div>
                    </section>

                    {/* 5. Branding & extras */}
                    <section className={`section${step === 5 ? " active" : ""}`}  style={{ display: step === 5 ? "block" : "none", margin: "18px 0" }}>
                        <FormSectionHeader theme={theme}>Branding & Extras</FormSectionHeader>
                        <FormField theme={theme} style={{ marginBottom: 18 }}>
                            <FormLabel theme={theme} htmlFor="tagline">Tagline</FormLabel>
                            <FormInput theme={theme} name="tagline" id="tagline" type="text" placeholder="Infinite laughs, infinite gains." value={form.tagline || ""} onChange={handleChange} />
                        </FormField>
                        <FormGroup theme={theme} style={{ gridTemplateColumns: "1fr 1fr" }}>
                            <FormField theme={theme}>
                                <FormLabel theme={theme} htmlFor="ctaBuy">Primary DEX Link</FormLabel>
                                <FormInput theme={theme} name="ctaBuy" id="ctaBuy" type="url" placeholder="https://app.uniswap.org/..." value={form.ctaBuy || ""} onChange={handleChange} />
                            </FormField>
                            <FormField theme={theme}>
                                <FormLabel theme={theme} htmlFor="ctaDocs">Docs / Whitepaper Link</FormLabel>
                                <FormInput theme={theme} name="ctaDocs" id="ctaDocs" type="url" placeholder="https://docs.yourproject.xyz" value={form.ctaDocs || ""} onChange={handleChange} />
                            </FormField>
                        </FormGroup>
                        <FormGroup theme={theme} style={{ gap: 10, flexWrap: "wrap", alignItems: "center" }}>
                            <label style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
                                <input name="allowMemes" type="checkbox" checked={form.allowMemes} onChange={handleChange} /> Allow community meme uploads
                            </label>
                            <label style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
                                <input name="allowPolls" type="checkbox" checked={form.allowPolls} onChange={handleChange} /> Enable community polls
                            </label>
                        </FormGroup>
                        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 12 }}>
                            <CapsuleButton onClick={prevStep}>Back</CapsuleButton>
                            <CapsuleButton className="glow" onClick={nextStep}>Next</CapsuleButton>
                        </div>
                    </section>
                    {/* 6. Review & submit */}
                    <section className={`section${step === 6 ? " active" : ""}`}  style={{ display: step === 6 ? "block" : "none", margin: "18px 0" }}>
                        <FormSectionHeader theme={theme}>Review & Submit</FormSectionHeader>
                        <div style={{ background: "#0f1a26", border: "1px solid #1d2733", borderRadius: 12, padding: 14, fontSize: 14, whiteSpace: "pre-wrap" }}>
                            {review ? <pre>{review}</pre> : "Click “Generate Review” to preview your submission."}
                        </div>
                        <div style={{ padding: 14, height: 78, background: "#0d1722", border: "1px solid #1d2733", borderRadius: 12, color: "#7fa7c6", margin: "12px 0" }}>
                            {/* [ Captcha placeholder ] */}

                            <div style={{ display: "grid", gap: 8 }}>
                                <label>
                                    <input type="checkbox" name="tos" checked={!!form.tos} onChange={handleChange} required /> I confirm the information is accurate and I am authorized to claim this profile.
                                </label>
                                <label>
                                    <input type="checkbox" name="ack" checked={!!form.ack} onChange={handleChange} /> I agree to show team badge and transparency details on the profile.
                                </label>
                            </div>
                        </div>
                        {showError && <div style={{ fontSize: 13, color: "#ff6b8f", marginBottom: 8 }}>Please complete required fields marked with * in previous steps.</div>}
                        {showSuccess && <div style={{ padding: 14, border: "1px solid #2d6a4f", background: "#0e1b14", borderRadius: 12, marginBottom: 8 }}>✅ Submission accepted (demo). In production, this would send your data to the backend.</div>}
                        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 12 }}>
                            <CapsuleButton onClick={prevStep}>Back</CapsuleButton>
                            <div style={{ display: "inline-flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
                                <CapsuleButton className="glow" onClick={handleGenReview}>Generate Review</CapsuleButton>
                                <CapsuleButton className="selected">Submit Claim</CapsuleButton>
                            </div>
                        </div>
                    </section>
                </form>
            </FormDiv>
        </PageContainer>
    );
};

const PageContainer = styled.div`
  max-width: 900px;
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
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: ${({ theme }) => theme.spacing.large};
`;

const FormSectionHeader = styled.h2`
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: ${({ theme }) => theme.spacing.medium};
`;

const FormGroup = styled.div`
    margin-bottom: ${({ theme }) => theme.spacing.extraLarge};
    display: grid;
    gap: 14px;
`;

const FormField = styled.div`
    display: flex;
    flex-direction: column;
    gap: ${({ theme }) => theme.spacing.small};
    width: 100%;
`;

const FormLabel = styled.label`
    font-weight: bold;
    color: ${({ theme }) => theme.colors.text};
`;

const FormInput = styled.input`
    padding: ${({ theme }) => theme.spacing.small};
    border-radius: ${({ theme }) => theme.borderRadius};
    border: 1px solid ${({ theme }) => theme.colors.border};
    background-color: ${({ theme }) => theme.colors.background};
    color: ${({ theme }) => theme.colors.text};
    line-height: 1.5;

    &::placeholder {
        color: ${({ theme }) => theme.colors.placeholder};
    }

    &:focus {
        outline: none;
        border-color: ${({ theme }) => theme.colors.primary};
        box-shadow: 0 0 0 2px ${({ theme }) => theme.colors.primary}40;
    }
`;
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

// Button styles

const btnStyle: React.CSSProperties = {
    border: "1px solid #1d2733",
    background: "linear-gradient(180deg,#1a2532,#111a24)",
    color: "#e6eef6",
    padding: "12px 16px",
    borderRadius: 12,
    fontWeight: 700,
    cursor: "pointer",
    boxShadow: "0 8px 24px rgba(0,0,0,.35)",
    transition: ".2s"
};
const pillStyle: React.CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    padding: "6px 10px",
    borderRadius: 999,
    background: "#17202b",
    border: "1px solid #1d2733",
    fontSize: 12
};

const optionStyle: React.CSSProperties = {
    display: "flex",
    gap: 10,
    alignItems: "center",
    marginBottom: 16
};

const FormDiv = styled.div `
    border: "1px solid #1d2733";
    width: 100%;
    padding: ${({ theme }) => theme.spacing.medium};
    border-radius: ${({ theme }) => theme.borderRadius};
    background-color: ${({ theme }) => theme.colors.cardBackground};
    box-shadow: ${({ theme }) => theme.boxShadow};
    form {
        width: 100%;
    }
`;

export default ClaimTokenProfile;