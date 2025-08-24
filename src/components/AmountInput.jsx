import React from 'react';

const AmountInput = ({ amount, onAmountChange }) => {
  return (
    <input 
      type="number" 
      value={amount}
      onChange={(e) => onAmountChange(e.target.value)}
      placeholder="Enter amount"
      className="p-2 border rounded-md w-full"
    />
  );
};

export default AmountInput;