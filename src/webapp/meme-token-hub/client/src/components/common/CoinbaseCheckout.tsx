import React from 'react';

interface CoinbaseCheckoutProps {
  chargeCode: string; // This is the hosted charge code from Coinbase Commerce
}

const CoinbaseCheckout: React.FC<CoinbaseCheckoutProps> = ({ chargeCode }) => {
  const handleCheckout = () => {
    window.location.href = `https://commerce.coinbase.com/charges/${chargeCode}`;
  };

  return (
    <button onClick={handleCheckout} style={{ padding: '10px 20px', fontSize: '16px' }}>
      Pay with Crypto 💸
    </button>
  );
};

export default CoinbaseCheckout;