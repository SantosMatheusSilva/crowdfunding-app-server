// this code is to link the the donate button to the payment system  
import React from 'react';

const PaymentButton = () => {
  const handlePaymentClick = () => {
    // Redirect the donate button to the payment  system
    window.location.href = 'https://example.com/payment'; // Replace with your payment method system URL
  };

  return (
    <button onClick={handlePaymentClick}>
     Make your donation
    </button>
  );
};

export default PaymentButton;
