// client/src/components/common/Button.tsx
import styled from 'styled-components';
import { useTheme } from '../../context/ThemeContext';

interface ProfileBannerProps extends React.HTMLAttributes<HTMLDivElement> {
  imgUrl?: string;
  logoUrl?: string;
}
const StyledProfileBanner = styled.div<{ $imgUrl?: string }>`
  width: 100%;
  height: 200px;
  background-image: url(${props => props.$imgUrl || '/token-default-banner.JPG'});
  background-size: cover;
  background-position: center;
  border-radius: 8px;
  margin: ${({ theme }) => theme.spacing.large} 0;
  img {
    width: 110px;
  border-radius: 8px;
  }

  @media (max-width: 720px) {
    height: 120px;
    margin: ${({ theme }) => theme.spacing.medium} 0;
  }
`;

const ProfileBanner: React.FC<ProfileBannerProps> = ({ imgUrl, logoUrl }) => {
  const theme = useTheme(); // Access the theme
  
  return <StyledProfileBanner theme={theme} $imgUrl={imgUrl || undefined}>
      {logoUrl && <img src={logoUrl} alt="Profile Logo" />}
    </StyledProfileBanner>;
};

export default ProfileBanner;