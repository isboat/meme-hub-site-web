// client/src/types/index.d.ts
export interface UserProfile {
  id: string;
  privyId: string;
  createdAt: string;
  username: string;
  discountCode:string;
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
  
  export interface TokenProfileProps {
    user: UserProfile;
    isCurrentUser: boolean;
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

export interface RawTokenData {
  mint: string;
  initialBuy: number; // Assuming number, adjust if string
  marketCapSol: number; // Assuming number, adjust if string
  // Add other rawData properties if they exist and are used
}

export interface UnclaimedToken {
  name: string;
  image: string; // URL to the image
  rawData: RawTokenData;
  // Add other properties if your backend sends them
}



// Root object
export interface TrendingData {
  data: TokenData;
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

