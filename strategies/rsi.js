function strategy({ candles }) {
  const closes = candles.map(c => c[4]);
  const period = 14;

  let gains = 0;
  let losses = 0;

  for (let i = 1; i <= period; i++) {
    const diff = closes[i] - closes[i - 1];
    if (diff >= 0) gains += diff;
    else losses -= diff;
  }

  const rs = gains / losses;
  const rsi = 100 - (100 / (1 + rs));

  const price = closes.at(-1);

  if (rsi < 30) return { signal: "BUY", reason: "RSI low", price };
  if (rsi > 70) return { signal: "SELL", reason: "RSI high", price };

  return { signal: "HOLD", reason: "Neutral", price };
}
