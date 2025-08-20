// client/src/components/common/Button.tsx
import styled from 'styled-components';
import { useTheme } from '../../context/ThemeContext';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  // Allow passing className for external styling if needed (though styled-components handles most)
  className?: string;
  // Allow onClick and other standard button props
  onChange?: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  disabled?: boolean;
}

const StyledSelect = styled.select<SelectProps>`
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 9999px;
      font-family: inherit;
    font-size: 100%;
  cursor: pointer;
  transition: background-color 0.2s ease-in-out, transform 0.1s ease-in-out, opacity 0.2s ease-in-out;
  width: auto;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;

  /* Variant-specific styles */
  background-color: ${({ theme }) => theme.colors.navBarBackground}
  color: ${({ theme }) => theme.colors.white};

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
    /* on selected state */
  &.selected {
    background: #facc15;
    color: #0f172a;
    font-weight: bold;
  }
  &.socials-updated {
    box-shadow: 0 0 12px #4ade80;
    border: 2px solid #4ade80;
  }
`;

const CapsuleSelect: React.FC<SelectProps> = (props) => {
  const theme = useTheme(); // Access the theme
  return <StyledSelect theme={theme} {...props} />;
};

export default CapsuleSelect;