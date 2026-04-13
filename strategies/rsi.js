function strategy(input) {
  const { candles, config } = input;
  
  // Get closing prices from candle objects
  const closes = candles.map(c => c.close);
  const period = config.period || 14;
  
  // Calculate RSI
  let gains = 0;
  let losses = 0;
  
  for (let i = 1; i <= period; i++) {
    const diff = closes[i] - closes[i - 1];
    if (diff >= 0) {
      gains += diff;
    } else {
      losses += Math.abs(diff);
    }
  }
  
  // Prevent division by zero
  if (losses === 0) {
    return { signal: "HOLD", reason: "No losses (all gains)", price: closes[closes.length - 1] };
  }
  
  const avgGain = gains / period;
  const avgLoss = losses / period;
  const rs = avgGain / avgLoss;
  const rsi = 100 - (100 / (1 + rs));
  
  const currentPrice = candles[candles.length - 1].close;
  
  // Trading signals
  const oversoldLevel = config.oversold || 30;
  const overboughtLevel = config.overbought || 70;
  
  if (rsi < oversoldLevel) {
    return { 
      signal: "BUY", 
      reason: `RSI ${rsi.toFixed(2)} < ${oversoldLevel}`, 
      price: currentPrice 
    };
  }
  
  if (rsi > overboughtLevel) {
    return { 
      signal: "SELL", 
      reason: `RSI ${rsi.toFixed(2)} > ${overboughtLevel}`, 
      price: currentPrice 
    };
  }
  
  return { 
    signal: "HOLD", 
    reason: `RSI ${rsi.toFixed(2)} neutral`, 
    price: currentPrice 
  };
}
