import React from 'react';

const CurrencySelector = ({ currencies, selectedCurrency, onCurrencyChange }) => {
  return (
    <select 
      value={selectedCurrency} 
      onChange={(e) => onCurrencyChange(e.target.value)}
      // Optional: Add Tailwind CSS classes for basic styling
      className="p-2 border rounded-md"
    >
      {currencies.map((currencyCode) => (
        <option key={currencyCode} value={currencyCode}>
          {currencyCode}
        </option>
      ))}
    </select>
  );
};

export default CurrencySelector;