/*
  This file contains TypeScript types and interfaces for the token components
  used in the Meme Token Hub application.

 */
export interface UserTokenSocialsClaim {
  id: string;
  userId: string;
  tokenAddress: string;
  description: string;
  tokenName: string;
  telegram: string;
  telegramUsername: string;
  discordUsername: string;
  twitter: string;
  reddit: string;
  website: string;
  bannerUrl: string;
  logoUrl: string;
  chain: string;
  discord: string;
  others: string;
  status: number; // e.g., 0 = pending, 1 = approved, 2 = rejected
  submittedAt: string;
  approvers: TokenSocialsClaimApprover[]; // Array of user IDs who approved the claim
}

export class TokenSocialsClaimApprover {
  userId: string;
  approvedAt: string;
}

export interface UnclaimedToken {
  name: string;
  image: string; // URL to the image
  rawData: RawTokenData;
  // Add other properties if your backend sends them
}

export interface TokenDataModel {
    id: string;
    name: string;
    symbol: string;
    description: string;
    image: string; // URL to the token image
    showName: boolean; // Whether to display the token name
    createdOn: string; // Platform where the token was created
    createdDateTime: string; // ISO date string of creation
    website?: string | null; // Optional website URL
    rawData: RawTokenData; // Data structure containing raw token data
}

export interface RawTokenData {
    signature: string; // Signature of the transaction
    mint: string; // Mint address of the token
    traderPublicKey: string; // Public key of the trader
    txType: string; // Type of transaction (e.g., create)
    initialBuy: number; // Initial buy amount
    bondingCurveKey: string; // Key for the bonding curve
    vTokensInBondingCurve: number; // Virtual tokens in the bonding curve
    vSolInBondingCurve: number; // Virtual SOL in the bonding curve
    marketCapSol: number; // Market cap in SOL
    name: string; // Name of the token
    symbol: string; // Symbol of the token
    uri: string; // URI for the token metadata
}