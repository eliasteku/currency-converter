import { useState, useEffect } from 'react';
import './App.css'; 

const CurrencySelector = ({ currencies, selectedCurrency, onCurrencyChange }) => {
  return (
    <select 
      value={selectedCurrency} 
      onChange={(e) => onCurrencyChange(e.target.value)}
      className="selector-field"
    >
      {currencies.map((currencyCode) => (
        <option key={currencyCode} value={currencyCode}>
          {currencyCode}
        </option>
      ))}
    </select>
  );
};

const AmountInput = ({ amount, onAmountChange }) => {
  return (
    <input 
      type="number" 
      value={amount}
      onChange={(e) => onAmountChange(e.target.value)}
      placeholder="0"
      className="input-field"
    />
  );
};

function App() {
  const [currencyData, setCurrencyData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [fromCurrency, setFromCurrency] = useState('USD');
  const [toCurrency, setToCurrency] = useState('EUR');
  const [amount, setAmount] = useState('');
  
  const [theme, setTheme] = useState('dark');

  const handleSwapCurrencies = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  };
  
  const handleThemeToggle = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  useEffect(() => {
    const API_KEY = 'bb19030d2f14fa0de3662e89'; 
    const BASE_CURRENCY = 'USD'; 

    const fetchData = async () => {
      try {
        const response = await fetch(`https://v6.exchangerate-api.com/v6/${API_KEY}/latest/${BASE_CURRENCY}`);
        
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const data = await response.json();
        
        if (data.result === 'error') {
          throw new Error(data['error-type'] || 'An API error occurred.');
        }

        setCurrencyData(data);
        setError(null);
      } catch (err) {
        setError(err.message);
        setCurrencyData(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const currencies = currencyData ? Object.keys(currencyData.conversion_rates) : [];
  
  let convertedAmount = '';
  if (currencyData && amount) {
    const rateTo = currencyData.conversion_rates[toCurrency];
    const rateFrom = currencyData.conversion_rates[fromCurrency];
    convertedAmount = (parseFloat(amount) * (rateTo / rateFrom)).toFixed(2);
  }

  let exchangeRate = '';
  if (currencyData) {
    const rateTo = currencyData.conversion_rates[toCurrency];
    const rateFrom = currencyData.conversion_rates[fromCurrency];
    exchangeRate = `1 ${fromCurrency} = ${(rateTo / rateFrom).toFixed(4)} ${toCurrency}`;
  }

  return (
    <div className={`app-container ${theme}`}>
      <div className="card">
        {/* Theme Toggle Button */}
        <button 
          onClick={handleThemeToggle} 
          className="theme-toggle-button" 
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? '☀️' : '🌙'}
        </button>
        
        <h1 className="app-title">Currency Converter</h1>
        
        {isLoading && <p className="loading-text">Loading exchange rates...</p>}
        {error && <p className="error-text">Error: {error}</p>}
        
        {currencyData && (
          <div className="space-y-4">
            {/* Amount input field */}
            <div className="input-group">
              <label htmlFor="amount">Amount</label>
              <AmountInput amount={amount} onAmountChange={setAmount} />
            </div>

            {/* Currency selectors and swap button */}
            <div className="input-container">
              <div className="input-group">
                <label>From</label>
                <CurrencySelector 
                  currencies={currencies}
                  selectedCurrency={fromCurrency}
                  onCurrencyChange={setFromCurrency}
                />
              </div>

              {/* The swap button */}
              <button 
                onClick={handleSwapCurrencies}
                className="swap-button"
                aria-label="Swap currencies"
              >
                {/* SVG for a cleaner, more scalable icon */}
                <svg className="swap-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                </svg>
              </button>

              <div className="input-group">
                <label>To</label>
                <CurrencySelector
                  currencies={currencies}
                  selectedCurrency={toCurrency}
                  onCurrencyChange={setToCurrency}
                />
              </div>
            </div>
            
            {/* Display the exchange rate */}
            <div className="exchange-rate-container">
              <p className="exchange-rate-text">{exchangeRate}</p>
            </div>

            {/* Display the conversion result */}
            <div className="result-container">
              <p className="result-text-label">
                {amount || '0'} {fromCurrency} =
              </p>
              <p className="result-amount">
                {convertedAmount || '0.00'} {toCurrency}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
