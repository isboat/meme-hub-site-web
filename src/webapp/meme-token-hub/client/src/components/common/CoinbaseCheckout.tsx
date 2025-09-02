import React from 'react';
import CapsuleButton from './CapsuleButton';

interface CoinbaseCheckoutProps {
  chargeCode: string; // This is the hosted charge code from Coinbase Commerce
  disabled?: boolean;
}

const CoinbaseCheckout: React.FC<CoinbaseCheckoutProps> = ({ chargeCode, disabled }) => {
  const handleCheckout = () => {
    if (disabled) return;
    if (!chargeCode) {
      console.error('Charge code is required for Coinbase Checkout');
      return;
    }
    // Redirect to Coinbase Commerce hosted checkout page
    window.location.href = `https://commerce.coinbase.com/charges/${chargeCode}`;
  };

  return (
    <CapsuleButton className='glow' onClick={handleCheckout} style={{ padding: '10px 20px', fontSize: '16px' }}>
      Pay via Coinbase 💸
    </CapsuleButton>
  );
};

export default CoinbaseCheckout;