// client/src/types/index.d.ts

export interface User {
    _id: string;
    privyId: string;
    createdAt: string;
    username: string;
    email: string;
    bio?: string;
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
    user: User;
    isCurrentUser: boolean;
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