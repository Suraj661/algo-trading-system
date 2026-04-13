function strategy({ candles }) {
  const closes = candles.map(c => c[4]);

  const ema = (data, period) => {
    const k = 2 / (period + 1);
    let ema = data[0];
    return data.map(price => (ema = price * k + ema * (1 - k)));
  };

  const ema12 = ema(closes, 12);
  const ema26 = ema(closes, 26);

  const macd = ema12.map((v, i) => v - ema26[i]);
  const signal = ema(macd, 9);

  const last = macd.at(-1) - signal.at(-1);
  const price = closes.at(-1);

  if (last > 0) return { signal: "BUY", reason: "MACD bullish", price };
  if (last < 0) return { signal: "SELL", reason: "MACD bearish", price };

  return { signal: "HOLD", reason: "Neutral", price };
}
