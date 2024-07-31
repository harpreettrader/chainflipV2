import React, { useState } from 'react';
import ExchangeComponent from './Exchange';
import axios from 'axios';

const SwapInterface: React.FC = () => {
  const [depositAddr, setDepositAddr] = useState<string>('');
  const [selectedChain, setSelectedChain] = useState<string>('ChainFlip');
  const [processingMessage, setProcessingMessage] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const handleClick = () => {
    setLoading(true);

    let config = {
      method: 'get',
      maxBodyLength: Infinity,
      url: 'https://perseverance.chainflip-broker.io/swap?apikey=dff049a53a4d4cc499cb5f555e316416&sourceAsset=flip.eth&destinationAsset=usdc.arb&destinationAddress=0xfe0442fB1599FE52Bd9Cd40afe0F37F297d867A7',
      headers: {}
    };

    axios.request(config)
      .then((response) => {
        console.log(JSON.stringify(response.data));
        setDepositAddr(response.data.address);
        alert(response.data.address);
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        setLoading(false);
      });
  }

  return (
    <div className="p-4 border-t flex flex-col justify-center items-center border-blue-200">
      {depositAddr}

      <div className='text-3xl pt-4'>Swap</div>

      <div className="flex w-full h-[90%] p-6">
        <div className="w-1/2 border border-gray-400 p-8 rounded-xl mr-4 flex flex-col justify-center items-center min-h-[300px]">
          <ul className='items-center w-full text-sm font-medium mb-4 text-gray-900 bg-white border border-gray-200 rounded-lg sm:flex'>
            <li className="w-full border-b border-gray-200 sm:border-b-0 sm:border-r">
              <div className="flex items-center ps-3">
                <input
                  id="chainflip-radio"
                  type="radio"
                  value="ChainFlip"
                  name="list-radio"
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500"
                  // checked={selectedChain === 'ChainFlip'}

                />
                <label htmlFor="chainflip-radio" className="w-full py-3 ms-2 text-sm font-medium text-gray-900">
                  ChainFlip
                </label>
              </div>
            </li>
            <li className="w-full border-b border-gray-200 sm:border-b-0 sm:border-r">
              <div className="flex items-center ps-3">
                <input
                  id="maya-radio"
                  type="radio"
                  value="Maya"
                  name="list-radio"
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500"
                  // checked={selectedChain === 'Maya'}

                />
                <label htmlFor="maya-radio" className="w-full py-3 ms-2 text-sm font-medium text-gray-900">
                  Maya
                </label>
              </div>
            </li>
            <li className="w-full border-b border-gray-200 sm:border-b-0 sm:border-r">
              <div className="flex items-center ps-3">
                <input
                  id="thorchain-radio"
                  type="radio"
                  value="THORChain"
                  name="list-radio"
                  className="w-4 h-4 text-blue-600 bg-gray-500 border-gray-300 focus:ring-blue-500"
                  // checked={selectedChain === 'THORChain'}
                  
                />
                <label htmlFor="thorchain-radio" className="w-full py-3 ms-2 text-sm font-medium text-gray-800">
                  THORChain
                </label>
              </div>
            </li>
          </ul>

          {processingMessage && (
            <div className="text-red-500 mb-4">{processingMessage}</div>
          )}

          {loading ? (
            <div className="flex justify-center items-center w-full h-full">
              <div className="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-12 w-12"></div>
            </div>
          ) : (
            <ExchangeComponent sellValue={3137.2} buyValue={47.60} priceChange={-39.3} exchangeRate={40} />
          )}

          <button className="w-full rounded-xl mt-2 p-2 bg-gray-800 text-white" onClick={handleClick}>Swap</button>
        </div>

        <div className="w-1/2 border border-gray-400 p-4 rounded-xl ml-4 flex flex-col justify-start items-start min-h-[300px]">
          <h2 className="text-xl font-bold mb-4">Info</h2>
          <p className="mb-2">Gas Fee: ...</p>
          <p className="mb-2">Time Duration: ...</p>
          <p className="mb-2">Affiliate Fee: ...</p>
          <p className="mb-2">TPS: ...</p>
        </div>
      </div>
    </div>
  );
}

export default SwapInterface;
