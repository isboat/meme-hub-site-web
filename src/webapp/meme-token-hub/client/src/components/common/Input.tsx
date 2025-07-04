// client/src/components/common/Input.tsx
import React from 'react';
import styled from 'styled-components';
import { useTheme } from '../../context/ThemeContext';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  type?: string; // Allow 'textarea' as a type for styling purposes
  rows?: number; // For textarea
}

const StyledInput = styled.input<InputProps>`
  width: 100%;
  padding: ${({ theme }) => theme.spacing.small};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius};
  background-color: ${({ theme }) => theme.colors.cardBackground};
  color: ${({ theme }) => theme.colors.text};
  font-size: 1em;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);
  }

  &::placeholder {
    color: ${({ theme }) => theme.colors.placeholder};
  }
`;

const StyledTextArea = styled.textarea<InputProps>`
  width: 100%;
  padding: ${({ theme }) => theme.spacing.small};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius};
  background-color: ${({ theme }) => theme.colors.cardBackground};
  color: ${({ theme }) => theme.colors.text};
  font-size: 1em;
  resize: vertical; /* Allow vertical resizing for textareas */

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);
  }

  &::placeholder {
    color: ${({ theme }) => theme.colors.placeholder};
  }
`;

const Input: React.FC<InputProps> = ({ type = 'text', ...props }) => {
  const theme = useTheme();

  if (type === 'textarea') {
    return <StyledTextArea theme={theme} {...props} />;
  }

  return <StyledInput theme={theme} type={type} {...props} />;
};

export default Input;