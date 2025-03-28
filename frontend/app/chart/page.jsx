"use client"
import { useEffect } from 'react';

const ChartPage = ({ updatePage }) => {

  
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/tv.js';
    script.async = true;
    script.onload = () => {
      new TradingView.widget({
        container_id: 'tradingview-chart',
        width: '100%',
        height: 650,
        symbol: 'BINANCE:BTCUSDT',
        interval: '1',
        timezone: 'Etc/UTC',
        theme: 'dark',
        style: '1',
        toolbar_bg: '#222222',
        enable_publishing: false,
        allow_symbol_change: false,
        hide_side_toolbar: true,
        hide_top_toolbar: false,
        studies: ['RSI@tv-basicstudies', 'MACD@tv-basicstudies'],
        locale: 'en',
      });
    };
    document.body.appendChild(script);
  }, []);

  return (
    <div>
         <div className="flex items-center justify-between p-3">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="white"
          className="size-12"
          onClick={() => updatePage(1)}
        >
          <path
            fillRule="evenodd"
            d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm-4.28 9.22a.75.75 0 0 0 0 1.06l3 3a.75.75 0 1 0 1.06-1.06l-1.72-1.72h5.69a.75.75 0 0 0 0-1.5h-5.69l1.72-1.72a.75.75 0 0 0-1.06-1.06l-3 3Z"
            clipRule="evenodd"
          />
        </svg>
        {/* <h1 className="text-3xl font-bold font-sans text-white">Earn</h1> */}
      </div>
    <div className='bg-black'>

        <div className='w-full h-full' id="tradingview-chart"></div>
    </div>

    </div>
);
};

export default ChartPage;
