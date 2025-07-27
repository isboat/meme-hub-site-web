// client/src/components/common/Button.tsx
import styled from 'styled-components';
import { useTheme } from '../../context/ThemeContext';

interface AnchorButtonProps extends React.ButtonHTMLAttributes<HTMLAnchorElement> {
  // 'primary' is the default, 'secondary' could be for less prominent actions
  variant?: 'primary' | 'secondary' | 'youtube' | 'x' | 'telegram' | 'instagram';

  // Size of the button, can be used for styling
  size?: 'small' | 'medium' | 'large';
  // Allow passing className for external styling if needed (though styled-components handles most)
  className?: string;
  // Allow href for navigation
  href?: string;
  // Allow target and rel for security
  target?: string;
  rel?: string;

  // Allow onClick and other standard button props
  onClick?: (event: React.MouseEvent<HTMLAnchorElement>) => void;
  disabled?: boolean;
}

const StyledAnchorButton = styled.a<AnchorButtonProps>`
  /* Base styles for all buttons */
  padding: ${({ theme }) => theme.spacing.small} ${({ theme }) => theme.spacing.medium};
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius};
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s ease-in-out, transform 0.1s ease-in-out, opacity 0.2s ease-in-out;
  font-size: 1em;
  width: ${({ size, theme }) => {
    switch (size) {
      case 'small':
        return theme.button.size.small || '100px';
      case 'medium':
        return theme.button.size.medium || '200px';
      case 'large':
        return theme.button.size.large || '300px';
      default:
        return 'auto';
    }
  }};
  display: inline-flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;

  /* Variant-specific styles */
  background-color: ${({ theme, variant }) =>
    variant === 'telegram'
      ? '#086492ff'
      : variant === 'x'
      ? '#000'
      : variant === 'youtube'
      ? '#FF0000'
      : variant === 'secondary'
      ? theme.colors.cardBackground
      : theme.colors.primary};
  color: ${({ theme, variant }) =>
    variant === 'x' || variant === 'youtube' || variant === 'telegram'
      ? '#fff'
      : variant === 'secondary'
      ? theme.colors.primary
      : theme.colors.cardBackground};
  border: ${({ theme, variant }) =>
    variant === 'x' ||variant === 'youtube'
      ? 'none'
      : variant === 'secondary'
      ? `1px solid ${theme.colors.primary}`
      : 'none'};

  /* Hover effect */
  &:hover:not(:disabled) {
    opacity: 0.9;
    transform: translateY(-2px);
    box-shadow: ${({ theme }) => theme.boxShadow};
    text-decoration: none;
  }

  /* Disabled state */
  &:disabled {
    background-color: ${({ theme }) => theme.colors.placeholder};
    color: ${({ theme }) => theme.colors.text};
    cursor: not-allowed;
    opacity: 0.6;
    transform: none;
    box-shadow: none;
  }
`;

const AnchorButton: React.FC<AnchorButtonProps> = (props) => {
  const theme = useTheme(); // Access the theme
  return <StyledAnchorButton theme={theme} {...props} />;
};

export default AnchorButton;