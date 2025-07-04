// client/src/components/common/Button.tsx
import styled from 'styled-components';
import { useTheme } from '../../context/ThemeContext';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  // You can add custom props here if needed
}

const StyledButton = styled.button<ButtonProps>`
  background-color: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.text};
  padding: ${({ theme }) => theme.spacing.small} ${({ theme }) => theme.spacing.medium};
  border-radius: ${({ theme }) => theme.borderRadius};
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.2s ease-in-out;
  border: none; /* Ensure no default border */

  &:hover {
    background-color: ${({ theme }) => theme.colors.secondary};
  }

  &:disabled {
    background-color: ${({ theme }) => theme.colors.placeholder};
    cursor: not-allowed;
  }
`;

const Button: React.FC<ButtonProps> = (props) => {
  const theme = useTheme(); // Access the theme
  return <StyledButton theme={theme} {...props} />;
};

export default Button;