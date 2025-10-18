// client/src/components/common/Button.tsx
import styled from 'styled-components';
import { useTheme } from '../../context/ThemeContext';

interface ProfileBannerProps extends React.HTMLAttributes<HTMLDivElement> {
  // 'primary' is the default, 'secondary' could be for less prominent actions
  variant?: 'primary' | 'secondary';
  // Allow passing className for external styling if needed (though styled-components handles most)
  className?: string;
  imgUrl?: string;
}

const StyledProfileBanner = styled.div<ProfileBannerProps>`
  width: 100%;
  min-height: 200px;
  background-color: ${({ theme }) => theme.colors.cardBackground || '#f0f0f0'};

  img {
    width: 100%;
  object-fit: cover;
  margin-bottom: ${({ theme }) => theme.spacing.medium};
  }

`;

const ProfileBanner: React.FC<ProfileBannerProps> = (props) => {
  const theme = useTheme(); // Access the theme
  return <StyledProfileBanner theme={theme} {...props}>
    {props.imgUrl && <img src={props.imgUrl} alt="Profile Banner" />}
    {!props.imgUrl && <img src="/token-default-banner.JPG" alt="Default Profile Banner" />}
    </StyledProfileBanner>;
};

export default ProfileBanner;