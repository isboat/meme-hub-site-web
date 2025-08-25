import React, { useEffect, useRef, memo } from 'react';

interface TradingViewChartProps {
    
  symbol?: string;
}

const TradingViewChart: React.FC<TradingViewChartProps> = ({ symbol }) => {
  const container = useRef<HTMLDivElement>(null);

  useEffect(
    () => {
      const script = document.createElement("script");
      script.src = "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
      script.type = "text/javascript";
      script.async = true;
      script.innerHTML = `
        {
          "allow_symbol_change": false,
          "calendar": false,
          "details": false,
          "hide_side_toolbar": true,
          "hide_top_toolbar": false,
          "hide_legend": false,
          "hide_volume": false,
          "hotlist": false,
          "interval": "D",
          "locale": "en",
          "save_image": true,
          "style": "1",
          "symbol": "${symbol}USDT",
          "theme": "dark",
          "timezone": "Etc/UTC",
          "backgroundColor": "#000000",
          "gridColor": "rgba(144, 138, 138, 0.94)",
          "watchlist": [],
          "withdateranges": false,
          "compareSymbols": [],
          "studies": [],
          "autosize": true
        }`;
      container.current?.appendChild(script);
    },
    []
  );

  return (
    <div className="tradingview-widget-container" ref={container} style={{ height: "100%", width: "100%" }}>
      <div className="tradingview-widget-container__widget" style={{ height: "calc(100% - 32px)", width: "100%" }}></div>
      <div className="tradingview-widget-copyright"><a href="https://www.tradingview.com/symbols/BINANCE-PEPEUSDT/?exchange=BINANCE" rel="noopener nofollow" target="_blank"><span className="blue-text">BINANCE:PEPEUSDT chart by TradingView</span></a></div>
    </div>
  );
}

export default memo(TradingViewChart);
