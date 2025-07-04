// client/src/components/common/LoadingSpinner.tsx
import React from 'react';
import styled, { keyframes } from 'styled-components';
import { useTheme } from '../../context/ThemeContext';

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const SpinnerContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
`;

const Spinner = styled.div`
  border: 4px solid ${({ theme }) => theme.colors.border};
  border-top: 4px solid ${({ theme }) => theme.colors.primary};
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: ${spin} 1s linear infinite;
`;

const LoadingSpinner: React.FC = () => {
  const theme = useTheme();
  return (
    <SpinnerContainer>
      <Spinner theme={theme} />
    </SpinnerContainer>
  );
};

export default LoadingSpinner;