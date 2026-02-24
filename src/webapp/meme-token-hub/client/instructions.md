# MemeTokenHub - Development Instructions

## Project Overview

**MemeTokenHub** is a React + TypeScript + Vite web application that serves as a social platform for discovering, tracking, and managing meme tokens across multiple blockchain networks (Ethereum, Solana, BNB Chain, Polygon, Arbitrum, Base, etc.).

### Key Features
- 🔐 **Authentication**: Privy.IO integration (Google, Discord, X, crypto wallets)
- 👤 **User Profiles**: Create and manage KOL/Developer/Lover profiles
- 🪙 **Token Discovery**: Browse claimed and unclaimed meme tokens
- 📊 **Token Management**: Submit and claim token profiles with verification
- 🐦 **Twitter Integration**: OAuth authentication for social verification
- 💬 **Community Features**: Follow, engage, and interact with projects
- 🎨 **Dark Theme**: Styled-components with customizable theme context

---

## Project Structure

```
client/
├── src/
│   ├── api/
│   │   └── api.ts                    # Axios instance with interceptors
│   ├── components/
│   │   ├── common/                   # Reusable UI components
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── PostCard.tsx
│   │   │   ├── LoadingSpinner.tsx
│   │   │   ├── TradingViewChart.tsx
│   │   │   └── CoinbaseCheckout.tsx
│   │   ├── layout/
│   │   │   ├── Layout.tsx            # Main app wrapper
│   │   │   ├── Navbar.tsx
│   │   │   └── Footer.tsx
│   │   ├── profile/
│   │   │   ├── ProfileOverview.tsx
│   │   │   ├── ProfileActivity.tsx
│   │   │   ├── ProfileHubSpot.tsx
│   │   │   └── ProfileHubSocials.tsx
│   │   ├── token/
│   │   │   ├── TokenProfileOverview.tsx
│   │   │   ├── TokenProfileCommunity.tsx
│   │   │   ├── TokenProfileChart.tsx
│   │   │   ├── TokenProfileLinks.tsx
│   │   │   ├── TokenProfileHubFollow.tsx
│   │   │   └── TokenProfileKolFollows.tsx
│   │   └── twitter/
│   │       └── TwitterLoginButton.tsx
│   ├── context/
│   │   └── ThemeContext.tsx          # Dark theme management
│   ├── hooks/
│   │   └── useApi.ts                 # Custom API hook
│   ├── pages/                        # Route components
│   │   ├── Home.tsx
│   │   ├── Profile.tsx               # User profile page
│   │   ├── Auth.tsx
│   │   ├── CreateProfile.tsx
│   │   ├── Tokens.tsx                # Token discovery feed
│   │   ├── TokenProfile.tsx
│   │   ├── UnclaimedTokensFeed.tsx
│   │   ├── claimsform.tsx            # Multi-step token claim form
│   │   ├── FAQ.tsx
│   │   ├── AboutUs.tsx
│   │   └── token-claims/
│   │       ├── SubmitSocialsClaim.tsx
│   │       └── TwitterManualPost.tsx
│   ├── styles/
│   │   └── (theme configuration)
│   ├── types/
│   │   ├── index.d.ts
│   │   └── token-components.d.ts
│   ├── App.tsx                       # Main router
│   ├── App.css
│   ├── index.css                     # Tailwind directives
│   └── main.tsx
├── public/
├── index.html
├── package.json
├── tailwind.config.cjs
├── postcss.config.cjs
├── vite.config.ts
├── tsconfig.json
├── eslint.config.js
└── README.md
```

---

## Tech Stack

### Core
- **React 19.1.0** - UI library
- **TypeScript 5.8** - Type safety
- **Vite 7.0** - Build tool & dev server
- **React Router 7.6** - Client-side routing

### Styling
- **Styled-components 6.1** - CSS-in-JS styling
- **Tailwind CSS 3.4** - Utility-first CSS framework
- **PostCSS 8.4** - CSS processing
- **Autoprefixer 10.4** - Browser prefix support

### Authentication & API
- **@privy-io/react-auth 2.17** - Web3 wallet/social auth
- **Axios 1.10** - HTTP client with custom interceptors
- **JWT tokens** - Stored in localStorage (backend-issued)

### UI & Icons
- **React Icons 5.5** - Icon library
- **@heliofi/checkout-react 4.0** - Coinbase payment integration

### Development Tools
- **ESLint 9.29** - Code linting
- **Globals 16.2** - Global browser variables

---

## Environment Setup

### Prerequisites
- **Node.js** 18+ 
- **npm** 9+

### Installation

```bash
# Navigate to client directory
cd client

# Install dependencies
npm install

# Create .env file
echo "VITE_API_BASE_URL=https://memehubsiteapi-ekeca9fua6h9h2fy.uksouth-01.azurewebsites.net/api" > .env
```

### Environment Variables

```env
# .env file (already configured)
VITE_API_BASE_URL=https://memehubsiteapi-ekeca9fua6h9h2fy.uksouth-01.azurewebsites.net/api
```

---

## Running the Application

### Development Mode

```bash
npm run dev
```

- Starts Vite dev server on `http://localhost:3000`
- Hot Module Replacement (HMR) enabled
- Open browser and navigate to http://localhost:3000

### Production Build

```bash
npm run build
```

- Builds TypeScript (`tsc -b`)
- Creates optimized bundle in `./dist`
- Output ready for deployment

### Preview Production Build

```bash
npm run preview
```

- Serves the production build locally for testing

### Linting

```bash
npm run lint
```

- Runs ESLint on all files
- Checks TypeScript and React rules

---

## Tailwind CSS

### Configuration
- **Config file**: [`tailwind.config.cjs`](tailwind.config.cjs)
- **Content scanning**: All `.{js,ts,jsx,tsx}` files in `src/`
- **Directives**: Imported in [`src/index.css`](src/index.css)

### Usage

The project uses **both styled-components AND Tailwind CSS**:

```tsx
// Styled-components (primary)
const Container = styled.div`
  background-color: ${({ theme }) => theme.colors.background};
  padding: ${({ theme }) => theme.spacing.large};
`;

// Tailwind utility classes (secondary, especially in newer pages)
<div className="w-full max-w-4xl mx-auto p-4 sm:p-6">
  Content
</div>
```

### Building Tailwind CSS Output

```bash
npm run tailwind:build
```

Generates minified CSS output to `src/tailwind.css` (optional).

---

## API Integration

### API Client Configuration

File: [`src/api/api.ts`](src/api/api.ts)

```typescript
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor: attaches JWT token from localStorage
api.interceptors.request.use(async (config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

### Custom useApi Hook

File: [`src/hooks/useApi.ts`](src/hooks/useApi.ts)

```typescript
const { data, loading, error } = useApi<T>(
  endpoint,     // '/users/123'
  method,       // 'get' | 'post' | 'put' | 'delete'
  body,         // Request payload (optional)
  dependencies, // Dependency array (optional)
  skip          // Skip request if true (optional)
);
```

### Usage Example

```tsx
// In any component
const { user: privyUser } = usePrivy();
const { data: currentUser, loading } = useApi<User>(
  `/users/${privyUser?.id}`,
  'get',
  null,
  null,
  !authenticated  // Skip if not authenticated
);
```

---

## Authentication Flow

### Privy.IO Integration

1. **User clicks "Log In"** → Privy login modal
2. **Select auth method**:
   - Social: Google, X, Discord
   - Wallet: MetaMask, WalletConnect
3. **Backend receives Privy user ID**
4. **Backend issues JWT token** (stored in localStorage)
5. **Token attached to all API requests**

### Files Involved
- [`src/pages/Auth.tsx`](src/pages/Auth.tsx) - Auth page
- [`src/components/twitter/TwitterLoginButton.tsx`](src/components/twitter/TwitterLoginButton.tsx) - Twitter OAuth
- [`src/api/api.ts`](src/api/api.ts) - Token management

---

## Routing

File: [`src/App.tsx`](src/App.tsx)

### Public Routes (no auth required)
- `/` - Token feed (home)
- `/about-us` - About page
- `/faq` - FAQ page
- `/auth` - Login page
- `/tokens` - Token discovery
- `/unclaimed-tokens` - Unclaimed token feed
- `/profile/:userId` - View user profile (public)
- `/user-profile/:profileId` - Alternative profile view
- `/kol-profiles` - KOL directory

### Protected Routes (auth required)
- `/create-profile` - Create user profile
- `/profile` - Current user profile
- `/dashboard` - User dashboard
- `/settings` - User settings
- `/update-profile` - Edit profile
- `/update-profile-socials` - Edit social links
- `/claim-token/:tokenId` - Token claim form
- `/token/:tokenId` - Token profile

---

## Theme System

File: [`src/context/ThemeContext.tsx`](src/context/ThemeContext.tsx)

### Theme Object Structure

```typescript
interface Theme {
  colors: {
    primary: string;           // #3b82f6
    secondary: string;         // #8b5cf6
    success: string;           // #10b981
    error: string;             // #ef4444
    warning: string;           // #f59e0b
    background: string;        // #0f172a
    cardBackground: string;    // #1e293b
    text: string;              // #e2e8f0
    placeholder: string;       // #94a3b8
    border: string;            // #334155
    dimmedWhite: string;       // #666
    footer: string;            // #8b949e
    navBarBackground: string;  // #111827
    yellow: string;            // #fbbf24
    white: string;             // #ffffff
  };
  spacing: {
    extraSmall: string;        // 4px
    small: string;             // 8px
    medium: string;            // 16px
    large: string;             // 24px
    extraLarge: string;        // 32px
  };
  borderRadius: string;        // 8px
  boxShadow: string;
  breakpoints: {
    small: string;             // 480px
    medium: string;            // 768px
    large: string;             // 1024px
  };
}
```

### Usage in Components

```tsx
import { useTheme } from '../context/ThemeContext';

const MyComponent = () => {
  const theme = useTheme();
  
  return (
    <div style={{ backgroundColor: theme.colors.background }}>
      {/* Content */}
    </div>
  );
};
```

---

## Key Components & Pages

### User Profile ([`src/pages/Profile.tsx`](src/pages/Profile.tsx))
- Display user profile with stats
- Tabs: Overview, Activity, HubSpot, HubSocials, Polls
- Edit profile button (if own profile)
- Twitter verification button

### Token Discovery ([`src/pages/Tokens.tsx`](src/pages/Tokens.tsx))
- Search by contract address or MTH ID
- Filter by chain
- Display token grid with status ribbons (Verified/Pending/Rejected)
- Explore MTH features (Pills)

### Token Claim Form ([`src/pages/claimsform.tsx`](src/pages/claimsform.tsx))
- **6-step multi-step form**:
  1. Project basics (name, symbol, chain, contract)
  2. Official links (website, Twitter, Telegram)
  3. Community verification (wallet signature or DNS/social post)
  4. Team details (contact info)
  5. Branding (logo, banner, tagline)
  6. Review & submit
- Form validation at each step
- localStorage persistence

### Token Profile ([`src/pages/TokenProfile.tsx`](src/pages/TokenProfile.tsx))
- Display verified/pending token profile
- Tabs: Community, Token, Hub Socials, Followers, Swaps
- Token metadata and links
- Status ribbon if pending
- Action buttons (Claim, Follow, etc.)

---

## Important Type Definitions

File: [`src/types/index.d.ts`](src/types/index.d.ts)

### Core Types

```typescript
interface User {
  _id: string;
  privyId: string;
  username: string;
  email: string;
  description: string;
  profileImage: string;
  profileName: string;
  verified: boolean;
  followers: string[];
  following: string[];
  createdAt: Date;
  updatedAt: Date;
}

interface UserProfile {
  _id: string;
  username: string;
  profileName: string;
  description: string;
  profileImage: string;
  verified: boolean;
  followers: string[];
  following: string[];
}

interface NetworkTokenData {
  id: string;
  name: string;
  symbol: string;
  logoURI: string;
  address: string;
  chain: string;
  // ... more fields
}

interface TokenSocialsClaim {
  _id: string;
  tokenId: string;
  profileName: string;
  status: 0 | 1 | 2;  // 0=pending, 1=approved, 2=rejected
  logoUrl: string;
  bannerUrl: string;
  description: string;
  website?: string;
  twitter?: string;
  telegram?: string;
  // ... more fields
}

interface Post {
  _id: string;
  authorId: string;
  content: string;
  likes: string[];
  comments: Comment[];
  createdAt: Date;
}
```

---

## Common Patterns

### API Request with Loading & Error Handling

```tsx
const { data, loading, error } = useApi<Token>('/tokens/123');

if (loading) return <LoadingSpinner />;
if (error) return <div>Error: {error}</div>;

return <div>{data?.name}</div>;
```

### Form State Management

```tsx
const [form, setForm] = useState({ name: '', email: '' });

const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
  const { name, value } = e.target;
  setForm(prev => ({ ...prev, [name]: value }));
};

const handleSubmit = async (e: FormEvent) => {
  e.preventDefault();
  await api.post('/submit', form);
};
```

### Theme-Aware Styled Component

```tsx
const Container = styled.div`
  background-color: ${({ theme }) => theme.colors.cardBackground};
  padding: ${({ theme }) => theme.spacing.medium};
  border-radius: ${({ theme }) => theme.borderRadius};
  border: 1px solid ${({ theme }) => theme.colors.border};
`;
```

### Responsive Design (styled-components)

```tsx
const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: ${({ theme }) => theme.spacing.medium};

  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;
```

---

## Database Models (Backend Reference)

### User
```typescript
{
  _id, privyId, username, email, description, profileImage,
  profileName, verified, followers[], following[], createdAt, updatedAt
}
```

### Token (Network)
```typescript
{
  _id, name, symbol, address, chain, logoURI, logoUrl, marketcap,
  status (0|1|2), createdAt, updatedAt
}
```

### TokenSocialsClaim
```typescript
{
  _id, tokenId, userId, profileName, status, logoUrl, bannerUrl,
  description, website, twitter, telegram, discord, github,
  location, language, createdAt, updatedAt
}
```

### Post
```typescript
{
  _id, authorId, content, likes[], comments[], createdAt, updatedAt
}
```

---

## Deployment

### Azure Static Web Apps

Files:
- [`staticwebapp.config.json`](staticwebapp.config.json) - Azure config
- Built output: `./dist`

### Build & Deploy

```bash
# Build
npm run build

# Preview (local)
npm run preview

# Deploy to Azure (requires auth token)
npm run deploy
```

### Environment
- **Production API**: `https://memehubsiteapi-ekeca9fua6h9h2fy.uksouth-01.azurewebsites.net/api`

---

## Best Practices

### 1. **Always use useApi for data fetching**
   - Handles loading, error, and data states
   - Automatic token attachment

### 2. **Theme-aware styling**
   - Use `useTheme()` hook in components
   - Reference theme colors/spacing from context

### 3. **Type safety**
   - Define interfaces for all data structures
   - Use `<T>` generics with useApi

### 4. **Form validation**
   - Validate before submission
   - Show user-friendly error messages
   - Use localStorage for persistence if needed

### 5. **Responsive design**
   - Mobile-first approach
   - Test at breakpoints: 480px, 768px, 1024px
   - Use media queries in styled-components

### 6. **Component organization**
   - Keep components under 300 lines
   - Extract reusable logic to hooks
   - Use common components for UI elements

### 7. **API error handling**
   - Check for 404 (not found) vs other errors
   - Display meaningful error messages
   - Log errors for debugging

---

## Troubleshooting

### Port Already in Use
```bash
# Change dev port in vite.config.ts or use:
npm run dev -- --port 3001
```

### Dependencies Issues
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Tailwind Not Working
```bash
# Ensure content paths are correct in tailwind.config.cjs
# Restart dev server after config changes
npm run dev
```

### API 401 Unauthorized
```bash
# Check token in localStorage
localStorage.getItem('accessToken')

# Ensure user is authenticated via Privy
// Check usePrivy() authenticated state
```

### TypeScript Errors
```bash
# Rebuild TypeScript
npm run build

# Check for missing types
npm install --save-dev @types/node
```

---

## Useful Links

- [Vite Docs](https://vite.dev/)
- [React 19 Docs](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Styled-components Docs](https://styled-components.com/)
- [Tailwind CSS Docs](https://tailwindcss.com/)
- [Privy.IO Docs](https://docs.privy.io/)
- [Axios Docs](https://axios-http.com/)
- [React Router Docs](https://reactrouter.com/)

---

## Contributors & Support

For issues, feature requests, or contributions, please contact the development team.

**Last Updated**: $(date)