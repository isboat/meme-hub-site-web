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


const ProfileActivity: React.FC<ProfileProps> = ({ user, isCurrentUser }) => {
  const theme = useTheme();
  return (
    <OverviewCard theme={theme}>   
      <h2>About: Claim Your Profile with GENESIS Code {user.username }</h2>
      <p>Use the GENESIS token code to claim your project profile page at a discounted price. 
        This code offers a cheaper entry for verified developers to showcase and manage their token dashboard.
      </p> 
      <h2>Discount Code: <pre>GENESIS Code</pre></h2>
      <h2>Tokens That Used the Code in the Last 24 Hours</h2>
    </OverviewCard>
  );
};

export default ProfileActivity;