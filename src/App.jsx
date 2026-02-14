import { useState, useEffect } from "react";
import "./App.css";

const API_KEY = import.meta.env.VITE_API_KEY;

function getFlag(currencyCode) {
  const country = currencyCode.substring(0, 2);
  return String.fromCodePoint(
    ...country
      .toUpperCase()
      .split("")
      .map((c) => 127397 + c.charCodeAt()),
  );
}

function App() {
  const [amount, setAmount] = useState("");
  const [fromCurrency, setFromCurrency] = useState("USD");
  const [toCurrency, setToCurrency] = useState("EUR");
  const [currencies, setCurrencies] = useState([]);
  const [result, setResult] = useState("");

  useEffect(() => {
    async function loadCurrencies() {
      try {
        const res = await fetch(
          `https://v6.exchangerate-api.com/v6/${API_KEY}/codes`,
        );
        const data = await res.json();
        const codes = data.supported_codes;
        codes.sort((a, b) => a[0].localeCompare(b[0]));
        setCurrencies(codes);
      } catch {
        setResult("Error loading currencies.");
      }
    }

    loadCurrencies();
  }, []);

  function handleSwap() {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  }

  async function handleConvert() {
    const parsed = parseFloat(amount);

    if (isNaN(parsed) || parsed <= 0) {
      setResult("Please enter a valid amount.");
      return;
    }

    try {
      const res = await fetch(
        `https://v6.exchangerate-api.com/v6/${API_KEY}/latest/${fromCurrency}`,
      );
      const data = await res.json();
      const rate = data.conversion_rates[toCurrency];
      const converted = (parsed * rate).toFixed(2);
      setResult(`${parsed} ${fromCurrency} = ${converted} ${toCurrency}`);
    } catch {
      setResult("Error fetching exchange rate.");
    }
  }

  return (
    <div className="card">
      <div className="card-title">CURRENCY CONVERTER</div>

      <label className="label">AMOUNT</label>
      <input
        className="amount-input"
        type="number"
        placeholder="Enter amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />

      <div className="row">
        <div className="field">
          <label className="label">FROM</label>
          <select
            className="select-box"
            value={fromCurrency}
            onChange={(e) => setFromCurrency(e.target.value)}
          >
            {currencies.map(([code]) => (
              <option key={code} value={code}>
                {code} {getFlag(code)}
              </option>
            ))}
          </select>
        </div>

        <button className="swap-btn" onClick={handleSwap}>
          <span className="swap-icon">⇄</span>
        </button>

        <div className="field">
          <label className="label">TO</label>
          <select
            className="select-box"
            value={toCurrency}
            onChange={(e) => setToCurrency(e.target.value)}
          >
            {currencies.map(([code]) => (
              <option key={code} value={code}>
                {code} {getFlag(code)}
              </option>
            ))}
          </select>
        </div>
      </div>

      <button className="submit-btn" onClick={handleConvert}>
        CONVERT
      </button>

      <div className="result">{result}</div>
    </div>
  );
}

export default App;
