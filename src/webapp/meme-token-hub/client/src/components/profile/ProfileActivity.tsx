// client/src/components/profile/ProfileOverview.tsx
import React from 'react';
import styled from 'styled-components';
import { ProfileProps } from '../../types';
import { useTheme } from '../../context/ThemeContext';

const OverviewCard = styled.div`
  text-align: left;
  background-color: ${({ theme }) => theme.colors.cardBackground};
  padding: ${({ theme }) => theme.spacing.medium};
  border-radius: ${({ theme }) => theme.borderRadius};
  box-shadow: ${({ theme }) => theme.boxShadow};
`;

const Discount = styled.p`
  color: ${({ theme }) => theme.colors.success};
`;
const DiscountCode = styled.span`
  background: #334155;
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 1.1em;
`;


const ProfileActivity: React.FC<ProfileProps> = ({ user }) => {
  const theme = useTheme();
  return (
    <OverviewCard theme={theme}>   
      <h2>🎟️ Claim Your Profile with <strong>{user.discountCode}</strong> Code</h2><br />
      <p>Use the <strong>{user.discountCode}</strong> token code to claim your project profile page at a discounted price. 
        This code offers a cheaper entry for verified developers to showcase and manage their token dashboard.
      </p> <br />
      <Discount theme={theme}><h2>Discount Code: <DiscountCode>{user.discountCode}</DiscountCode></h2></Discount>
      <br />
      <h3>🚀 Tokens That Used the Code in the Last 24 Hours</h3>
    </OverviewCard>
  );
};

export default ProfileActivity;