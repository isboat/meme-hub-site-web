// client/src/types/index.d.ts


export interface TokenProfileProps {
  tokenProfile: TokenProfile | null;
  isCurrentUser: boolean;
  tokenData?: NetworkTokenData | null; // Optional token data for specific token profiles
}

export interface TokenProfile {
  id: string;
  privyId: string;
  createdAt: string;
  username: string;
  discountCode: string;
  verified: boolean;
  metadata: ProfileMetadata;
  email: string;
  description?: string;
  profileImage?: string;
  bannerImageUrl?: string;
  profileName: string;
  language: string;
  totalMentions: number;
  location: string;
  socialLinks?: {
    facebook?: string;
    twitter?: string;
    // Add more as needed
  };
  followers: string[]; // Array of user IDs
  following: string[]; // Array of user IDs
  settings?: {
    anonymousBrowseAllowed?: boolean;
    // ... more settings
  };
}

export interface UserProfile {
  id: string;
  privyId: string;
  createdAt: string;
  username: string;
  discountCode: string;
  verified: boolean;
  metadata: ProfileMetadata;
  email: string;
  description?: string;
  profileImage?: string;
  profileName: string;
  language: string;
  totalMentions: number;
  location: string;
  socialLinks?: {
    facebook?: string;
    twitter?: string;
    // Add more as needed
  };
  followers: string[]; // Array of user IDs
  following: string[]; // Array of user IDs
  settings?: {
    anonymousBrowseAllowed?: boolean;
    // ... more settings
  };
}


export interface ProfileMetadata {
  [key: string]: string
}

export interface User {
  _id: string;
  privyId: string;
  createdAt: string;
  username: string;
  email: string;
  profileImage?: string;
  socialLinks?: {
    facebook?: string;
    twitter?: string;
    // Add more as needed
  };
  followers: string[]; // Array of user IDs
  following: string[]; // Array of user IDs
  settings?: {
    anonymousBrowseAllowed?: boolean;
    // ... more settings
  };
}

export interface ProfileProps {
  user: UserProfile;
  isCurrentUser: boolean;
  header?: string; // Optional header for the component
}

export interface Post {
  _id: string;
  userId: string; // ID of the user who posted
  content: string;
  imageUrl?: string;
  likes: string[]; // Array of user IDs who liked
  comments: Comment[];
  createdAt: string;
}

export interface Comment {
  _id: string;
  userId: string; // ID of the user who commented
  text: string;
  createdAt: string;
}

export interface TickerItem {
  _id: string; // Or just 'id' if your backend uses that
  text: string;
  link?: string; // Optional link for the ticker item
}

// Root object
export interface TrendingData {
  data: TokenData;
}

export interface NetworkData {
  id: string;
  chainIdentifier: string;
  name: string;
  shortName: string;
  nativeCoinId: string;
  image: {
      thumb: string;
      small: string;
      large: string;
  };
}

export interface NetworkTokenData {
  id: string;
  name: string;
  address: string;
  addressDto: TokenAddressDto;
  links: TokenLinkDto[];
  slug: string;
  symbol: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  logoURI: string;
  price: number;
  marketcap: number;
  liquidity: number;
  priceChangeH1: number;
  priceChangeH6: number;
  priceChangeH24: number;
  listedAt: Date;
  isExpressListing: boolean;
  status: number; // Assuming this is an enum or similar
  launchedAt: Date;
  createdBy: string;
}

export interface TokenLinkDto {
  id: string;
  type: TokenLinkType; // e.g., 'website', 'twitter', etc.
  url: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface TokenLinkType {
  id: string;
  title: string; // e.g., 'website', 'twitter', etc.
  position: number; // Position in the list
  createdAt: Date;
  updatedAt: Date;
}

export interface TokenAddressDto {
  id: string;
  token: string;
  tokenAddress: string;
  pairAddress: string;
  txnH24_Buy: number;
  txnH6_Buy: number;
  txnH1_Buy: number;
  txnH24_Sell: number;
  txnH6_Sell: number;
  txnH1_Sell: number;
  volumeH24: number;
  volumeH6: number;
  volumeH1: number;
  launchpad?: string; // Optional, as it can be null
  createdAt: Date;
  updatedAt: Date;
  chain: {
    id: string;
    chainId: string;
    name: string;
    abbr: string;
    slug: string;
    currencySymbol: string;
    explorerUrl: string;
    dextoolsIdentifier: string;
    geckoterminalIdentifier: string;
    payCurrency: string;
    emoji: string;
    logoUrl: string;
  };
}

// Main data shape where keys like "eth", "bsc", "sol", etc. map to arrays of TokenInfo
export interface TokenData {
  [chain: string]: TokenInfo[];
}

// Individual token info
export interface TokenInfo {
  name: string;
  symbol: string;
  slug: string;
  logo: string;
  chain_logo: string;
  h24: number;
}

