const API_KEY = "ae6a9780baacfeeadfbe4e2a";

const amountInput = document.getElementById("amount");
const fromCurrency = document.getElementById("fromCurrency");
const toCurrency = document.getElementById("toCurrency");
const resultEl = document.getElementById("result");
const swapBtn = document.getElementById("swapBtn");
const convertBtn = document.getElementById("convertBtn");

async function loadCurrencies() {
  const res = await fetch(
    `https://v6.exchangerate-api.com/v6/${API_KEY}/codes`,
  );
  const data = await res.json();

  const codes = data.supported_codes;

  codes.sort((a, b) => a[0].localeCompare(b[0]));

  codes.forEach(([code, name]) => {
    const option1 = document.createElement("option");
    const option2 = document.createElement("option");

    option1.value = option2.value = code;

    option1.textContent = `${code} ${getFlag(code)}`;
    option2.textContent = `${code} ${getFlag(code)}`;

    fromCurrency.appendChild(option1);
    toCurrency.appendChild(option2);
  });

  fromCurrency.value = "USD";
  toCurrency.value = "EUR";
}

function getFlag(currencyCode) {
  const country = currencyCode.substring(0, 2);
  return String.fromCodePoint(
    ...country
      .toUpperCase()
      .split("")
      .map((c) => 127397 + c.charCodeAt()),
  );
}

swapBtn.addEventListener("click", () => {
  const temp = fromCurrency.value;
  fromCurrency.value = toCurrency.value;
  toCurrency.value = temp;
});

convertBtn.addEventListener("click", convert);

async function convert() {
  const amount = parseFloat(amountInput.value);

  if (isNaN(amount) || amount <= 0) {
    resultEl.textContent = "Please enter a valid amount.";
    return;
  }

  const from = fromCurrency.value;
  const to = toCurrency.value;

  try {
    const res = await fetch(
      `https://v6.exchangerate-api.com/v6/${API_KEY}/latest/${from}`,
    );
    const data = await res.json();

    const rate = data.conversion_rates[to];
    const converted = (amount * rate).toFixed(2);

    resultEl.textContent = `${amount} ${from} = ${converted} ${to}`;
  } catch (err) {
    resultEl.textContent = "Error fetching exchange rate.";
  }
}

loadCurrencies();
