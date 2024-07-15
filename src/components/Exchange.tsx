// import React, { useState } from 'react';

// const ExchangeComponent: React.FC = () => {
//   const [sellAmount, setSellAmount] = useState<number>(90);
//   const [buyAmount, setBuyAmount] = useState<number>(3597.79);

//   const handleSellAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setSellAmount(parseFloat(e.target.value));
//   };

//   const handleBuyAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setBuyAmount(parseFloat(e.target.value));
//   };

//   return (
//     <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
//       <div className="w-full max-w-md p-6 bg-gray-800 rounded-lg shadow-lg">
//         {/* Sell Section */}
//         <div className="flex justify-between items-center mb-4">
//           <div className="flex flex-col">
//             <label className="text-sm text-gray-500">Sell</label>
//             <input
//               type="number"
//               value={sellAmount}
//               onChange={handleSellAmountChange}
//               className="text-2xl bg-transparent border-none focus:outline-none"
//             />
//             <span className="text-sm text-gray-500">$282,354.30</span>
//           </div>
//           <div className="flex items-center">
//             <img src="https://cryptologos.cc/logos/ethereum-eth-logo.png" alt="ETH" className="w-6 h-6 mr-2" />
//             <span>ETH</span>
//           </div>
//         </div>
//         {/* Divider */}
//         <div className="flex justify-center mb-4">
//           <button className="p-2 bg-gray-700 rounded-full">
//             <svg
//               className="w-6 h-6 text-gray-300"
//               fill="none"
//               stroke="currentColor"
//               viewBox="0 0 24 24"
//               xmlns="http://www.w3.org/2000/svg"
//             >
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
//             </svg>
//           </button>
//         </div>
//         {/* Buy Section */}
//         <div className="flex justify-between items-center">
//           <div className="flex flex-col">
//             <label className="text-sm text-gray-500">Buy</label>
//             <input
//               type="number"
//               value={buyAmount}
//               onChange={handleBuyAmountChange}
//               className="text-2xl bg-transparent border-none focus:outline-none"
//             />
//             <span className="text-sm text-gray-500">$171,339.39 <span className="text-red-500">(-39.31%)</span></span>
//           </div>
//           <div className="flex items-center">
//             <img src="https://cryptologos.cc/logos/compound-comp-logo.png" alt="COMP" className="w-6 h-6 mr-2" />
//             <span>COMP</span>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ExchangeComponent;

// SwapComponent.tsx
import React, { useState } from 'react';

interface SwapComponentProps {
  sellValue: number;
  buyValue: number;
  priceChange: number;
  exchangeRate: number; // The exchange rate from sellCurrency to buyCurrency
}

const ExchangeComponent: React.FC<SwapComponentProps> = ({
  sellValue,
  buyValue,
  priceChange,
  exchangeRate,
}) => {
  const [sellAmount, setSellAmount] = useState<number>(0); // Pre-filled sell amount
  const [sellCurrency, setSellCurrency] = useState<string>('ETH');
  const [buyCurrency, setBuyCurrency] = useState<string>('COMP');

  const handleSellAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSellAmount(parseFloat(e.target.value));
  };

  const handleSellCurrencyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSellCurrency(e.target.value);
  };

  const handleBuyCurrencyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setBuyCurrency(e.target.value);
  };

  const buyAmount = sellAmount * exchangeRate;

  return (
    <div className="max-w-md mx-auto bg-gray-900 text-white p-6 rounded-lg shadow-lg dark:bg-gra dark:text-gray-200">
      <div className="flex justify-between items-center mb-2">
        <div className='p-2'>
          <h2 className="text-xl font-bold">Sell</h2>
          <input
            type="number"
            value={sellAmount}
            onChange={handleSellAmountChange}
            className="text-3xl bg-gray-800 p-2 rounded  w-full dark:bg-gray-700"
          />
          <p className="text-lg">${(sellAmount * sellValue).toFixed(2)!=='NaN'?(sellAmount * sellValue).toFixed(2):'0.00'}</p>
        </div>
        <div className='p-2'>
          <select
            value={sellCurrency}
            onChange={handleSellCurrencyChange}
            className="bg-blue-500 px-3 py-1 rounded-full dark:bg-blue-700"
          >
            <option value="ETH">ETH</option>
            <option value="BTC">BTC</option>
            <option value="USDT">USDT</option>
            {/* Add more options as needed */}
          </select>
        </div>
      </div>
      <div className="flex justify-center my-4">
        <div className="bg-gray-800 p-2 rounded-full dark:bg-gray-700">
          <span className="text-2xl">↓</span>
        </div>
      </div>
      <div className="flex justify-between items-center mb-4">
        <div className="p-2">
          <h2 className="text-xl font-bold">Buy</h2>
          <p className="text-3xl">{buyAmount.toFixed(2)!=='NaN'?buyAmount.toFixed(2):'0.00'}</p>
          <p className="text-lg">
            ${(buyAmount * buyValue).toFixed(2)!=='NaN'?(buyAmount * buyValue).toFixed(2):'0.00'}{' '}
            <span className={`text-lg ${priceChange < 0 ? 'text-red-500' : 'text-green-500'}`}>
              ({priceChange.toFixed(2)}%)
            </span>
          </p>
        </div>
        <div className="p-2">
          <select
            value={buyCurrency}
            onChange={handleBuyCurrencyChange}
            className="bg-green-500 px-3 py-1 rounded-full dark:bg-green-700"
          >
            <option value="COMP">COMP</option>
            <option value="LINK">LINK</option>
            <option value="DAI">DAI</option>
            {/* Add more options as needed */}
          </select>
        </div>
      </div>
    </div>
  );
};

export default ExchangeComponent;




