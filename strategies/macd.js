function strategy(input) {
  const { candles, config } = input;
  
  // Get closing prices from candle objects
  const closes = candles.map(c => c.close);
  
  // EMA calculation function
  const calculateEMA = (data, period) => {
    const k = 2 / (period + 1);
    const emaArray = [data[0]];
    
    for (let i = 1; i < data.length; i++) {
      emaArray.push(data[i] * k + emaArray[i - 1] * (1 - k));
    }
    
    return emaArray;
  };
  
  // Get periods from config (with defaults)
  const fastPeriod = config.fast_period || 12;
  const slowPeriod = config.slow_period || 26;
  const signalPeriod = config.signal_period || 9;
  
  // Calculate EMAs
  const emaFast = calculateEMA(closes, fastPeriod);
  const emaSlow = calculateEMA(closes, slowPeriod);
  
  // Calculate MACD line
  const macdLine = emaFast.map((v, i) => v - emaSlow[i]);
  
  // Calculate Signal line
  const signalLine = calculateEMA(macdLine, signalPeriod);
  
  // Get latest values
  const lastMACD = macdLine[macdLine.length - 1];
  const lastSignal = signalLine[signalLine.length - 1];
  const prevMACD = macdLine[macdLine.length - 2];
  const prevSignal = signalLine[signalLine.length - 2];
  
  const currentPrice = candles[candles.length - 1].close;
  const histogram = lastMACD - lastSignal;
  const prevHistogram = prevMACD - prevSignal;
  
  // Trading signals
  const bullishCrossover = prevMACD <= prevSignal && lastMACD > lastSignal;
  const bearishCrossover = prevMACD >= prevSignal && lastMACD < lastSignal;
  
  // Signal logic
  if (bullishCrossover) {
    return { 
      signal: "BUY", 
      reason: `MACD crossed above signal (${histogram.toFixed(4)})`, 
      price: currentPrice 
    };
  }
  
  if (bearishCrossover) {
    return { 
      signal: "SELL", 
      reason: `MACD crossed below signal (${histogram.toFixed(4)})`, 
      price: currentPrice 
    };
  }
  
  // Optional: histogram direction signals (uncomment to use)
  // if (histogram > 0 && prevHistogram <= 0) {
  //   return { signal: "BUY", reason: "Histogram turned positive", price: currentPrice };
  // }
  // if (histogram < 0 && prevHistogram >= 0) {
  //   return { signal: "SELL", reason: "Histogram turned negative", price: currentPrice };
  // }
  
  return { 
    signal: "HOLD", 
    reason: `MACD ${histogram > 0 ? 'bullish' : 'bearish'} (no crossover)`, 
    price: currentPrice 
  };
}
