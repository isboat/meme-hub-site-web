// client/src/components/common/Button.tsx
import styled from 'styled-components';
import { useTheme } from '../../context/ThemeContext';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  // 'primary' is the default, 'secondary' could be for less prominent actions
  variant?: 'primary' | 'secondary';
  // Add a type for the button's HTML type attribute
  type?: 'button' | 'submit' | 'reset';
  // Allow passing className for external styling if needed (though styled-components handles most)
  className?: string;
  // Allow onClick and other standard button props
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
}

const StyledButton = styled.button<ButtonProps>`
  /* Base styles for all buttons */
  padding: ${({ theme }) => theme.spacing.small} ${({ theme }) => theme.spacing.medium};
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius};
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s ease-in-out, transform 0.1s ease-in-out, opacity 0.2s ease-in-out;
  font-size: 1em;
  width: auto; /* Default to auto width, can be overridden by parent styles */
  display: inline-flex; /* Allows content to be centered if needed */
  align-items: center;
  justify-content: center;
  text-decoration: none; /* Ensure no underline for links styled as buttons */

  /* Variant-specific styles */
  background-color: ${({ theme, variant }) =>
    variant === 'secondary' ? theme.colors.cardBackground : theme.colors.primary};
  color: ${({ theme, variant }) =>
    variant === 'secondary' ? theme.colors.primary : theme.colors.cardBackground};
  border: ${({ theme, variant }) =>
    variant === 'secondary' ? `1px solid ${theme.colors.primary}` : 'none'};

  /* Hover effect */
  &:hover:not(:disabled) {
    opacity: 0.9;
    transform: translateY(-2px);
    box-shadow: ${({ theme }) => theme.boxShadow}; /* Add subtle shadow on hover */
  }

  /* Disabled state */
  &:disabled {
    background-color: ${({ theme }) => theme.colors.placeholder};
    color: ${({ theme }) => theme.colors.text};
    cursor: not-allowed;
    opacity: 0.6;
    transform: none; /* Remove hover transform when disabled */
    box-shadow: none; /* Remove hover shadow when disabled */
  }
`;

const Button: React.FC<ButtonProps> = (props) => {
  const theme = useTheme(); // Access the theme
  return <StyledButton theme={theme} {...props} />;
};

export default Button;